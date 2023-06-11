import redis
import logging

from flask import Flask, render_template
from flask_socketio import SocketIO, join_room, leave_room

import process

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'

socketio = SocketIO(app, cors_allowed_origins="*")
r = redis.Redis(host='localhost',
                port=6379,
                decode_responses=True)

logging.basicConfig(level=logging.INFO)


@socketio.on('start_process')
def handle_start_process(data):
    id_ = data.get("id")
    pid = r.get(id_)

    if not pid:
        try:
            pid = process.start()
            logging.info(f"({id_=}):({pid=}) is running now.")
            r.set(id_, pid)
            logging.info(f"({id_=}):({pid=}) is cached")
            join_room(id_)
            logging.info(f"({id_=}) join room is succeed")
            socketio.emit("healthcheck", { "id": id_ })
        except Exception as e:
            logging.error(f"process start failed: {e}")
    else:
        if not process.check_process(pid):
            old_pid = pid
            pid = process.start()
            logging.info(f"({id_=}):({pid=}) is started  now.")
            r.set(id_, pid)
            logging.info(f"({id_=}):({old_pid=}->{pid=}) is update cache")
            join_room(id_)
            logging.info(f"({id_=}) join room is succeed")
        else:
            logging.info(f"({id_=}) is already started and cached")

@socketio.on('suspend_process')
def handle_suspend_process(data):
    id_ = data.get("id")
    pid = r.get(id_)

    if pid:
        try:
            process.suspend(int(pid))
            logging.info(f"({id_=}):({pid=}) is suspended")
            socketio.emit("healthcheck", { "id": id_ })
        except Exception as e:
            logging.error(f"process suspend failed: {e}")
    else:
        logging.info(f"({id_=}) is not running and cached")

@socketio.on('resume_process')
def handle_resume_process(data):
    id_ = data.get("id")
    pid = r.get(id_)

    if pid:
        try:
            process.resume(int(pid))
            logging.info(f"({id_=}):({pid=}) is resume")
            socketio.emit("healthcheck", { "id": id_ })
        except Exception as e:
            logging.error(f"process resume failed: {e}")
    else:
        logging.info(f"({id_=}) is not running and cached")

@socketio.on('kill_process')
def handle_kill_process(data):
    id_ = data.get("id")
    pid = r.get(id_)

    if pid:
        try:
            process.kill(int(pid))
            logging.info(f"({id_=}):({pid=}) is killed succeed")
            socketio.emit("healthcheck", { "id": id_ })
        except Exception as e:
            logging.error(f"process kill failed: {e}")
        finally:
            r.delete(id_)
            logging.info(f"({id_=}):({pid=}) is removed from cache")
            leave_room(id_)
            logging.info(f"({id_=}) leave room")
    else:
        logging.info(f"({id_=}) is not running and cached")

@socketio.on('healthcheck')
def handle_healthcheck(data):
    id_ = data.get("id")
    pid = r.get(id_)

    status = process.status(pid)
    payload = {
        "status": status
    }
    socketio.emit("healthcheck", payload)

@socketio.on('connect')
def connect():
    socketio.emit("message", {"status": "running"})

@app.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    socketio.run(app)

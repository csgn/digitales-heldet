import argparse
import uuid

from flask import Flask, render_template
from flask_socketio import SocketIO

from capture import SourceCapture

app = Flask(__name__)
app.config['SECRET_KEY'] = str(uuid.uuid4())

socketio = SocketIO(app,
                    async_mode='threading',
                    cors_allowed_origins="*")
src_capture = None

@socketio.on('connect')
def connect():
    socketio.emit("message", {"status": "connect"})

@socketio.on('disconnect')
def disconnect():
    del src_capture
    socketio.emit("message", {"status": "disconnect"})


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
                    prog='Inference Subprocess')
    parser.add_argument('-p', '--port', required=True, type=int)
    parser.add_argument('-s', '--source', required=True, type=str)
    args = parser.parse_args()

    src_capture = SourceCapture(args.source)
    src_capture.start()
    socketio.run(app, port=args.port)
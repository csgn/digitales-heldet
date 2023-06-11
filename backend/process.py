import subprocess
import psutil

import logging


from random_open_port import random_port

def start(src):
    return subprocess.Popen(["python",
                             "inference/start.py",
                             '--port',
                             str(random_port()),
                             '--source',
                             src]).pid

def kill(pid):
    process = psutil.Process(pid)

    for proc in process.children(recursive=True):
        proc.terminate()
        proc.kill()

    process.terminate()
    process.kill()

def suspend(pid):
    process = psutil.Process(pid)
    process.suspend()

def resume(pid):
    process = psutil.Process(pid)
    process.resume()

def check_process(pid):
    try:
        process = psutil.Process(int(pid))
        return process.is_running() and process.parent().name().lower() == 'python'
    except psutil.NoSuchProcess:
        logging.info(f"{pid=} is not found or not a child process")
        return False
    except TypeError:
        return False

def status(pid):
    s = check_process(pid)

    if not s:
        return "terminated"

    process = psutil.Process(int(pid))
    return process.status()
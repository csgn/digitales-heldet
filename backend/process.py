import subprocess
import psutil

import logging


def start():
    return subprocess.Popen(["python", "temp.py"]).pid

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


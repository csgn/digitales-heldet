import sys
import argparse
import socketio

from capture import SourceCapture

sio = socketio.Client()
src_capture = None

@sio.on('connect')
def on_connect():
    print("connected")

@sio.on('disconnect')
def on_disconnect():
    del src_capture
    print("disconnected")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
                    prog='Inference Subprocess')
    parser.add_argument('-H', '--host', required=True, type=str)
    parser.add_argument('-S', '--source', required=True, type=str)
    args = parser.parse_args()

    try:
        src_capture = SourceCapture(args.source)
        src_capture.start(sio)

        sio.connect(args.host)
    except Exception as e:
        print(e)
        sys.exit(1)


import cv2
import threading
import time
import base64

class SourceCapture:
    def __init__(self, source_path):
        self.thread = None
        self.is_running: bool = False
        self.camera = cv2.VideoCapture(source_path)

        if not self.camera.isOpened():
            raise Exception("Could not open video device")

        self.camera.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        self.camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

    def __del__(self):
        self.camera.release()

    def start(self, sio):
        if self.thread is None:
            self.thread = threading.Thread(target=self._capture, args=(sio,))
            self.thread.start()

    def stop(self):
        self.is_running = False
        self.thread.join()
        self.thread = None

    def _capture(self, sio):
        self.is_running = True
        while self.is_running:
            time.sleep(1)
            ret, frame = self.camera.read()
            _, encoded_frame = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, 90])
            payload = base64.b64encode(encoded_frame).decode('utf-8')
            sio.emit("video_feed", {"frame": payload})
        print("Reading thread stopped")
        self.thread = None
        self.is_running = False
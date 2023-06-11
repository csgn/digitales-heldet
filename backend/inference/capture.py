import cv2
import threading
import time

class SourceCapture:
    def __init__(self, source_path, socket):
        self.thread = None
        self.current_frame  = None
        self.last_access = None
        self.is_running: bool = False
        self.socket = socket
        self.camera = cv2.VideoCapture(source_path)

        if not self.camera.isOpened():
            raise Exception("Could not open video device")

        self.camera.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        self.camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

    def __del__(self):
        self.camera.release()

    def start(self):
        if self.thread is None:
            self.thread = threading.Thread(target=self._capture)
            self.thread.start()

    def get_frame(self):
        self.last_access = time.time()
        return self.current_frame

    def stop(self):
        self.is_running = False
        self.thread.join()
        self.thread = None

    def _capture(self):
        self.is_running = True
        self.last_access = time.time()
        while self.is_running:
            time.sleep(1)
            ret, frame = self.camera.read()
            self.current_frame = frame
        print("Reading thread stopped")
        self.thread = None
        self.is_running = False
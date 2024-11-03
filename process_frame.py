# process_frame.py
import cvzone
import cv2
import math
from ultralytics import YOLO

# Charger le modèle
model = YOLO('best.pt')
classnames = ['approuve', 'interdit']

def process_frame(frame):
    frame = cv2.resize(frame, (640, 480))
    result = model(frame, stream=True)

    for info in result:
        boxes = info.boxes
        for box in boxes:
            confidence = box.conf[0]
            confidence = math.ceil(confidence * 100)
            Class = int(box.cls[0])
            if confidence > 50:
                xyxy = box.xyxy[0]
                if len(xyxy) == 4:
                    x1, y1, x2, y2 = map(int, xyxy)
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 5)
                    text_y = y1 - 10 if y1 - 10 > 20 else y1 + 10
                    cvzone.putTextRect(frame, f'{classnames[Class]} {confidence}%', [x1 + 8, text_y],
                                       scale=1.5, thickness=2)
    return frame


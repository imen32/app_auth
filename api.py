# api.py
import cv2
import numpy as np
from flask import Flask, request
from process_frame import process_frame

app = Flask(__name__)


@app.route('/predict', methods=['POST'])
def predict():
    # Recevoir l'image de la requête
    file = request.files['image']
    img_array = np.frombuffer(file.read(), np.uint8)
    frame = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

    # Traitement de la frame
    processed_frame = process_frame(frame)

    # Convertir l'image traitée en byte array
    _, buffer = cv2.imencode('.jpg', processed_frame)
    frame_bytes = buffer.tobytes()

    return frame_bytes, 200, {'Content-Type': 'image/jpeg'}


if __name__ == '__main__':
    app.run(debug=True)

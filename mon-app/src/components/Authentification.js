import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Authentification.css';

const Authentification = () => {
    const videoRef = useRef(null);
    const navigate = useNavigate();
    const [capturedImage, setCapturedImage] = useState(null);

    useEffect(() => {
        const startVideo = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Erreur d'accès à la caméra :", err);
            }
        };

        startVideo();

        return () => {
            if (videoRef.current) {
                const stream = videoRef.current.srcObject;
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
            }
        };
    }, []);

    const handleLogin = async () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);

        const imageBlob = await new Promise(resolve => {
            canvas.toBlob(resolve, 'image/jpeg');
        });

        const formData = new FormData();
        formData.append('image', imageBlob, 'photo.jpg');

        setCapturedImage(canvas.toDataURL('image/jpeg'));

        const response = await fetch('http://localhost:3000/predict', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (data.status === 'authorise') {
            navigate('/home');
        } else {
            alert(`Résultat de la reconnaissance : ${data.status}`);
        }
    };

    return (
        <div className="auth-container">
            <div className="video-container">
                <video ref={videoRef} autoPlay width="100%" height="auto" />
            </div>
            <button className="auth-button" onClick={handleLogin}>Se connecter</button>
            {capturedImage && <img src={capturedImage} alt="Captured" />}
        </div>
    );
};

export default Authentification;


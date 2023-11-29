import React, { useState, useRef } from 'react';

const AudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const handleStartRecording = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorderRef.current = new MediaRecorder(stream);
                audioChunksRef.current = [];

                mediaRecorderRef.current.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        audioChunksRef.current.push(event.data);
                    }
                };

                mediaRecorderRef.current.onstop = () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    const link = document.createElement('a');
                    link.href = audioUrl;
                    link.download = 'recording.webm';
                    link.click();
                };

                mediaRecorderRef.current.start();
                setIsRecording(true);
            } catch (error) {
                console.error('Error accessing media devices:', error);
                alert('Error accessing your microphone.');
            }
        } else {
            alert('Audio recording is not supported in this browser.');
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    return (
        <div>
            <button onClick={isRecording ? handleStopRecording : handleStartRecording}>
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
        </div>
    );
};

export default AudioRecorder;
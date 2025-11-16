import { useState } from 'react';
import { API_ENDPOINTS } from '../config/config';

interface UseAudioUploadReturn {
    audioFile: File | null;
    isProcessing: boolean;
    uploadAudio: (file: File, tool: string) => void;
    setAudioFile: (file: File | null) => void;
}

export const useAudioUpload = (): UseAudioUploadReturn => {
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const uploadAudio = (file: File, tool: string) => {
        setIsProcessing(true);

        try {
            const endpoint = tool === 'transcription'
                ? API_ENDPOINTS.transcription
                : API_ENDPOINTS.summarizing;

            const form = document.createElement("form");
            form.method = "GET";
            form.action = endpoint;
            form.style.display = "none";

            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.name = "file";

            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;

            form.appendChild(fileInput);
            document.body.appendChild(form);
            form.submit();
        } catch (error) {
            console.error('Error uploading audio:', error);
            setIsProcessing(false);
            throw error;
        }
    };

    return { audioFile, isProcessing, uploadAudio, setAudioFile };
};
import { useState } from 'react';
import { API_ENDPOINTS } from '../config/config';
import { authService } from '../services/authService';

interface UseAudioUploadReturn {
    audioFile: File | null;
    isProcessing: boolean;
    uploadAudio: (file: File, tool: string) => Promise<{ success: boolean }>;
    setAudioFile: (file: File | null) => void;
}

export const useAudioUpload = (): UseAudioUploadReturn => {
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const uploadAudio = async (file: File, tool: string): Promise<{ success: boolean }> => {
        setIsProcessing(true);

        try {
            const token = authService.getToken();
            const formData = new FormData();
            formData.append('file', file);

            const endpoint = tool === 'transcription'
                ? API_ENDPOINTS.transcription
                : API_ENDPOINTS.summarizing;

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.status === 401) {
                authService.logout();
                return { success: false };
            }

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.status}`);
            }

            // Якщо 200 - успіх
            return { success: true };
        } catch (error) {
            console.error('Error uploading audio:', error);
            throw error;
        } finally {
            setIsProcessing(false);
        }
    };

    return { audioFile, isProcessing, uploadAudio, setAudioFile };
};
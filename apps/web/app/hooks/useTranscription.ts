import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/config';
import { authService } from '../services/authService';

interface TranscriptionSegment {
    speaker: number;
    text: string;
}

interface TranscriptionData {
    transcription: TranscriptionSegment[];
}

interface UseTranscriptionReturn {
    transcription: TranscriptionSegment[];
    isLoading: boolean;
    loadPage: (page: number) => Promise<void>;
}

export const useTranscription = (): UseTranscriptionReturn => {
    const [transcription, setTranscription] = useState<TranscriptionSegment[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadPage = async (page: number) => {
        setIsLoading(true);
        try {
            const token = authService.getToken();

            const response = await fetch(`${API_ENDPOINTS.transcriptionPage}?page=${page}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 401) {
                authService.logout();
                return;
            }

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data: TranscriptionData = await response.json();
            setTranscription(data.transcription);
        } catch (error) {
            console.error('Error loading transcription:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadPage(1);
    }, []);

    return {
        transcription,
        isLoading,
        loadPage,
    };
};
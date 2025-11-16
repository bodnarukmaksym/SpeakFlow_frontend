import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/config';

interface TranscriptionData {
    text: string;
    total_pages: number;
}

interface UseTranscriptionReturn {
    transcription: string;
    currentPage: number;
    totalPages: number;
    isLoading: boolean;
    loadPage: (page: number) => Promise<void>;
}

export const useTranscription = (): UseTranscriptionReturn => {
    const [transcription, setTranscription] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const loadPage = async (page: number) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_ENDPOINTS.transcriptionPage}?page=${page}`);

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data: TranscriptionData = await response.json();
            setTranscription(data.text);
            setTotalPages(data.total_pages);
            setCurrentPage(page);
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
        currentPage,
        totalPages,
        isLoading,
        loadPage,
    };
};
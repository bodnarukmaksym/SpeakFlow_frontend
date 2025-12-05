import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/config';
import { authService } from '../services/authService';

interface SummaryData {
    summary: string;
    key_points: string[];
    word_count: number;
}

interface UseSummaryReturn {
    summary: string;
    keyPoints: string[];
    wordCount: number;
    isLoading: boolean;
}

export const useSummary = (): UseSummaryReturn => {
    const [summary, setSummary] = useState('');
    const [keyPoints, setKeyPoints] = useState<string[]>([]);
    const [wordCount, setWordCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const loadSummary = async () => {
        setIsLoading(true);
        try {
            const token = authService.getToken();

            const response = await fetch(API_ENDPOINTS.summary, {
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

            const data: SummaryData = await response.json();
            setSummary(data.summary);
            setKeyPoints(data.key_points);
            setWordCount(data.word_count);
        } catch (error) {
            console.error('Error loading summary:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadSummary();
    }, []);

    return { summary, keyPoints, wordCount, isLoading };
};
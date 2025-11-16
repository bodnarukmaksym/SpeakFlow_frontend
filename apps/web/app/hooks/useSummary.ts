import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/config';

interface SummaryData {
    summary: string;
}

interface UseSummaryReturn {
    summary: string;
    isLoading: boolean;
}

export const useSummary = (): UseSummaryReturn => {
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const loadSummary = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(API_ENDPOINTS.summary);

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data: SummaryData = await response.json();
            setSummary(data.summary);
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

    return { summary, isLoading };
};
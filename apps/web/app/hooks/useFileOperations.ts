import { useState } from 'react';
import { authService } from '../services/authService';

interface FileOperationsConfig {
    downloadPdfEndpoint: string;
    saveToDriveEndpoint: string;
}

interface UseFileOperationsReturn {
    isLoading: boolean;
    downloadPdf: () => Promise<void>;
    saveToDrive: () => Promise<{ message: string }>;
}

export const useFileOperations = (
    config: FileOperationsConfig
): UseFileOperationsReturn => {
    const [isLoading, setIsLoading] = useState(false);

    const downloadPdf = async () => {
        setIsLoading(true);
        try {
            const token = authService.getToken();

            const response = await fetch(config.downloadPdfEndpoint, {
                method: 'POST',
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

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = config.downloadPdfEndpoint.includes('summary')
                ? 'summary.pdf'
                : 'transcription.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading PDF:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const saveToDrive = async () => {
        setIsLoading(true);
        try {
            const token = authService.getToken();

            const response = await fetch(config.saveToDriveEndpoint, {
                method: 'POST',
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

            return await response.json();
        } catch (error) {
            console.error('Error saving to Drive:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, downloadPdf, saveToDrive };
};
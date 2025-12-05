export const env = {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
    maxFileSizeMB: Number(import.meta.env.VITE_MAX_FILE_SIZE_MB) || 50,
} as const;

export const API_ENDPOINTS = {
    transcription: `${env.apiBaseUrl}/get_transcription`,
    transcriptionPage: `${env.apiBaseUrl}/get_transcription_page`,
    downloadPdf: `${env.apiBaseUrl}/download_pdf`,
    saveToDrive: `${env.apiBaseUrl}/save_to_drive`,

    googleCallback: `${env.apiBaseUrl}/auth/google/callback`,
    googleAuthUrl: `${env.apiBaseUrl}/auth/google/url`,

    summarizing: `${env.apiBaseUrl}/get_summarizing`,
    summary: `${env.apiBaseUrl}/get_summary`,
    downloadSummaryPdf: `${env.apiBaseUrl}/download_summary_pdf`,
    saveSummaryToDrive: `${env.apiBaseUrl}/save_summary_to_drive`,
} as const;
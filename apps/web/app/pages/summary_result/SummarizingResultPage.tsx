import * as React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../../styles/SummarizingResultPage.module.css";
import { useSummary } from "../../hooks/useSummary";
import { useFileOperations } from "../../hooks/useFileOperations";
import { API_ENDPOINTS } from "../../config/config";

export function SummarizingResultPage() {
    const navigate = useNavigate();
    const { summary, keyPoints, wordCount, isLoading: isLoadingSummary } = useSummary();
    const { isLoading: isLoadingFile, downloadPdf, saveToDrive } = useFileOperations({
        downloadPdfEndpoint: API_ENDPOINTS.downloadSummaryPdf,
        saveToDriveEndpoint: API_ENDPOINTS.saveSummaryToDrive,
    });

    const isLoading = isLoadingSummary || isLoadingFile;

    const handleDownloadPdf = async () => {
        try {
            await downloadPdf();
        } catch (error) {
            alert(`Failed to download PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const handleSaveToDrive = async () => {
        try {
            const result = await saveToDrive();
            alert(result.message || "Successfully saved to Drive!");
        } catch (error) {
            alert(`Failed to save to Drive: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    return (
        <main className={styles.shell} aria-label="Summarizing result">
            <div className={styles.topbar}>
                <div className={styles.brandRow}>
                    <div className={styles.logo} aria-hidden="true">
                        <svg viewBox="0 0 24 24" className={styles.logoSvg}>
                            <path
                                d="M12 3a8 8 0 0 0-8 8v6a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H5a7 7 0 0 1 14 0h-2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-6a8 8 0 0 0-8-8Z"
                                fill="currentColor"
                            />
                        </svg>
                    </div>
                    <span className={styles.brand}>SpeakFlow</span>
                </div>
            </div>

            <section className={styles.board}>
                <div className={styles.card}>
                    <header className={styles.cardHeader}>
                        <div className={styles.titleIcon} aria-hidden="true">
                            <svg viewBox="0 0 48 48">
                                <rect x="8" y="6" width="28" height="36" rx="3" />
                                <rect x="13" y="13" width="18" height="2" />
                                <rect x="13" y="18" width="18" height="2" />
                                <rect x="13" y="23" width="14" height="2" />
                                <rect x="13" y="31" width="10" height="6" rx="1" />
                            </svg>
                        </div>
                        <h1 className={styles.title}>Summarizing Result</h1>
                    </header>

                    {isLoadingSummary ? (
                        <p style={{ textAlign: "center", color: "#6b7280" }}>
                            Loading summary...
                        </p>
                    ) : (
                        <>
                            <div className={styles.summarySection}>
                                <h2 className={styles.sectionTitle}>Summary</h2>
                                <p className={styles.summaryText}>{summary}</p>
                                <div className={styles.wordCount}>
                                    Word count: <strong>{wordCount}</strong>
                                </div>
                            </div>

                            {keyPoints.length > 0 && (
                                <div className={styles.keyPointsSection}>
                                    <h2 className={styles.sectionTitle}>Key Points</h2>
                                    <ul className={styles.keyPointsList}>
                                        {keyPoints.map((point, index) => (
                                            <li key={index} className={styles.keyPoint}>
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </>
                    )}

                    <div className={styles.actions}>
                        <button
                            className={`${styles.cta} ${styles.ctaPrimary}`}
                            type="button"
                            onClick={handleDownloadPdf}
                            disabled={isLoading}
                        >
                            Download PDF
                        </button>
                        <button
                            className={styles.cta}
                            type="button"
                            onClick={handleSaveToDrive}
                            disabled={isLoading}
                        >
                            Save Result to Drive
                        </button>
                        <button
                            className={styles.cta}
                            type="button"
                            onClick={() => navigate("/main")}
                            disabled={isLoading}
                        >
                            Back to main
                        </button>
                    </div>
                </div>
            </section>

            <div className={styles.footerBadge}>Created by Human</div>
        </main>
    );
}
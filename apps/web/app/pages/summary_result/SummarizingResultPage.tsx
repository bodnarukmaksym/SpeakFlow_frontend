import * as React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../../styles/SummarizingResultPage.module.css";

interface SummaryData {
    summary: string;
}

export function SummarizingResultPage() {
    const navigate = useNavigate();
    const [summary, setSummary] = React.useState("");
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        const loadSummary = async () => {
            setIsLoading(true);
            try {
                const response = await fetch("http://localhost:8000/get_summary");

                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }

                const data: SummaryData = await response.json();
                setSummary(data.summary);
            } catch (error) {
                console.error("Error loading summary:", error);
                alert(
                    `Failed to load summary: ${
                        error instanceof Error ? error.message : "Unknown error"
                    }`
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadSummary();
    }, []);

    const handleDownloadPdf = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                "http://localhost:8000/download_summary_pdf",
                {
                    method: "POST",
                }
            );

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "summary.pdf";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading PDF:", error);
            alert(
                `Failed to download PDF: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveToDrive = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                "http://localhost:8000/save_summary_to_drive",
                {
                    method: "POST",

                }
            );

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const result = await response.json();
            alert(result.message || "Successfully saved to Drive!");
        } catch (error) {
            console.error("Error saving to Drive:", error);
            alert(
                `Failed to save to Drive: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`
            );
        } finally {
            setIsLoading(false);
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

                    <h2 className={styles.sectionTitle}>Key points from Audio</h2>

                    {isLoading && !summary ? (
                        <p style={{ textAlign: "center", color: "#6b7280" }}>
                            Loading summary...
                        </p>
                    ) : (
                        <p className={styles.summaryText}>{summary}</p>
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
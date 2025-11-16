import styles from "../../../styles/TranscriptionResultPage.module.css";
import * as React from "react";
import { useNavigate } from "react-router-dom";

interface TranscriptionData {
    text: string;
    total_pages: number;
}

export function TranscriptionResultPage() {
    const navigate = useNavigate();
    const [transcription, setTranscription] = React.useState<string>("");
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const [totalPages, setTotalPages] = React.useState<number>(1);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        loadTranscriptionPage(1);
    }, []);

    const loadTranscriptionPage = async (page: number) => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `http://localhost:8000/get_transcription_page?page=${page}`
            );

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data: TranscriptionData = await response.json();
            setTranscription(data.text);
            setTotalPages(data.total_pages);
            setCurrentPage(page);
        } catch (error) {
            console.error("Error loading transcription:", error);
            alert(`Failed to load transcription: ${error instanceof Error ? error.message : "Unknown error"}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadPdf = async () => {
        try {
            const response = await fetch("http://localhost:8000/download_pdf", {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "transcription.pdf";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading PDF:", error);
            alert(`Failed to download PDF: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    };

    const handleSaveToDrive = async () => {
        try {
            const response = await fetch("http://localhost:8000/save_to_drive", {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const result = await response.json();
            alert(result.message || "Successfully saved to Drive!");
        } catch (error) {
            console.error("Error saving to Drive:", error);
            alert(`Failed to save to Drive: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            loadTranscriptionPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            loadTranscriptionPage(currentPage + 1);
        }
    };

    const handlePageClick = (page: number) => {
        loadTranscriptionPage(page);
    };

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    className={`${styles.pageBtn} ${i === currentPage ? styles.pageBtnActive : ""}`}
                    type="button"
                    onClick={() => handlePageClick(i)}
                    disabled={isLoading}
                >
                    {i}
                </button>
            );
        }

        return pages;
    };

    return (
        <main className={styles.shell} aria-label="Transcription result">
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
                                <rect x="10" y="8" width="20" height="28" rx="3" />
                                <rect x="15" y="14" width="12" height="2" />
                                <rect x="15" y="19" width="12" height="2" />
                                <rect x="15" y="24" width="9" height="2" />
                                <path d="M36 26a5 5 0 1 1-3-4.7V26h3Z" />
                                <path d="M33 29v2a6 6 0 0 1-6 6h-3" />
                            </svg>
                        </div>
                        <h1 className={styles.title}>Transcription Result</h1>
                    </header>

                    <div className={styles.transcriptBox}>
                        {isLoading ? (
                            <p style={{ textAlign: "center", color: "#6b7280" }}>Loading...</p>
                        ) : (
                            <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>{transcription}</p>
                        )}
                    </div>

                    <div className={styles.pagination} role="navigation" aria-label="Pages">
                        <button
                            className={styles.pageBtn}
                            type="button"
                            onClick={handlePrevPage}
                            disabled={currentPage === 1 || isLoading}
                        >
                            {"<< Prev"}
                        </button>
                        {renderPageNumbers()}
                        <button
                            className={styles.pageBtn}
                            type="button"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages || isLoading}
                        >
                            {"Next >>"}
                        </button>
                    </div>

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
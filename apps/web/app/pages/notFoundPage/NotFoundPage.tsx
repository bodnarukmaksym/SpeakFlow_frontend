import * as React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../../styles/NotFoundPage.module.css";

export function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <main className={styles.shell} aria-label="Page not found">
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
                    <div className={styles.errorIcon} aria-hidden="true">
                        <svg viewBox="0 0 48 48">
                            <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="2.5" />
                            <path d="M24 14v12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                            <circle cx="24" cy="32" r="1.5" fill="currentColor" />
                        </svg>
                    </div>

                    <h1 className={styles.errorCode}>404</h1>
                    <h2 className={styles.errorTitle}>Page Not Found</h2>
                    <p className={styles.errorMessage}>
                        The page you are looking for doesn't exist or has been moved.
                    </p>

                    <div className={styles.actions}>
                        <button
                            className={`${styles.cta} ${styles.ctaPrimary}`}
                            type="button"
                            onClick={() => navigate("/main")}
                        >
                            Go to Main Page
                        </button>
                        <button
                            className={styles.cta}
                            type="button"
                            onClick={() => navigate(-1)}
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </section>

            <div className={styles.footerBadge}>Created by Human</div>
        </main>
    );
}
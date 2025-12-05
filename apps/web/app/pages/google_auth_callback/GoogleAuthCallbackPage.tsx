import * as React from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "../../../styles/GoogleAuthCallbackPage.module.css";
import { API_ENDPOINTS } from "../../config/config";
import { authService } from "../../services/authService";

interface AuthResponse {
    access_token: string;
}

export function GoogleAuthCallbackPage() {
    const navigate = useNavigate();
    const [message, setMessage] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const handleGoogleCallback = async () => {
            const queryParams = new URLSearchParams(window.location.search);
            const code = queryParams.get("code");

            if (!code) {
                setMessage("⚠️ No authorization code received");
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(API_ENDPOINTS.googleCallback, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ code }),
                });

                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }

                const data: AuthResponse = await response.json();

                authService.setToken(data.access_token);

                setMessage("✓ Authorization successful!");

                setTimeout(() => {
                    navigate("/main");
                }, 1500);
            } catch (error) {
                console.error("Authorization error:", error);
                setMessage(
                    `❌ Authorization failed: ${error instanceof Error ? error.message : "Unknown error"}`
                );
            } finally {
                setIsLoading(false);
            }
        };

        handleGoogleCallback();
    }, [navigate]);

    return (
        <main className={styles.shell}>
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

            <Link to="/auth" className={styles.backLink}>
                ← Back to Auth
            </Link>

            <section className={styles.board}>
                <div className={styles.card}>
                    {isLoading && !message && (
                        <h1 className={styles.loadingText}>Handling authorization...</h1>
                    )}

                    {message && (
                        <div
                            className={`${styles.message} ${
                                message.includes("✓")
                                    ? styles.messageSuccess
                                    : message.includes("❌")
                                        ? styles.messageError
                                        : styles.messageWarning
                            }`}
                        >
                            {message}
                        </div>
                    )}

                    {message.includes("✓") && (
                        <p className={styles.redirectText}>
                            Redirecting to main page...
                        </p>
                    )}
                </div>
            </section>

            <div className={styles.footerBadge}>Created by Human</div>
        </main>
    );
}
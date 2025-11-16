import styles from "../../../styles/AuthPage.module.css";
import { useNavigate } from "react-router-dom";

export function AuthPage() {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/main");
    };
  return (
    <main className={styles.shell} aria-label="Authorization">
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

      <section className={styles.hero}>
        <div className={styles.body}>
          <p className={styles.lead}>
            SpeakFlow is a university project for processing and analyzing your
            audio files. It offers tools for transcription, summarization, and
            mood analysis.
          </p>

          <p className={styles.sub}>Sign in to start processing your audio.</p>

          <button type="button" className={styles.googleBtn} onClick={handleLogin}>
            <span className={styles.gIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M21.6 12.23c0-.66-.06-1.3-.18-1.92H12v3.64h5.4c-.23 1.25-.94 2.3-2 3v2.48h3.23c1.89-1.74 2.97-4.31 2.97-7.2Z" />
                <path d="M12 22c2.7 0 4.97-.9 6.62-2.47l-3.23-2.48c-.9.6-2.05.95-3.39.95-2.61 0-4.82-1.76-5.61-4.12H3.04v2.58A10 10 0 0 0 12 22Z" />
                <path d="M6.39 13.88A6 6 0 0 1 6 12c0-.65.11-1.28.32-1.88V7.54H3.04A10 10 0 0 0 2 12c0 1.6.38 3.1 1.04 4.46Z" />
                <path d="M12 6.38c1.47 0 2.8.5 3.84 1.49l2.88-2.88A10 10 0 0 0 3.04 7.54l3.28 2.58C7.1 8.76 9.39 6.38 12 6.38Z" />
              </svg>
            </span>
            <span className={styles.gText}>Sign in with Google</span>
          </button>
        </div>
      </section>

      <div className={styles.footerBadge}>Created by Human</div>
    </main>
  );
}

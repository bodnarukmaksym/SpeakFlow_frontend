import * as React from "react";
import styles from "../../../styles/MainPage.module.css";
import { useAudioUpload } from "../../hooks/useAudioUpload";
import { env } from "../../config/config";

export function MainPage() {
    const [selectedTool, setSelectedTool] = React.useState("transcription");
    const { audioFile, isProcessing, uploadAudio, setAudioFile } = useAudioUpload();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== 'audio/mpeg' && !file.name.toLowerCase().endsWith('.mp3')) {
            alert('Please upload an MP3 audio file');
            e.target.value = '';
            return;
        }

        const maxSizeBytes = env.maxFileSizeMB * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            alert(`File size must be less than ${env.maxFileSizeMB}MB`);
            e.target.value = '';
            return;
        }

        setAudioFile(file);
    };

    const handleProcessAudio = () => {
        if (!audioFile) {
            alert("Please upload an audio file first!");
            return;
        }

        if (selectedTool === "mood") {
            alert("Mood analysis feature is currently under development.");
            return;
        }

        try {
            uploadAudio(audioFile, selectedTool);
        } catch (error) {
            alert(`Failed to process audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    return (
        <main className={styles.shell} aria-label="Main">
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

            <div className={styles.boardWrap}>
                <section className={styles.board} aria-label="Workspace">
                    <div className={styles.toolsCard}>
                        <h2 className={styles.title}>Tools</h2>

                        <fieldset className={styles.toolsRow} aria-label="Tool selection">
                            <input
                                className={styles.toolInput}
                                type="radio"
                                id="tool-transcription"
                                name="tool"
                                defaultChecked
                                onChange={() => setSelectedTool("transcription")}
                            />
                            <label className={styles.toolItem} htmlFor="tool-transcription">
                                <svg viewBox="0 0 48 48" className={styles.toolIcon}>
                                    <rect x="9" y="8" width="22" height="28" rx="2" />
                                    <rect x="14" y="14" width="12" height="2" />
                                    <rect x="14" y="19" width="12" height="2" />
                                    <rect x="14" y="24" width="9" height="2" />
                                    <path d="M36 26a5 5 0 1 1-3-4.7V26h3Z" />
                                    <path d="M33 29v2a6 6 0 0 1-6 6h-3" />
                                </svg>
                                <div className={styles.toolLabel}>Transcription</div>
                                <span className={styles.selectedChip} aria-hidden="true">
                  Selected
                </span>
                            </label>

                            <input
                                className={styles.toolInput}
                                type="radio"
                                id="tool-summarizing"
                                name="tool"
                                onChange={() => setSelectedTool("summarizing")}
                            />
                            <label className={styles.toolItem} htmlFor="tool-summarizing">
                                <svg viewBox="0 0 48 48" className={styles.toolIcon}>
                                    <rect x="8" y="6" width="28" height="36" rx="3" />
                                    <rect x="13" y="13" width="18" height="2" />
                                    <rect x="13" y="18" width="18" height="2" />
                                    <rect x="13" y="23" width="14" height="2" />
                                    <rect x="13" y="31" width="10" height="6" rx="1" />
                                </svg>
                                <div className={styles.toolLabel}>Summarizing</div>
                                <span className={styles.selectedChip} aria-hidden="true">
                  Selected
                </span>
                            </label>

                            <input
                                className={styles.toolInput}
                                type="radio"
                                id="tool-mood"
                                name="tool"
                                onChange={() => setSelectedTool("mood")}
                            />
                            <label className={styles.toolItem} htmlFor="tool-mood">
                                <svg viewBox="0 0 48 48" className={styles.toolIcon}>
                                    <circle cx="30" cy="18" r="6" />
                                    <path d="M12 28v6a3 3 0 0 0 3 3h3a3 3 0 0 0 3-3v-6a8 8 0 1 1 8 8v6" />
                                    <circle cx="28" cy="17" r="1.2" fill="currentColor" />
                                    <circle cx="32" cy="17" r="1.2" fill="currentColor" />
                                    <path
                                        d="M27 20c2.2 1.8 3.8 1.8 6 0"
                                        stroke="currentColor"
                                        strokeWidth="1.6"
                                        fill="none"
                                    />
                                </svg>
                                <div className={styles.toolLabel}>Mood analysis</div>
                                <span className={styles.selectedChip} aria-hidden="true">
                  Selected
                </span>
                            </label>
                        </fieldset>

                        <div className={styles.dropWrap}>
                            <input
                                id="audio-input"
                                type="file"
                                accept=".mp3,audio/mpeg"
                                className={styles.fileInput}
                                onChange={handleFileChange}
                            />
                            <label htmlFor="audio-input" className={styles.dropzone}>
                                {audioFile ? audioFile.name : "Drag and drop your MP3 file here"}
                            </label>
                        </div>

                        <button
                            type="button"
                            className={styles.primaryBtn}
                            onClick={handleProcessAudio}
                            disabled={isProcessing}
                        >
                            {isProcessing ? "Processing..." : "Process Audio"}
                        </button>
                    </div>

                    <div className={styles.featuresRow}>
                        <div className={styles.featureCol}>
                            <h3>Transcription</h3>
                            <p>
                                Converts audio into text for easy reading and analysis. This is a
                                core feature of SpeakFlow.
                            </p>
                            <div className={styles.status}>
                                Status: <span className={styles.statusActive}>Active</span>
                            </div>
                        </div>

                        <div className={styles.featureCol}>
                            <h3>Summarizing</h3>
                            <p>
                                Automatically generates a concise summary of your audio content.
                                This feature is currently under development.
                            </p>
                            <div className={styles.status}>
                                Status: <span className={styles.statusActive}>Active</span>
                            </div>
                        </div>

                        <div className={styles.featureCol}>
                            <h3>Mood analysis</h3>
                            <p>
                                Identifies the emotional tone of speech within your audio files.
                                This feature is currently under development.
                            </p>
                            <div className={styles.status}>
                                Status: <span className={styles.statusWip}>In development</span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <div className={styles.footerBadge}>Created by Human</div>
        </main>
    );
}
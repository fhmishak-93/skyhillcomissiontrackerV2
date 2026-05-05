import { useState } from "react";
import styles from "./SheetsModal.module.css";

export default function SheetsModal({ sheetsUrl, setSheetsUrl, onClose, appsScriptCode, showToast }) {
  const [url, setUrl] = useState(sheetsUrl);
  const [copied, setCopied] = useState(false);

  const save = () => {
    setSheetsUrl(url.trim());
    showToast("URL disimpan ✓");
    onClose();
  };

  const copyCode = () => {
    navigator.clipboard.writeText(appsScriptCode.trim()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Setup Google Sheets Backup</h2>
          <button className={styles.btnClose} onClick={onClose}>✕</button>
        </div>

        <div className={styles.body}>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNum}>1</div>
              <div>
                <div className={styles.stepTitle}>Buka Google Sheets baru</div>
                <div className={styles.stepDesc}>Buat spreadsheet baru di <a href="https://sheets.google.com" target="_blank" rel="noreferrer">sheets.google.com</a></div>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNum}>2</div>
              <div>
                <div className={styles.stepTitle}>Buka Apps Script</div>
                <div className={styles.stepDesc}>Dalam Sheets → <strong>Extensions</strong> → <strong>Apps Script</strong></div>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNum}>3</div>
              <div>
                <div className={styles.stepTitle}>Paste kod berikut</div>
                <div className={styles.stepDesc}>Padam kod sedia ada, paste kod ni:</div>
                <button className={styles.btnCopy} onClick={copyCode}>
                  {copied ? "✓ Disalin!" : "Salin Kod Apps Script"}
                </button>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNum}>4</div>
              <div>
                <div className={styles.stepTitle}>Deploy sebagai Web App</div>
                <div className={styles.stepDesc}>
                  <strong>Deploy</strong> → <strong>New Deployment</strong> → Type: <strong>Web App</strong><br/>
                  Execute as: <strong>Me</strong> → Who has access: <strong>Anyone</strong><br/>
                  Klik Deploy → Authorize → Copy URL
                </div>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNum}>5</div>
              <div>
                <div className={styles.stepTitle}>Paste URL di sini</div>
              </div>
            </div>
          </div>

          <div className={styles.inputSection}>
            <label className={styles.inputLabel}>Google Apps Script Web App URL</label>
            <input
              type="url"
              placeholder="https://script.google.com/macros/s/..."
              value={url}
              onChange={e => setUrl(e.target.value)}
              className={styles.urlInput}
            />
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.btnCancel} onClick={onClose}>Batal</button>
          <button className={styles.btnSave} onClick={save} disabled={!url.trim()}>
            Simpan URL
          </button>
        </div>
      </div>
    </div>
  );
}

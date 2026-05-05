import styles from "./RatesEditor.module.css";

const RATE_FIELDS = [
  { key: "direct",  label: "Direct Close" },
  { key: "consult", label: "Konsultasi 30min" },
  { key: "followup",label: "Follow-Up" },
];

export default function RatesEditor({ rates, setRates }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.label}>Kadar Komisen (RM)</div>
      {RATE_FIELDS.map(f => (
        <div key={f.key} className={styles.row}>
          <span className={styles.name}>{f.label}</span>
          <div className={styles.inputWrap}>
            <span className={styles.prefix}>RM</span>
            <input
              type="number"
              min="0"
              value={rates[f.key]}
              onChange={e => setRates(r => ({ ...r, [f.key]: +e.target.value || 0 }))}
              className={styles.input}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

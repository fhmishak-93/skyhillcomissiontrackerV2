import styles from "./SummaryCards.module.css";

export default function SummaryCards({ totalPool, totalPtsAll, people, rows }) {
  const topPerformer = rows.length
    ? rows.reduce((a, b) => (a.pts >= b.pts ? a : b))
    : null;

  const avgComm = rows.length ? totalPool / rows.length : 0;

  const cards = [
    { label: "Total Pool Komisen",    value: `RM ${totalPool.toFixed(2)}`,   accent: true },
    { label: "Total Patients Closed", value: String(totalPtsAll),            accent: false },
    { label: "Avg Komisen / Orang",   value: `RM ${avgComm.toFixed(2)}`,     accent: false },
    { label: "Top Performer",         value: topPerformer ? topPerformer.name : "—", accent: false, sub: topPerformer ? `${topPerformer.pts} patients` : "" },
  ];

  return (
    <div className={styles.grid}>
      {cards.map((c, i) => (
        <div key={i} className={`${styles.card} ${c.accent ? styles.accent : ""}`}>
          <div className={styles.label}>{c.label}</div>
          <div className={styles.value}>{c.value}</div>
          {c.sub && <div className={styles.sub}>{c.sub}</div>}
        </div>
      ))}
    </div>
  );
}

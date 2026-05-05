import styles from "./CommissionTable.module.css";

export default function CommissionTable({ rows, totalPool, totalPtsAll, onExportIndividual, people }) {
  return (
    <div className={styles.card}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Cawangan</th>
            <th className={styles.center}>Total Patients</th>
            <th className={styles.right}>% Contribution</th>
            <th className={styles.right}>Pool (RM)</th>
            <th className={styles.right}>Komisen (RM)</th>
            <th className={styles.center}>PDF</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => {
            const person = people.find(p => p.id === r.id);
            return (
              <tr key={r.id}>
                <td className={styles.nameCell}>{r.name}</td>
                <td><span className={styles.branch}>{r.branch}</span></td>
                <td className={styles.center}>{r.pts}</td>
                <td className={styles.right}>
                  <div className={styles.pctWrap}>
                    <div className={styles.pctBar}>
                      <div className={styles.pctFill} style={{ width: `${Math.min(r.pct, 100)}%` }} />
                    </div>
                    <span className={styles.pctVal}>{r.pct.toFixed(1)}%</span>
                  </div>
                </td>
                <td className={styles.right}>RM {r.pool.toFixed(0)}</td>
                <td className={styles.right}>
                  <span className={styles.commVal}>RM {r.comm.toFixed(2)}</span>
                </td>
                <td className={styles.center}>
                  <button
                    className={styles.btnPdf}
                    onClick={() => onExportIndividual(person)}
                    title={`Export PDF ${r.name}`}
                  >
                    ↓ PDF
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2} className={styles.footLabel}>JUMLAH KESELURUHAN</td>
            <td className={styles.center}><strong>{totalPtsAll}</strong></td>
            <td className={styles.right}><strong>100%</strong></td>
            <td className={styles.right}><strong>RM {totalPool.toFixed(0)}</strong></td>
            <td className={styles.right}>
              <strong className={styles.totalComm}>RM {totalPool.toFixed(2)}</strong>
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

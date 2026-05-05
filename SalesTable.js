import { useState } from "react";
import styles from "./SalesTable.module.css";
import { totalPts, poolFor } from "../utils/calc";

export default function SalesTable({ people, setPeople, rates }) {
  const [newName, setNewName] = useState("");

  const update = (id, field, val) => {
    setPeople(prev => prev.map(p => p.id === id ? { ...p, [field]: Math.max(0, +val || 0) } : p));
  };

  const remove = (id) => {
    setPeople(prev => prev.filter(p => p.id !== id));
  };

  const add = () => {
    const name = newName.trim();
    if (!name) return;
    setPeople(prev => [...prev, {
      id: Date.now(),
      name,
      branch: "Denai Alam",
      direct: 0, consult: 0, followup: 0,
    }]);
    setNewName("");
  };

  return (
    <div className={styles.card}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Cawangan</th>
            <th className={styles.center}>Direct Close<br/><span className={styles.rate}>RM {rates.direct}/pt</span></th>
            <th className={styles.center}>Konsultasi<br/><span className={styles.rate}>RM {rates.consult}/pt</span></th>
            <th className={styles.center}>Follow-Up<br/><span className={styles.rate}>RM {rates.followup}/pt</span></th>
            <th className={styles.center}>Total Pts</th>
            <th className={styles.right}>Sub-Pool</th>
            <th className={styles.center}></th>
          </tr>
        </thead>
        <tbody>
          {people.map(p => {
            const tp = totalPts(p);
            const pool = poolFor(p, rates);
            return (
              <tr key={p.id}>
                <td className={styles.nameCell}>{p.name}</td>
                <td><span className={styles.branch}>{p.branch}</span></td>
                <td className={styles.center}>
                  <input
                    type="number" min="0" value={p.direct}
                    onChange={e => update(p.id, "direct", e.target.value)}
                    className={styles.numInput}
                  />
                </td>
                <td className={styles.center}>
                  <input
                    type="number" min="0" value={p.consult}
                    onChange={e => update(p.id, "consult", e.target.value)}
                    className={styles.numInput}
                  />
                </td>
                <td className={styles.center}>
                  <input
                    type="number" min="0" value={p.followup}
                    onChange={e => update(p.id, "followup", e.target.value)}
                    className={styles.numInput}
                  />
                </td>
                <td className={styles.center}>
                  <strong>{tp}</strong>
                </td>
                <td className={styles.right}>
                  <span className={styles.poolVal}>RM {pool.toFixed(0)}</span>
                </td>
                <td className={styles.center}>
                  <button className={styles.btnDel} onClick={() => remove(p.id)}>✕</button>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={5} className={styles.totalLabel}>JUMLAH</td>
            <td className={styles.center}>
              <strong>{people.reduce((s, p) => s + totalPts(p), 0)}</strong>
            </td>
            <td className={styles.right}>
              <strong className={styles.poolTotal}>
                RM {people.reduce((s, p) => s + poolFor(p, rates), 0).toFixed(0)}
              </strong>
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>

      <div className={styles.addRow}>
        <input
          type="text"
          placeholder="Nama sales person baru..."
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && add()}
          className={styles.addInput}
        />
        <button className={styles.btnAdd} onClick={add}>+ Tambah</button>
      </div>
    </div>
  );
}

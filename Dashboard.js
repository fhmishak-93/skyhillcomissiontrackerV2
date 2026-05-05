import { useState } from "react";
import styles from "./Dashboard.module.css";
import { calcCommissions, teamSummary } from "../utils/calc";
import { exportTeamPDF, exportIndividualPDF } from "../utils/pdf";
import { backupToSheets, APPS_SCRIPT_CODE } from "../utils/sheets";
import SalesTable from "./SalesTable";
import CommissionTable from "./CommissionTable";
import SummaryCards from "./SummaryCards";
import RatesEditor from "./RatesEditor";
import SheetsModal from "./SheetsModal";

export default function Dashboard({
  people, setPeople, rates, setRates,
  month, setMonth, months,
  sheetsUrl, setSheetsUrl, showToast,
}) {
  const [showSheets, setShowSheets] = useState(false);
  const [backing, setBacking]       = useState(false);

  const { rows, totalPool, totalPtsAll, totalComm } = teamSummary(people, rates);

  const handleBackup = async () => {
    if (!sheetsUrl) { setShowSheets(true); return; }
    setBacking(true);
    try {
      await backupToSheets(sheetsUrl, { month, rows, totalPool, totalPtsAll });
      showToast("Data berjaya dihantar ke Google Sheets ✓");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setBacking(false);
    }
  };

  const handleExportTeam = () => {
    exportTeamPDF(rows, totalPool, totalPtsAll, month, rates);
    showToast("PDF Team Summary sedang dimuat turun...");
  };

  const handleExportIndividual = (person) => {
    const row = rows.find(r => r.id === person.id);
    exportIndividualPDF(person, row, totalPool, totalPtsAll, month, rates);
    showToast(`PDF ${person.name} sedang dimuat turun...`);
  };

  return (
    <div className={styles.root}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>S</div>
          <div>
            <div className={styles.brandName}>Skyhill</div>
            <div className={styles.brandSub}>Commission Tracker</div>
          </div>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navLabel}>Tetapan</div>
          <div className={styles.navItem}>
            <span className={styles.navIcon}>◈</span> Dashboard
          </div>
        </nav>

        <div className={styles.sideSection}>
          <div className={styles.navLabel}>Bulan Aktif</div>
          <select
            className={styles.monthSelect}
            value={month}
            onChange={e => setMonth(e.target.value)}
          >
            {months.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>

        <RatesEditor rates={rates} setRates={setRates} />

        <div className={styles.sideBottom}>
          <button
            className={styles.btnSheets}
            onClick={handleBackup}
            disabled={backing}
          >
            {backing ? "Menghantar..." : "⬆ Backup ke Google Sheets"}
          </button>
          <button
            className={styles.btnSetup}
            onClick={() => setShowSheets(true)}
          >
            ⚙ Setup Sheets URL
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={styles.main}>
        <header className={styles.topbar}>
          <div>
            <h1 className={styles.pageTitle}>Komisen {month}</h1>
            <p className={styles.pageSub}>Hormone Harmony Q2 2026 — Denai Alam</p>
          </div>
          <div className={styles.topActions}>
            <button className={styles.btnExport} onClick={handleExportTeam}>
              ↓ Export PDF Team
            </button>
          </div>
        </header>

        <SummaryCards totalPool={totalPool} totalPtsAll={totalPtsAll} people={people} rows={rows} />

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Input Data Sales</h2>
          </div>
          <SalesTable
            people={people}
            setPeople={setPeople}
            rates={rates}
          />
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Pecahan Komisen Individu</h2>
            <p className={styles.sectionNote}>Dikira berdasarkan % contribution kepada jumlah team</p>
          </div>
          <CommissionTable
            rows={rows}
            totalPool={totalPool}
            totalPtsAll={totalPtsAll}
            onExportIndividual={handleExportIndividual}
            people={people}
          />
        </section>
      </main>

      {showSheets && (
        <SheetsModal
          sheetsUrl={sheetsUrl}
          setSheetsUrl={setSheetsUrl}
          onClose={() => setShowSheets(false)}
          appsScriptCode={APPS_SCRIPT_CODE}
          showToast={showToast}
        />
      )}
    </div>
  );
}

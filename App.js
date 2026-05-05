import { useState, useCallback } from "react";
import Dashboard from "./components/Dashboard";
import "./App.css";

const INITIAL_PEOPLE = [
  { id: 1, name: "Hashikin", branch: "Denai Alam", direct: 0, consult: 0, followup: 0 },
  { id: 2, name: "Aminah",   branch: "Denai Alam", direct: 0, consult: 0, followup: 0 },
  { id: 3, name: "Wafiq",    branch: "Denai Alam", direct: 0, consult: 0, followup: 0 },
  { id: 4, name: "Alisha",   branch: "Denai Alam", direct: 0, consult: 0, followup: 0 },
];

const MONTHS = [
  "Jan 2026","Feb 2026","Mac 2026","Apr 2026",
  "Mei 2026","Jun 2026","Jul 2026","Ogo 2026",
  "Sep 2026","Okt 2026","Nov 2026","Dis 2026",
];

export default function App() {
  const [people, setPeople]       = useState(INITIAL_PEOPLE);
  const [rates, setRates]         = useState({ direct: 15, consult: 5, followup: 8 });
  const [month, setMonth]         = useState("Mei 2026");
  const [sheetsUrl, setSheetsUrl] = useState("");
  const [toast, setToast]         = useState(null);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  return (
    <div className="app-root">
      <Dashboard
        people={people} setPeople={setPeople}
        rates={rates} setRates={setRates}
        month={month} setMonth={setMonth}
        months={MONTHS}
        sheetsUrl={sheetsUrl} setSheetsUrl={setSheetsUrl}
        showToast={showToast}
      />
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const PURPLE = [83, 74, 183];
const LIGHT  = [238, 237, 254];
const DARK   = [60, 52, 137];
const GRAY   = [68, 68, 65];
const WHITE  = [255, 255, 255];

function header(doc, month, title) {
  doc.setFillColor(...PURPLE);
  doc.rect(0, 0, 210, 22, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...WHITE);
  doc.text("SKYHILL CLINIC", 14, 10);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Hormone Harmony — Commission Report", 14, 16);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(month, 196, 10, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.text(title, 196, 16, { align: "right" });
}

function footer(doc) {
  const pages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...GRAY);
    doc.text(
      `Skyhill Marketing Team  |  SMT-260401-01  |  We Do. We Achieve. The Best Team.`,
      14, 290
    );
    doc.text(`Halaman ${i} / ${pages}`, 196, 290, { align: "right" });
  }
}

export function exportTeamPDF(rows, totalPool, totalPtsAll, month, rates) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  header(doc, month, "Team Summary");

  doc.setFontSize(10);
  doc.setTextColor(...DARK);
  doc.setFont("helvetica", "bold");
  doc.text("Ringkasan Komisen Pasukan", 14, 30);

  const rateText = `Kadar: Direct Close RM${rates.direct}  |  Konsultasi RM${rates.consult}  |  Follow-Up RM${rates.followup}`;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...GRAY);
  doc.text(rateText, 14, 36);

  // Summary boxes
  const boxes = [
    { label: "Total Pool Komisen", val: `RM ${totalPool.toFixed(2)}` },
    { label: "Total Patients Closed", val: String(totalPtsAll) },
    { label: "Bilangan Sales Person", val: String(rows.length) },
  ];
  boxes.forEach((b, i) => {
    const x = 14 + i * 61;
    doc.setFillColor(...LIGHT);
    doc.roundedRect(x, 40, 57, 18, 2, 2, "F");
    doc.setFontSize(7);
    doc.setTextColor(...PURPLE);
    doc.setFont("helvetica", "normal");
    doc.text(b.label, x + 4, 46);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...DARK);
    doc.text(b.val, x + 4, 54);
  });

  autoTable(doc, {
    startY: 64,
    head: [["Nama", "Cawangan", "Direct\nClose", "Konsultasi", "Follow-Up", "Total Pts", "% Contribution", "Pool (RM)", "Komisen (RM)"]],
    body: rows.map(r => [
      r.name,
      r.branch,
      r.direct,
      r.consult,
      r.followup,
      r.pts,
      r.pct.toFixed(1) + "%",
      "RM " + r.pool.toFixed(0),
      "RM " + r.comm.toFixed(2),
    ]),
    foot: [["JUMLAH", "", "", "", "", totalPtsAll, "100%", "RM " + totalPool.toFixed(0), "RM " + totalPool.toFixed(2)]],
    headStyles: { fillColor: PURPLE, textColor: WHITE, fontSize: 8, fontStyle: "bold", halign: "center" },
    footStyles: { fillColor: DARK,   textColor: WHITE, fontSize: 8, fontStyle: "bold" },
    bodyStyles: { fontSize: 8, textColor: GRAY },
    alternateRowStyles: { fillColor: [248, 248, 247] },
    columnStyles: {
      0: { fontStyle: "bold" },
      6: { halign: "right" },
      7: { halign: "right" },
      8: { halign: "right", textColor: PURPLE, fontStyle: "bold" },
    },
    margin: { left: 14, right: 14 },
  });

  footer(doc);
  doc.save(`Skyhill_Commission_Team_${month.replace(" ", "_")}.pdf`);
}

export function exportIndividualPDF(person, row, totalPool, totalPtsAll, month, rates) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  header(doc, month, `Individual Statement`);

  // Name card
  doc.setFillColor(...LIGHT);
  doc.roundedRect(14, 28, 182, 22, 3, 3, "F");
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK);
  doc.text(person.name, 22, 38);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GRAY);
  doc.text(person.branch, 22, 44);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...PURPLE);
  doc.text(`RM ${row.comm.toFixed(2)}`, 190, 38, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...GRAY);
  doc.text("Komisen bulan ini", 190, 44, { align: "right" });

  // Breakdown table
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK);
  doc.text("Pecahan Aktiviti", 14, 60);

  autoTable(doc, {
    startY: 64,
    head: [["Jenis Aktiviti", "Kadar (RM)", "Bilangan Patients", "Sub-total (RM)"]],
    body: [
      ["Direct Close",          `RM ${rates.direct}`,   person.direct,   `RM ${(person.direct * rates.direct).toFixed(0)}`],
      ["Consultation 30min",    `RM ${rates.consult}`,  person.consult,  `RM ${(person.consult * rates.consult).toFixed(0)}`],
      ["After Consult Follow-Up",`RM ${rates.followup}`,person.followup, `RM ${(person.followup * rates.followup).toFixed(0)}`],
    ],
    foot: [["JUMLAH", "", row.pts, `RM ${row.pool.toFixed(0)}`]],
    headStyles: { fillColor: PURPLE, textColor: WHITE, fontSize: 9, fontStyle: "bold" },
    footStyles: { fillColor: DARK,   textColor: WHITE, fontSize: 9, fontStyle: "bold" },
    bodyStyles: { fontSize: 9, textColor: GRAY },
    alternateRowStyles: { fillColor: [248, 248, 247] },
    columnStyles: { 3: { halign: "right", fontStyle: "bold" } },
    margin: { left: 14, right: 14 },
  });

  const y2 = doc.lastAutoTable.finalY + 12;

  // Commission calc box
  doc.setFillColor(...LIGHT);
  doc.roundedRect(14, y2, 182, 42, 3, 3, "F");
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK);
  doc.text("Pengiraan Komisen (Group Hybrid Method)", 22, y2 + 8);

  const lines = [
    `Total pool pasukan          :  RM ${totalPool.toFixed(2)}`,
    `Patients anda               :  ${row.pts} / ${totalPtsAll} patients`,
    `% Contribution              :  ${row.pct.toFixed(2)}%`,
    `Komisen = ${row.pct.toFixed(2)}% × RM ${totalPool.toFixed(2)}  =  RM ${row.comm.toFixed(2)}`,
  ];
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...GRAY);
  lines.forEach((l, i) => doc.text(l, 22, y2 + 16 + i * 7));

  // Final commission highlight
  doc.setFillColor(...PURPLE);
  doc.roundedRect(14, y2 + 46, 182, 18, 3, 3, "F");
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...WHITE);
  doc.text("Jumlah Komisen Bulan Ini", 22, y2 + 56);
  doc.setFontSize(13);
  doc.text(`RM ${row.comm.toFixed(2)}`, 190, y2 + 56, { align: "right" });

  footer(doc);
  doc.save(`Skyhill_Commission_${person.name}_${month.replace(" ", "_")}.pdf`);
}

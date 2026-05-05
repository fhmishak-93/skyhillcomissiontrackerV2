/**
 * Sends commission data to a Google Apps Script Web App endpoint.
 * The Apps Script must be deployed as Web App with "Anyone" access.
 *
 * SETUP INSTRUCTIONS (one-time):
 * 1. Open Google Sheets → Extensions → Apps Script
 * 2. Paste the doPost() function from APPS_SCRIPT_CODE below
 * 3. Deploy → New Deployment → Web App → Execute as "Me" → Access "Anyone"
 * 4. Copy the Web App URL and paste into the app settings
 */

export async function backupToSheets(sheetsUrl, payload) {
  if (!sheetsUrl || !sheetsUrl.startsWith("https://script.google.com")) {
    throw new Error("URL Google Apps Script tidak sah. Pastikan URL bermula dengan https://script.google.com");
  }

  const response = await fetch(sheetsUrl, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  // no-cors returns opaque response — we assume success if no network error
  return true;
}

export const APPS_SCRIPT_CODE = `
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // --- Sheet 1: Raw Data ---
    let rawSheet = ss.getSheetByName("Data Komisen");
    if (!rawSheet) {
      rawSheet = ss.insertSheet("Data Komisen");
      rawSheet.appendRow([
        "Tarikh Backup","Bulan","Nama","Cawangan",
        "Direct Close","Konsultasi","Follow-Up",
        "Total Patients","% Contribution","Pool (RM)","Komisen (RM)"
      ]);
      rawSheet.getRange(1, 1, 1, 11).setBackground("#534AB7").setFontColor("#FFFFFF").setFontWeight("bold");
    }

    const now = new Date().toLocaleString("ms-MY");
    data.rows.forEach(r => {
      rawSheet.appendRow([
        now, data.month, r.name, r.branch,
        r.direct, r.consult, r.followup,
        r.pts, r.pct.toFixed(2) + "%",
        r.pool.toFixed(2), r.comm.toFixed(2)
      ]);
    });

    // --- Sheet 2: Monthly Summary ---
    let sumSheet = ss.getSheetByName("Summary Bulanan");
    if (!sumSheet) {
      sumSheet = ss.insertSheet("Summary Bulanan");
      sumSheet.appendRow(["Bulan","Total Pool (RM)","Total Patients","Bil. Sales Person","Tarikh Backup"]);
      sumSheet.getRange(1, 1, 1, 5).setBackground("#534AB7").setFontColor("#FFFFFF").setFontWeight("bold");
    }
    sumSheet.appendRow([
      data.month,
      data.totalPool.toFixed(2),
      data.totalPtsAll,
      data.rows.length,
      now
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;

/**
 * AniFX registration endpoint.
 * Paste this into Extensions → Apps Script on the registration Sheet,
 * then deploy as a Web App. See README.md in this folder for setup.
 */

const SHEET_ID = "1h5P26etgB_F2vmJZr2auzuF5ma4v0kLOqBFoxZv8rec";
const FOLDER_NAME = "AniFX Payment Screenshots";

// Grouped for a person scanning the sheet, not for how the code builds
// the row: who/entry-shape first, then contact, then academic, then
// payment proof. A few columns don't apply to every track (e.g. Entry
// Type only for game jam/film, Category only for film, Roster only for
// team tracks, Fee/Txn/Screenshot blank for the free character-design
// track) — those cells are just blank on rows where they don't apply.
const HEADERS = [
  "Submitted At", "Track",
  "Entry Type",              // Solo / Team — game jam, film only
  "Team Name", "Lead Role",  // team tracks only
  "Registrant Name", "Phone", "Email",
  "Category",                // film only
  "Roster",                  // team tracks only
  "College", "Class/Year", "Board", "Age", "Address",
  "Fee", "Txn ID", "Screenshot Link",
];

function doPost(e) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
  ensureHeaders(sheet);

  const data = JSON.parse(e.postData.contents);

  let screenshotLink = "";
  if (data.paymentScreenshotBase64) {
    screenshotLink = saveScreenshot(
      data.paymentScreenshotBase64,
      data.paymentScreenshotName || "screenshot",
      data.paymentScreenshotType || "image/png"
    );
  }

  sheet.appendRow([
    data.submittedAt || new Date().toISOString(),
    data.track || "",
    data.entryType ? (data.entryType === "solo" ? "Solo" : "Team") : "",
    data.teamName || "",
    data.leadRole || "",
    data.registrantName || "",
    data.registrantPhone || "",
    data.registrantEmail || "",
    data.category === "Others" && data.categoryOther
      ? "Others, " + data.categoryOther
      : (data.category || ""),
    data.roster || "",
    data.college || "",
    data.classYear || "",
    data.board || "",
    data.age || "",
    data.address || "",
    data.fee || "",
    data.txnId || "",
    screenshotLink,
  ]);

  sendConfirmationEmail(data);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function sendConfirmationEmail(data) {
  if (!data.registrantEmail) return;

  const subject = "AniFX 2026 — entry received for " + data.track;

  const lines = [
    "Hi " + (data.registrantName || "") + ",",
    "",
    "Your registration for " + data.track + " has been recorded. We will verify your payment against our account and confirm your slot by email within 72 hours.",
    "",
    "Details on file:",
    "Team / entrant: " + (data.teamName || data.registrantName || ""),
    "College: " + (data.college || ""),
    data.txnId ? "Transaction ID: " + data.txnId : "",
    "",
    "Keep your transaction ID handy — if you haven't heard back within 72 hours, reply to this email with it.",
    "",
    "— AniFX 2026",
  ].filter(line => line !== "");

  try {
    MailApp.sendEmail({
      to: data.registrantEmail,
      subject: subject,
      body: lines.join("\n"),
      htmlBody: buildConfirmationEmailHtml(data),
    });
  } catch (err) {
    // Don't fail the whole submission just because the email didn't send —
    // the row is already saved; log it so it's visible in Executions.
    console.error("sendConfirmationEmail failed: " + err);
  }
}

function buildConfirmationEmailHtml(data) {
  const name = escapeHtml(data.registrantName || "");
  const track = escapeHtml(data.track || "");
  const entrant = escapeHtml(data.teamName || data.registrantName || "");
  const college = escapeHtml(data.college || "");
  const txnRow = data.txnId
    ? '<tr><td style="padding:4px 0;color:#a89e8c;font-size:14px;">Transaction ID</td>' +
      '<td style="padding:4px 0;color:#f0e6d2;font-size:14px;text-align:right;">' + escapeHtml(data.txnId) + '</td></tr>'
    : "";

  return '' +
    '<div style="background:#0d0d0d;padding:48px 24px;font-family:Arial,Helvetica,sans-serif;">' +
      '<table role="presentation" width="100%" style="max-width:520px;margin:0 auto;border-collapse:collapse;">' +
        '<tr><td style="text-align:center;padding-bottom:24px;">' +
          '<div style="width:64px;height:64px;line-height:64px;border:2px solid #e8384f;border-radius:50%;margin:0 auto;color:#e8384f;font-size:28px;">&#10003;</div>' +
        '</td></tr>' +
        '<tr><td style="text-align:center;padding-bottom:16px;">' +
          '<span style="color:#f0e6d2;font-size:28px;font-weight:bold;letter-spacing:1px;">ENTRY RECEIVED</span>' +
        '</td></tr>' +
        '<tr><td style="text-align:center;color:#c9bfa8;font-size:15px;line-height:1.6;padding-bottom:28px;">' +
          'Hi ' + name + ', your registration for <b style="color:#f0e6d2;">' + track + '</b> has been recorded. ' +
          'We will verify your payment against our account and confirm your slot by email within 72 hours.' +
        '</td></tr>' +
        '<tr><td style="border-top:1px solid #2a2a2a;padding-top:20px;">' +
          '<table role="presentation" width="100%" style="border-collapse:collapse;">' +
            '<tr><td style="padding:4px 0;color:#a89e8c;font-size:14px;">Team / entrant</td>' +
              '<td style="padding:4px 0;color:#f0e6d2;font-size:14px;text-align:right;">' + entrant + '</td></tr>' +
            '<tr><td style="padding:4px 0;color:#a89e8c;font-size:14px;">College</td>' +
              '<td style="padding:4px 0;color:#f0e6d2;font-size:14px;text-align:right;">' + college + '</td></tr>' +
            txnRow +
          '</table>' +
        '</td></tr>' +
        '<tr><td style="text-align:center;color:#a89e8c;font-size:13px;line-height:1.6;padding:24px 0 8px;">' +
          "Keep your transaction ID handy — if you haven't heard back within 72 hours, reply to this email with it." +
        '</td></tr>' +
        '<tr><td style="text-align:center;color:#6f6656;font-size:12px;padding-top:16px;">— AniFX 2026</td></tr>' +
      '</table>' +
    '</div>';
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() > 0) return;
  sheet.appendRow(HEADERS);
}

function saveScreenshot(base64, filename, mimeType) {
  const folder = getOrCreateFolder(FOLDER_NAME);
  const bytes = Utilities.base64Decode(base64);
  const blob = Utilities.newBlob(bytes, mimeType, filename);
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getUrl();
}

function getOrCreateFolder(name) {
  const existing = DriveApp.getFoldersByName(name);
  if (existing.hasNext()) return existing.next();
  return DriveApp.createFolder(name);
}

/**
 * AniFX registration endpoint.
 * Paste this into Extensions → Apps Script on the registration Sheet,
 * then deploy as a Web App. See README.md in this folder for setup.
 */

const SHEET_ID = "13H1DZNwcnj4deJjAc0wxPIeH5-hP31RZKUxIKLO5vIk";
const FOLDER_NAME = "AniFX Payment Screenshots";

const HEADERS = [
  "Submitted At", "Track ID", "Track", "Fee", "Team Name", "Lead Role",
  "Registrant Name", "Phone", "Email", "College", "Age", "Class/Year",
  "Board", "Address", "Roster", "Txn ID", "Screenshot Link",
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
    data.trackId || "",
    data.track || "",
    data.fee || "",
    data.teamName || "",
    data.leadRole || "",
    data.registrantName || "",
    data.registrantPhone || "",
    data.registrantEmail || "",
    data.college || "",
    data.age || "",
    data.classYear || "",
    data.board || "",
    data.address || "",
    data.roster || "",
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
    "Your registration for " + data.track + " has been recorded. We verify every payment against our account and confirm your slot by email within 48 hours.",
    "",
    "Details on file:",
    "Team / entrant: " + (data.teamName || data.registrantName || ""),
    "College: " + (data.college || ""),
    data.txnId ? "Transaction ID: " + data.txnId : "",
    "",
    "Keep your transaction ID handy — if you haven't heard back within 48 hours, reply to this email with it.",
    "",
    "— AniFX 2026",
  ].filter(line => line !== "");

  try {
    MailApp.sendEmail(data.registrantEmail, subject, lines.join("\n"));
  } catch (err) {
    // Don't fail the whole submission just because the email didn't send —
    // the row is already saved; log it so it's visible in Executions.
    console.error("sendConfirmationEmail failed: " + err);
  }
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

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

// Film's own submission form — deliberately a separate sheet, not a
// column on the registration row. Registering and submitting are two
// different moments days apart; keeping them as one row would mean the
// row either gets appended twice (bad) or edited in place (Apps Script
// has no clean "find and update" story here). A second sheet, joined by
// registrant email when someone needs to cross-reference, is the
// simplest thing that actually works.
const SUBMISSION_HEADERS = [
  "Submitted At", "Team / Entrant Name", "Registration Email", "Film Title", "Drive Link",
  "Verified", "Matched Registration Name",
];

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  if (data.kind === "filmSubmission") {
    return handleFilmSubmission(data);
  }
  return handleRegistration(data);
}

// GET is read-only, used by the submission form to check "is this email
// actually registered?" before letting someone submit a film — the form
// itself blocks on this, so a plain "no" here is what stops a mismatched
// email at the UI, not anything on the write side. doPost stays
// mode:"no-cors" from the browser (unread response, by design — see
// handleRegistration), so this check has to be a separate GET the page
// can actually read the answer from.
function doGet(e) {
  const action = e.parameter.action;
  if (action === "checkRegistration") {
    const match = findRegistration(e.parameter.email, e.parameter.track);
    return jsonOutput({ found: !!match, name: match ? match.name : "" });
  }
  return jsonOutput({ ok: false, error: "unknown action" });
}

// Case-insensitive, whitespace-trimmed match on Email + Track against
// the main registration sheet. Returns the matched row's Team Name (or
// Registrant Name if solo) for display, or null if nothing matches.
function findRegistration(email, track) {
  if (!email) return null;
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
  if (sheet.getLastRow() < 2) return null;

  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const emailCol = headers.indexOf("Email");
  const trackCol = headers.indexOf("Track");
  const teamCol = headers.indexOf("Team Name");
  const nameCol = headers.indexOf("Registrant Name");
  if (emailCol === -1) return null;

  const wantEmail = String(email).trim().toLowerCase();
  const wantTrack = track ? String(track).trim().toLowerCase() : "";

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const rowEmail = String(row[emailCol] || "").trim().toLowerCase();
    if (rowEmail !== wantEmail) continue;
    if (wantTrack) {
      const rowTrack = String(row[trackCol] || "").trim().toLowerCase();
      if (rowTrack !== wantTrack) continue;
    }
    const name = (teamCol !== -1 && row[teamCol]) ? row[teamCol] : (row[nameCol] || "");
    return { name: name };
  }
  return null;
}

function jsonOutput(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleRegistration(data) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
  ensureHeaders(sheet, HEADERS);

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

  return jsonOutput({ ok: true });
}

function handleFilmSubmission(data) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName("Film Submissions");
  if (!sheet) sheet = ss.insertSheet("Film Submissions");
  ensureHeaders(sheet, SUBMISSION_HEADERS);

  // The form already checked this via doGet before letting someone
  // submit, but that's a client-side gate — someone could still hit
  // this endpoint directly. Re-checking here means the sheet itself
  // always shows the true match status, not just what the browser saw.
  const match = findRegistration(data.registrantEmail, "Film & animation");

  sheet.appendRow([
    data.submittedAt || new Date().toISOString(),
    data.entrantName || "",
    data.registrantEmail || "",
    data.filmTitle || "",
    data.driveLink || "",
    match ? "Yes" : "No",
    match ? match.name : "",
  ]);

  sendSubmissionConfirmationEmail(data);

  return jsonOutput({ ok: true });
}

function sendSubmissionConfirmationEmail(data) {
  if (!data.registrantEmail) return;

  const subject = "AniFX 2026 - film submission received"
    + (data.filmTitle ? ": " + data.filmTitle : "");

  const lines = [
    "Hi,",
    "",
    "We have received your film submission" + (data.filmTitle ? ' for "' + data.filmTitle + '"' : "")
      + (data.entrantName ? " (" + data.entrantName + ")" : "") + ".",
    "",
    "Drive link on file: " + (data.driveLink || ""),
    "",
    "We will contact you if we have any further queries.",
    "",
    "AniFX 2026 - 23-24 October 2026",
  ].filter(line => line !== "");

  try {
    MailApp.sendEmail({
      to: data.registrantEmail,
      subject: subject,
      body: lines.join("\n"),
      htmlBody: buildFilmSubmissionEmailHtml(data),
    });
  } catch (err) {
    // Don't fail the whole submission just because the email didn't send —
    // the row is already saved; log it so it's visible in Executions.
    console.error("sendSubmissionConfirmationEmail failed: " + err);
  }
}

function buildFilmSubmissionEmailHtml(data) {
  const entrant = escapeHtml(data.entrantName || "");
  const filmTitle = escapeHtml(data.filmTitle || "");
  const driveLink = escapeHtml(data.driveLink || "");
  const filmTitleRow = filmTitle
    ? '<tr><td style="padding:4px 0;color:#a89e8c;font-size:14px;">Film title</td>' +
      '<td style="padding:4px 0;color:#f0e6d2;font-size:14px;text-align:right;">' + filmTitle + '</td></tr>'
    : "";
  const driveLinkRow = driveLink
    ? '<tr><td style="padding:4px 0;color:#a89e8c;font-size:14px;">Drive link</td>' +
      '<td style="padding:4px 0;color:#f0e6d2;font-size:14px;text-align:right;"><a href="' + driveLink + '" style="color:#e8384f;">View file</a></td></tr>'
    : "";

  return '' +
    '<div style="background:#0d0d0d;padding:48px 24px;font-family:Arial,Helvetica,sans-serif;">' +
      '<table role="presentation" width="100%" style="max-width:520px;margin:0 auto;border-collapse:collapse;">' +
        '<tr><td style="text-align:center;padding-bottom:24px;">' +
          '<div style="width:64px;height:64px;line-height:64px;border:2px solid #e8384f;border-radius:50%;margin:0 auto;color:#e8384f;font-size:28px;">&#10003;</div>' +
        '</td></tr>' +
        '<tr><td style="text-align:center;padding-bottom:16px;">' +
          '<span style="color:#f0e6d2;font-size:28px;font-weight:bold;letter-spacing:1px;">FILM RECEIVED</span>' +
        '</td></tr>' +
        '<tr><td style="text-align:center;color:#c9bfa8;font-size:15px;line-height:1.6;padding-bottom:28px;">' +
          'Hi, we have received your film submission' + (filmTitle ? ' for <b style="color:#f0e6d2;">' + filmTitle + '</b>' : '') +
          (entrant ? ' (' + entrant + ')' : '') + '.' +
        '</td></tr>' +
        '<tr><td style="border-top:1px solid #2a2a2a;padding-top:20px;">' +
          '<table role="presentation" width="100%" style="border-collapse:collapse;">' +
            '<tr><td style="padding:4px 0;color:#a89e8c;font-size:14px;">Team / entrant</td>' +
              '<td style="padding:4px 0;color:#f0e6d2;font-size:14px;text-align:right;">' + entrant + '</td></tr>' +
            filmTitleRow +
            driveLinkRow +
          '</table>' +
        '</td></tr>' +
        '<tr><td style="text-align:center;color:#a89e8c;font-size:13px;line-height:1.6;padding:24px 0 8px;">' +
          'We will contact you if we have any further queries.' +
        '</td></tr>' +
        '<tr><td style="text-align:center;color:#6f6656;font-size:12px;padding-top:16px;">AniFX 2026 &middot; 23-24 October 2026</td></tr>' +
      '</table>' +
    '</div>';
}

function sendConfirmationEmail(data) {
  if (!data.registrantEmail) return;

  const subject = "AniFX 2026 - entry received for " + data.track;

  const lines = [
    "Hi " + (data.registrantName || "") + ",",
    "",
    "Your registration for " + data.track + " has been recorded. We will verify your payment against our account and confirm your slot by email within 72 hours.",
    "",
    "Details on file:",
    "Team / entrant: " + (data.teamName || data.registrantName || ""),
    "Competition: " + (data.track || ""),
    data.txnId ? "Transaction ID: " + data.txnId : "",
    data.roster ? "Roster:" : "",
    data.roster || "",
    "",
    "AniFX 2026 - 23-24 October 2026",
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
  const txnRow = data.txnId
    ? '<tr><td style="padding:4px 0;color:#a89e8c;font-size:14px;">Transaction ID</td>' +
      '<td style="padding:4px 0;color:#f0e6d2;font-size:14px;text-align:right;">' + escapeHtml(data.txnId) + '</td></tr>'
    : "";
  const rosterBlock = data.roster
    ? '<tr><td style="padding-top:20px;">' +
        '<div style="color:#a89e8c;font-size:14px;margin-bottom:6px;">Roster</div>' +
        '<div style="color:#f0e6d2;font-size:14px;line-height:1.6;white-space:pre-line;">' + escapeHtml(data.roster) + '</div>' +
      '</td></tr>'
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
            '<tr><td style="padding:4px 0;color:#a89e8c;font-size:14px;">Competition</td>' +
              '<td style="padding:4px 0;color:#f0e6d2;font-size:14px;text-align:right;">' + track + '</td></tr>' +
            txnRow +
          '</table>' +
        '</td></tr>' +
        rosterBlock +
        '<tr><td style="text-align:center;color:#6f6656;font-size:12px;padding-top:24px;">AniFX 2026 &middot; 23-24 October 2026</td></tr>' +
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

function ensureHeaders(sheet, headers) {
  if (sheet.getLastRow() > 0) return;
  sheet.appendRow(headers);
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

// function testSendEmail() {
//   sendConfirmationEmail({
//     registrantEmail: "avdhut.satish@gmail.com",
//     registrantName: "Avdhut Malankar",
//     track: "Game jam",
//     teamName: "avdhut",
//     college: "est",
//     txnId: "232423423432",
//   });
// }

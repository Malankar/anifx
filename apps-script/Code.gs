/**
 * AniFX registration endpoint.
 * Paste this into Extensions → Apps Script on the registration Sheet,
 * then deploy as a Web App. See README.md in this folder for setup.
 */

const SHEET_ID = "1h5P26etgB_F2vmJZr2auzuF5ma4v0kLOqBFoxZv8rec";
const FOLDER_NAME = "AniFX Payment Screenshots";

// Every outgoing confirmation (registration + film submission) is
// silently BCC'd here. Deliberately a DIFFERENT account from whichever
// one runs this script - the whole point is a copy that's still
// reachable if the sending account itself gets locked again. BCC'ing
// the same account that sends it would be worthless as a backup, since
// a locked account takes its own inbox down with it.
// Each email now carries a full summary of everything the entrant
// submitted (see buildSubmissionSummaryFields below) - with sheet
// backups done manually instead of automatically, this BCC'd copy is
// the de facto independent data record, built up one registration at
// a time rather than as a periodic export.
const BACKUP_BCC_EMAIL = "tanayjoshi08@gmail.com";

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

// Emails are queued here instead of sent inline from doPost - see
// queueEmail()/processMailQueue() below for why: a burst of
// registrations firing MailApp.sendEmail() back-to-back is exactly the
// pattern Google's abuse detection reads as spam, and it's also what
// made a single slow/stuck send hang the whole registration request
// for the person submitting it. Decoupling means doPost always returns
// fast, and the queue drains itself at a steady, capped rate instead.
const MAIL_QUEUE_SHEET_NAME = "Mail Queue";
const MAIL_QUEUE_HEADERS = [
  "Queued At", "Type", "Payload", "Status", "Attempts", "Last Error",
];
const MAIL_BATCH_SIZE = 15;      // emails sent per processMailQueue() run
const MAIL_MAX_ATTEMPTS = 3;     // give up on a single bad entry after this many failures

function doPost(e) {
  ensureMailQueueTrigger();
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
  ensureMailQueueTrigger();
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

  queueEmail("confirmation", data);

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

  queueEmail("submission", data);

  return jsonOutput({ ok: true });
}

// --------------------------------------------------------------------
// Mail queue: queueEmail() just appends a row and returns immediately -
// the actual MailApp.sendEmail() calls only ever happen inside
// processMailQueue(), which a time-driven trigger calls once a minute.
// That trigger installs itself automatically (see ensureMailQueueTrigger
// below) - no manual setup step needed after deploying.
// --------------------------------------------------------------------

function queueEmail(type, data) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(MAIL_QUEUE_SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(MAIL_QUEUE_SHEET_NAME);
  ensureHeaders(sheet, MAIL_QUEUE_HEADERS);

  sheet.appendRow([
    new Date().toISOString(),
    type,
    JSON.stringify(data),
    "",   // Status - blank until sent
    0,    // Attempts
    "",   // Last Error
  ]);
}

// Time-driven trigger target. Sends at most MAIL_BATCH_SIZE emails per
// run so a flood of registrations can only ever produce a steady,
// capped send rate - never a burst - regardless of how many came in
// at once. Entries that keep failing are marked "Failed" after
// MAIL_MAX_ATTEMPTS rather than retried forever.
function processMailQueue() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(MAIL_QUEUE_SHEET_NAME);
  if (!sheet || sheet.getLastRow() < 2) return;

  // A quota-exhaustion failure isn't that entry's fault - stop the run
  // without touching anyone's Attempts count, so the whole backlog just
  // tries again at the next run (daily quota resets at midnight PT).
  if (MailApp.getRemainingDailyQuota() <= 0) return;

  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const statusCol = headers.indexOf("Status");
  const attemptsCol = headers.indexOf("Attempts");
  const errorCol = headers.indexOf("Last Error");
  const typeCol = headers.indexOf("Type");
  const payloadCol = headers.indexOf("Payload");

  let sent = 0;
  for (let i = 1; i < values.length && sent < MAIL_BATCH_SIZE; i++) {
    const row = values[i];
    const status = row[statusCol];
    const attempts = Number(row[attemptsCol]) || 0;
    if (status === "Sent" || status === "Failed") continue;
    if (attempts >= MAIL_MAX_ATTEMPTS) {
      sheet.getRange(i + 1, statusCol + 1).setValue("Failed");
      continue;
    }

    const rowNum = i + 1;
    try {
      const data = JSON.parse(row[payloadCol]);
      if (row[typeCol] === "submission") {
        sendSubmissionConfirmationEmail(data);
      } else {
        sendConfirmationEmail(data);
      }
      sheet.getRange(rowNum, statusCol + 1).setValue("Sent");
      sent++;
    } catch (err) {
      sheet.getRange(rowNum, attemptsCol + 1).setValue(attempts + 1);
      sheet.getRange(rowNum, errorCol + 1).setValue(String(err));
      console.error("processMailQueue failed for row " + rowNum + ": " + err);
    }
  }
}

// Self-installing - no manual "run this once" step needed. Called at
// the top of both doPost and doGet, so the trigger gets created
// automatically the moment the very first real request (a registration,
// or even just a doGet registration check) hits the deployed web app.
// A Script Property flag means every request after the first does one
// cheap property lookup instead of re-listing triggers every time -
// ScriptApp.getProjectTriggers()/newTrigger() only actually run once,
// ever, per deployment.
function ensureMailQueueTrigger() {
  const props = PropertiesService.getScriptProperties();
  if (props.getProperty("MAIL_QUEUE_TRIGGER_INSTALLED") === "true") return;

  const exists = ScriptApp.getProjectTriggers()
    .some(t => t.getHandlerFunction() === "processMailQueue");
  if (!exists) {
    ScriptApp.newTrigger("processMailQueue").timeBased().everyMinutes(1).create();
  }
  props.setProperty("MAIL_QUEUE_TRIGGER_INSTALLED", "true");
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
      bcc: BACKUP_BCC_EMAIL,
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
  // Only ever linkify a real http(s) URL - this field is raw user input,
  // and an unvalidated href in an automated email (e.g. a javascript:
  // URI, or just garbage text) is exactly the kind of thing spam/abuse
  // detection looks at. Anything that doesn't look like a URL is shown
  // as plain escaped text instead of becoming a clickable link.
  const rawDriveLink = String(data.driveLink || "").trim();
  const isSafeUrl = /^https?:\/\/\S+$/i.test(rawDriveLink);
  const driveLink = escapeHtml(rawDriveLink);
  const filmTitleRow = filmTitle
    ? '<tr><td style="padding:4px 0;color:#a89e8c;font-size:14px;">Film title</td>' +
      '<td style="padding:4px 0;color:#f0e6d2;font-size:14px;text-align:right;">' + filmTitle + '</td></tr>'
    : "";
  const driveLinkRow = driveLink
    ? '<tr><td style="padding:4px 0;color:#a89e8c;font-size:14px;">Drive link</td>' +
      '<td style="padding:4px 0;color:#f0e6d2;font-size:14px;text-align:right;">' +
      (isSafeUrl ? '<a href="' + driveLink + '" style="color:#e8384f;">View file</a>' : driveLink) +
      '</td></tr>'
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

// Full list of everything the entrant submitted, as ordered [label, value]
// pairs - one source of truth consumed by both the plain-text and HTML
// confirmation emails below, so they can't drift apart the way the
// phone number almost did (added to one, forgotten on the other).
// Roster is deliberately excluded here and handled separately by each
// caller, since it needs its own multi-line layout rather than a single
// table row. Empty/missing fields are dropped automatically.
function buildSubmissionSummaryFields(data) {
  const category = data.category === "Others" && data.categoryOther
    ? "Others, " + data.categoryOther
    : (data.category || "");
  const feeValue = data.fee === 0 || data.fee === "0"
    ? "Free"
    : (data.fee ? "₹" + data.fee : "");

  const fields = [
    ["Competition", data.track],
    ["Entry type", data.entryType ? (data.entryType === "solo" ? "Solo" : "Team") : ""],
    ["Team name", data.teamName],
    ["Lead role", data.leadRole],
    ["Full name", data.registrantName],
    ["WhatsApp number", data.registrantPhone],
    ["Email", data.registrantEmail],
    ["Category", category],
    ["College / institution", data.college],
    ["Class / year", data.classYear],
    ["Board", data.board],
    ["Age", data.age],
    ["Address", data.address],
    ["Entry fee", feeValue],
    ["Transaction ID", data.txnId],
  ];
  return fields.filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== "");
}

function sendConfirmationEmail(data) {
  if (!data.registrantEmail) return;

  // Free tracks (Film & Animation, Character Design) have no payment
  // step, so there's nothing to verify - registration is confirmed the
  // moment it's submitted, not "pending" for 72 hours like a paid entry.
  const isFree = !data.fee || Number(data.fee) === 0;

  const subject = isFree
    ? "AniFX 2026 - registration confirmed for " + data.track
    : "AniFX 2026 - entry received for " + data.track;

  const summaryLines = buildSubmissionSummaryFields(data).map(([label, value]) => label + ": " + value);

  const lines = [
    "Hi " + (data.registrantName || "") + ",",
    "",
    isFree
      ? "Your registration for " + data.track + " is confirmed. Group links will be sent to you by email soon."
      : "Your registration for " + data.track + " has been recorded. We will verify your payment against our account and confirm your slot by email within 72 hours.",
    "",
    "Here's a full summary of what you submitted, for your records:",
    ...summaryLines,
    data.roster ? "Roster:" : "",
    data.roster || "",
    "",
    "AniFX 2026 - 23-24 October 2026",
  ].filter(line => line !== "");

  try {
    MailApp.sendEmail({
      to: data.registrantEmail,
      bcc: BACKUP_BCC_EMAIL,
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
  const isFree = !data.fee || Number(data.fee) === 0;

  const summaryRows = buildSubmissionSummaryFields(data).map(([label, value]) =>
    '<tr><td style="padding:4px 0;color:#a89e8c;font-size:14px;">' + escapeHtml(label) + '</td>' +
    '<td style="padding:4px 0;color:#f0e6d2;font-size:14px;text-align:right;">' + escapeHtml(String(value)) + '</td></tr>'
  ).join("");

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
          '<span style="color:#f0e6d2;font-size:28px;font-weight:bold;letter-spacing:1px;">' + (isFree ? 'REGISTRATION CONFIRMED' : 'ENTRY RECEIVED') + '</span>' +
        '</td></tr>' +
        '<tr><td style="text-align:center;color:#c9bfa8;font-size:15px;line-height:1.6;padding-bottom:28px;">' +
          (isFree
            ? 'Hi ' + name + ', your registration for <b style="color:#f0e6d2;">' + track + '</b> is confirmed. Group links will be sent to you by email soon.'
            : 'Hi ' + name + ', your registration for <b style="color:#f0e6d2;">' + track + '</b> has been recorded. ' +
              'We will verify your payment against our account and confirm your slot by email within 72 hours.') +
        '</td></tr>' +
        '<tr><td style="border-top:1px solid #2a2a2a;padding-top:20px;">' +
          '<div style="color:#a89e8c;font-size:14px;margin-bottom:6px;">Full summary of your submission</div>' +
          '<table role="presentation" width="100%" style="border-collapse:collapse;">' +
            summaryRows +
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

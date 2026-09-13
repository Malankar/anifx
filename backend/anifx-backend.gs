/**
 * ANIFX 2026 — registration backend
 * Runs in YOUR Google account. Data lands in YOUR sheet.
 *
 * ── SETUP (10 minutes) ─────────────────────────────────────────
 * 1. Create a Google Sheet. Name it "AniFX 2026 Registrations".
 * 2. Extensions → Apps Script. Delete everything, paste this in.
 * 3. Edit the SETTINGS block below.
 * 4. Run setup() once. Grant permissions when asked.
 * 5. Deploy → New deployment → type "Web app"
 *      Execute as: Me
 *      Who has access: Anyone
 *    Copy the Web App URL.
 * 6. Paste that URL into CONFIG.sheetEndpoint in the website file.
 * ───────────────────────────────────────────────────────────────
 */

var SETTINGS = {
  eventName:    'AniFX 2026',
  eventDates:   '23–24 October 2026',
  venue:        'DY Patil School of Creative Studies, Navi Mumbai',
  fromName:     'AniFX 2026',
  replyTo:      '',                      // your contact email
  instagram:    'dypu.socs',
  whatsappLink: '',                      // redirect link, NOT the raw invite
  discordLink:  '',                      // game jam + valorant ops
  rulesUrl:     '',                      // link to the rules section of your site
  notifyMe:     ''                       // your email — get pinged on every entry
};

/**
 * Hard caps. The site checks these too, but this is the one that
 * actually counts — it can't be bypassed by editing the page.
 * Once a track hits its cap, further entries are saved as WAITLIST
 * and told so in their confirmation email.
 */
var CAPS = {
  valorant: 32,
  fc26:     64,
  gamejam:  0,   // 0 = no cap
  film:     0
};

var SHEET_ENTRIES = 'Entries';
var SHEET_BANK    = 'BankStatement';

var HEADERS = [
  'Timestamp','Entry ID','Competition','Team / Player','Captain','Phone','Email',
  'College','Roster','Fee','Status','UTR / Ref','Verified On','Confirmation Sent','Notes'
];

/* ============================================================ */

function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var s = ss.getSheetByName(SHEET_ENTRIES) || ss.insertSheet(SHEET_ENTRIES);
  s.clear();
  s.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
    .setFontWeight('bold').setBackground('#16121A').setFontColor('#FFB020');
  s.setFrozenRows(1);
  s.getRange('K2:K').insertCheckboxes();   // Status column as a tick box

  var b = ss.getSheetByName(SHEET_BANK) || ss.insertSheet(SHEET_BANK);
  if (b.getLastRow() === 0) {
    b.getRange(1, 1, 1, 4).setValues([['Date', 'Amount', 'UTR / Ref', 'Description']])
      .setFontWeight('bold');
    b.setFrozenRows(1);
  }

  SpreadsheetApp.getUi().alert(
    'Setup complete.\n\n' +
    'Paste your bank or UPI statement into the BankStatement tab.\n' +
    'Then run verifyPayments() to match entries against it.'
  );
}

/* ---------- the website posts here ---------- */

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_ENTRIES);

    var trackId = d.trackId || 'gen';

    // ---- cap check, server side ----
    var cap = CAPS[trackId] || 0;
    var isWaitlist = false;
    if (cap > 0) {
      var rows = sheet.getDataRange().getValues();
      var verified = 0;
      for (var r = 1; r < rows.length; r++) {
        var rowTrack = String(rows[r][2] || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        if (rowTrack === trackId && rows[r][10] === true) verified++;
      }
      if (verified >= cap) isWaitlist = true;
    }

    var prefix = trackId.substring(0, 3).toUpperCase();
    var entryId = (isWaitlist ? 'WL-' : '') + prefix + '-' +
                  Utilities.formatString('%03d', sheet.getLastRow());

    sheet.appendRow([
      new Date(),
      entryId,
      d.track || '',
      d.teamName || '',
      d.captainName || '',
      "'" + (d.captainPhone || ''),   // leading quote keeps the leading zero
      d.captainEmail || '',
      d.college || '',
      d.roster || '',
      d.fee || 0,
      false,                          // Status — ticked once verified
      '', '', '',
      isWaitlist ? 'WAITLIST — cap reached' : ''
    ]);

    sendConfirmation(d, entryId, isWaitlist);

    if (SETTINGS.notifyMe) {
      MailApp.sendEmail({
        to: SETTINGS.notifyMe,
        subject: (isWaitlist ? '[WAITLIST] ' : '') + 'New entry — ' + (d.track || '') + ' — ' + (d.teamName || ''),
        body: entryId + '\n' + (d.teamName || '') + '\n' + (d.college || '') +
              '\n' + (d.captainName || '') + ' · ' + (d.captainPhone || '') +
              (isWaitlist ? '\n\nCAP REACHED — this entry is on the waitlist.' :
                            '\n\nUnverified until payment is matched.')
      });
    }

    return json({ ok: true, entryId: entryId, waitlist: isWaitlist });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

/* ---------- the website reads verified entries from here ---------- */

function doGet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_ENTRIES);
  var rows = sheet.getDataRange().getValues();
  var out = [];

  for (var i = 1; i < rows.length; i++) {
    if (rows[i][10] !== true) continue;           // verified only
    out.push({
      name:    rows[i][3],
      college: rows[i][7],
      track:   String(rows[i][2] || '').toLowerCase().replace(/[^a-z0-9]/g, ''),
      id:      rows[i][1]
    });
  }
  return json({ ok: true, entries: out });
}

/* ---------- confirmation email ---------- */

function sendConfirmation(d, entryId, isWaitlist) {
  if (!d.captainEmail) return;

  var isTeam = d.trackId !== 'fc26';
  var label  = isTeam ? 'Team' : 'Player';

  var lines = [];
  lines.push('<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;color:#16121A">');
  lines.push('<div style="background:#16121A;color:#F2EDE4;padding:22px">');
  lines.push('<div style="font-size:26px;font-weight:bold;letter-spacing:1px">ANIFX <span style="color:#FFB020">26</span></div>');
  lines.push('<div style="font-size:13px;color:#9A91A6;margin-top:4px">' + SETTINGS.eventDates + ' · ' + SETTINGS.venue + '</div>');
  lines.push('</div>');

  lines.push('<div style="padding:24px 22px">');
  lines.push('<p style="font-size:16px;margin:0 0 16px">Hi ' + escapeHtml(d.captainName || 'there') + ',</p>');

  if (isWaitlist) {
    lines.push('<p style="margin:0 0 18px;line-height:1.6"><b>All slots for ' + escapeHtml(d.track || '') +
      ' are taken.</b> You are on the waitlist. If a slot opens we contact you in the order entries came in — ' +
      'do not pay until we confirm a slot is available.</p>');
  } else {
    lines.push('<p style="margin:0 0 18px;line-height:1.6">We have your entry for <b>' + escapeHtml(d.track || '') + '</b>. ' +
      'Your slot is <b>not confirmed until payment is verified</b> against our account — that usually takes under 48 hours.</p>');
  }

  lines.push('<table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:18px">');
  lines.push(row('Entry ID', entryId));
  lines.push(row(label, d.teamName || ''));
  lines.push(row('Competition', d.track || ''));
  lines.push(row('College', d.college || ''));
  lines.push(row('Entry fee', d.fee ? '₹' + d.fee : 'To be announced'));
  lines.push(row('Status', isWaitlist ? 'Waitlist — do not pay yet' : 'Awaiting payment verification'));
  lines.push('</table>');

  if (!isWaitlist) {
    lines.push('<p style="margin:0 0 10px;font-weight:bold">What happens next</p>');
    lines.push('<ol style="margin:0 0 18px;padding-left:20px;line-height:1.75;font-size:14px">');
    lines.push('<li>We match your payment against our account.</li>');
    lines.push('<li>Your ' + (isTeam ? 'team name' : 'name') + ' appears on the live roster on our website.</li>');
    lines.push('<li>Fixtures and your match times are sent here and posted in the group.</li>');
    lines.push('</ol>');
  }

  if (SETTINGS.whatsappLink) {
    lines.push('<p style="margin:0 0 8px;font-size:14px"><b>Join the group now.</b> ' +
      'Match times go out there first. Missing a match because you did not join is not grounds for a reschedule.</p>');
    lines.push('<p style="margin:0 0 18px"><a href="' + SETTINGS.whatsappLink +
      '" style="background:#FFB020;color:#1A1207;padding:11px 20px;text-decoration:none;font-weight:bold;display:inline-block">Join the WhatsApp group</a></p>');
  }
  if (SETTINGS.discordLink) {
    lines.push('<p style="margin:0 0 18px;font-size:14px">Match lobbies, scores and disputes are handled on Discord: ' +
      '<a href="' + SETTINGS.discordLink + '" style="color:#B8860B">join here</a>.</p>');
  }
  if (SETTINGS.rulesUrl) {
    lines.push('<p style="margin:0 0 18px;font-size:14px">Read the full rules before your first match: ' +
      '<a href="' + SETTINGS.rulesUrl + '" style="color:#B8860B">' + SETTINGS.rulesUrl + '</a></p>');
  }

  lines.push('<p style="font-size:13px;color:#666;line-height:1.6;margin:22px 0 0;border-top:1px solid #ddd;padding-top:14px">' +
    'Keep your payment reference. If your name is not on the roster within 48 hours, reply to this email with it. ' +
    'Entry fees are non-refundable once the bracket is published.</p>');
  lines.push('</div></div>');

  var opts = { to: d.captainEmail, subject: 'Entry received — ' + (d.track || '') + ' — ' + SETTINGS.eventName,
               htmlBody: lines.join(''), name: SETTINGS.fromName };
  if (SETTINGS.replyTo) opts.replyTo = SETTINGS.replyTo;
  MailApp.sendEmail(opts);
}

function row(k, v) {
  return '<tr><td style="padding:7px 0;color:#666;width:38%">' + escapeHtml(k) +
         '</td><td style="padding:7px 0;font-weight:bold">' + escapeHtml(v) + '</td></tr>';
}

/* ---------- payment verification ---------- */
/**
 * Paste your bank or UPI statement into the BankStatement tab
 * (Date | Amount | UTR/Ref | Description), then run this.
 * Matches on UTR first, then on an exact unique amount.
 */
function verifyPayments() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var eSheet = ss.getSheetByName(SHEET_ENTRIES);
  var bSheet = ss.getSheetByName(SHEET_BANK);

  var entries = eSheet.getDataRange().getValues();
  var bank    = bSheet.getDataRange().getValues();

  var byUtr = {};
  for (var b = 1; b < bank.length; b++) {
    var ref = String(bank[b][2] || '').trim();
    if (ref) byUtr[ref] = { amount: bank[b][1], date: bank[b][0] };
  }

  var matched = 0;
  for (var i = 1; i < entries.length; i++) {
    if (entries[i][10] === true) continue;
    var utr = String(entries[i][11] || '').trim();
    if (utr && byUtr[utr]) {
      eSheet.getRange(i + 1, 11).setValue(true);
      eSheet.getRange(i + 1, 13).setValue(byUtr[utr].date);
      matched++;
    }
  }
  SpreadsheetApp.getUi().alert(matched + ' entries verified.\n\nRun sendVerifiedEmails() to tell them they are in.');
}

/**
 * Emails everyone newly verified. Skips anyone already emailed.
 */
function sendVerifiedEmails() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_ENTRIES);
  var rows = sheet.getDataRange().getValues();
  var sent = 0;

  for (var i = 1; i < rows.length; i++) {
    if (rows[i][10] !== true) continue;
    if (rows[i][13] === 'YES') continue;
    if (!rows[i][6]) continue;

    var body = '<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px">' +
      '<div style="background:#16121A;color:#F2EDE4;padding:22px">' +
      '<div style="font-size:26px;font-weight:bold">ANIFX <span style="color:#FFB020">26</span></div></div>' +
      '<div style="padding:24px 22px;color:#16121A">' +
      '<p style="font-size:18px;font-weight:bold;margin:0 0 14px">You are in.</p>' +
      '<p style="line-height:1.6;margin:0 0 16px">Payment verified for <b>' + escapeHtml(rows[i][3]) +
      '</b> in <b>' + escapeHtml(rows[i][2]) + '</b>. Your name is now on the live roster.</p>' +
      '<p style="line-height:1.6;margin:0 0 16px">Entry ID <b>' + escapeHtml(rows[i][1]) + '</b>. ' +
      'Fixtures are published once registration closes.</p>' +
      (SETTINGS.whatsappLink ? '<p><a href="' + SETTINGS.whatsappLink +
        '" style="background:#FFB020;color:#1A1207;padding:11px 20px;text-decoration:none;font-weight:bold">Join the WhatsApp group</a></p>' : '') +
      '</div></div>';

    var opts = { to: rows[i][6], subject: 'Confirmed — ' + rows[i][2] + ' — ' + SETTINGS.eventName,
                 htmlBody: body, name: SETTINGS.fromName };
    if (SETTINGS.replyTo) opts.replyTo = SETTINGS.replyTo;
    MailApp.sendEmail(opts);

    sheet.getRange(i + 1, 14).setValue('YES');
    sent++;
    Utilities.sleep(400);
  }
  SpreadsheetApp.getUi().alert(sent + ' confirmation emails sent.');
}

/**
 * Builds click-to-send WhatsApp links for anyone verified but not
 * yet messaged. Writes them into the Notes column — click to open
 * WhatsApp with the message pre-filled. Sending stays manual, which
 * keeps your number safe from being flagged.
 */
function buildWhatsAppLinks() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_ENTRIES);
  var rows = sheet.getDataRange().getValues();
  var made = 0;

  for (var i = 1; i < rows.length; i++) {
    if (rows[i][10] !== true) continue;
    var phone = String(rows[i][5] || '').replace(/\D/g, '');
    if (phone.length < 10) continue;
    if (phone.length === 10) phone = '91' + phone;

    var msg = 'Hi ' + rows[i][4] + ' — your entry for ' + rows[i][2] + ' at ' +
              SETTINGS.eventName + ' is confirmed. Entry ID ' + rows[i][1] + '. ' +
              (SETTINGS.whatsappLink ? 'Join the group: ' + SETTINGS.whatsappLink : '');

    sheet.getRange(i + 1, 15).setFormula(
      '=HYPERLINK("https://wa.me/' + phone + '?text=' + encodeURIComponent(msg) + '","Message")'
    );
    made++;
  }
  SpreadsheetApp.getUi().alert(made + ' WhatsApp links built in the Notes column.');
}

/* ---------- menu ---------- */

function onOpen() {
  SpreadsheetApp.getUi().createMenu('AniFX')
    .addItem('First-time setup', 'setup')
    .addSeparator()
    .addItem('Verify payments against statement', 'verifyPayments')
    .addItem('Email newly verified entries', 'sendVerifiedEmails')
    .addItem('Build WhatsApp message links', 'buildWhatsAppLinks')
    .addToUi();
}

/* ---------- helpers ---------- */

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

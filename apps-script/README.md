# AniFX registration → Google Sheet (Apps Script)

Backend for the registration form and the Film & Animation submission
form in `frontend-v2`. Every registration becomes one row on the main
sheet; payment screenshots are saved to a Drive folder and linked from
the sheet. Film submissions (sent separately, after registration, once
someone's film is ready) land on their own second sheet — see
**Film submissions** below.

## The main sheet's columns

Row 1 of the first sheet, in this exact order:

```
Submitted At	Track	Entry Type	Team Name	Lead Role	Registrant Name	Phone	Email	Category	Roster	College	Class/Year	Board	Age	Address	Fee	Txn ID	Screenshot Link
```

`ensureHeaders()` writes this automatically the first time the sheet
is completely empty — on a sheet that already has data, it's a no-op,
so if you're looking at a live sheet, this is just documentation, not
something you need to go type in.

A few columns only apply to some tracks and are just blank elsewhere:
Entry Type/Team Name/Roster only fill in for team tracks (VALORANT,
game jam, film — blank on a game jam/film Solo entry too). Lead Role
is the exception: it's never blank — team entries get the track's
lead title (Captain, Team Lead, etc.), and every solo entry (FC26,
Character Design, or a Solo pick on game jam/film) gets the literal
string "Solo entrant" instead of being left empty. Category only
applies to film (the picked category, or whatever the person typed in
"specify" when they chose Others), and Fee/Txn ID/Screenshot Link are
blank for the free character-design track.

## First-time setup (skip this if you already have a deployment)

1. **Create a Google Sheet.** Any name. Leave row 1 blank —
   `ensureHeaders()` writes the header row above automatically the
   first time the sheet is empty.

2. In the Sheet, open **Extensions → Apps Script**. Delete the
   default `Code.gs` contents and paste in `Code.gs` from this folder.

3. In the script, update `SHEET_ID` to the new Sheet's ID (from its
   URL) and `FOLDER_NAME` if you want a different Drive folder name
   for screenshots (default: `AniFX Payment Screenshots`). The script
   creates the folder itself on first run.

4. **Deploy → New deployment → Web app.**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click Deploy, authorize when prompted (it's your own script, the
     "unsafe" warning is expected — click Advanced → Go to project).

5. Copy the Web App URL it gives you (ends in `/exec`).

6. Paste that URL into `frontend-v2/public/shared.js`:

   ```js
   sheetEndpoint: "https://script.google.com/macros/s/XXXXX/exec",
   ```

7. Rebuild and redeploy the site (`pnpm run build` then
   `firebase deploy --only hosting`).

## Updating an existing deployment

Paste the new `Code.gs` over your script's contents, save, then
**Deploy → Manage deployments → (pencil icon on the active deployment)
→ Version: New version → Deploy**. Same URL, nothing in `shared.js`
needs to change. Don't use "New deployment" for an update — that
issues a *different* URL and you'd have to go update `shared.js` again.

## Film submissions

Registration and film submission are deliberately two separate steps,
days apart — someone registers for Film & Animation well before their
film is finished, then comes back closer to the deadline to send the
actual film. Rather than edit their existing registration row (Apps
Script has no clean "find and update" story, only `appendRow`), a
submission is a new row on its own sheet, named **Film Submissions**,
auto-created the first time someone submits:

```
Submitted At	Team / Entrant Name	Registration Email	Film Title	Drive Link	Verified	Matched Registration Name
```

`Verified` and `Matched Registration Name` are filled in automatically —
the script itself looks up the submitted email against the main sheet's
`Email` + `Track` columns and records what it found. This is the same
check the submission form already runs before letting someone submit
(via `doGet`, see below), done a second time server-side so the sheet
always shows the true match status even if someone bypassed the form.
A `Verified: No` row is worth a manual look — likely a typo'd email, an
unregistered entrant, or an unlikely direct hit on the endpoint.

### The registration-check endpoint (`doGet`)

The submission form calls the deployed Web App URL with
`?action=checkRegistration&email=...&track=Film%20%26%20animation`
before it will let someone submit, and blocks with an explanation if no
match is found. This is a plain `GET`, unlike the `POST` used for
actually saving a submission — see the code comment on `doGet` in
`Code.gs` for why that split matters (the page needs to actually read
this answer, not just fire-and-forget it).

If this check itself fails to load (network hiccup, this URL not being
reachable, etc.), the form does **not** hard-block the participant —
it warns them and lets the submission through anyway, since the
server-side re-check above still records the true status either way.
So don't be alarmed by an occasional `Verified: No` you can't explain —
cross-check the email by eye before assuming it's a real problem.

## Notes

- Every submission lands as a new row. No slot-capacity check — nothing
  polls the endpoint or counts entries; `doGet` only ever answers the
  one "is this email registered" question above, nothing else.
- `Screenshot Link` is a Drive view link — click it from the sheet.
- `Drive Link` (Film Submissions sheet) is whatever the participant
  pasted in — it's their own Drive folder, not copied anywhere. Open it
  from the sheet like any other link; if it's broken or not shared
  properly, that's exactly the kind of thing the confirmation email
  invites them to fix before the deadline.
- Re-running **Deploy → Manage deployments → Edit → New version** is
  required after any change to `Code.gs`; editing the script alone
  does not update the live `/exec` URL's behavior.
- The endpoint is public (anyone with the URL can POST). That's
  normal for this pattern — Apps Script has no built-in auth for a
  form endpoint. Don't put anything in the sheet you wouldn't want
  guessed at from the URL, and don't share the URL beyond the site's
  own code.

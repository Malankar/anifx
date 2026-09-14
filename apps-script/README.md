# AniFX registration → Google Sheet (Apps Script)

Backend for the registration form in `frontend-v2`. Every submission
becomes one row in a Google Sheet; payment screenshots are saved to a
Drive folder and linked from the sheet.

## Setup (one-time, ~5 minutes)

1. **Create a Google Sheet.** Any name. On row 1, paste this header
   (one cell per column, in this exact order):

   ```
   Submitted At	Track	Entry Type	Team Name	Lead Role	Registrant Name	Phone	Email	Category	Roster	College	Class/Year	Board	Age	Address	Fee	Txn ID	Screenshot Link
   ```

   You don't have to type this in — `ensureHeaders()` in the script writes
   it automatically the first time the sheet is empty.

   A few columns only apply to some tracks and are just blank elsewhere:
   Entry Type/Team Name/Lead Role/Roster only fill in for team tracks
   (VALORANT, game jam, film — blank on a game jam/film Solo entry too),
   Category only for film (the picked category, or whatever the person
   typed in "specify" when they chose Others), and Fee/Txn ID/Screenshot
   Link are blank for the free character-design track.

2. In the Sheet, open **Extensions → Apps Script**. Delete the
   default `Code.gs` contents and paste in `Code.gs` from this folder.

3. In the script, update `FOLDER_NAME` if you want a different Drive
   folder name for screenshots (default: `AniFX Payment Screenshots`).
   The script creates the folder itself on first run.

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

## Notes

- Every submission lands as a new row. No slot-capacity check — the
  script only exposes `doPost`, nothing polls it or counts entries.
- `Screenshot Link` is a Drive view link — click it from the sheet.
- Re-running **Deploy → Manage deployments → Edit → New version** is
  required after any change to `Code.gs`; editing the script alone
  does not update the live `/exec` URL's behavior.
- The endpoint is public (anyone with the URL can POST). That's
  normal for this pattern — Apps Script has no built-in auth for a
  form endpoint. Don't put anything in the sheet you wouldn't want
  guessed at from the URL, and don't share the URL beyond the site's
  own code.

# AniFX 2026 — frontend-v2

Vite + React + shadcn/ui rebuild of the AniFX site, backed by Firebase
(Auth + Firestore + Hosting + Cloud Functions). Replaces the old static
`frontend/` (Apps Script + Google Sheet) backend.

## Stack

- Vite + React + TypeScript, shadcn/ui (`radix-nova` style)
- Firebase Auth (email/password + Google) — real user accounts, feeds the
  dashboard's "events I registered for"
- Firestore — `registrations` collection (replaces the Google Sheet)
- Cloud Functions (Blaze plan required) — cap/waitlist enforcement + entry
  ID assignment on every new registration, confirmation email via the
  Trigger Email extension, and the `setAdmin` callable for granting admin
- Firebase Hosting — deploy target, wire up a custom domain from the
  Hosting tab once deployed

## One-time setup

1. Create a Firebase project (console.firebase.google.com), **upgrade to
   Blaze** (Settings → Usage and billing) — required for Cloud Functions
   and the Trigger Email extension. Usage stays inside the free tier at
   this event's scale; Blaze just means a card is on file.
2. Enable **Authentication** → Email/Password and Google providers.
3. Enable **Firestore** (production mode — rules are in `firestore.rules`).
4. Install the **Trigger Email** extension (Firebase console → Extensions)
   pointed at the `mail` collection, with your SMTP provider (SendGrid,
   Mailgun, etc.) — this is what actually sends the confirmation emails
   the Cloud Function queues.
5. `cp .env.example .env.local` and fill in the Firebase web app config
   (Project settings → your apps → SDK config) plus `VITE_UPI_ID` /
   `VITE_UPI_PAYEE_NAME` for the payment QR code.
6. `firebase login`, then `firebase use --add` to point `.firebaserc` at
   your project (replaces the `REPLACE_WITH_YOUR_FIREBASE_PROJECT_ID`
   placeholder).

## Install & run

```bash
pnpm install
pnpm dev              # local dev server
```

```bash
cd functions && pnpm install   # separate package, installs on its own
```

## Deploy

```bash
pnpm run build
firebase deploy --only hosting,firestore:rules,functions
```

### Custom domain

Firebase Hosting → Add custom domain, follow the DNS verification/CNAME
steps it gives you. No separate host needed.

## First admin account

Nobody has the `admin` custom claim yet after a fresh deploy. Sign up
normally in the app, open the browser console on that page, and run:

```js
import { getFunctions, httpsCallable } from "firebase/functions";
await httpsCallable(getFunctions(), "setAdmin")({ targetUid: "<your uid>", admin: true });
```

(Find your uid in Firebase console → Authentication.) The `setAdmin`
function only allows this self-bootstrap once — after that, only an
existing admin can promote others. Sign out and back in (or wait ~1hr for
token refresh) for the `/admin` route to unlock.

## Payment / QR behaviour

Per event, defined in `src/lib/tracks.ts`:

- **VALORANT, FC26, Game jam** — always paid → QR/payment section always
  shows after registering.
- **Film & animation** — has a fee tier picker (student = free, pro =
  ₹499). QR/payment section only shows if the paid tier is picked.
- **Character design** — `freeEntry: true`, always free → QR/payment
  section never shows.

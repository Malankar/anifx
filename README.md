# AniFX 2026 — frontend-v2

Vite-built static site (multi-page HTML + shared.css/shared.js) for the
AniFX site. Registration data goes to a Google Sheet via the Apps Script
backend in `apps-script/` — no login, no admin dashboard, no Firestore.
Firebase is used only for Hosting.

## Stack

- Vite (multi-page build: `index.html` + one HTML per event)
- Plain HTML/CSS/JS (`public/shared.css`, `public/shared.js`)
- Google Apps Script + Google Sheets — registration storage (`apps-script/`)
- Firebase Hosting — deploy target only

## Prerequisites

- Node.js 20+
- pnpm (`corepack enable` or `npm i -g pnpm`)
- Firebase CLI (`npm i -g firebase-tools`)
- Access to the `anifx-2b1f0` Firebase project (or your own — see below)
- Git

### Windows

No extra tooling beyond the above — this is a plain Vite/HTML/CSS/JS
project, no native/compiled deps. Use PowerShell, cmd, or WSL; all
scripts (`pnpm dev`, `pnpm run deploy`, etc.) run cross-platform as-is.

## Setup

```bash
git clone <repo-url>
cd anifx
pnpm install
firebase login
```

Check `.firebaserc` points at the Firebase project you have access to:

```json
{ "projects": { "default": "anifx-2b1f0" } }
```

Using your own Firebase project instead: create one at
[console.firebase.google.com](https://console.firebase.google.com),
enable Hosting, then `firebase use --add` and pick it.

### Registration backend (one-time)

Form submissions post to a Google Apps Script endpoint (Google Sheet +
Drive, no server of our own). Follow `apps-script/README.md` to create
the Sheet, deploy the script, and get the `/exec` URL. Paste that URL
into `public/shared.js` (`sheetEndpoint`) before deploying the site.

## Develop

```bash
pnpm dev              # local dev server, http://localhost:5173
```

Other useful scripts: `pnpm lint`, `pnpm typecheck`, `pnpm format`,
`pnpm preview` (serve the production build locally).

## Deploy

```bash
pnpm run deploy        # = vite build && firebase deploy --only hosting
```

or step by step:

```bash
pnpm run build
firebase deploy --only hosting
```

Deploys `dist/` to Firebase Hosting for the project in `.firebaserc`.

### Custom domain

Firebase Hosting → Add custom domain, follow the DNS verification/CNAME
steps it gives you. No separate host needed.

## Payment / QR behaviour

Per-event fee/QR config lives in `public/shared.js`. Payment QR itself is
a static image (`public/payment-qr.png`).

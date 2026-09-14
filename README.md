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

## Install & run

```bash
pnpm install
pnpm dev              # local dev server
```

## Deploy

```bash
pnpm run build
firebase deploy --only hosting
```

### Custom domain

Firebase Hosting → Add custom domain, follow the DNS verification/CNAME
steps it gives you. No separate host needed.

## Payment / QR behaviour

Per-event fee/QR config lives in `public/shared.js`. Payment QR itself is
a static image (`public/payment-qr.png`).

# AniFX 2026 — frontend-v2

Vite + React + TypeScript + Tailwind single-page app for the AniFX site
(react-router handles the 6 routes client-side). Registration data goes
to a Google Sheet via the Apps Script backend in `apps-script/` — no
login, no admin dashboard, no Firestore. Firebase is used only for
Hosting.

## Stack

- Vite + React + TypeScript (SPA — one `index.html`, routed by `react-router-dom`)
- Tailwind CSS v4 + shadcn/ui infra (`components.json`) for any new UI;
  the site's existing visual design still comes from `public/shared.css`,
  linked globally and unchanged from the old static site
- Google Apps Script + Google Sheets — registration storage (`apps-script/`)
- Firebase Hosting — deploy target only

All site content/copy (competitions, rules, FAQ, schedule) lives in one
place: `src/lib/config.ts` (ported from the old `shared.js` CONFIG
object) — edit that and it updates every page.

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

Per-event fee/QR config lives in `src/lib/config.ts`. Payment QR itself is
a static image (`public/payment-qr.png`).

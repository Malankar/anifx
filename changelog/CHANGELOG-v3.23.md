# AniFX 2026 — v3.23 Log (Device audit — found and fixed the real "dashed line" bug)

Requested: audit mobile/tablet/desktop and ship. Found something worth flagging clearly.

## The dashed line was never actually fixed

Back in v3.16, "the dashed line under the tabs" was fixed by removing `.content-tabs`'s `border-bottom`. That element was real, but it wasn't the one causing the visible dashes — it was a low-contrast **solid** line. The actual dashed line is `.track::before`, a `repeating-linear-gradient` decoration at the top of every track page's Overview-panel content block (`.track`, rendered into the Overview tab on every one of the 5 event pages). It's accent-colored and clearly dashed — exactly what the original screenshot showed — and it was never touched.

Found it this round doing the tablet pass specifically: at 820px width it was very visible right under the Overview/Rules/Schedule/FAQ tabs on every track page. Removed `.track::before` entirely. Confirmed removed across all 5 track pages × mobile/tablet/desktop (15 checks, all clean) — not just the one page/width where it was spotted.

Left two other dashed elements alone since they're unrelated and intentional: `.todo` (marks unfilled contact-info links, small and contextual, not a page-spanning divider) and VALORANT's `.v-plate-scan` (a subtle sci-fi scanline texture on the hero decoration, not a border/divider).

## Full device audit

Screenshotted all 6 pages at mobile (390px), tablet (820px), and desktop (1440px) — 18 screenshots, reviewed individually. Everything else from the last several rounds held up: hero banner, VALORANT/FC26 card crops, Film's new hero image, all three credit captions, button glow, countdown, reel-strip assets (VFX Breakdown image and the 3D Reel video both confirmed served correctly via HTTP 200 — the video itself still can't be screenshotted playing in this sandbox specifically, same known Chromium-codec limitation as every prior round, not a real issue).

One thing noted but **not** changed: on the landing page, the transparent `.btn-ghost` "Register your team" button now shows more of the busy hero-banner image through it than it used to against the old plain background. Text is still fully readable — flagging it as a look worth a glance, not a bug I fixed unasked.

## Verified
Full 6-page × desktop/tablet/mobile console/error sweep: clean.

## Cache-buster
`shared.css?v=61` (was 60). `shared.js` unchanged this round.

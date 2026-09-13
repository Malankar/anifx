# AniFX 2026 — v3.31 Log (FC26 card image replaced — same pattern as VALORANT)

Same approach as last round's VALORANT swap: `fc26.jpg` replaced with the new image, same filename, zero config/markup/CSS changes. This only affects the **index-page card** — FC26's own page hero was explicitly locked to keep its pitch/floodlight/ball decoration two rounds ago (that was the client's main-thing instruction, gotten wrong once already), and this round doesn't touch that. Verified both independently before shipping, not assumed.

## Also resolves the promotional-banner complaint structurally

The old FC26 photo had "PLAY NOW ON EA FC26 / THE WORLD'S GAME" banner text baked in, sitting almost on top of the players' heads — the reason for the zoom-crop workaround a few rounds back. This new image has no equivalent banner or logo at all, just the two players and the crowd — nothing to crop around or fade awkwardly. `object-fit:contain` (already in place, untouched) shows the whole thing cleanly.

## Bug bounty this round (explicitly requested, nothing skipped)

- `node -c shared.js` — syntax clean.
- Parsed all 6 HTML files — no markup errors.
- Every internal nav link on every page actually resolves (navigated to each one, not just checked the `href` string).
- Every asset reference (images, videos, CSS, JS) on every page returns 200 — no 404s anywhere.
- Full 6-page × mobile/tablet/desktop console+overflow sweep: clean.

## Verified
Card screenshotted at desktop and mobile — clean, both players fully visible, no clutter. Hero re-confirmed unaffected: no `has-video` class, no poster set, pitch decoration still visible. Diffed the shipped zip against the previous round afterward — confirmed `fc26.jpg` is the only file that changed.

## Cache-buster
Unchanged — `shared.css?v=70`, `shared.js?v=58`. No code touched, image file only.

# AniFX 2026 — v3.30 Log (VALORANT image replaced — same file, same everything)

Client-requested swap: `valorant.jpg` replaced with the new character art. Same filename, so no config/markup/CSS changes anywhere — it automatically feeds both the index card and the hero exactly as before, per the "same fit, same everything, just replace" instruction. No code touched this round, image file only.

## Why this also resolves the recurring VALORANT ghosting issue

The old image had a large "VALORANT" wordmark baked into the artwork, which is what caused the ghosted-duplicate-heading look reported at both tablet widths (fixed with a scoped `object-fit:contain` in v3.28) and — as this round's reference screenshot showed — at wide desktop widths too, which hadn't been caught yet. The new image has no equivalent large wordmark, just small side text ("TACTICS/SKILL/TEAMWORK/VICTORY", "DEFY / THE LIMITS"), so there's nothing sized to collide with the real heading in the first place.

Left the existing tablet-range `object-fit:contain` override in place, per "same everything" — checked it directly against the new image at that width and it still looks clean, so there's no reason to touch it.

## Verified
- Hero screenshotted at 6 widths, including 1920px (matching the width of the client's own reported-bug screenshot) and the 700–1000px tablet range covered by the existing override: clean at all of them, no ghosting, no collision with the real heading.
- Index card screenshotted separately: clean.
- Full 6-page × mobile/tablet/desktop console+overflow sweep: clean.
- Zero JS/console errors on load at any tested width.

## Cache-buster
Unchanged — `shared.css`/`shared.js` weren't touched, only the image file.

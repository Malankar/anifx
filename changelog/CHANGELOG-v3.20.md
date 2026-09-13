# AniFX 2026 — v3.20 Log (Card fixes, tilt removed, FC26 image override, reel-strip assets)

Fast round on annotated feedback. Each item verified in-browser before being marked done.

## Card image crops fixed — VALORANT and FC26

Both were center-cropping (`object-position: 50% 50%`), and both source images have their focal point (the character's / players' heads) high in the frame — the card's wide/short box was cutting the heads off entirely. Set per-track `object-position` (VALORANT `50% 12%`, FC26 `50% 15%`) so faces are visible. Hero versions of both were already fine — only the card crop needed the fix.

## Event-card tilt — removed

Explicitly not wanted. Removed the rotateX/rotateY; kept the plain lift and the cursor-tracking glow (neither was the complaint).

## FC26's key art — client override, documented

Last round declined this (hard rule #3, same category as the Riot key art declined in v3.5). Client was told directly, and explicitly instructed to use it anyway — their own promotional asset, their call to make. Using it now. This is not a change to hard rule #3 itself; it's a one-off client decision on their own asset, recorded here so it reads as deliberate rather than a lapse.

## Film reel-strip — two placeholder cell-types replaced

The strip cycles 5 cell-types (2D/Stop Motion/Live Action/VFX Breakdown/3D Reel), each appearing 4 times across the two duplicated halves that make the scroll loop seamless.

- **VFX Breakdown** cells (4 of 4) — generic camera-icon stock graphic → client's own photo (`vfx-breakdown.jpg`).
- **3D Reel 02** cells (4 of 4) — static placeholder photo → client's video (`pari-3d-reel.mp4`), muted/loop/autoplay. Compressed from the 60MB/4K upload to 151KB (640×360, ~150kbps) — a marquee cell this small doesn't need anywhere near that resolution.
- Confirmed all 4 occurrences of each were updated, not just the first two (this project has had that exact bug before — see `PROJECT_MEMORY.md` §4.5).

## Credits reworded

"Video — Name" / "Character art — Name" → **"Credits — Name"** across all three (Atharva Patil, Shivam Prasad, Paritosh Khairwal | RRS).

## Verified
- Both fixed card crops screenshotted and visually confirmed (heads/faces visible).
- Tilt confirmed gone (`getComputedStyle().transform` no longer returns a `matrix3d`), lift confirmed still present on hover.
- All 4 occurrences each of `vfx-breakdown.jpg` and `pari-3d-reel.mp4` present in the rendered page; no console errors.
- All three credit strings present in their pages' rendered text.

## Cache-buster
`shared.css?v=58` (was 57), `shared.js?v=52` (was 51).

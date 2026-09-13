# AniFX 2026 — v3.21 Log (New hero imagery, Film switched to image, button glow)

Fast round, client supplied new pre-cropped images. Verified in-browser before done.

## Index hero — new background

`CONFIG.heroPoster` set to `anifx-banner.jpg` (client's 4-panel montage: Film/FC26/VALORANT/Game Jam). Fixed a real bug in the process: setting `heroPoster` alone never added the `.hero.has-video` class the image needs to actually become visible (`.hero-video` is `opacity:0` without it) — so this slot has silently never worked, on any prior round. Added the missing class-toggle. Visually confirmed the banner now shows behind "ANIFX 26" with text still readable over the vignette.

## Film — switched from video to a still image

`video:""` (was `film-vfx-clip.mp4`), `cardImage:"film-rrs-ship.jpg"` (a still from Paritosh Khairwal | RRS's work). Same credit caption as before, unchanged. The compressed mp4 is still sitting in the frontend folder, just unreferenced — easy to wire back in if wanted.

## VALORANT and FC26 — new pre-cropped images

Client sent new versions of both (`valorant.jpg` 853×950, `fc26.jpg` 793×673 — different files, same names). Both are taller/more portrait than the previous crops, so the old `object-position` fixes needed retuning — re-tested against the actual card box and reset to `50% 0%` (VALORANT) and `50% 8%` (FC26).

## Button hover — glow added (ref: obsidianlabs.pages.dev)

`.btn-primary`, the nav Register pill, and `.btn-ghost` now get a soft accent-colored glow (box-shadow halo) on hover, on top of the existing lift/sheen-sweep. Kept it as a glow, not the tilt idea floated earlier — event cards already had tilt explicitly rejected last round, and this reference video was specifically about buttons glowing, not tilting.

## Verified
Full 6-page × desktop/tablet/mobile sweep: zero console errors. Banner, Film's new hero, and the button glow all screenshotted directly.

## Cache-buster
`shared.css?v=60` (was 57), `shared.js?v=53` (was 51).

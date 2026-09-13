# AniFX 2026 — v3.10 Log (Game Jam card was blank + hero clip too dark)

Fast fix on top of v3.9.

## Bug 1 — index "Pick your event" card showed nothing for Game Jam

`wireTrackVideos()` in `shared.js` only selected elements with class `.track-video`. The index event-nav cards render their video element with class `.event-card-video` (a different class, used only there) — so the selector never matched it, `src` was never set, and `has-video` was never added. Card sat blank on the right side.

Fix: selector now covers both — `$$(".track-video, .event-card-video")`.

## Bug 2 — Game Jam hero clip too dark/blended

`.hero-video-overlay` was a near-opaque dark gradient (.88 → .7 → solid) sitting over the video the whole time — video was technically visible but heavily crushed. Lightened the gradient (.5 → .38 → .88) and added a small saturation/brightness boost on `.hero.has-video .hero-video` so the footage actually reads. Bottom of the hero (where the fact strip sits) stays dark enough for text contrast.

Cache-buster: `shared.css?v=50`, `shared.js?v=45` (was v=49/v=44).

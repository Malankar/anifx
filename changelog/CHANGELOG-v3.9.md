# AniFX 2026 — v3.9 Log (Game Jam hero: video was blocked by decorative CSS runner)

Fast fix on top of v3.8.

## The bug

v3.8 wired the Game Jam clip through the site's real `.has-video` mechanism correctly — video src, autoplay, and the `has-video` class all fire fine on `game-jam.html`'s hero. But that page's hero also has a hardcoded decorative CSS "runner" (`.gj-stage` — the pixel guy jumping over an obstacle) baked directly into the markup, sitting in the same stacking context, later in DOM order. Nothing ever told it to hide when the video is active, so it painted over the video every time. Looked like the video swap never happened.

## Fix

One CSS rule in `shared.css`:
```
.hero.has-video .gj-stage{display:none}
```
No JS/markup/config changes. Cache-buster: `shared.css?v=49` (v3.8 was v=48). `shared.js` unchanged, stays v=44.

## Not touched

Index "Pick your event" card was never affected by this bug (it has no `.gj-stage` — that decoration only exists on Game Jam's own page hero), so no change needed there.

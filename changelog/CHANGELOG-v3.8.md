# AniFX 2026 — v3.8 Log (Game Jam: video instead of static screenshot)

Fast round on top of v3.7.

Status: implemented, syntax-checked, cache-buster bumped, packaged into `ship/anifx-2026-delivery-v3.8.zip`.

## What changed this round

Client sent an actual gameplay-capture video and asked for it to replace the Game Jam static screenshot, blended the same way.

- Compressed the client's upload (12.3MB, 3838×1548, 24s, h264+aac) down to `frontend/gamejam-clip.mp4` (698KB, 1600×646, audio stripped since the video plays muted anyway, `-movflags +faststart` for smooth start). Same 24s loop content, just web-weight.
- Game Jam's track config switched from `cardImage:"gamejam-shot.jpg"` to `video:"gamejam-clip.mp4"`. This is actually a downgrade in code complexity, not just an asset swap: `video` uses the site's original, already-existing `.has-video` blend mechanism (the one VALORANT/FC26/etc. were always meant to use), so Game Jam now renders through the exact same path as everything else — no separate image-blend logic needed for it anymore. The `cardImage`/`.has-img` mechanism built two rounds ago is still there in `shared.js`/`shared.css` for any future track that has a photo instead of a video, just unused right now since nothing currently sets `cardImage`.
- Deleted `frontend/gamejam-shot.jpg`, no longer referenced anywhere.
- Renders in both places Game Jam's media shows: the index "Pick your event" card and Game Jam's own page hero box — same as the screenshot did before it.

## Cache-busting

`shared.css?v=48`, `shared.js?v=44`.

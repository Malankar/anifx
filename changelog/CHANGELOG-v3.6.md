# AniFX 2026 — v3.6 Log (Game Jam + Character Design imagery)

Fast round on top of v3.5. Read `PROJECT_MEMORY.md` and `CHANGELOG-v3.5.md` first.

Status: implemented, syntax-checked (`CONFIG` object parsed and inspected via Node to confirm all 5 tracks intact after edits — this round's edits to `shared.js` briefly broke the tracks array mid-edit twice and were caught and fixed before packaging), cache-buster bumped, packaged into `ship/anifx-2026-delivery-v3.6.zip`.

## What changed this round

1. **New image assets added**, processed/optimized from client uploads:
   - `frontend/gamejam-shot.jpg` — the client's platformer screenshot, resized to 1400px wide, ~26KB.
   - `frontend/char-rat.png`, `char-alien.png`, `char-monkey.png`, `char-centaur.png` — the 4 client-confirmed original/handmade character sketches, resized to 500px wide each (RGBA kept, transparent-ish backgrounds preserved).

2. **New generic per-track media mechanism, added alongside the existing video one** (`shared.js`/`shared.css`), used by both `#eventNav` (index "Pick your event" cards) and `#eventOverview` (each event's own page hero box):
   - `CONFIG.tracks[].cardImage` — a single image filename. Renders full-bleed, blurred/blended into the card background (same visual treatment as the existing `video` field — same opacity, same left-to-right dark tint gradient — just an `<img>` instead of a `<video>`). Set for **Game Jam only** this round (`gamejam-shot.jpg`).
   - `CONFIG.tracks[].cardGallery` — an array of image filenames. Renders as a crisp (NOT blurred) 2×2 grid, right-aligned inside the card, sized `min(320px, 40%)` of card width, each thumbnail `object-fit:contain` so the artwork isn't cropped. Set for **Character Design only** this round (the 4 sketches). This required restructuring `.event-card` from a single-column flex-end layout into a row layout with a new `.event-card-body` wrapper around the existing text — done carefully so it's a no-op for the 3 other tracks (VALORANT/FC26/Film) that don't set `cardGallery`: `.event-card-gallery{display:none}` by default, only flipped on via the `.has-gallery` class `wireTrackMedia()` adds.
   - New function `wireTrackMedia()` in `shared.js` (next to `wireTrackVideos()`) wires both of the above. Called right after `wireTrackVideos()` in both render sites.
   - Mirrored on the actual event pages too: `.track-media` (the box on e.g. `game-jam.html` itself) now has a `.track-img` counterpart to `.track-video`, same blended-background treatment. **Game Jam's own page now shows the screenshot as its hero-box background, not just the index card.** Character Design's own page was left untouched this round (out of scope for what was asked — only the index card gallery was requested); if the sketches should also appear on `character-design.html` itself, that's a follow-up, not assumed done here.

3. **VALORANT and FC26 explicitly untouched this round** — client said "fc valo will do" (i.e., handling those separately/later), so `cardImage`/`cardGallery` were not set for those two tracks. Their cards/hero boxes still render empty (no video, no image) exactly as before.

## Mistake made and caught mid-round (worth recording so it doesn't repeat)

Editing `CONFIG.tracks` in `shared.js` with `str_replace`-style targeted edits, adding new fields (`cardImage`, `cardGallery`) next to existing ones, caused a match/replace region to accidentally swallow adjacent lines (`rosterHint`, `rosterRequired`, closing braces) twice in a row — once merging the `gamejam` and `film` track objects into invalid JS, once merging `character`'s tail into the `sponsors` key below it. **Both were caught immediately** by actually parsing the file (`new Function(s)` syntax check, then a full `eval()` of the `CONFIG` object and printing `CONFIG.tracks.length` + each track's new fields) before moving on — not just visually eyeballing the diff. Lesson for next agent: after ANY edit inside the `tracks:[...]` array specifically, re-parse and print the array length + field values, don't trust a clean-looking `str_replace` result on its own — the array is long and repetitive enough (multiple tracks share near-identical trailing lines like `rosterRequired:true\n    },\n    {`) that a technically-successful unique-match replace can still delete more than intended if the replacement text doesn't include everything the match consumed.

## Still open / not done this round

- VALORANT and FC26 imagery — client will specify separately.
- Character Design's own event page (`character-design.html`) doesn't show the gallery yet, only the index card does.
- The two previously-declined copyrighted images (Riot VALORANT key art, Planet of the Apes VFX still) are still declined — client was told a CSS/SVG-built alternative could be made instead; no response yet on whether that's wanted.

## Cache-busting

`shared.css?v=46`, `shared.js?v=42` — bumped identically across all 6 HTML files for this round's CSS/JS changes.

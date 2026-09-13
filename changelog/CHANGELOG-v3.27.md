# AniFX 2026 — v3.27 Log (Image cropping reverted, second stale-price location found, reel-strip reorganized)

## Card images: stopped cropping/zooming, show the whole thing

Wrong call last round: I cropped VALORANT's image down to just the character, and zoomed FC26's to hide the ad banner. Client's actual instruction: show the whole image, let the side-fade (already there) handle the fade — a partially-faded promo banner is fine. Reverted:

- VALORANT: restored the client's full original image (was cropped to just the character).
- Both VALORANT and FC26 cards: `object-fit: contain` (shows the entire image) instead of `cover` + manual crop/zoom hacks. No more per-track `object-position`/`transform` overrides — just the whole image, sized to fit.

## Second stale-price location — found and fixed

Client reported "still says Winner, not Prize pool" after I'd already fixed this. Checked the shipped zip's source directly — the fix WAS there (`shared.js`, the facts array). The miss: `valorant.html` has its **own separate, hardcoded** `<div class="pill">` in the hero markup, entirely independent of the facts array in `shared.js` — same information, stored twice, and I only updated one of the two copies. Fixed the second location. Grepped the entire frontend folder for the exact string afterward — confirmed exactly two matches, both now correct, no third copy anywhere.

Every other track page has this same hardcoded-pill-plus-facts-array duplication (by original design, not something introduced this round) — noted in `PROJECT_MEMORY.md` as a standing trap: any future price/fee/date change needs both locations checked, not just the facts array.

## Character gallery: repositioned to actually show all 4

Previously spanned the full card width, which meant roughly half the card's opaque tint was sitting on top of 1–2 of the 4 characters, making them barely visible — not neat. Narrowed the gallery to the card's actually-visible zone (right ~52%) so all 4 sit somewhere they can be seen, evenly. Mobile unaffected — still goes full-width there since the fade direction flips to vertical at that breakpoint.

## Film reel-strip, corrected placement

- **Akhiri Dor** (the award-winning film) moved from "2D Reel 01" to **Stop Motion**, where the client says it actually belongs. Sticker unchanged.
- **2D Reel 01** now plays the client's `Showreel_1.mp4` (compressed from 97MB/1080p to 1.7MB/640×360 — a marquee cell this size doesn't need more).
- **Live Action** now plays the client's `liveaction.mp4` (compressed from 25MB/848×480/162s to 7.9MB/640×360 — still fairly large given the source is nearly 3 minutes long; flagging the size rather than trimming the clip myself without being asked which part to keep).
- VFX Breakdown and 3D Reel 02 untouched, reconfirmed still correct.
- Checked explicitly: no cell has both the Akhiri Dor video and a "2D" label together — it's fully moved, not duplicated in two places.

## Verified this round, exhaustively, not just spot-checked

Wrote a single verification script covering every item above at once, with a cache-busting query string forcing a genuinely fresh load each time (not relying on the browser's own cache, which caused a false alarm last round): prize wording (both correct, old wording confirmed absent), both card images' `object-fit`/`transform`, all 4 character images loaded and visible, exact counts (4 each) for every reel-strip video/sticker with no cross-contamination, and a zero-console-error check across all 6 pages. Then ran the full mobile/tablet/desktop overflow+error sweep separately on top of that. All passed.

## Cache-buster
`shared.css?v=67` (was 65), `shared.js` unchanged this round (still v56).

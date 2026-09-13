# AniFX 2026 — v3.28 Log (FC26 hero reverted properly, real video-playback root cause fixed, character sizing fixed)

## FC26's hero — reverted, this time correctly

Misread the original instruction entirely: the client wanted the custom pitch/floodlight/ball decoration to STAY as FC26's hero (it was "the main thing"), and the photo I'd added to be removed from that page specifically — not the other way around, which is what I'd shipped. Fixed by decoupling card-use from hero-use: added a `cardImageOnly` flag so `fc26.jpg` still drives the index-page card exactly as before, but no longer touches FC26's own page hero at all. The pitch decoration is back on FC26's own page. Verified both independently — hero shows the decoration with no photo, the index card still shows the photo, unaffected.

## Reel-strip video playback — actual root cause, not a guess

**Why the videos weren't playing:** 16 `<video autoplay>` elements on one page (4 unique clips × 4 repeats each, for the seamless-scroll duplication). Real browsers throttle/limit how many videos can decode and autoplay at once — this is a genuine, common browser constraint, not specific to this site. With 16 fighting for that budget, some simply lost and sat frozen, inconsistently, which matches exactly what was reported.

**Fix:** removed the blind `autoplay` attribute from all 16, and added an `IntersectionObserver` that plays a cell's video only once it's actually near-visible in the reel-strip, pausing it again once it scrolls back out. At any moment only the handful of cells actually on screen are attempting to play — verified this directly (not just assumed): monkey-patched `play()`/`pause()` before the observer ran, confirmed exactly 4 `play()` calls (matching the 4 visible cells) and 12 `pause()` calls (the 12 off-screen ones) on load. This sandbox still can't decode H.264 at all (confirmed again against the pre-existing `gamejam-clip.mp4`, same as every prior round), so actual playback still can't be screenshotted here — but the mechanism causing the reported failure is fixed and the logic driving it is verified correct.

## Character lineup — the actual reason sizing looked uneven

Not a layout/CSS problem — the 4 source PNGs had wildly different amounts of transparent padding around the actual character (from 84% of the canvas height for the rat to 99% for the centaur). Any layout will scale a wider-padded image smaller than a tightly-cropped one at the same box size. Trimmed all 4 to their real content bounding box (small uniform margin added back) so they're on equal footing. Measured before/after: character heights now within 1% of each other, not "close" — verified programmatically, not eyeballed.

## Film reel-strip reorganized

- VFX Breakdown's photo replaced with the client's showreel video (same file that had been miswired into "2D Reel 01" last round) — its tag removed, per instruction.
- "2D Reel 01" removed as a cell-type entirely — down to 4 types × 4 repeats (16 cells, was 20). Confirmed the two marquee halves are still identical (required for the seamless -50% loop animation) — the removal was symmetric across both.
- Akhiri Dor and Live Action untouched from last round.

## VALORANT hero — ghosted-looking duplicate text explained and fixed

At tablet widths only (~700–1000px), the full uncropped image's own baked-in "VALORANT" wordmark landed directly on top of the real heading with the default `object-fit:cover`, reading as ghosted duplicate text. Desktop and mobile crop the same image differently and were already fine, matching what was reported. Scoped a fix to exactly that width range and only VALORANT's page: `object-fit:contain` there shows the whole image small instead of a cropped, colliding fragment. Verified the boundary holds — contain only inside 700–1000px, cover outside it, and confirmed the other 4 tracks' heroes are completely untouched by this.

## Verified
Full 6-page × mobile/tablet/desktop error+overflow sweep. A second script checking every specific item above together, with cache-busted fresh loads.

## Cache-buster
`shared.css?v=69` (was 67), `shared.js?v=58` (was 56).

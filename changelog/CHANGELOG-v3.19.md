# AniFX 2026 — v3.19 Log (Font finalized, event-card polish, hero-image feature, credits, FC26 image declined)

Big round — font decision, the whole annotated-feedback plan from two turns ago, and one image declined per an existing hard rule. Every item below was verified in-browser (all 6 pages × desktop/tablet/mobile) before being marked done.

## Font: Alegreya Sans is final

`--f-data` (labels/eyebrows/stats — the small technical text) was Fira Sans, mid-comparison against Alegreya Sans, was IBM Plex Sans before that. Client picked Alegreya Sans. Changed the CSS variable, the Google Fonts `<link>` on all 6 pages, and — because Alegreya Sans only ships static 400/500/700/800/900 weight files (no 600) — moved the 4 places that hardcoded `font-weight:600` on `--f-data` text to `700`, so rendering doesn't depend on browser fallback guessing.

## Event-card hover: tilt + glow

Replaced the flat `translateY(-6px)` lift with a cursor-following 3D tilt (±5°) plus a soft accent-colored glow that tracks the pointer. The scroll-in reveal animation is untouched — tilt only activates once a card has finished revealing, so it never fights that transition. Falls back to the old plain lift under `prefers-reduced-motion` or on touch devices (no JS runs at all in that case).

## Hero-image fallback (new capability)

Previously, a track with no video showed nothing on its own page hero — only the index card could fall back to a static `cardImage`. Extended the wiring so a track with no video but a `cardImage` shows that same image on its own hero too, via the existing `<video>` element's `poster` attribute (no `src` ever set, so it never attempts playback — the poster just displays indefinitely). **VALORANT now uses this** (`valorant.jpg`, fan art supplied by the client, made by a friend).

## FC26's image — declined

The client also supplied official EA Sports FC26 promotional key art for this same slot. **Not used.** `PROJECT_MEMORY.md` hard rule #3 ("never use real/copyrighted or branded imagery, even 'just for now'") already has precedent for this exact situation — official Riot Games VALORANT key art was declined in an earlier round for the same reason (see `CHANGELOG-v3.5.md`). FC26's key art is the same category of asset. FC26's card/hero stay imageless for now; the file was not included in this delivery. Flagged to the client directly rather than deciding silently.

## Credits added

- Game Jam hero (existing video) — **Atharva Patil**
- Character Design hero gallery + index-card thumbnails — **Shivam Prasad**
- Film hero (new video, below) — **Paritosh Khairwal | RRS**

Visible corner caption on each hero; the index-card gallery thumbnails carry the credit in `alt`/`title` text instead (too small for a visible caption).

## Film's new hero video

Client supplied a VFX/animation reel — as uploaded, 3840×2160, 45s, **248MB**. Compressed to 1280×720, ~1.5Mbps, audio stripped (muted background loop anyway) → **7.9MB**. Wired into `CONFIG.tracks.film.video`, which automatically feeds both the hero and the index card (same mechanism Game Jam's clip already used). Caught and fixed a real bug in the process: Film's hero had a `.fm-projector` placeholder (beam + blurred still) explicitly built as filler "until real footage exists" — it sat at the same z-index, later in the DOM, so it kept covering the real video once wired in. Added `.hero.has-video .fm-projector{display:none}`.

## On-campus schedule (from two turns ago — content only, code untouched here)
Already shipped in v3.17/v3.18: FC26 time/venue confirmed, Character Design/VALORANT venues confirmed, Prize distribution time moved, Screening 1 + Game jam jury round moved to Saturday (renamed "Game jam screening" there). No further changes this round.

## Small fixes carried in this round
- `.content-tabs` divider, header Register-pill accent, magnetic hover on Register buttons — from v3.16, unchanged, reverified still correct.
- Header magnetic hover **extended to the 6 plain nav links** (not the logo).
- `.event-nav`'s card-base color changed from the shared warm-toned `--line-soft` to its own neutral `#2B2B2B` (that shared variable is used 24+ other places sitewide — scoped the fix instead of changing it globally).
- "Five Events. / One Festival." — `text-wrap:balance` was forcing the second line to wrap into two even with room to spare, at every width tested (320–1800px). Fixed with `white-space:nowrap` + a slightly smaller font clamp calibrated against the longer phrase.
- Countdown timer — was rebuilding its entire `innerHTML` every second; now builds the 4 boxes once and only updates + animates the digits that actually changed value.

## Verified
Full 6-page × 3-viewport (desktop/tablet/mobile) sweep: zero console/page errors anywhere except the sandbox's own Google Fonts block (unrelated to this code, confirmed in earlier rounds). Deep-checked per feature: brand-break line counts at 3 widths, countdown actually ticking, all 3 credits present in the rendered page, FC26/VALORANT poster wiring, tilt-ready class on all 5 event cards, nav-link magnetic-hover wiring, card-base color. One honest limitation: this sandbox's headless Chromium build can't decode H.264 video at all (confirmed by testing the pre-existing, already-shipped `gamejam-clip.mp4` — it fails identically), so the new Film video's actual playback couldn't be screenshotted here. The file itself was verified directly (standard H.264 High profile, yuv420p, 1280×720 — nothing unusual) and will play normally in any real browser.

## Cache-buster
`shared.css?v=57` (was 56), `shared.js?v=51` (was 49) — bumped identically across all 6 files.

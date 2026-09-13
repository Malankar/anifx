# AniFX 2026 — v3.33 Log (Full suite audit — no code changes, everything below is a check, not a fix)

Requested: full audit, every bug from cosmetic to major, fix and ship. Ran it exhaustively. **Result: no functional bugs found.** Two cosmetic/cleanliness notes below, neither touched (explained why). No code files changed this round — this changelog exists to document what was actually checked, not to record a fix.

**Backend: confirmed byte-identical to your very first upload via direct hash comparison before touching anything else.** Not opened this round.

## What was checked (all passed)

**Structural:** `shared.js` syntax-checked clean; all 6 HTML files parsed with zero markup errors; no duplicate `id` attributes on any page; no `<img>` missing an `alt` attribute; viewport meta present on all 6 pages.

**Rendering, all 6 pages × mobile/tablet/desktop (54 checks):** zero console/page errors, zero horizontal overflow (real scroll simulated top to bottom, not just page-load state), zero failed asset loads (every image/video/CSS/JS request returns 200).

**Interactions (42 checks):** registration modal opens and closes on all 5 track pages at both desktop and mobile; Rules/Schedule/FAQ/Overview tabs all show their content on every track page; countdown seconds actually change between reads, not frozen; mobile burger menu opens the nav.

**Cross-references:** every price/fee/date pulled from every page's hero pill, diffed against its `facts` array and its `<meta description>` — all consistent, no stale copies (this is the exact bug class that shipped twice before; specifically re-checked this round for that reason). Every "23 October"/"24 October" mention in the codebase (30 of them) individually confirmed correct for its actual event day.

**Reel-strip:** 16 cells, both marquee halves still byte-identical (required for the seamless loop) after last round's tag removal — no stray empty tags left behind. Video autoplay-gating (added a few rounds back to fix a real playback bug) still limits simultaneous playback correctly even with Film's hero video now also playing independently — confirmed only the visible/near-visible videos attempt to play, not all of them.

**Character gallery:** all 4 images still exactly equal height (419px, not just "close").

## Two things noted, neither fixed, both harmless

- **Three decorative placeholders are now permanently dead CSS** — `.v-plate` (VALORANT), `.gj-stage` (Game Jam), `.fm-projector` (Film). Each was built to show only when its track had no video/image, but all three tracks now have a permanent, hardcoded one — so each placeholder's own `display:none` guard is unconditionally true and can never NOT apply. They render nothing, cost nothing at runtime (browsers don't animate `display:none` elements), just unused bytes. Not removed — real but low-value cleanup, and this round's priority was verification, not refactoring working code.
- **Two image files are now unreferenced** (`vfx-breakdown.jpg`, `film-rrs-ship.jpg`) — from earlier swaps where VFX Breakdown became a video and Film's hero went back to video from a still image. Left in the folder rather than deleted, matching how every other superseded asset in this project has been handled — in case either is wanted back.

## Cache-buster
Unchanged — `shared.css?v=71`, `shared.js?v=59`. No code touched.

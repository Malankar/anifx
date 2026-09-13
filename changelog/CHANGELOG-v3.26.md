# AniFX 2026 — v3.26 Log (RCA on the text-clip bug, 3rd instance of a recurring bug caught via bounty pass)

## RCA: the "FESTIVAL" text-clip bug, for real this time

**Symptom:** "One Festival." clipped at the edge in the client's own browser, despite v3.22 claiming to fix this with a measure-and-shrink script.

**Root cause:** that script (`fitBrandBreak()`) only ran twice — once immediately at page load, and again on window resize. Neither of those moments is when the bug actually happens. Custom web fonts (Archivo, here) load asynchronously; the browser renders with a fallback font first, then swaps to the real one once it arrives — often a second or so after the page is otherwise interactive. `fitBrandBreak()` was measuring text width **before that swap**, computing a font-size that fit the fallback font, then never checking again once the real font (with different character widths) took over.

**Why this sandbox never caught it:** every test in every prior round ran against this sandbox's network, which blocks Google Fonts outright (403, confirmed repeatedly in every audit this whole project). That means every single test here only ever exercised the "fallback font" case — the real font never arrives in this environment, so there was never a swap to miss. The bug only exists in a browser that can actually load the font, which is every real visitor and zero of my prior tests. Proved this mechanism directly: forced a metric change on the text after the initial fit ran with nothing re-checking it, and reproduced a 15px clip on demand.

**Fix:** hook `document.fonts.ready` — a real browser API that resolves once every `@font-face` has actually finished loading/swapping — and re-run the fit right then. Added a `ResizeObserver` on the same element as a second, broader net for any future width-change cause. Verified the hook fires correctly and the fit holds at 8 widths from 320px to 2560px, including the exact width from the client's screenshot (1569px).

## Bug bounty: same root cause, found twice more

Went looking for the same *pattern* — a decorative placeholder built for "no image yet" that never got a guard against a real image showing up — across every track page, not just the one already reported.

- **FC26** (`.fc-pitch`, the stadium-pitch graphic) — was sitting on top of the new `fc26.jpg` hero. Hidden.
- **VALORANT** (`.v-plate`, the diagonal poster-plate veil/scanlines/frame) — found this round, unreported. Compared the hero with it on vs. off directly: measurably muddier with it on (a second darkening layer stacked on top of the overlay that's already there). Hidden.
- **Film** (`.fm-projector`) — already fixed in v3.21, re-confirmed still correctly hidden this round.
- **Character Design**'s hero gallery is not this bug — it was never a placeholder, it's the intended permanent content, so it's untouched.

Same fix pattern each time: `.hero.has-video .the-decoration{display:none}`.

## Everything else from this round, confirmed correct on a fresh load (not cached)

- VALORANT's Prize label: **"Prize pool ₹17,500"** — confirmed in source and on the rendered page. (An intermediate test screenshot briefly showed the old wording due to browser HTTP caching between two page loads in the same test script, not a reverted edit — re-verified against a completely fresh page load with the new cache-buster to be sure.)
- Akhiri Dor (Parul University) now plays in all 4 "2D Reel 01" cells in the Film reel-strip, each with a "Winner — Best Animated Film 2025" sticker. (My wording for the sticker text — flag it if you want it phrased differently.)
- FC26's card image re-cropped — the promotional "PLAY NOW ON EA FC26 / WORLD'S GAME" banner sat directly above the players' heads with almost no buffer, so any crop showing full faces also showed the ad banner. Zoomed in enough to fully clear the banner; trades some forehead for a clean, unbranded background.
- Landing-page hero banner cropped 7% off the bottom for a bit more breathing room above the heading.
- VALORANT's hero + card now use the new character artwork. Cropped down to just the character, dropping the "VALORANT" wordmark and stat lines baked into the original file — the site's own real heading and stats already show that same information, so keeping the wordmark would have doubled it.

## Verified
Full 6-page × mobile/tablet/desktop sweep, both before and after the `.v-plate` fix: zero console errors, zero horizontal overflow (natural full-page scroll simulated, not just page-load state). Brand-break fit re-tested at 8 widths including the client's exact reported width.

## Cache-buster
`shared.css?v=65` (was 63), `shared.js?v=56` (was 54).

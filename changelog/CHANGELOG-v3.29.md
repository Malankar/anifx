# AniFX 2026 — v3.29 Log (Re-verification found 2 more real bugs — same root cause as before)

Asked to re-verify everything with no assumed trust. Re-extracted the actual shipped v3.28 zip fresh and tested against that, not my working copy. 62 independent checks re-confirmed everything claimed in v3.28 was actually true (FC26 decoupling, video-gating logic, character sizing, reel-strip structure, VALORANT hero boundaries, zero 404s) — full detail below.

But re-verifying only what I'd already claimed isn't enough after getting the same class of bug wrong twice. So this round specifically went hunting for the **same root cause again** — a hardcoded value in a page's own HTML that's a separate copy of something in `shared.js`, silently going stale when the JS side gets edited. Pulled every hero pill from every one of the 5 track pages and diff'd each one against its facts array by hand.

## Found 2 more, real and currently shipping

- **Game Jam's "Jury round" pill** said 23 October. The actual jury round moved to 24 October (Saturday) back in the schedule-reorganization round — I updated the facts array, the schedule, and the rules-tab prose at the time, but missed this pill.
- **Film's "Screening 1" pill** — same story, said 23 October, should be 24.
- **Bonus find, a third copy I hadn't even considered:** both pages' `<meta name="description">` SEO tags *also* had the same stale date baked in — a location I hadn't been checking for this class of bug at all until this pass.

All 3 stale copies (2 pills + 2 meta tags) fixed. Then went further: pulled every `23 October`/`24 October` occurrence across the entire codebase — 27 of them — and manually confirmed each one is contextually correct for its actual event day, not just grep-matched.

## Full re-verification results

- 62 independent checks (fresh script, not reusing prior test code) against the actual re-extracted zip: all passed — FC26 hero/card decoupling, video autoplay removed + intersection-gated play confirmed via monkey-patched play/pause (5 plays, 11 pauses on load), character gallery heights within 1%, reel-strip at 16 cells with both marquee halves still identical, VALORANT hero object-fit correct at all 4 boundary widths (699/700/1000/1001px) and the other 4 tracks confirmed untouched, zero 404s on any asset across all 6 pages.
- Backend re-diffed against the very first upload of this whole project: still byte-identical.
- Full 6-page × mobile/tablet/desktop console+overflow sweep: clean.

## Cache-buster
`shared.css?v=70` (was 69). `shared.js` unchanged this round.

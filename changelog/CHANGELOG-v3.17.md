# AniFX 2026 — v3.17 Log (On-campus schedule: confirmed venues + FC26 time)

Content-only update to `CONFIG.schedule` in `shared.js` from client-confirmed venue/time notes. No markup or CSS changes — `shared.css` cache-buster unchanged, `shared.js` bumped.

## Friday 23 October

- **Character design** — venue confirmed: Auditorium → **Media Lab**.
- **VALORANT grand final** — venue confirmed: Auditorium → **Game Lab**.
- **FC26** — time confirmed: "To be announced" → **11:00**; venue confirmed: Auditorium → **Rooms 204, 205**. (Matches the 11am/204-205 figure already on file elsewhere for this event.)
- Reordered the day's rows chronologically (10:00 ×3, then 11:00 FC26, then 14:00 Game jam) now that FC26 has a real time instead of sitting last as "TBA."

## Saturday 24 October

- **Prize distribution** — time confirmed: 15:00 → **16:00**.

## Verified

- Rendered `index.html#campus` (the full weekend view) and `fc26.html`'s own Schedule tab (the per-track filtered view) — both show the new time/venue correctly.
- Full 6-page console/error sweep re-run after the edit: clean, no regressions from the earlier v3.16 fixes.

## Not yet done — needs a call before touching it

The feedback note also included a second block: "screening at 24th," "game jam screening," and prize distribution's new 16:00 time, grouped together. Prize distribution's time is applied above. The other two are NOT yet added anywhere, because it's genuinely unclear whether they mean:

(a) Friday's existing **Screening 1** and **Game jam — team presentations to jury** rows move to Saturday, and Friday keeps only VALORANT / Character Design / FC26; or
(b) Saturday gains two brand-new rows (a second screening, and a separate "game jam screening" event) while Friday's two rows stay exactly as they are.

Didn't want to guess and either delete real schedule rows or invent a fourth reading — flagged back to the client-facing side of this for a decision.

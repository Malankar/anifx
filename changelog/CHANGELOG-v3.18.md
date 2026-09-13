# AniFX 2026 — v3.18 Log (Screening 1 + Game jam jury round move to Saturday)

Follow-up to v3.17. Confirmed: both move to Saturday; Friday keeps only Character design, VALORANT, FC26.

## Schedule (`CONFIG.schedule`)

**Friday 23 October** — now just:
- 10:00 Character design — Media Lab
- 10:00 VALORANT grand final — Game Lab
- 11:00 FC26 — 204, 205

**Saturday 24 October** — gains the two moved rows ahead of Prize distribution:
- 10:00 Screening 1 — film and animation — Auditorium
- 14:00 **Game jam screening** — Auditorium *(renamed from "Game jam — team presentations to jury," per the note; same time, same `feature` styling)*
- 16:00 Prize distribution — all categories — Auditorium

## Everywhere else this date was duplicated

Two events' facts tables and Rules-tab prose hardcode the same date/time separately from the schedule array — both updated to stay consistent with the move:

- Game Jam facts table: `Jury round` → 24 October, 14:00.
- Game Jam Rules tab: "the jury round happens on campus" → 24 October at 14:00.
- Film facts table: `Screening` → 24 October, 10:00.
- Film Rules tab: "Screening 1 is ..." → 24 October at 10:00.

(Correction to v3.17's own changelog: I'd called this text "FAQ prose" — it's actually the **Rules** tab (`#rulesWrap`), not FAQ. Content and fix are correct; only my label in the last writeup was wrong.)

Everything NOT tied to these two events (VALORANT's grand final date, FC26's played-date, Character Design's date/venue, Prize distribution's date-only mentions) was left alone — confirmed unaffected by grepping every "23 October" / "24 October" occurrence in the file before and after.

## Verified

- `index.html#campus` — both columns match the target layout exactly (Friday: 3 rows, Saturday: 3 rows).
- Game Jam's and Film's own per-track Schedule tabs — each now shows its moved row under Saturday.
- Game Jam's and Film's facts tables and Rules tabs — all four re-checked individually against the actual rendered text, not just the source.
- Full 6-page console/error sweep re-run: clean, no regressions.

Cache-buster: `shared.js?v=49` (was v=48). `shared.css` untouched.

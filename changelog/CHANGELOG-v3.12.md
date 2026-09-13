# AniFX 2026 — v3.12 Log (Card video: full opacity, sharp fade at text edge)

Fast fix on top of v3.11.

- `.event-card-video`: opacity .92 → 1, dropped the brightness boost in favor of a touch more contrast — reads like an actual photo/clip instead of a wash.
- `.event-card-tint`: was a slow blend across ~24% of the card width (38%→62%). Now holds solid dark through 42% (covers the text column), then clears fast over a 10% band (42%→52%) and is fully transparent by 62% — the fade happens right at the text edge instead of bleeding across the middle of the card.

Cache-buster: `shared.css?v=52` (was v=51).

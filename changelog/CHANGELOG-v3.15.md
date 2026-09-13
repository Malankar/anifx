# AniFX 2026 — v3.15 Log (Character Design hero gallery: bigger, restyled, scroll parallax)

- Boxes sized up (~150–230px vs ~120–168px before) and gaps widened.
- Stagger redone across all four boxes (was only 2 offset before) for a less grid-like, more designed feel.
- Added scroll parallax: each box has its own `data-parallax` speed (mix of positive/negative) and drifts independently as the page scrolls, using the same rAF-throttled scroll pattern the hero title already uses elsewhere on the site — clamped to the hero's own height so it settles once you scroll past it. Respects `prefers-reduced-motion` (skipped entirely, same as the title parallax).
- Added a narrower breakpoint (≤1080px) that shrinks box size before the existing ≤900px breakpoint hides the gallery outright.

Cache-buster: `shared.css?v=55`, `shared.js?v=46` (was v=54/v=45).

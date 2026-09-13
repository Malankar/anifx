# AniFX 2026 — v3.13 Log (Character Design hero: added the 4 char sketches)

- Character Design's hero had empty space on the right (no video for this track). Added the four existing `char-*.png` sketches there as a staggered 2x2 grid.
- Each box is masked with a radial vignette (`mask-image`) so it fades at its own edges into the dark hero rather than sitting as a hard-edged tile — proper gap spacing between boxes, alternating vertical offset so it doesn't look like a flat grid.
- Hidden under 900px width — it's a decorative accent, not something worth fighting for space with the actual hero text on smaller screens.
- No new assets — reuses the same 4 PNGs already shipped for the index card's gallery.

Cache-buster: `shared.css?v=53` (was v=52). `shared.js` unchanged.

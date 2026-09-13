# AniFX 2026 — v3.14 Log (Character sketches were getting clipped by their own mask)

Fast fix on top of v3.13. Also ran the usual quick audit — nothing else found.

## Bug — mask-image was fading actual artwork, not just empty box padding

v3.13's `.hcg-box` used `mask-image: radial-gradient(...)` directly on the box, which fades/removes pixels. With `object-fit:contain` + 14% padding, non-square character art could still reach into the 58%–100% fade band near its own corners — parts of the actual sketch could get faded out along with the box edges.

Fix: dropped the mask entirely. Each box now has an `::after` overlay — a radial gradient that's transparent in the middle and solid `var(--ink)` at the edges, drawn *on top of* the image. The artwork underneath renders at full opacity everywhere; only the visual edge blend is affected. Also reduced image padding 14% → 10% to give the art a bit more room.

Cache-buster: `shared.css?v=54` (was v=53). `shared.js` unchanged.

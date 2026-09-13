# AniFX 2026 — v3.11 Log (Game Jam card video was fading to black)

Fast fix on top of v3.10.

## Bug — card video visible only in a small top sliver, rest black

`.event-card-tint`'s dark gradient ran `160deg` (near top-to-bottom) with the near-opaque stop at 75%. The card's actual layout is left-right (text column on the left, video full-bleed behind the whole card) — a vertical gradient darkens the same way regardless of whether text is even there, so the video was crushed to black across nearly the whole card height, only showing through in a sliver near the top.

Fix: gradient now runs `100deg` (left→right): dark on the left where the text sits, clears up by the right edge where the video should actually show.

Added a mobile-only override (`max-width:720px`) reverting to a uniform top-to-bottom dark tint, since the card stacks to full width there and text would otherwise sit over the bright half.

Cache-buster: `shared.css?v=51` (was v=50). `shared.js` unchanged, stays v=45.

# AniFX 2026 — v3.25 Log (Character Design card: boxed grid → side-fade strip)

Requested: make the 4-character grid on the index page's Character Design card feel like the other cards (Film/FC26/VALORANT single-image style) instead of 4 separate boxed thumbnails — rearrange, not redesign.

## Research first

The other cards' "photo" look is one `position:absolute;inset:0` image layer + a side-fade gradient (`.event-card-tint`) painted on top of it. The character gallery was a completely different pattern: a normal flex child sitting to the *right* of the text, laid out as a bordered 2×2 grid (`display:grid`, each `<img>` individually boxed with its own border/background/padding). That's why it looked like 4 separate framed thumbnails instead of one continuous scene. Also checked the 4 source PNGs directly — genuinely transparent (verified alpha channel), not white-background — so they were already suited to sitting directly on the card's dark background without individual boxing once positioned right.

## What changed

- Moved `.event-card-gallery` in the markup to sit where `.event-card-img` sits (right after it, before the tint) — it was previously placed *after* the text content, which would have painted on top of everything once repositioned as a background layer.
- `.event-card-gallery` now uses the exact same `position:absolute;inset:0` as the img/video layer, with `display:flex` arranging the 4 characters side-by-side.
- Removed all the individual-box styling (border, background tile, padding, border-radius) — no filter/blur either, since these are illustrations meant to read clearly, not photo texture.
- The same `.event-card-tint` side-fade gradient every other card already has now paints over this strip too, unmodified — that's what gives the "faded from the side, characters revealed left-to-right" look.
- Removed the gallery-specific mobile override (it was sized for the old boxed-grid layout); it now inherits the same mobile stacking + vertical-fade behavior every other card already has, so mobile behaves consistently across all 5 cards instead of this one being a special case.

## Verified
Screenshotted the result on desktop (characters visible side-by-side, faded in from the left, matching the other cards exactly) and mobile (stacks under the text with the same subtle vertical fade every other card gets at that width). Full 6-page × desktop/tablet/mobile console-error sweep: clean.

## Cache-buster
`shared.css?v=63` (was 62), `shared.js?v=55` (was 54) — the markup reorder in shared.js is a real change (returning visitors' cached JS would still build the old DOM order otherwise), bumped both.

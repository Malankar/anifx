# AniFX 2026 — v3.22 Log (URGENT: "Five Events. / One Festival." overflow fixed properly)

Client screenshot showed "FESTIVAL." clipped at the right edge in production — the `clamp()` sizing from v3.16 was calibrated against this sandbox's rendering and didn't hold in the real browser it was actually viewed in. Different fix this time, not another guessed number.

## What changed

Replaced the fixed-size guess with a real shrink-to-fit measurement: on load and on resize, JS measures the actual rendered width of both lines (`scrollWidth`) against the container, and reduces `font-size` in 2px steps until it genuinely fits with a 4px margin — capped at 20px minimum so it can't shrink into illegibility. Resets to the full CSS size first on every run, so growing the window back out un-shrinks it correctly (verified: 52px at 400px width → 168px at 1800px width, not stuck small).

This is correct regardless of font-rendering differences across browsers/OS/zoom — it doesn't matter that the sandbox and the client's real browser measure text width slightly differently, because it's measuring **the client's actual browser's** real width every time, not trusting a number calibrated somewhere else.

## Verified

Tested 23 widths from 320px to 2560px, including 1608px (the exact width from the screenshot) — zero overflow, zero wrapping at any of them. Full 6-page × desktop/tablet/mobile console-error sweep: clean.

## Cache-buster
`shared.js?v=54` (was 53). `shared.css` untouched this round.

# AniFX 2026 — v3.24 Log (Real mobile bug found: page could drift sideways)

Requested: make sure mobile genuinely works, every piece of content visible. Went deeper than screenshots this time — simulated real scroll behavior and tested every interactive element, not just static layout.

## The real bug: index.html could scroll 27px sideways on mobile

The "Pick your event" cards use a reveal-on-scroll animation that's reversible (`once:false` — cards slide back to their off-position if you scroll past them, so it can replay). That off-position (`translateX(±48px)`) was never contained: once a visitor scrolled past that section, the whole page's document width grew by ~27px and the entire page could shift sideways with a horizontal swipe. `body{overflow-x:hidden}` didn't fully prevent it. Confirmed by simulating a natural scroll from top to bottom of the page (not just checking initial load state) — the drift was real and reproducible on every load, only on `index.html` (the only page using this reveal pattern), at every mobile width tested.

**Fix:** `overflow-x:hidden` added directly on `.event-nav` (the cards' own grid container), containing the animation's off-position locally instead of relying on it never happening. Reveal animation itself still works exactly as before — verified a card still gets its `.in` class and settles at `translateX(0)` normally when scrolled to.

Re-tested with the same realistic full-page scroll simulation across mobile/tablet/desktop widths (390–1440px) on all 6 pages: zero overflow, zero sideways drift, anywhere.

## Two things that looked like bugs and weren't

Chasing this down, two other things looked broken and turned out to be test mistakes on my end, not site problems — worth naming so they're not re-litigated:
- The registration modal briefly looked broken on both mobile *and* desktop — actually a wrong CSS selector in my own test script (there are two modals sharing a class; I was checking the wrong one). Retested against the correct element on all 5 track pages: opens and closes correctly on mobile.
- The mobile burger menu looked like it opened behind the intro screen with nothing visible — actually because my test hadn't scrolled past the landing page's intro title card first, same as a real visitor wouldn't see the header at all until they scroll/skip it either. Once past the intro, the menu opens correctly with all 8 links.

## Verified this round
- Natural full-page scroll simulation (not just top-of-page) on all 6 pages, mobile/tablet/desktop: zero overflow.
- Registration modal open + close on all 5 track pages, mobile viewport.
- Rules/Schedule/FAQ tab switching on all 5 track pages, mobile viewport.
- Burger menu opens with all links reachable, mobile viewport.
- Full console/error sweep, all 6 pages × 3 viewports: clean.

## Cache-buster
`shared.css?v=62` (was 61). `shared.js` unchanged this round.

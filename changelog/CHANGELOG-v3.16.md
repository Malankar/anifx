# AniFX 2026 — v3.16 Log (Annotated-screenshot fixes: tab divider, Register accent, hover + form polish)

Fixes from a round of annotated-screenshot feedback. Each item verified in-browser (all 6 pages, console clean apart from the sandbox's own Google Fonts block — see note at bottom) before being marked done.

## 1. Removed the full-width divider under the event-page content tabs

`.content-tabs` had a low-contrast `border-bottom:1px solid var(--line)` — solid in code, but faint enough that a compressed screenshot read it as a broken/dashed line. It's a shared rule, so it rendered identically under Overview/Rules/Schedule/Sponsors/FAQ on all 5 track pages. Removed the border-bottom entirely; kept the short colored underline beneath the *active* tab (a separate, intentional "you are here" indicator) and the 36px spacing below the tab bar.

## 2. Header Register pill now follows each page's accent

The hero "Register now" / "Register — it's free" buttons (`.btn-primary`) already used `var(--accent)`, correctly varying by track. The header's Register pill (`.nav-links .nav-cta`) was hardcoded to a fixed `--brand-accent` red on every page — the actual inconsistency flagged in feedback. Repointed it to `var(--accent)`. `--brand-accent` is left untouched (still drives the "FX" in the logo, which should stay fixed brand red on every page). On the main page and VALORANT, `--accent` and `--brand-accent` are the same red, so nothing visibly changes there — matches "default as current on main page."

## 3. "Locked to this page" — investigated, not reproduced

Tested opening the registration modal from `index.html` three ways: desktop nav-cta, hero "Register your team" link, and the mobile burger-menu nav-cta. In every case `#trackLocked` stayed `hidden` and the dropdown stayed editable — no path found in this codebase where the main page shows the "Locked to this page" note. Also confirmed `index.html` never sets `window.PAGE_TRACK` (the flag the lock check reads), and that its two `data-open-reg` triggers don't pass a track id either. No code changed here — flagged back for exact repro steps (which button, which device, and whether this was on a live deployed URL that might be serving an older cached `shared.js`).

## 4. Magnetic hover on Register buttons

New: every `[data-open-reg]` button (header pill + each hero's Register CTA) now nudges up to 7px toward the cursor on mousemove and springs back on mouseleave (`.25s` ease, `.08s` linear while tracking). Skipped entirely under `prefers-reduced-motion` and on coarse/touch pointers, consistent with how every other animation in this file is gated. Deliberately small and confined to the Register-style buttons only, not sitewide.

## 5. Registration form — first small polish pass

Added a `border-color` transition to every form field and a subtle `var(--accent-dim)` hover border, matching the treatment already used on the custom competition dropdown (`.cdrop-btn:hover`) — a consistency fix, not a redesign. Structural/visual-grouping changes (sectioning the fields, etc.) intentionally not done yet — open pending direction.

## Cache-buster

`shared.css?v=56` (was v=55), `shared.js?v=47` (was v=46) — bumped identically across all 6 HTML files.

## Note on the audit

Every page loads with a clean console except for one thing outside this codebase's control: Google Fonts' stylesheet request (`fonts.googleapis.com`) returns 403 in the sandboxed environment this was tested in — a network-egress restriction of the test harness, not a site bug. It will load normally on a real host/browser.

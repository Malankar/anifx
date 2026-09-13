# AniFX 2026 — Project Memory / Handoff Doc

This file exists so a **new chat session can pick up this project with zero lost context**. Read this fully before touching any code. It covers: what the project is, hard rules, mistakes already made (don't repeat them), workflows/patterns used, and a session-by-session history.

---

## 1. What this project is

Static multi-page festival website for **AniFX 2026**, a DY Patil School of Creative Studies event (23–24 October 2026, Navi Mumbai). 6 HTML pages sharing one `shared.css` + `shared.js`, backed by a Google Apps Script (`anifx-backend.gs`) for registration/payment handling.

Pages: `index.html` (landing), `valorant.html`, `fc26.html`, `game-jam.html`, `film-festival.html`, `character-design.html`.

Single source of truth for competition data: `CONFIG.tracks[]` array inside `shared.js` — event-nav cards, registration dropdown, and FAQ text are all data-driven from it. Each track's `id` must exactly match its page's `data-track="..."` attribute on `<html>` (mismatches like "gamejam" vs "game-jam" have caused real bugs).

Current git tags: `v3`, `v3.1`, `v3.2`, `v3.3` (`v3.4`/`v3.5` may also exist — check `git tag`). Delivery zips live in `ship/`. **A big content/structure overhaul happened across v3.3/v3.4** (real pricing/prizes/schedule replacing placeholders, form field rework, org-hierarchy wording, per-event accent colors, logo added then removed again) — full detail in `CHANGELOG-v3.4.md` at the project root. **v3.5 (small, fast round on top of v3.4):** logo placeholder removed for good (was briefly re-added then removed again in v3.4, now the markup/CSS/JS for it is deleted outright, not just hidden), Sponsors tab removed entirely from the 4 event pages with no confirmed sponsor (only Character Design has one, XP-Pen). Client also sent a batch of images to place across the site; two were declined outright (official Riot VALORANT key art, a copyrighted movie VFX still of a real person) per hard rule #3 below — full detail in `CHANGELOG-v3.5.md`. **v3.16–v3.19 (this chat's rounds):** tab-divider/Register-accent/hover-magnet fixes; on-campus schedule day-move (Screening + Game jam jury round to Saturday); `--f-data` font finalized as **Alegreya Sans** (was Fira Sans, was IBM Plex Sans — comparison is over); event-card hover replaced with cursor tilt+glow (tilt removed again in v3.20, see below); a hero-image fallback added (track with no video but a `cardImage` now shows it on its own page hero too, not just the index card) — VALORANT now uses client-supplied fan art (`valorant.jpg`) this way; FC26's official EA Sports key art was initially declined for the same reason as the Riot art above (hard rule #3) — **overridden in v3.20, see below**; Game Jam's/Character Design's existing imagery credited to Atharva Patil/Shivam Prasad, a new Film hero video credited to Paritosh Khairwal (compressed from a 248MB/4K upload to ~8MB/720p first). **v3.20 (fast follow-up round):** event-card tilt explicitly rejected by client — removed, kept the lift + cursor glow. VALORANT's and FC26's card image crops fixed (both were cutting off faces/heads — `object-position` tuned per track). **FC26's key art override: client was told about hard rule #3 and the Riot precedent, and explicitly instructed to use it anyway** — this is the client's own call on their own promotional asset, documented here so it reads as a deliberate decision, not a lapse; it is NOT a reversal of the rule for anything else. Film reel-strip: two of its five placeholder cell-types replaced with real assets (VFX Breakdown → client photo; 3D Reel 02 → client video, `pari-3d-reel.mp4`, compressed from 60MB/4K to 151KB) — all 4 repeated occurrences of each updated, not just the first. Credit captions reworded to "Credits — Name". Full detail in `CHANGELOG-v3.16.md` through `-v3.20.md`. **v3.21:** new client-supplied imagery — index hero banner (`anifx-banner.jpg`, fixing a real bug where `heroPoster` alone never actually displayed since it never added the `has-video` class), Film switched from video to a still (`film-rrs-ship.jpg`), VALORANT/FC26 got newer pre-cropped images requiring retuned crop positions; button hover got a glow (ref: obsidianlabs.pages.dev). **v3.22:** the brand-break font-size fix from v3.16 still overflowed in the client's real browser (font metrics differ across browsers) — replaced the guessed clamp() with actual JS measurement that shrinks-to-fit live, correct regardless of rendering differences. **v3.23 (device audit):** found the ACTUAL source of the original "dashed line" complaint from v3.16 — it was never `.content-tabs` (a solid, low-contrast line), it's `.track::before` (a real repeating-gradient dash), present on every track page's Overview panel this whole time. Removed. Read whichever changelog is newest before assuming anything about current pricing, schedule, form fields, or what images exist where.

---

## 2. HARD RULES — never violate these

1. **Never touch or modify `anifx-backend.gs`.** Backend is owned by someone else.
2. **Never fabricate competition specifics** (fees, dates, rules, categories) that the client hasn't provided. Use literal **"To be announced"** placeholders instead of guessing.
3. **Never use real/copyrighted movie posters or branded imagery**, even as "temporary" placeholders — even if told "no worries, just for now." Use the two provided stock photos (`film.jpg`, `film-1155439_640.jpg`) or plain placeholders only.
4. Keep the codebase clean and professional — a **different backend developer** will eventually maintain this, so no clutter, no dead code, no stray duplicate folders.
5. **Verify claims before reporting "done."** Run actual checks (console output, `read_page`, grep across all instances of a repeated block) — don't just assert something is fixed. This project has been bitten twice by "claimed done, actually partial" bugs (see §4).
6. User writes fast/informal, often typo-heavy, sometimes mid-task via system-reminder interruptions ("user sent a new message while you were working"). Triage these without derailing current work, but don't ignore them.
7. When user says **"planning only, don't execute"** — stop at a plan/confirmation, do not write code until they explicitly say go ahead.
8. Don't start on old/deferred/tangential requests proactively — only when the user asks or revisits them (see §6 Outstanding Items).

---

## 3. Key technical patterns used in this codebase

- **`CONFIG.tracks[]`** in `shared.js` — add/edit a competition here first; cards/dropdown/FAQ update automatically.
- **`[data-track="..."]`** CSS attribute selectors override `--accent`/`--accent-dim`/`--ink`/`--surface`/`--surface-2`/`--line`/`--line-soft` per track/page.
- **CSS specificity is a recurring bug source in this project.** Before adding an override rule, check existing selector specificity math (e.g. `.nav-links a{}` at (0,1,1) silently beat `.nav-cta{}` at (0,1,0) — grey Register-button-text bug). When in doubt, scope more specifically rather than relying on source order.
- **Web Animations API (`el.animate(keyframes, opts)`)** used instead of CSS `@keyframes` whenever the client wants genuinely non-repeating/randomized motion (FC26 ball). Chain via `anim.onfinish = playAgainFn` for continuous randomized loops. CSS `@keyframes` are deterministic — don't reach for them if "random"/"not the same every time" is a requirement.
- **Squash-and-stretch** (`scale(x,y)` + `translateY` keyframes) used for "juicy" jump/impact feel (Game Jam runner).
- **Seamless infinite marquee** pattern: two identical copies of content, animate `translateX -50%` linear infinite — only looks seamless if ONE copy's rendered width already exceeds the viewport/container. This has caused two real bugs (FC26 ball path, film reel strip running out) — when building/editing any marquee, explicitly verify the single-copy width against the container before considering it done.
- **Border/frame fade without fading the content**: use `mask-image`/`-webkit-mask-image: linear-gradient(...)` on a `::before`/`::after` pseudo-element that draws just the border, not on the image itself. "Blend/fade the border" ≠ "fade the whole image into the background" — these are different asks, confirm which one is meant (see §4).
- **`prefers-reduced-motion: reduce`** must be respected by every new animation added — CSS keyframes need a reduced-motion override rule; JS-driven animations (ball) must check `reduceMotion` before starting.
- **Custom accessible dropdown**: real `<select>` stays in the DOM (hidden) as the actual form data source; a custom `<button>` + `<ul role="listbox">` UI sits on top, wired through global `window.__syncCdropLabel` / `window.__setCdropLocked` functions so other code (e.g. the registration modal's track-lock logic) can control it without tight coupling.
- **Modal pattern**: `.modal-bg` / `.modal` reused for both the registration modal (`#regModal`) and the legal-content modal (`#legalModal`); legal content pulled from a `LEGAL` object in `shared.js` keyed `terms`/`refund`/`privacy`.
- **Form validation**: HTML5 `pattern`/`maxlength`/`inputmode` attributes PLUS live `input`-event listeners that strip disallowed characters as the user types (belt and suspenders).
- **Cache-busting**: `shared.css?v=NN` / `shared.js?v=NN` query param bumped on every HTML file whenever css/js changes, so browsers don't serve stale cached copies. Current version as of v3.29: `shared.css?v=70`, `shared.js?v=58`. **Always bump this and update it identically across all 6 HTML files** — a partial bump means some pages serve stale styles.
- **Git history**: real, chronological commits (not just one flat "initial commit") — reconstructed early on from timestamped `backups/` folders using `GIT_AUTHOR_DATE`/`GIT_COMMITTER_DATE`. `backups/` and any temp replay scripts are gitignored.
- **Delivery packaging**: `ship/anifx-2026-delivery-vX.zip`, professional structure — top-level `README.txt`, `frontend/` folder (all 6 html + shared.css + shared.js), `backend/` folder (anifx-backend.gs). Do NOT dump files flat. Standalone single-file build (`standalone/build_single_file.py`) is a SEPARATE optional artifact — only include it in a delivery if explicitly requested; v3.2 explicitly excluded it ("no standalone").
- **Standalone build script gotcha**: `build_single_file.py` extracts things like the Google Fonts `<link>` dynamically via regex from a donor page rather than hardcoding — do this for ANY value that could change (fonts, version numbers) to avoid silent staleness. This bit the project twice before being fixed properly.

---

## 4. Mistakes already made — do not repeat

1. **CSS specificity bug**: `.nav-links a{color:var(--muted)}` beat `.nav-cta{color:...}`, making the Register button text grey-on-red (bad contrast). Lesson: when styling a link/button that's nested inside another selector's scope, check what broader selectors already apply and match/exceed their specificity intentionally.
2. **Assumed CSS `@keyframes` = "random" enough.** Client rejected the FC26 ball animation TWICE for looking like "a loop of pattern." Lesson: if the brief says "random"/"not repeating"/"not the same," don't default to CSS keyframes — use JS-driven motion from the start.
3. **Over-iterated on a fundamentally illegible shape.** Spent multiple passes trying to make a CSS-only camera icon "look like a camera" at small size; user eventually said bluntly to just remove it. Lesson: if a decorative CSS shape isn't reading correctly after 1-2 honest attempts, consider removing/simplifying rather than continuing to iterate blindly — flag it to the user as an option rather than burning turns.
4. **Misread "blend/fade the border" as "fade the whole image."** Planned a full-image vignette mask when the actual ask was only the frame/border fading, image staying sharp. Caught before implementation because it was a planning-only turn — but the lesson is to re-read ambiguous "blend/fade X into Y" phrasing carefully and, if genuinely ambiguous, restate the plan back before coding.
5. **Claimed a feature "done" when it was 4/20 complete.** Film reel strip changelog said "shows real thumbnails" but only 4 of 20 `.fm-cell` divs actually had `<img>` tags — the other 16 were still placeholder gradient boxes with text labels. User caught it with a screenshot. **Lesson: for any change applied across a repeated/array-like block of near-identical elements (cards, cells, list items), explicitly verify EVERY instance was updated — grep/count them — before reporting done, not just the first few.**
6. **Same class of issue happened twice in one project** (grey button text + partial reel strip) — both were "claimed done, actually partial/wrong." This is the single most important process lesson: **self-verify with an actual tool check (grep count, read_page, console) before saying something is complete, especially across multi-element or multi-file changes.**
7. **Stray extracted delivery folders accumulated 3 separate times** (`.claude/` had a full project duplicate; `ship/anifx-2026-delivery-v2.1/` and `-v3.1/` were leftover unzipped folders). Lesson: after any zip-extraction/testing, clean up the extracted folder immediately, don't let it linger to be caught later during `git status`.
8. **Wiring a real video/image into a track that had a "placeholder until real footage exists" decoration doesn't automatically remove the placeholder** — same z-index, later in the DOM, so it keeps painting over the real media once a `video`/`cardImage` is set. First caught on Film's `.fm-projector` (v3.21). **This lesson was written down but not fully acted on** — FC26's `.fc-pitch` and VALORANT's `.v-plate` had the exact same unguarded pattern and shipped for multiple rounds before a dedicated bug-bounty pass caught both at once (v3.26). Corrected process: whenever ANY track's media slot changes, grep `shared.css` for every `.hero{` / `position:absolute;inset:0` decorative block across ALL 5 tracks in that same pass, not just the one track being touched — this bug is sitewide-shaped even when only one track prompts the fix.
9. **Every track's price/fee/date facts are stored in AT LEAST THREE independent places, not two** — a hardcoded `<div class="pill">` in that track's own HTML, the `facts` array in `shared.js`, AND that page's own `<meta name="description">` SEO tag. None are linked; editing one never touches the others. First caught v3.27 (VALORANT's prize pill). **Recurred anyway** — the v3.20 schedule day-move round updated the `facts` array, the `schedule` array, and the rules-tab prose for Game Jam's jury round and Film's Screening 1, but missed both pages' hero pills AND both pages' meta descriptions (v3.29, caught only by a dedicated cross-check pass, not by remembering the lesson). Corrected process: after ANY price/fee/date/prize edit, don't just grep for the old value — grep the OLD value AND pull every `<dt>...</dt><dd>...</dd>` pill plus every `<meta name="description">` on the affected page(s) and read them individually against the source of truth. Don't trust that fixing the "main" occurrence caught the rest.
8. **Landing-page intro dead-space bug** (see §6, in-progress work): root cause was a scroll-progress denominator computed against the wrong reference (`spacer.offsetHeight - viewportHeight` when the spacer's actual end was one viewport further out), leaving a fully blank cream gap between the fading black title card and the real hero. The fix direction settled on: eliminate the separate spacer entirely and place the fixed overlay directly on top of real content from `scrollY=0`, so blank space is structurally impossible rather than dependent on a distance calculation being exactly right. General lesson: prefer designs where a bug class is made *impossible*, not just *corrected*.

---

## 5. Workflow / how this user likes to work

- **Feedback often arrives as screenshots with annotations/circles + a run-on list of dash-separated notes.** Read carefully; each dash/asterisk is usually a distinct, unrelated action item — don't merge or drop any.
- **"Planning only" means literally stop and confirm before writing code.** Respect this explicitly when stated.
- User authorizes execution with a clear go-ahead phrase (e.g. "cofirm everything and go ahead"), sometimes buried mid-sentence in an otherwise unrelated note — read the whole message before starting or stopping work.
- Mid-task interruptions arrive as `<system-reminder>` "user sent a new message while you were working" — these are real, must be triaged into current or queued work, not ignored.
- User wants **version-controlled, tagged deliveries** ("shud be v3 since new feature added") whenever a meaningfully new feature ships — bump semantic-ish version, tag it, zip it.
- User wants **professional folder structure** in delivery zips (frontend/backend split), not flat file dumps.
- User explicitly said **"use skills asw"** and **"dont overcomplicate anything"** — prefer the simplest correct fix (e.g. CSS-only where possible) over adding new complexity/rigging/abstractions.
- User does real audits themselves and catches partial implementations — treat every "done" claim as something that WILL be checked, so verify before saying it.
- When asked a exploratory/opinion question ("what can be done for more aesthetics?"), give a short list of options; user may reply picking a subset + "ship it" immediately — be ready to execute right after, don't just wait for a separate "go" message if they've already picked and named a version.

---

## 6. Outstanding / deferred items (not started unless user asks)

- Full sitewide text-contrast sweep (only one real contrast bug — nav-cta grey text — was found and fixed; a systematic pass hasn't been done).
- Whether Character Design gets its own distinct visual treatment beyond its accent color (client called this a "maybe," not decided).
- Broader doc/folder reorg beyond what's done: `anifx-2026-plan.md`, `anifx-dark-redesign.html`, old `anifx-2026.html` (v1), `standalone/PREVIEW-NOTES.txt` still sit loose in project root and haven't been consolidated.
- Real photo/video content — site still uses 2 stock placeholder images (`film.jpg`, `film-1155439_640.jpg`); flagged as the single biggest remaining aesthetic lever, blocked on client assets.
- Unclear whether the user ever got the "refs from lovable and replit" they mentioned wanting early on — never followed up in this transcript.

### RESOLVED since the above was written: landing intro dead-space task

The intro dead-space fix described in the old plan file (`C:\Users\Admin\.claude\plans\humming-squishing-floyd.md`) is **confirmed done** — verified in-browser this session: the intro card renders full-viewport with no dead-space gap, the console error/rejection logger is present at the top of `shared.js`, and no console errors appear on load. Don't re-open this unless a new bug report comes in.

### CURRENT active thread as of session end (2026-09-10)

A large content/structure/branding overhaul (client-driven, multi-round) happened this session — tagged `v3.3`, packaged again as `v3.4` purely for a self-contained handoff zip (no further code changes between v3.3 and v3.4, just packaging). **Full detail, requirements, Q&A, and remaining open items are in `CHANGELOG-v3.4.md` at the project root — read that file, not this section, for the current state of pricing/prizes/schedule/forms/branding.** This section intentionally stays short so it doesn't duplicate and drift out of sync with that file.

---

## 7. Where things live

- Project root: `F:\Works\AniFX-2026`
- Backend (never touch): `anifx-backend.gs`
- Delivery zips: `ship\anifx-2026-delivery-v{1,2,3,3.1,3.2,3.3,3.4}.zip` + standalone preview `ship\AniFX-2026-preview.html` (stale since before v3.1's font changes — exclude from deliveries unless explicitly rebuilt). **v3.4 zip is the current self-contained handoff package** — includes `frontend/`, `backend/`, `README.txt`, `PROJECT_MEMORY.md`, and `CHANGELOG-v3.4.md`, meant to be usable with zero other context.
- Old/legacy files still in root (not yet cleaned up): `anifx-2026-plan.md`, `anifx-2026.html`, `anifx-dark-redesign.html`
- Standalone single-file builder: `standalone\build_single_file.py` — **stale relative to root as of v3.3/v3.4, not rebuilt this round.**
- Git: real repo, tags `v3`/`v3.1`/`v3.2`/`v3.3` (`v3.4` may or may not be tagged — check `git tag`), clean tree as of last check (2026-09-10)
- Full record of the v3.3/v3.4 round: `CHANGELOG-v3.4.md` at project root.

---

## 8. Session starting message for a NEW chat

If starting fresh, the opening context to give yourself is:

> This is AniFX 2026, a festival website (5 event pages + landing) for the School of Creative Studies, DY Patil Deemed to be University, built on shared.css/shared.js + a Google Apps Script backend I must never touch. v3.3 has been delivered and tagged in git; v3.4 is a self-contained handoff repackaging on top of it (same code, adds the doc files into the zip). Read `PROJECT_MEMORY.md` in the project root first (hard rules, past mistakes), then `CHANGELOG-v3.4.md` for the full detail of the most recent overhaul (pricing/prizes/schedule/forms/branding) and what's still explicitly unresolved (FC26's own on-campus time, the backend payload field-name mismatch, Alegreya Sans not yet tried). Check git status/tags and the actual state of the HTML/shared.js/shared.css files before assuming anything is done or not done — don't trust this message's summary over the actual files if they disagree.

**If you're working from just the v3.4 zip with no repo access:** see `CHANGELOG-v3.4.md` §0 inside that zip — it's written to be readable standalone.

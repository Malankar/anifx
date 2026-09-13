# AniFX 2026 — v3.3/v3.4 Content, Structure & Handoff-Packaging Log

This document exists so **any agent/session can pick up this specific round of work with zero lost context**. It covers: the exact requirements the client gave, every clarifying question asked and how it was answered, every change actually made (with file/line pointers), what was explicitly deferred, and known bugs already fixed. Read `PROJECT_MEMORY.md` first for overall project context/hard rules — this file is the detailed record of the v3.3 round only.

Status as of this write-up: **implemented and spot-verified in-browser (no console errors), packaged into `ship/anifx-2026-delivery-v3.4.zip`. `standalone/` NOT updated (see §5 item 3).**

---

## 0. START HERE — if all you have is this zip and no other context

This zip is meant to be **fully self-contained**. If you're a new Claude (or any agent) session picking this up with nothing but this zip and a plain-language instruction from the client, read in this order: **this section → §1 → §5 ("Still open") → the rest of this file → `PROJECT_MEMORY.md`** (also in this zip) before touching any code.

**What this is:** AniFX 2026, a festival website (5 competition pages + landing) for the School of Creative Studies, DY Patil Deemed to be University, Navi Mumbai. Static site: `index.html` + 5 event pages, all sharing one `shared.css` + `shared.js` (all data lives in `shared.js`'s `CONFIG` object — edit there, not per-page). Backend is a separate Google Apps Script file (`backend/anifx-backend.gs`), owned by a different developer.

**Hard rules — never violate these (full list in `PROJECT_MEMORY.md` §2):**
1. Never touch/modify `anifx-backend.gs` — it's someone else's file. If frontend changes affect what the backend expects (they currently do — see §4/§5 below), document it, don't fix it yourself.
2. Never invent event details (fees, dates, rules, prizes) the client hasn't confirmed. Use literal "To be announced" instead of guessing.
3. Never use real/copyrighted imagery — only the two provided stock photos (`film.jpg`, `film-1155439_640.jpg`) or plain placeholders.
4. Verify every claim before saying "done" — actually reload the page and check, don't just assert.
5. This client writes fast/informal and corrects course often — if a new instruction seems to contradict an earlier one, it's usually a refinement, not a mistake; check the most recent message first.

**Current state in one paragraph:** All 5 events have real, client-confirmed pricing/prizes/schedule (§1). Registration form collects Student Name/Age/Class-Year/Board/College/Phone/Email/Address plus track-specific team fields (Captain for VALORANT only, Team Lead for Game Jam/Film, nothing for solo FC26/Character Design). No logo (client said not needed, removed after briefly being added). Each event page has its own accent color (VALORANT red, FC26 green, Game Jam cyan-blue, Film orange/amber, Character Design off-white). Match Board and Watch Live sections are gone entirely, not hidden.

**What's genuinely unresolved (see §5 for full detail) — do not silently resolve these, ask the client:**
- FC26's own on-campus time slot (currently "To be announced").
- The exact replacement/final content for anything the client hasn't explicitly confirmed yet.
- `anifx-backend.gs` has NOT been updated to match the new registration payload field names — this is a real, live integration gap. See the zip's own `README.txt` for the exact old→new field mapping; hand that to whoever owns the backend file.
- Alegreya Sans (an alternate font) was never tried — only Fira Sans was swapped in so far, client is still mid-comparison.

---

## 1. Client's original requirements (raw ask, paraphrased/organized)

Client asked for a full requirements-gathering pass before any code — see the process transcript for the full verbatim prompt. Condensed:

**Global/branding:** improve typography (test Fira Sans, then Alegreya Sans, as the "secondary" font — client will compare and pick); add a Riot Games non-affiliation disclaimer near legal/footer; strip Riot Games pre-fill from every form except VALORANT's.

**Homepage:** collapse the "Five Events. One Festival." brand-break text from 4 visual lines to 2 (and bring back a scroll-linked color-fill effect on it); make event cards flow instead of a fixed 4-block grid (site already had 5 cards, not 4 — no structural change needed there); remove the "Prize Pool" strip tile; remove the Match Board section entirely; remove "Watch live" entirely (streaming is cancelled); rebuild the on-campus schedule with real times (previously 100% placeholder); remove the Friday "Prize presentation" line — prize distribution for **all** categories happens **Saturday**, after 3pm, wrapped by 5–6pm; remove FC26's quarter-final line from the on-campus schedule; de-number every "Auditorium 2/3" style reference down to plain "Auditorium."

**Schedule specifics given:** Screening 1 @10 (10:00 AM), Character Design @10, VALORANT grand final @10 (all Friday, parallel, different rooms), Game Jam @2 (2:00 PM), all on **Friday 23 October 2026**. FC26's own on-campus time was **not** given — client said "we will check and let you know."

**Policy:** refund policy text reduced to exactly **"No refunds at any cost."** — no exceptions, no extra legal wording.

**Per-event pricing/prizes (all client-confirmed):**
- **FC26** — solo/1v1 only, no team registration at all, entry ₹100/person, prize 1st ₹5,000 / 2nd ₹3,000, football-themed hero background with abstract animated "dot" players hitting the ball (randomized paths, not a fixed loop — NOT real people/photos).
- **VALORANT** — team event, entry ₹1,000/team (was ₹500/player + ₹2,500/team), prize ₹17,500, keeps "Captain" terminology and Riot ID references (the one page allowed to).
- **Game Jam** — team event (1–5 people), entry ₹1,000/team, prize ₹10,000, registrant is called **"Team Lead"**, never "Captain."
- **Film & Animation** — free for students (DY Patil or any other college) and animation hobbyists; ₹499 for people who do it professionally; prize ₹20,000; "Team Lead" terminology (team event).
- **Character Design** — solo, free entry, sponsored by XP-Pen, prize = XP-Pen tablet. Full official rules later supplied via `Character Design Rules & Regulations.docx` (see §3).

**Event type / terminology rule:** solo events (FC26, Character Design) must never show "Team Lead" or "Captain" anywhere. Team events other than VALORANT show "Team Lead." VALORANT alone shows "Captain."

**Form fields (client-confirmed, "must have"):** Student Name, Age, Class/Year/Graduation, Board (e.g. CBSE), College Name, Phone, Email, Address — for the person registering. Team events additionally keep the existing lightweight roster textarea for listing teammates (this was confirmed explicitly — teammate details, e.g. Riot IDs for VALORANT, go in that roster field, not as full duplicated profiles).

**Org hierarchy (confirmed via the official DY Patil SOCS logo the client sent):** School of Creative Studies → DY Patil Deemed to be University → Navi Mumbai. This replaces the old mixed "DY Patil School of Creative Studies" / "DY Patil University" wording sitewide.

**Button hover FX:** client sent a reference file (`anifx-ui-kit.html`, found in their Downloads folder) showing a diagonal "sheen sweep" hover effect on `.btn-primary`. Asked to apply that same effect to all primary buttons site-wide, including the header's Register CTA.

**Card animation (this session, follow-up):** event cards on the homepage should fade in **left to right**, not the previous bottom-up-with-tilt reveal.

**Logo:** official DY Patil SOCS shield+wordmark logo supplied as an image (dark/transparent version found at `Downloads\small-School-of-Creative-Studies-Logo-2-min.png`), now wired into `CONFIG.logoUrl`.

---

## 2. Clarifying Q&A — what was asked, what the client answered

Full back-and-forth is in the conversation transcript; the resolved answers actually used are baked into §1 above and the config data itself. Two items were explicitly left **unresolved** by the client (see §5, "Still open").

Key corrections mid-thread worth remembering for future sessions:
- Client's first written note said Professional film entry was "₹499"; a follow-up voice-style message said "500" — client then explicitly confirmed **₹499 is correct** ("499 and 500 aint lot diff its 499 ok").
- Client clarified the "2 more items" language in their raw notes was about replacing the removed Prize Pool tile with 1–2 *other stat tiles for that same homepage strip section* — **not** about adding 2 more competitions. No replacement content was ever specified, so (per the project's no-fabrication rule) the strip was simply left at its remaining 2 tiles ("5 Competitions" / "100 Hours") rather than inventing new numbers. **This is still open — see §5.**
- Client confirmed venue numbers ("Auditorium 2", "Auditorium 3", "Room 204/25") should all collapse to the plain word "Auditorium" — no numbers, since real room assignment isn't confirmed yet.

---

## 3. Source documents used (all under the user's Downloads folder, not copied into the repo except the logo)

- `Anifx 26_260910_152031.pdf` — the client's raw planning notes (bulleted, unpolished). Text-extracted via `pdftotext`.
- `Character Design Rules & Regulations.docx` — official, detailed rules for Character Design (eligibility, format, originality/AI policy, software, submission, judging criteria with exact weightages, disqualification, copyright, conduct, awards). Text-extracted via a small Python zip/XML script (docx is a zip of XML). Its content is now baked directly into `CONFIG.rules` (the `"character"` block) and `CONFIG.tracks` (the `"character"` track's facts/eligibility) in `shared.js`. Confirms: organiser = School of Creative Studies (DY Patil University), in association with **Katha Film Club**; venue = **Media Lab, COE Building, DY Patil University, Nerul, Navi Mumbai**; competition 23 Oct 2026, 10:00 AM; prize distribution 24 Oct 2026.
- `anifx-ui-kit.html` — reference file for the button sheen-sweep hover effect (`.btn-primary::after` diagonal light sweep). Not copied into the repo; just used as a one-time visual reference.
- `small-School-of-Creative-Studies-Logo-2-min.png` — official logo, **copied into the repo** at `assets/logo.png` and wired via `CONFIG.logoUrl` in `shared.js`.

---

## 4. Everything actually changed, by file

### `shared.js` (single source of truth — start here for any content/data question)
- Removed `prizePoolLabel`, `streams`, `streamPlaceholder`, `fixtures` from `CONFIG` entirely (Match Board and Watch Live are gone as features, not just hidden).
- Rewrote `CONFIG.schedule` — real Friday/Saturday times per §1, `scheduleNote` now just `"Times are fixed."`.
- Set `CONFIG.logoUrl = "assets/logo.png"`.
- Rewrote `CONFIG.tracks` for all 5 events: real fees, real prizes (as `facts` entries), added `isTeam` (bool) and `leadLabel` ("Captain" / "Team Lead" / `""` for solo) to every track — this drives all the form terminology logic. FC26: `slots:0` (this is also what auto-disables its old slot/roster UI — see below). Film: added `feeTiers: [{key,label,amount}, ...]` for its two-tier free/₹499 pricing, since the old single `fee`/`feeNote` model couldn't express that.
- `CONFIG.sponsors` now has one real entry: XP-Pen for Character Design.
- Simplified `LEGAL.refund` to just `<p>No refunds at any cost.</p>`; simplified the FAQ refund answer to match; stripped the old multi-condition refund bullets from the general "Payment, refunds and prize money" rules block.
- Updated `CONFIG.rules`: VALORANT/FC26/Game Jam/Film entry+prize lines rewritten with new numbers and correct Captain/Team Lead wording; **added a whole new "Character design" rules block** sourced from the docx (see §3).
- Removed the entire "live board" (`#fixtures`/`#boardClock`) render block and the entire "live streams" (`#streamFrame`) render block — dead JS deleted, not just orphaned.
- Reworked the registration modal logic (`syncTrack`, `fieldProblem`, the submit payload):
  - New fields wired: `#fAge`, `#fClassYear`, `#fBoard`, `#fAddress` (validated in `fieldProblem`, included in the submit payload).
  - Team vs solo: `$("#fTeam")`'s wrapping `.field` is shown/hidden and required/not-required based on `t.isTeam`. Field labels for the old "fCaptain"/"fPhone"/"fEmail" trio now read dynamically off `t.leadLabel` — "Captain" for VALORANT, "Team Lead" for Game Jam/Film, "Student name"/"WhatsApp number"/"Email" (no role prefix) for solo FC26/Character Design.
  - Added `currentFee(t)` helper + a dynamically-built radio group (`#feeTierField`) for tracks with `feeTiers` (currently only Film). **Bug found and fixed during testing:** the radio group was being fully rebuilt (and reset to its first option) every time `syncTrack()` ran — including when a radio's own `change` event triggered `syncTrack()` — so picking "Professional" silently snapped back to "Free" every time. Fixed with a `feeTierField.dataset.builtFor` guard so the radios are only rebuilt when the *track* changes, not on every sync.
  - Payload field names changed: `captainName/captainPhone/captainEmail` → `registrantName/registrantPhone/registrantEmail`, plus new `age/classYear/board/address/leadRole` fields, plus `teamName`/`roster` are now sent empty for solo tracks. **⚠ This is a breaking change for `anifx-backend.gs`, which was NOT touched (per hard rule) — whoever owns that file needs to update its expected field names to match, or entries will land with the old key names missing.**
  - `updateTitle()`'s `(t.id==="fc26"?"name":"team name")` phrasing generalized to `t.isTeam` so it's correct for any current/future solo track, not hardcoded to FC26.
- Added a scroll-driven fill effect for `#brandBreak .outline-fill` spans (`--fill-pct` custom property, updated on scroll via `requestAnimationFrame`), respecting `prefers-reduced-motion`. **Bug found and fixed (client reported "can't see the scroll text reveal"):** the unfilled base color was `rgb(from var(--accent) r g b / .18)` — 18% opacity red on a near-black background, essentially invisible until scrolled into full fill. Changed to `rgb(from var(--bone) r g b / .3)` (dim off-white) in `shared.css` so the "outline" state is actually legible before it fills solid red.
- Extended the FC26 `.fc-ball` Web-Animations-API kick loop (already existed, already randomized per the project's established pattern — see `PROJECT_MEMORY.md` §3) to also position and pulse **two `.fc-dot` elements** at each kick's start/end points, so it reads as players actually striking the ball — still fully randomized, never a fixed loop, per the client's explicit "no fake loop" requirement.

### `shared.css`
- `--f-data` (the codebase's own pre-existing "secondary/small text" font role — labels, eyebrows, stats) swapped from `'IBM Plex Sans'` to `'Fira Sans'`. Comment updated to note Alegreya Sans is the next one to test.
- Added the sheen-sweep hover (`::after` diagonal light sweep) to `.btn-primary` and `.nav-links .nav-cta` (the header Register pill), matching the client's reference file (`anifx-ui-kit.html`).
- Added `.foot-disclaimer` style (small, muted) for the new Riot Games disclaimer line.
- Added `.outline-fill` / `.outline-fill::after` for the brand-break scroll-fill effect.
- Added `.fc-players` / `.fc-dot` for the FC26 background "player dots."
- **This session's follow-up (v1):** `.event-card.reveal` / `.event-card.reveal.in` changed from `translateY(42px) rotateX(4deg)` (fade up + tilt) to `translateX(-48px)` → `translateX(0)` (fade in from the left).
- **This session's follow-up (v2 — client corrected v1):** client actually wanted **alternating** direction, not uniform left-in — card 1 enters from the left, card 2 from the right, card 3 from the left, etc. Added `.event-card:nth-child(even).reveal{transform:translateX(48px)}` alongside the existing (odd/default) `translateX(-48px)` rule. Both converge to `translateX(0)` via the same `.reveal.in` rule. Verified in-browser: mid-transition computed `transform` matrices confirmed card 1 approaching 0 from negative-X and card 2 from positive-X. The existing per-card stagger delay in `revealNodes()` (`shared.js`) already indexes cards in order, so this reads as a left/right-alternating cascade with no JS change needed.
- **This session's follow-up (v3 — client corrected v2 again):** client actually wanted every card **full-width, single column** (stacked one per row, like the old Character Design row always was), not a 2-column grid, WITH the alternating direction still applying per card. Changed `.event-nav{grid-template-columns:repeat(2,1fr)}` → `grid-template-columns:1fr`, and removed the now-unneeded `.event-nav .event-card:last-child:nth-child(odd){grid-column:1/-1}` rule (and its `@media(max-width:760px)` mobile override) since every card is full-width now regardless of index. Verified visually in-browser — all 5 cards now stack full-width with the existing left/right alternating reveal intact.

### All 6 HTML files (`index.html`, `valorant.html`, `fc26.html`, `game-jam.html`, `film-festival.html`, `character-design.html`)
- Google Fonts `<link>` swapped `IBM+Plex+Sans` → `Fira+Sans`.
- Cache-busters bumped: `shared.css?v=38→39→40`, `shared.js?v=38→39`.
- Footer: org hierarchy line rewritten (School of Creative Studies / DY Patil Deemed to be University / Navi Mumbai) + new `<p class="foot-disclaimer">` Riot Games line added to every page.
- Registration modal: added the 4 new fields (Age/Class-Year/Board/Address), added the empty `#feeTierField` container, relabeled fCaptain/fPhone/fEmail to generic defaults that `syncTrack()` overwrites per track, changed their `name=` attributes to the new payload keys, removed the hardcoded `placeholder="Name, Riot ID#TAG, phone, email"` from the roster `<textarea>` on **every** page (it's now set dynamically per track via `t.rosterPlaceholder` — this was leaking Riot branding onto Game Jam/Film's forms, which the client explicitly said to remove).

### `index.html` specific
- `<title>`/meta description updated to the new org hierarchy wording.
- Hero meta line: added the School of Creative Studies / DY Patil Deemed to be University tiers.
- Brand-break markup restructured into two `<span class="outline-fill" data-fill-text="...">` lines for the scroll-fill effect, forced to 2 lines via `<br>`.
- `#board` section: the `.board` (Match Board/fixtures) div deleted; the `.strip` (stat tiles) kept, Prize Pool tile removed. **Follow-up:** client said 2 tiles "feels bad" and asked for one more — added a 3rd tile, `"2" / "Days on campus, Friday 23 and Saturday 24 October — competitions and prize distribution."` This is a real, already-established fact (the festival's own 2-day span), not invented data, so it satisfies the no-fabrication rule. Strip is now 3 tiles again: 5 / 2 / 100.
- `#watch` (Watch Live) section deleted entirely.
- On-campus blurb: "DY Patil University" → "DY Patil Deemed to be University".

### `fc26.html` specific
- Meta description, hero-sub, pill-row rewritten (₹100/player, Solo 1v1, Prize 1st ₹5,000/2nd ₹3,000; dropped the old "Slots"/"Played from 11:00" pills).
- Added `<div class="fc-players" id="fcPlayers">` inside `.fc-pitch` for the new dot-player animation.
- Removed the entire "Live roster" tab button **and** its `#panel-roster` panel (search bar, slot counter, ladder) — FC26 no longer has any slot/roster concept, consistent with `slots:0` in config.

### `valorant.html`, `game-jam.html`, `film-festival.html`, `character-design.html` specific
- Meta descriptions and hero pill-rows updated with new fees/prizes/times per §1 (VALORANT dropped its old "Slots" pill in favor of showing "Prize" instead — a judgment call, flagged here since it wasn't explicitly requested but there wasn't room for both in a 4-pill row; VALORANT still has slots functionality internally, just not as its own hero pill).
- Film's hero CTA changed from "Get notified when it opens" to "Register" (its `open` flag flipped `false→true` in config since real pricing now exists).

### New files
- `assets/logo.png` — the official DY Patil SOCS logo, copied from the client's Downloads folder.
- This file (`CHANGELOG-v3.4.md`).

---

## 4b. In-progress as of this write (client asked to log BEFORE executing, so nothing is lost mid-task)

Client's exact new asks, just given, not yet all verified done — check each before assuming complete:

1. **Hero-meta org line → one line.** Currently `index.html`'s `.hero-meta` renders "23–24 October 2026" / "School of Creative Studies" / "DY Patil Deemed to be University" / "Navi Mumbai" as separate wrapped spans (screenshot shows it wrapping across the hero). Client wants the org/location part combined into ONE line: "School of Creative Studies, DY Patil Deemed to be University, Navi Mumbai" (comma-separated), date can stay separate/first.
2. **Game Jam accent color → cyan/blue.** Currently Game Jam's `[data-track="gamejam"]` accent is a yellow-olive (visible on its "Enter Game jam" button, `.gj-` prefixed decorations). Change to a cyan/blue.
3. **Character Design accent color → white/off-white.** Currently pink/magenta-ish (`[data-track="character"]`). Change to white/off-white.
4. **Keep documentation continuously updated** — client explicitly wants every change written down as it happens (not just at the end) so a different agent/session can pick up mid-task with zero loss. This file (`CHANGELOG-v3.4.md`) is that record — keep appending to it, don't just overwrite.
5. **Ship a new delivery zip** with everything current, specifically so the **backend developer** (separate person, owns `anifx-backend.gs`) can see the current frontend state — most importantly the **registration payload field-name changes** noted in §4/§5 below (`captainName`→`registrantName` etc., plus new `age/classYear/board/address` fields). The zip's `README.txt` should flag this explicitly for whoever picks it up.

Once all 5 are done, move their status into §4/§6 below and check them off here rather than deleting this section (keeps a visible trail of what was asked vs. done).

**Status — all done, verified in-browser:**
1. ✅ Hero-meta org line combined into one `<span>`: `"School of Creative Studies, DY Patil Deemed to be University, Navi Mumbai"` (was 3 separate spans in `index.html`).
2. ✅ Game Jam (`[data-track="gamejam"]` in `shared.css`) recolored from olive-yellow (`#8A9A1E`) to cyan-blue: `--accent:#2FC4E0;--accent-dim:#1A7A8C`, plus matching cooler dark `--ink/--surface/--surface-2/--line/--line-soft` tones (previously purple-tinted, now blue-tinted). Verified: hero pills, button, tab underline, dashed rule all render cyan.
3. ✅ Character Design (`[data-track="character"]` in `shared.css`) recolored from pink/magenta (`#E85D9E`) to off-white: `--accent:#F3EDDD` (same hex as the site's own `--bone`) `--accent-dim:#B8B2A2`, plus neutral warm-grey dark surfaces (previously pink-tinted). Verified: hero title accent, pills, button, tab underline all render off-white/cream, good contrast in both places it's used as text-on-dark and as button-background-with-dark-text.
4. ✅ This doc is the running log — kept appending rather than overwriting, as requested.
5. ✅ **Delivery zip built:** `ship/anifx-2026-delivery-v3.3.zip` (frontend/ + backend/ + README.txt, same folder convention as v3.2). Its README.txt leads with a **"BREAKING CHANGE FOR THE BACKEND DEVELOPER"** section spelling out the exact old→new payload field-name mapping (`captainName`→`registrantName` etc., plus the new `age/classYear/board/address/leadRole` fields and the Film per-submission `fee` change) so whoever owns `anifx-backend.gs` knows exactly what to update. The staging folder was deleted after zipping (zip only, no loose extracted copy left lying around — matches this project's established convention of not leaving stray extracted delivery folders).

Cache-buster bumped `shared.css?v=43→44` on all 6 pages for this batch.

## 4c. Logo removed (client follow-up, after this round's other fixes)

Client sent the real DY Patil SOCS logo mid-round (§3), it was wired into `CONFIG.logoUrl` and `assets/logo.png` — then the client came back and said the logo isn't needed at all anymore, remove it completely. Done:
- `CONFIG.logoUrl` in `shared.js` reverted to `""` (empty) — the header's `.logo-slot` automatically falls back to its placeholder "LOGO HERE" box, no HTML change needed since that's already how the site behaves when `logoUrl` is blank.
- `assets/logo.png` deleted, and the now-empty `assets/` folder removed.
- **Note for future sessions:** don't re-add a logo unless the client explicitly asks again — this was tried and then explicitly reversed.

Also: this document and the delivery zip were renamed from "v4" to **v3.3** at the client's request, to match this project's actual tag sequence (v3 → v3.1 → v3.2 → v3.3), not a separate v4 numbering. If you see any stray reference to "v4" anywhere (old zip file, a stale note), it means the same thing as v3.3 in this project's history — this round was never actually shipped as v4, that was a naming mistake caught and corrected before shipping.

## 5. Still open / explicitly deferred (do not silently resolve these — ask first)

1. ~~Homepage strip's missing 2nd/3rd tile~~ — **resolved.** Client said 2 tiles "feels bad"; added a 3rd tile ("2" — Days on campus) built from an already-confirmed fact rather than invented data. Strip is now 5 / 2 / 100.
2. **FC26's own on-campus time.** The client said "we will check and let you know" — currently shows `"To be announced"` in the schedule. Update `CONFIG.schedule` in `shared.js` (the `{time:"To be announced", title:"FC26", ...}` row) once they confirm.
3. **`standalone/` and `ship/` not yet updated.** This whole v3.3 round only touched the live root site (`index.html` etc. + `shared.css`/`shared.js`). The `standalone/` single-file mirror and the `ship/anifx-2026-delivery-v3.2/` extracted zip are now stale relative to root. Don't assume they're current. Rebuild/re-zip only when the client asks for a new delivery — they tend to want a version bump + tag when that happens (see `PROJECT_MEMORY.md` §5).
4. **`anifx-backend.gs` payload mismatch.** See the `shared.js` bullet in §4 above — the registration payload's field names changed. The backend owner needs to update their Apps Script to match, or new registrations will arrive with different keys than before. This was flagged to the client already but not yet resolved.
5. **Alegreya Sans not yet tried.** Only Fira Sans has been swapped in so far, per the client's own "first fira then i will test and then we decide" sequencing. Don't swap fonts again until they've seen this version and said which way to go (or to try Alegreya next).
6. ~~Logo sizing not visually tuned~~ — **moot.** Client decided no logo is needed at all; `CONFIG.logoUrl` is blank again, `assets/logo.png` was deleted. Don't re-add a logo unless explicitly asked again.

---

## 6. Verification already done this round

- Started a local server (`.claude/launch.json` → `anifx-static`, port 8420) and loaded every page in the Browser pane — zero console errors on any of the 6 pages.
- Confirmed via `get_page_text` that the homepage's stats strip, on-campus schedule, and FAQ all render the new data correctly, and that the Riot Games disclaimer is present in the footer (`find` matched it).
- Confirmed via direct DOM inspection (`javascript_tool`, read-only) that:
  - FC26's registration form hides the Team name field and labels itself "Student name" (no Captain/Team Lead anywhere).
  - VALORANT's form shows "Captain — full name" / "Captain WhatsApp number" with the roster field visible and the Riot ID hint intact.
  - Game Jam's form shows "Team Lead — full name" / "Team Lead WhatsApp number".
  - Film's two-tier fee radio group renders correctly and (after the bug fix in §4) correctly updates the displayed fee when switching between Free/₹499.
  - Character Design's Sponsors tab renders "XP-Pen — Character Design".
- Did **not** yet do: a full responsive/mobile pass, a real end-to-end form submission test (no `sheetEndpoint` is configured, so submission is a no-op by design — see `shared.js` comments), or a visual comparison against the client's reference screenshots pixel-for-pixel.

---

## 7. How to resume this work in a new session

**If you have the git repo** (not just this zip):
1. Read `PROJECT_MEMORY.md` first (hard rules, overall project shape, past mistakes).
2. Read this file (`CHANGELOG-v3.4.md`) for what changed in this specific round and what's still open.
3. Check `git status` / `git log` / `git tag` to see if anything's been committed since this was written — this file is a snapshot at write-time, not a live diff. Latest tag at time of writing: `v3.3` (this v3.4 packaging pass may or may not have its own tag yet — check).
4. Before touching `CONFIG.schedule`, `CONFIG.tracks`, pricing, or org-hierarchy wording again, re-check §5 for what's still explicitly pending client confirmation — don't silently invent replacements.

**If you only have this zip** (no repo, no chat history — e.g. a fresh Claude session started specifically to continue this work):
1. Everything in this zip IS the current state — `frontend/` is the live site, there is no more-current version elsewhere unless the client hands you one.
2. Read §0 above, then §5 ("Still open"), before making any change.
3. There is no git history available to you — don't reference "the last commit" or try to diff against anything; treat the zip's contents as ground truth as of whatever date the client tells you they got it.
4. If the client gives you a new instruction that seems to contradict something recorded here, trust the client's new instruction — this file records what was true as of packaging, not a permanent decision log that overrides the person you're actually talking to.

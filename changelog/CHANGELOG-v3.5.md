# AniFX 2026 — v3.5 Log (logo removal + sponsors-tab cleanup)

Small, fast round on top of v3.4. Read `PROJECT_MEMORY.md` first, then this file. `CHANGELOG-v3.4.md` still holds the full prior round's detail and is unchanged.

Status: implemented, cache-buster bumped, packaged into `ship/anifx-2026-delivery-v3.5.zip`.

## What changed this round

1. **Logo placeholder removed completely, site-wide.** The `<span class="logo-slot" id="logoSlot">LOGO<br>HERE</span>` dashed box in the header brand block is gone from all 6 HTML files. Removed the matching `.logo-slot` CSS rule from `shared.css`, and the `CONFIG.logoUrl` field + its injection logic from `shared.js`. Header is now just the "ANIFX" wordmark, no logo slot of any kind. (Sponsor `logoUrl` field on `CONFIG.sponsors` entries is untouched — that's a different, unrelated field for sponsor logos, not the site's own brand logo.)

2. **Sponsors tab removed on pages with no sponsor.** Only Character Design currently has a confirmed sponsor (XP-Pen). The Sponsors tab button + panel (`data-panel="panel-sponsors"` / `#panel-sponsors` / `#eventSponsors`) has been deleted outright from `valorant.html`, `fc26.html`, `game-jam.html`, and `film-festival.html`. Character Design keeps its Sponsors tab. Tab-switching JS in `shared.js` iterates `.ctab`/`.tab-panel` generically, so removing a tab pair on some pages but not others is safe — no hardcoded tab list anywhere.

3. **Known gap, flagged not fixed:** `CONFIG.sponsors` in `shared.js` is still one flat global list, not per-track. Right now that's harmless (only one sponsor exists, only on the one page that still has the tab), but if a second sponsor is added for a different event later, whoever adds it needs to either re-add a Sponsors tab to that page manually, or (better) make `sponsors` track-aware first — don't just push a new entry into the flat array and assume it'll land on the right page.

## Explicitly NOT done this round (client hasn't provided what's needed / blocked)

- **No images were placed into the site.** Client sent a batch of images for VALORANT, Character Design, Game Jam, and Film & Animation. Two of them — official Riot Games VALORANT key art, and a copyrighted Planet of the Apes VFX/mocap still of a real person (Andy Serkis) — were declined outright per this project's own hard rule #3 (never use real/copyrighted or branded imagery, even "just for now"). Client was told directly and asked for CSS/SVG-built alternatives instead; no response yet on that.
- FC26 has no photo/art of any kind provided — open question, unanswered as of this round.
- The 4 character-design sketches (rat, alien, monkey, centaur — client says original/handmade) are approved for placement, layout/positioning ("right side of card, properly positioned") not yet built.
- Game Jam screenshot approved for use, not yet placed.
- Film & Animation stays exactly as-is (client confirmed: current 2 stock photos, no change) — EXCEPT client also said the declined VFX-breakdown image should go "on card where events page is and also inside film page," which is blocked per the copyright issue above; flagged to client, unresolved.

None of the above are silently skipped — all were surfaced to the client in-conversation before this zip was cut. Next agent: don't infer a decision on the blocked images from silence: ask again if it comes up.

## Cache-busting

`shared.css?v=45`, `shared.js?v=41` — bumped identically across all 6 HTML files for this round's CSS/JS changes.

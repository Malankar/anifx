# AniFX 2026 — v3.7 Log (Bracket + Live roster removed)

Fast round on top of v3.6. Read `PROJECT_MEMORY.md` and the last couple changelogs first.

Status: implemented, syntax-checked, cache-buster bumped, packaged into `ship/anifx-2026-delivery-v3.7.zip`.

## What changed this round

Client: "no brackets for any events and roster no remove it" — removed both features entirely, not just hidden.

1. **Bracket tab removed.** It only existed on `valorant.html` and `fc26.html` (the other 3 pages never had it). Removed the tab button + `#panel-bracket` panel from both. Deleted the now-dead `#bracketView` rendering block from `shared.js` and the `CONFIG.brackets` placeholder data object entirely (fake match data — "Team Alpha vs Team Bravo" etc — was marked as placeholder to delete anyway).

2. **Live roster tab removed.** It only existed on `valorant.html`. Removed the tab button + `#panel-roster` panel (search box, slot counter, ladder). Deleted the now-dead `#ladder` rendering block from `shared.js`.

3. **NOT removed — a different "roster" that's actually the registration form's team-member field** (`#rosterField`/`#fRoster`/`rosterCount`, `rosterLabel`/`rosterHint`/`rosterPlaceholder` on each track). That's how a team lists its members when signing up (VALORANT captain, Game Jam/Film team lead) — unrelated to the public roster display that got removed, left completely untouched.

4. **`CONFIG.confirmedTeams` was NOT deleted**, even though it used to feed the now-removed roster/bracket displays — it's also the data source for `entriesFor()`/`trackState()`, the actual slot-capacity check that decides whether a track shows "Full — waitlist only". Deleting it would have silently broken that gating logic. Comment on it updated to reflect its real remaining purpose. Still placeholder sample data (fake team names) — still needs deleting once real registrations exist, per its own comment.

5. **Stale copy fixed while in there** (found by actually reading what referenced the removed features, not left behind): the payment-success message, its fine print on `index.html`, and the privacy-policy tab both used to promise "your name appears on the live roster within 48 hours" / "shown publicly on the site's live roster and bracket" — no longer true now that those views don't exist. Reworded to just promise email confirmation within 48 hours, and to state plainly that registrant details aren't published on the site. The FAQ line about VALORANT/FC26 brackets being "drawn and published... on Instagram" was left as-is — that describes the club's own offline draw process, not an on-site feature, so it's still accurate.

## Not done (explicitly out of scope for speed, flagged not silently skipped)

- Left the now-unused CSS for `.bracket`, `.match`, `.round`, `.ladder`, `.slot`, `.pair` etc in `shared.css` — dead but harmless (nothing references those classes anymore, so none of it renders). Didn't spend time trimming it given "fast" — worth a cleanup pass later if anyone wants a leaner stylesheet, but it's not costing anything functionally today.

## Cache-busting

`shared.css?v=47`, `shared.js?v=43` — bumped identically across all 6 HTML files.

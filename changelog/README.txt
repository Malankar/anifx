ANIFX 2026 — FRONTEND HANDOFF (v3.33 — current, self-contained)
================================================

THIS IS A SELF-CONTAINED PACKAGE. If you are picking this project up
with nothing else — no chat history, no repo access, just this zip —
that is fine by design. Read in this order:
  1. This README (you're here).
  2. CHANGELOG-v3.33.md — this round: font finalized (Alegreya Sans),
     event-card tilt+glow, hero-image fallback feature, credits added,
     Film's new hero video, FC26's key art declined. Then work
     backwards through -v3.18.md, -v3.17.md, -v3.16.md for the rounds
     right before it, and -v3.4.md ("START HERE") for the original
     full requirements history.
  3. PROJECT_MEMORY.md — the project's overall hard rules and history,
     independent of any single round of changes.
Nothing about this project's current pricing, schedule, form fields,
or branding should be assumed from memory or guessed — check the
newest changelog and the actual files first.

Files in this package:
  README.txt                     this file
  CHANGELOG-v3.19.md through
  CHANGELOG-v3.4.md               one file per round, newest first —
                                  see PROJECT_MEMORY.md §1 for a one-
                                  paragraph summary of what each
                                  major round changed
  PROJECT_MEMORY.md               overall project handoff doc — hard
                                  rules, past mistakes, project shape
  frontend/
    index.html                   landing page — hero, brand-break, "pick
                                  your event", stats strip, on-campus
                                  schedule, FAQ
    valorant.html                VALORANT event page
    fc26.html                    FC26 event page
    game-jam.html                Game Jam event page
    film-festival.html           Film & Animation event page
    character-design.html        Character Design event page
    shared.css                   all styles — one file, loaded by every page
    shared.js                    CONFIG + all logic — one file, loaded by
                                  every page
    film.jpg, film-1155439_640.jpg   sample stock photos used on the
                                  Film & Animation page (real stills swap
                                  in later, no code change needed)
  backend/
    anifx-backend.gs             Google Apps Script backend — UNCHANGED
                                  file contents, but see the BREAKING
                                  CHANGE section below, it now needs an
                                  update to match the new payload.

--------------------------------------------------------------------
⚠ BREAKING CHANGE FOR THE BACKEND DEVELOPER — READ THIS FIRST
--------------------------------------------------------------------
The registration form's submitted payload shape changed in this pass.
anifx-backend.gs (owned by you, not touched by this pass per the client's
standing instruction) currently expects the OLD field names below and
will need updating to read the NEW ones, or incoming registrations will
be missing data under the names it's looking for.

  OLD payload key      →  NEW payload key
  ------------------------------------------
  captainName           →  registrantName
  captainPhone          →  registrantPhone
  captainEmail          →  registrantEmail
  (none — new field)    →  leadRole        ("Captain" / "Team Lead" / "Solo entrant")
  (none — new field)    →  age
  (none — new field)    →  classYear
  (none — new field)    →  board            (often empty string — optional field)
  (none — new field)    →  address
  teamName / roster     →  unchanged in name, but now sent as EMPTY
                           STRINGS for solo tracks (fc26, character) —
                           previously these tracks didn't have a
                           `roster` field shown at all; now the keys
                           always exist in the payload, just blank for
                           solo entries.
  fee                   →  unchanged in name, but for the Film track it
                           now reflects whichever fee tier the entrant
                           picked (Free or ₹499), not a single fixed
                           track fee — check `fee` per-submission, don't
                           assume Film always equals one number.

Full current payload shape sent on submit (see shared.js, the
form.addEventListener("submit", ...) handler, near the bottom of the
registration-modal section):

  {
    track, trackId, fee,
    teamName, leadRole,
    registrantName, registrantPhone, registrantEmail,
    college, age, classYear, board, address,
    roster,
    waitlist, submittedAt
  }

Nothing else about the backend contract changed — same sheetEndpoint
config field, same mode:"no-cors" POST, same GET-for-refresh behavior.

--------------------------------------------------------------------
WHAT YOU NEED TO DO (unchanged from before)
--------------------------------------------------------------------
Same CONFIG block, same "leave blank and nothing breaks" behavior:
  1. sheetEndpoint   — Apps Script Web App URL, once deployed.
  2. contactEmail / contactPhone — client's real details. logoUrl is
     intentionally blank — client said no logo is needed for this site
     at all, leave the header's placeholder mark as-is.
  3. heroVideo / heroPoster, and each track's own `video` field —
     background loops. Leave blank until footage exists.
  4. whatsappLink / discordLink — use a redirect link, not the raw invite.
  5. Each track's payUrl — Razorpay link, once created.

Still marked PLACEHOLDER and still needs deleting before real
registrations start: CONFIG.confirmedTeams and CONFIG.brackets sample
entries (search "PLACEHOLDER" in shared.js).

--------------------------------------------------------------------
WHAT'S NEW IN v3.3/v3.4 (this pass — full content/pricing/structure overhaul)
--------------------------------------------------------------------
Full requirements were gathered, clarified with the client over several
rounds, and are recorded in detail in CHANGELOG-v3.4.md, included
directly in this zip (see the top of this README). Summary of what changed:

- Real, client-confirmed pricing, prizes and on-campus schedule
  everywhere — the whole site was running on placeholder numbers/times
  before this pass.
- FC26 is now genuinely solo/1v1 only — all team/slot/live-roster UI
  removed from that page entirely, ₹100 entry, ₹5,000/₹3,000 prize.
  Its hero background now has small animated "player" dots hitting the
  ball (randomized paths, Web Animations API — not a fixed CSS loop,
  not real photos).
- VALORANT: ₹1,000/team (was a per-player+per-team split), ₹17,500
  prize, keeps "Captain" and Riot ID references — the only page that
  does. A sitewide Riot Games non-affiliation disclaimer was added to
  every footer.
- Game Jam / Film & Animation: registrant is called "Team Lead", never
  "Captain". Film now has a real two-tier fee (free for students/
  animation hobbyists, ₹499 for professionals) via a small radio-button
  choice in the registration form.
- Character Design: fully fleshed out from the client's official rules
  document — real venue, eligibility, judging criteria, XP-Pen sponsor,
  prize is an XP-Pen tablet + certificate.
- Registration form gained four new fields (Age, Class/Year/Graduation,
  Board, Address) alongside the existing ones — see the BREAKING CHANGE
  section above for exactly how this changed the submitted payload.
- Org/institution wording standardized sitewide to "School of Creative
  Studies, DY Patil Deemed to be University, Navi Mumbai" (was a mix of
  two different older names).
- Visual: Alegreya Sans is now the finalized secondary/label font (was
  Fira Sans, was IBM Plex Sans before that — comparison is over, see
  CHANGELOG-v3.19.md); a sheen-sweep hover effect added to
  all primary buttons and the header's Register pill; homepage event
  cards now stack full-width with an alternating left/right scroll-in
  reveal; Game Jam recolored to cyan-blue, Character Design to off-white
  (each event's own accent color, unrelated to backend/data).
- Removed entirely: the homepage "Match Board" (live fixtures) and
  "Watch Live" (streaming) sections — both features are gone, not just
  hidden, since the client cancelled live streaming for this edition.
- Logo removed: a real logo was briefly wired in mid-pass, then the
  client said it's not needed at all — CONFIG.logoUrl is blank again
  and the header shows its normal "LOGO HERE" placeholder box.

--------------------------------------------------------------------
KNOWN LIMITATION (carried over — still applies)
--------------------------------------------------------------------
The form's POST to the Apps Script endpoint uses mode:"no-cors"
(required for Apps Script Web Apps), so the frontend can't read whether
the save actually succeeded — it always shows "saved" to the user.
Test the real endpoint end-to-end once deployed, so a misconfigured
deployment doesn't fail silently. This is now MORE important than
before given the payload shape change above.

--------------------------------------------------------------------
Verified in-browser this pass (local static server, all 6 pages): zero
console errors, correct data-driven content per page, registration form
shows the correct fields/labels per track (solo vs. team, Captain vs.
Team Lead), Film's fee-tier switch correctly updates the displayed
amount. NOT yet tested: a real end-to-end submission against a live
Apps Script endpoint (none is configured — see sheetEndpoint above).

— Atharva Patil

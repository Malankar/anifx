# AniFX 2026 — v3.32 Log (Film video restored, VALORANT face visibility, reel-strip tags removed)

Fast round, all 4 items verified before shipping, nothing skipped.

## Film hero — video restored
`video:"film-vfx-clip.mp4"` back (was a static image). File was already sitting unused in the folder from before. Confirmed: correct src on the hero, `has-video` class present, placeholder projector still correctly hidden.

## VALORANT hero — face now visible near the pills
Scaled up + repositioned (`scale(1.4)`, `object-position:70% 30%`) — the fact-pills row previously sat over the cape/blade area, not the face. Confirmed no overflow from the scale (`.hero` already clips it). Tablet-range override (a separate, unrelated fix) explicitly resets the transform so the two don't stack.

## Reel-strip — generic category tags removed
"LIVE ACTION" and "3D · REEL 02" labels removed from all cells. Akhiri Dor's credit and award sticker kept — those are attribution, not category tags, and weren't part of this request.

## Verified
Fast but real: all 4 items checked programmatically (video src, hidden placeholder, tag text absence/presence, no overflow), plus a full 6-page console-error sweep. All clean.

## Cache-buster
`shared.css?v=71` (was 70), `shared.js?v=59` (was 58).

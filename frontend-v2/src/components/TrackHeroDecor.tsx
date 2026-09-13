import { useRef } from "react"
import { useFcBallAnimation } from "@/hooks/useFcBallAnimation"
import type { TrackPageMeta } from "@/lib/config"

/* ---------- per-track hero decoration ----------
   Each track's own page hero has a bespoke decorative layer — ported
   1:1 from the markup in the old per-track HTML files. */
export function TrackHeroDecor({ decor }: { decor: TrackPageMeta["decor"] }) {
  const ballRef = useRef<HTMLDivElement>(null)
  const playersRef = useRef<HTMLDivElement>(null)
  useFcBallAnimation(ballRef, playersRef)

  if (decor === "valorant") {
    return (
      <div className="v-plate" aria-hidden="true">
        <div className="v-plate-layer" />
        <div className="v-plate-scan" />
        <div className="v-plate-veil" />
        <div className="v-plate-frame" />
      </div>
    )
  }
  if (decor === "fc26") {
    return (
      <div className="fc-pitch" aria-hidden="true">
        <div className="fc-floodlight fc-fl-l" />
        <div className="fc-floodlight fc-fl-r" />
        <div className="fc-pitch-outline" />
        <div className="fc-pitch-circle" />
        <div className="fc-pitch-line" />
        <div className="fc-goal fc-goal-l" />
        <div className="fc-goal fc-goal-r" />
        <div className="fc-ball" ref={ballRef} />
        <div className="fc-players" ref={playersRef} aria-hidden="true" />
      </div>
    )
  }
  if (decor === "gamejam") {
    return (
      <div className="gj-stage" aria-hidden="true">
        <div className="gj-hills" />
        <div className="gj-ground" />
        <div className="gj-obstacle" />
        <div className="gj-dust" />
        <div className="gj-runner">
          <span className="gj-px gj-leg gj-l1" />
          <span className="gj-px gj-leg gj-l2" />
          <span className="gj-px gj-body" />
          <span className="gj-px gj-head" />
          <span className="gj-px gj-eye" />
        </div>
      </div>
    )
  }
  if (decor === "film") {
    return (
      <div className="fm-projector" aria-hidden="true">
        <div className="fm-beam" />
        <div className="fm-screen">
          <img src="/film-1155439_640.jpg" alt="" />
        </div>
      </div>
    )
  }
  // character
  return (
    <div className="hero-char-gallery" aria-hidden="true">
      <div className="hcg-box" data-parallax="-.08">
        <img src="/char-monkey.png" alt="" />
      </div>
      <div className="hcg-box" data-parallax=".14">
        <img src="/char-alien.png" alt="" />
      </div>
      <div className="hcg-box" data-parallax=".1">
        <img src="/char-rat.png" alt="" />
      </div>
      <div className="hcg-box" data-parallax="-.16">
        <img src="/char-centaur.png" alt="" />
      </div>
      <span className="media-credit hcg-credit">Credits — Shivam Prasad</span>
    </div>
  )
}

import { useRef } from "react"
import { useBrandBreakFit } from "@/hooks/useBrandBreakFit"

export function BrandBreak() {
  const ref = useRef<HTMLDivElement>(null)
  useBrandBreakFit(ref)

  return (
    <div className="brand-break wrap" ref={ref}>
      <p className="display outline-text">
        <span className="outline-fill" data-fill-text="Five Events.">
          Five Events.
        </span>
        <br />
        <span className="outline-fill" data-fill-text="One Festival.">
          One Festival.
        </span>
      </p>
      <p className="outline-sub">VALORANT — FC26 — GAME JAM — FILM &amp; ANIMATION — CHARACTER DESIGN</p>
    </div>
  )
}

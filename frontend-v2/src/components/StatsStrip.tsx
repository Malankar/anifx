import { useRef } from "react"
import { useStatCountUp } from "@/hooks/useStatCountUp"

export function StatsStrip() {
  const ref = useRef<HTMLDivElement>(null)
  useStatCountUp(ref)

  return (
    <div className="strip" ref={ref}>
      <div className="strip-item">
        <div className="strip-num">5</div>
        <p className="strip-lab">Competitions: VALORANT, FC26, a 100-hour game jam, a film and animation showcase, and character design.</p>
      </div>
      <div className="strip-item">
        <div className="strip-num">2</div>
        <p className="strip-lab">Days on campus, Friday 23 and Saturday 24 October — competitions and prize distribution.</p>
      </div>
      <div className="strip-item">
        <div className="strip-num">100</div>
        <p className="strip-lab">Hours to design, build and ship an original side-scroller. Online, from anywhere.</p>
      </div>
    </div>
  )
}

import { useCountdown } from "@/hooks/useCountdown"

const LABELS = ["DAYS", "HOURS", "MINUTES", "SECONDS"]

export function Countdown() {
  const { live, units, hidden } = useCountdown()
  if (hidden) return null

  return (
    <>
      <div className="countdown" aria-label="Time until the festival">
        {live ? (
          <div className="cd-unit">
            <div className="cd-num">LIVE</div>
            <div className="cd-lab">HAPPENING NOW</div>
          </div>
        ) : (
          units &&
          units.map((v, i) => (
            <div className="cd-unit" key={LABELS[i]}>
              <div className="cd-num">{v}</div>
              <div className="cd-lab">{LABELS[i]}</div>
            </div>
          ))
        )}
      </div>
      <p className="cd-note">{live ? "" : "Until the festival opens on campus."}</p>
    </>
  )
}

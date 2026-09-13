import { useRef } from "react"
import { Link } from "react-router-dom"
import { CONFIG } from "@/lib/config"
import { getTrackCardMedia } from "@/lib/trackMedia"
import { useReveal } from "@/hooks/useReveal"
import { useEventCardHover } from "@/hooks/useEventCardHover"

/* ---------- event navigator (landing page only) — the 5 route-out cards.
   Port of shared.js's #eventNav block. */
export function EventNav() {
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref, ".event-card", { once: false })
  useEventCardHover(ref)

  return (
    <div className="event-nav" ref={ref}>
      {CONFIG.tracks.map((t, i) => {
        const media = getTrackCardMedia(t)
        const mediaClass = media.kind === "video" ? " has-video" : media.kind === "img" ? " has-img" : media.kind === "gallery" ? " has-gallery" : ""
        return (
          <Link className={"event-card" + mediaClass} to={t.page} data-track={t.id} key={t.id}>
            {media.kind === "video" && (
              <video className="event-card-video" muted loop playsInline src={media.src} aria-hidden="true" />
            )}
            {media.kind === "img" && <img className="event-card-img" src={"/" + media.src} alt={media.alt} aria-hidden="true" />}
            {media.kind === "gallery" && (
              <div className="event-card-gallery" aria-hidden="true">
                {media.srcs.map((src) => (
                  <img key={src} src={"/" + src} alt={t.name + " — student sketch by Shivam Prasad"} title="Shivam Prasad" loading="lazy" />
                ))}
              </div>
            )}
            <div className="event-card-tint" aria-hidden="true" />
            <div className="event-card-glow" aria-hidden="true" />
            <div className="event-card-body">
              <div className="event-card-num">
                {String(i + 1).padStart(2, "0")} / {String(CONFIG.tracks.length).padStart(2, "0")}
              </div>
              <h3>{t.name}</h3>
              <div className="event-card-fmt">{t.format}</div>
              <p>{t.blurb}</p>
              <dl className="event-card-facts">
                {t.facts.slice(0, 2).map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="event-card-cta">
                <span className="btn btn-primary">Enter {t.name}</span>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

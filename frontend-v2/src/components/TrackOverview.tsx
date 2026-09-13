import { useRef } from "react"
import type { Track } from "@/lib/config"
import { getTrackCardMedia } from "@/lib/trackMedia"
import { useReveal } from "@/hooks/useReveal"

/* Port of shared.js's #eventOverview block. */
export function TrackOverview({ track }: { track: Track }) {
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref, ".track", undefined, [track.id])
  const media = getTrackCardMedia(track)

  return (
    <div ref={ref}>
      <article className="track" data-track={track.id}>
        <div>
          <p className="track-desc" style={{ maxWidth: "60ch", fontSize: 16.5 }}>
            {track.blurb}
          </p>
          <p className="track-desc" style={{ marginTop: 16 }}>
            <b style={{ color: "var(--bone)" }}>Eligibility.</b> {track.eligibility || ""}
          </p>
        </div>
        <div className={"track-media" + (media.kind === "video" ? " has-video" : media.kind === "img" ? " has-img" : "")}>
          {media.kind === "video" && <video className="track-video" muted loop playsInline src={media.src} aria-hidden="true" />}
          {media.kind === "img" && <img className="track-img" src={"/" + media.src} alt={media.alt} aria-hidden="true" />}
          <div className="track-video-tint" aria-hidden="true" />
          <dl className="track-facts">
            {track.facts.map(([k, v]) => (
              <div className="fact" key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </article>
    </div>
  )
}

import { useEffect, useRef, useState } from "react"
import { CONFIG, TRACK_PAGE_META, FILM_REEL_CELLS } from "@/lib/config"
import { getHeroMedia } from "@/lib/trackMedia"
import { useModal } from "@/context/ModalContext"
import { useHeroTitleParallax } from "@/hooks/useHeroTitleParallax"
import { useCharGalleryParallax } from "@/hooks/useCharGalleryParallax"
import { useFilmReelVideos } from "@/hooks/useFilmReelVideos"
import { useReveal } from "@/hooks/useReveal"
import { TrackHeroDecor } from "@/components/TrackHeroDecor"
import { TrackOverview } from "@/components/TrackOverview"
import { Schedule } from "@/components/Schedule"
import { RulesAccordion, FaqAccordion } from "@/components/Accordion"

const TABS = [
  { id: "panel-overview", label: "Overview" },
  { id: "panel-rules", label: "Rules" },
  { id: "panel-schedule", label: "Schedule" },
  { id: "panel-faq", label: "FAQ" },
]

export default function TrackPage({ trackId }: { trackId: string }) {
  const { openRegistration } = useModal()
  const track = CONFIG.tracks.find((t) => t.id === trackId)!
  const meta = TRACK_PAGE_META[trackId]
  const [activePanel, setActivePanel] = useState("panel-overview")

  const heroRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const filmStripRef = useRef<HTMLDivElement>(null)
  const genericRevealRef = useRef<HTMLDivElement>(null)

  // Each track page has its own accent/ink/surface color theme, keyed off
  // `<html data-track="...">` (see shared.css's `[data-track="..."]`
  // blocks). The old static pages had this baked into the page's own
  // <html> tag; here it has to be set/torn down per route instead.
  useEffect(() => {
    document.documentElement.setAttribute("data-track", trackId)
    return () => {
      document.documentElement.removeAttribute("data-track")
    }
  }, [trackId])

  useHeroTitleParallax(titleRef)
  useCharGalleryParallax(heroRef)
  useFilmReelVideos(filmStripRef)
  useReveal(genericRevealRef, ".sec-head, .strip-item, .sched-day, [data-acc], .stream-main, .pill-row", { once: true }, [trackId])

  const heroMedia = getHeroMedia(track)

  const tabs = meta.hasSponsorsTab
    ? [...TABS.slice(0, 3), { id: "panel-sponsors", label: "Sponsors" }, TABS[3]]
    : TABS

  function selectPanel(id: string) {
    setActivePanel(id)
  }

  function goToRules(e: React.MouseEvent) {
    e.preventDefault()
    setActivePanel("panel-rules")
    document.getElementById("panel-rules")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const generalRules = CONFIG.rules.filter((r) => !r.track || r.track === trackId)

  return (
    <div ref={genericRevealRef}>
      {/* ============ EVENT HERO ============ */}
      <section className={"hero event-hero" + (heroMedia.hasMedia ? " has-video" : "")} ref={heroRef}>
        {heroMedia.src ? (
          <video className="hero-video" muted loop playsInline autoPlay src={heroMedia.src} aria-hidden="true" />
        ) : (
          <video
            className="hero-video"
            muted
            loop
            playsInline
            poster={heroMedia.poster ? "/" + heroMedia.poster : undefined}
            aria-hidden="true"
          />
        )}
        <div className="hero-video-overlay" aria-hidden="true" />
        {meta.mediaCredit && <span className="media-credit">{meta.mediaCredit}</span>}
        <TrackHeroDecor decor={meta.decor} />
        <div className="wrap hero-inner">
          <div className="event-eyebrow">
            <a href="/">AniFX 2026</a>
            <span className="sep">—</span>
            <span>{meta.eyebrow}</span>
          </div>

          <h1 className="display h-xl hero-title" ref={titleRef}>
            {meta.title}
          </h1>
          <p className="hero-sub">{meta.heroSub}</p>

          <div className="hero-actions">
            <a
              className="btn btn-primary"
              href="#"
              data-open-reg
              onClick={(e) => {
                e.preventDefault()
                openRegistration(trackId, true)
              }}
            >
              {meta.registerCta}
            </a>
            <a className="btn btn-ghost" href="#panel-rules" data-panel-link="panel-rules" onClick={goToRules}>
              Read the rules
            </a>
          </div>

          <dl className="pill-row">
            {meta.pills.map(([k, v]) => (
              <div className="pill" key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {trackId === "film" && (
        <div className="fm-strip" aria-hidden="true" ref={filmStripRef}>
          <div className="run">
            {[0, 1, 2, 3].flatMap((rep) =>
              FILM_REEL_CELLS.map((cell, i) => (
                <div className="fm-cell" key={rep + "-" + i}>
                  <video src={"/" + cell.src} muted loop playsInline aria-hidden="true" />
                  {cell.award && <span className="fm-award">{cell.award}</span>}
                  {cell.caption && <span>{cell.caption}</span>}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ============ CONTENT TABS ============ */}
      <section className="sec" style={{ paddingTop: "clamp(30px,5vw,56px)" }}>
        <div className="wrap">
          <div className="content-tabs" role="tablist">
            {tabs.map((t) => (
              <button
                key={t.id}
                className="ctab"
                role="tab"
                aria-selected={activePanel === t.id}
                onClick={() => selectPanel(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className={"tab-panel" + (activePanel === "panel-overview" ? " active" : "")} id="panel-overview">
            <TrackOverview track={track} />
          </div>

          <div className={"tab-panel" + (activePanel === "panel-rules" ? " active" : "")} id="panel-rules">
            <RulesAccordion rules={generalRules} />
          </div>

          <div className={"tab-panel" + (activePanel === "panel-schedule" ? " active" : "")} id="panel-schedule">
            <Schedule trackName={track.name} />
          </div>

          {meta.hasSponsorsTab && (
            <div className={"tab-panel" + (activePanel === "panel-sponsors" ? " active" : "")} id="panel-sponsors">
              {CONFIG.sponsors.length ? (
                CONFIG.sponsors.map((s) => (
                  <a href={s.url || "#"} target="_blank" rel="noopener" key={s.name}>
                    {s.name}
                  </a>
                ))
              ) : (
                <div className="empty-card">No sponsors confirmed yet for this edition. Check back closer to the event.</div>
              )}
            </div>
          )}

          <div className={"tab-panel" + (activePanel === "panel-faq" ? " active" : "")} id="panel-faq">
            <FaqAccordion faq={CONFIG.faq} />
          </div>
        </div>
      </section>
    </div>
  )
}

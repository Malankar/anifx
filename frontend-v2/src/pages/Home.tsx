import { useRef } from "react"
import { CONFIG } from "@/lib/config"
import { getHeroMedia } from "@/lib/trackMedia"
import { useModal } from "@/context/ModalContext"
import { useHeroTitleParallax } from "@/hooks/useHeroTitleParallax"
import { useHeroFade } from "@/hooks/useHeroFade"
import { useReveal } from "@/hooks/useReveal"
import { IntroFx } from "@/components/IntroFx"
import { Countdown } from "@/components/Countdown"
import { BrandBreak } from "@/components/BrandBreak"
import { EventNav } from "@/components/EventNav"
import { StatsStrip } from "@/components/StatsStrip"
import { Schedule } from "@/components/Schedule"
import { FaqAccordion } from "@/components/Accordion"

export default function Home() {
  const { openRegistration } = useModal()
  const spacerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const heroInnerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const genericRevealRef = useRef<HTMLDivElement>(null)

  useHeroTitleParallax(titleRef, spacerRef)
  useHeroFade(heroInnerRef, heroRef, spacerRef)
  // Generic reveal for the rest of the page — same selector shared.js used
  // for its catch-all revealNodes() call at the end of the file.
  useReveal(genericRevealRef, ".sec-head, .strip-item, .sched-day, [data-acc], .pill-row", { once: false })

  const heroMedia = getHeroMedia()

  return (
    <div ref={genericRevealRef}>
      <IntroFx spacerRef={spacerRef} />

      {/* ============ HERO ============ */}
      <section
        className={"hero" + (heroMedia.hasMedia ? " has-video" : "")}
        style={{ minHeight: "min(88vh,860px)", display: "flex", alignItems: "center" }}
        ref={heroRef}
      >
        {heroMedia.src ? (
          <video className="hero-video" muted loop playsInline autoPlay src={heroMedia.src} aria-hidden="true" />
        ) : (
          <video className="hero-video" muted loop playsInline poster={heroMedia.poster ? "/" + heroMedia.poster : undefined} aria-hidden="true" />
        )}
        <div className="hero-video-overlay" aria-hidden="true" />
        <div className="wrap hero-inner" ref={heroInnerRef}>
          <div className="hero-meta data">
            <span>
              <strong>23–24 October 2026</strong>
            </span>
            <span>School of Creative Studies, DY Patil Deemed to be University, Navi Mumbai</span>
          </div>

          <h1 className="display h-xxl hero-title" ref={titleRef}>
            AniFX <span className="yr">26</span>
          </h1>
          <p className="hero-sub">Five competitions. One weekend. One campus. Bring something that works.</p>

          <div className="hero-actions">
            <a className="btn btn-primary" href="#events">
              Explore the events
            </a>
            <a
              className="btn btn-ghost"
              href="#"
              data-open-reg
              onClick={(e) => {
                e.preventDefault()
                openRegistration()
              }}
            >
              Register your team
            </a>
          </div>

          <Countdown />
        </div>
      </section>

      {/* ============ BRAND BREAK ============ */}
      <BrandBreak />

      {/* ============ EVENT NAVIGATOR ============ */}
      <section className="sec" id="events">
        <div className="wrap">
          <div className="sec-head">
            <h2 className="display h-lg">Pick your event</h2>
            <p>Every rule, fee, deadline and tiebreak lives on that event's own page. Nothing gets decided on the day.</p>
          </div>
          <EventNav />
        </div>
      </section>

      {/* ============ STATS STRIP ============ */}
      <section className="sec" id="board" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <StatsStrip />
        </div>
      </section>

      {/* ============ ON CAMPUS ============ */}
      <section className="sec" id="campus">
        <div className="wrap">
          <div className="sec-head">
            <h2 className="display h-lg">On campus</h2>
            <p>Everything that happens in person across the festival weekend at the Centre of Excellence, DY Patil Deemed to be University, Navi Mumbai.</p>
          </div>
          <Schedule />
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="sec" id="faq">
        <div className="wrap">
          <div className="sec-head">
            <h2 className="display h-lg">Frequently asked</h2>
            <p>The short answers. For rules specific to your event, visit that event's own page.</p>
          </div>
          <FaqAccordion faq={CONFIG.faq} />
        </div>
      </section>
    </div>
  )
}

import { useEffect, useRef, useState, type RefObject } from "react"
import { reduceMotion } from "@/lib/motion"

/* ---------- landing-page-only intro title card ----------
   Direct port of shared.js's #introFx block: a separate phase before
   the real page, its own scroll runway (#introSpacer). Text dissolves
   letter-by-letter against solid black, then the black itself fades,
   then the real page begins. See the original's long comment in
   shared.js for why the timing windows are computed the way they are.
   `spacerRef` is owned by the parent (Home) so the hero parallax/fade
   hooks can read the same spacer's height — same relationship the
   original had between the intro block and the hero-scroll blocks. */
export function IntroFx({ spacerRef }: { spacerRef: RefObject<HTMLDivElement | null> }) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const wordRef = useRef<HTMLParagraphElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const skipRef = useRef<HTMLButtonElement>(null)
  const [skipVisible, setSkipVisible] = useState(false)

  useEffect(() => {
    if (reduceMotion) return
    const overlay = overlayRef.current,
      word = wordRef.current,
      hint = hintRef.current,
      spacer = spacerRef.current,
      skipBtn = skipRef.current
    if (!overlay || !word || !hint || !spacer) return

    let dist = Math.max(spacer.offsetHeight, 1)

    let seenBefore = true
    try {
      seenBefore = localStorage.getItem("anifxSeenIntro") === "1"
      if (!seenBefore) localStorage.setItem("anifxSeenIntro", "1")
    } catch {
      /* storage unavailable (private mode etc) — default to showing it */
    }
    if (seenBefore) setSkipVisible(true)

    // Split into individual letters so the dissolve cascades left-to-right
    // instead of the whole word fading as one block — same as shared.js's
    // TreeWalker approach. Walking text nodes (not word.textContent as a
    // whole) keeps the <em>2026</em> wrapper intact, so its accent color
    // still applies to those letters.
    word.setAttribute("aria-label", word.textContent || "")
    const letters: HTMLSpanElement[] = []
    const walker = document.createTreeWalker(word, NodeFilter.SHOW_TEXT)
    const textNodes: Text[] = []
    let n: Node | null
    while ((n = walker.nextNode())) textNodes.push(n as Text)
    textNodes.forEach((node) => {
      const frag = document.createDocumentFragment()
      ;[...(node.textContent || "")].forEach((ch) => {
        const span = document.createElement("span")
        span.className = "intro-letter"
        span.setAttribute("aria-hidden", "true")
        // A plain space collapses to zero width once it's alone inside its
        // own inline-block span — shared.js swapped it for a non-breaking
        // space (U+00A0) here specifically so the "AniFX 2026" gap survives
        // the split. Keep that exact substitution.
        span.textContent = ch === " " ? " " : ch
        frag.appendChild(span)
        letters.push(span)
      })
      node.parentNode?.replaceChild(frag, node)
    })

    function applyIntro() {
      const p = Math.min(Math.max(window.scrollY / dist, 0), 1)
      const textStart = 0.06,
        textEnd = 0.42
      const textP = Math.min(Math.max((p - textStart) / (textEnd - textStart), 0), 1)
      const revealStart = Math.min(Math.max(1 - (window.innerHeight * 0.4) / dist, textEnd + 0.04), 0.92)
      const bgP = Math.min(Math.max((p - revealStart) / (1 - revealStart), 0), 1)
      const spread = 0.5
      letters.forEach((span, i) => {
        const frac = letters.length > 1 ? i / (letters.length - 1) : 0
        const localP = Math.min(Math.max((textP - frac * spread) / (1 - spread), 0), 1)
        span.style.opacity = String(1 - localP)
        span.style.transform = "translateY(" + localP * -16 + "px) scale(" + (1 + localP * 0.35) + ")"
        span.style.filter = "blur(" + localP * 9 + "px)"
        const glow = Math.sin(localP * Math.PI)
        span.style.textShadow = glow > 0.02 ? "0 0 " + glow * 22 + "px rgb(226 57 74 / " + glow * 0.9 + ")" : "none"
      })
      hint!.style.opacity = String(Math.max(1 - p / 0.1, 0))
      overlay!.style.opacity = String(1 - bgP)
      overlay!.style.display = bgP >= 1 ? "none" : "flex"
      if (skipBtn) {
        skipBtn.style.opacity = String(1 - bgP)
        skipBtn.style.pointerEvents = bgP >= 1 ? "none" : "auto"
      }
      ticking = false
    }
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(applyIntro)
        ticking = true
      }
    }
    const onResize = () => {
      dist = Math.max(spacer.offsetHeight, 1)
      applyIntro()
    }
    addEventListener("scroll", onScroll, { passive: true })
    addEventListener("resize", onResize)
    applyIntro()
    return () => {
      removeEventListener("scroll", onScroll)
      removeEventListener("resize", onResize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (reduceMotion) return <div className="intro-spacer" id="introSpacer" ref={spacerRef} hidden />

  function handleSkip() {
    const spacer = spacerRef.current
    if (!spacer) return
    window.scrollTo({ top: spacer.offsetHeight, behavior: "smooth" })
  }

  return (
    <>
      <div className="intro-fixed" id="introFx" ref={overlayRef}>
        <p className="intro-word" ref={wordRef}>
          AniFX <em>2026</em>
        </p>
        <div className="intro-hint" ref={hintRef}>
          <span className="intro-arrows">
            <svg className="intro-arrow intro-arrow-1" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <svg className="intro-arrow intro-arrow-2" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span>Scroll</span>
        </div>
        <button
          className="intro-skip"
          ref={skipRef}
          type="button"
          hidden={!skipVisible}
          aria-label="Skip intro"
          title="Skip intro"
          onClick={handleSkip}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 5l5 7-5 7" />
            <path d="M13 5l5 7-5 7" />
          </svg>
        </button>
      </div>
      <div className="intro-spacer" id="introSpacer" ref={spacerRef} />
    </>
  )
}

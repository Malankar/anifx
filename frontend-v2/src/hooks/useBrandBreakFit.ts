import { useEffect, type RefObject } from "react"
import { reduceMotion } from "@/lib/motion"

/* ---------- landing-page brand break: shrink-to-fit + scroll fill ----------
   Port of shared.js's fitBrandBreak()/updateFill() block. */
export function useBrandBreakFit(sectionRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    section.classList.add("in")
    const text = section.querySelector<HTMLElement>(".outline-text")
    const fillSpans = [...section.querySelectorAll<HTMLElement>(".outline-fill")]
    if (!text || !fillSpans.length) return

    function fitBrandBreak() {
      text!.style.fontSize = ""
      const maxWidth = text!.parentElement!.clientWidth
      let guard = 40
      while (guard-- > 0) {
        const widest = Math.max(...fillSpans.map((s) => s.scrollWidth))
        if (widest <= maxWidth - 4) break
        const size = parseFloat(getComputedStyle(text!).fontSize)
        if (size <= 20) break
        text!.style.fontSize = size - 2 + "px"
      }
    }
    fitBrandBreak()
    addEventListener("resize", fitBrandBreak)
    document.fonts?.ready?.then(fitBrandBreak)
    let ro: ResizeObserver | undefined
    if (window.ResizeObserver) {
      ro = new ResizeObserver(fitBrandBreak)
      ro.observe(section)
    }

    let cleanupFill = () => {}
    if (!reduceMotion) {
      let ticking = false
      function updateFill() {
        const r = section!.getBoundingClientRect()
        const vh = innerHeight
        const start = vh,
          end = -r.height
        let p = (start - r.top) / (start - end)
        p = Math.min(1, Math.max(0, p))
        fillSpans.forEach((s) => s.style.setProperty("--fill-pct", p * 100 + "%"))
        ticking = false
      }
      const onScroll = () => {
        if (!ticking) {
          requestAnimationFrame(updateFill)
          ticking = true
        }
      }
      addEventListener("scroll", onScroll, { passive: true })
      addEventListener("resize", updateFill)
      updateFill()
      cleanupFill = () => {
        removeEventListener("scroll", onScroll)
        removeEventListener("resize", updateFill)
      }
    }

    return () => {
      removeEventListener("resize", fitBrandBreak)
      ro?.disconnect()
      cleanupFill()
    }
  }, [sectionRef])
}

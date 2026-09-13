import { useEffect, type RefObject } from "react"
import { reduceMotion } from "@/lib/motion"

/* ---------- landing page only: whole hero fades out on scroll ----------
   Port of shared.js's hero-inner fade block. */
export function useHeroFade(
  innerRef: RefObject<HTMLElement | null>,
  heroRef: RefObject<HTMLElement | null>,
  introSpacerRef: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    if (reduceMotion) return
    const inner = innerRef.current,
      heroSec = heroRef.current
    if (!inner || !heroSec) return
    const introSpacer = introSpacerRef.current
    let heroScrollOffset = introSpacer ? introSpacer.offsetHeight : 0
    let ticking = false
    function fadeHero() {
      const h = heroSec!.offsetHeight || 800
      const y = Math.min(Math.max(window.scrollY - heroScrollOffset, 0), h)
      inner!.style.opacity = String(Math.max(1 - (y / h) * 1.35, 0))
      ticking = false
    }
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(fadeHero)
        ticking = true
      }
    }
    const onResize = () => {
      heroScrollOffset = introSpacer ? introSpacer.offsetHeight : 0
      fadeHero()
    }
    addEventListener("scroll", onScroll, { passive: true })
    addEventListener("resize", onResize)
    fadeHero()
    return () => {
      removeEventListener("scroll", onScroll)
      removeEventListener("resize", onResize)
    }
  }, [innerRef, heroRef, introSpacerRef])
}

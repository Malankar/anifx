import { useEffect, type RefObject } from "react"
import { reduceMotion } from "@/lib/motion"

/* ---------- hero title: load-in, then scroll parallax ----------
   Port of shared.js's hero-title block. `introSpacerRef` (landing
   page only) offsets where the hero's own scroll is considered to
   start, same reasoning as the original. */
export function useHeroTitleParallax(
  titleRef: RefObject<HTMLElement | null>,
  introSpacerRef?: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    const el = titleRef.current
    if (!el) return
    if (reduceMotion) {
      el.style.opacity = "1"
      return
    }
    const introSpacer = introSpacerRef?.current
    let heroScrollOffset = introSpacer ? introSpacer.offsetHeight : 0
    const onResize = () => {
      heroScrollOffset = introSpacer ? introSpacer.offsetHeight : 0
    }
    addEventListener("resize", onResize)

    el.style.opacity = "0"
    el.style.transform = "translateY(22px)"
    el.style.transition = "opacity .7s cubic-bezier(.16,.8,.3,1) .1s, transform .7s cubic-bezier(.16,.8,.3,1) .1s"
    const raf1 = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        el.style.opacity = "1"
        el.style.transform = "translateY(0)"
      })
    )

    let handedOff = false
    let ticking = false
    function apply() {
      const y = Math.min(Math.max(window.scrollY - heroScrollOffset, 0), 400)
      el!.style.transform = "translateY(" + y * -0.12 + "px)"
      ticking = false
    }
    const timeoutId = setTimeout(() => {
      el.style.transition = "none"
      handedOff = true
      apply()
    }, 850)
    const onScroll = () => {
      if (!handedOff) return
      if (!ticking) {
        requestAnimationFrame(apply)
        ticking = true
      }
    }
    addEventListener("scroll", onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(raf1)
      clearTimeout(timeoutId)
      removeEventListener("resize", onResize)
      removeEventListener("scroll", onScroll)
    }
  }, [titleRef, introSpacerRef])
}

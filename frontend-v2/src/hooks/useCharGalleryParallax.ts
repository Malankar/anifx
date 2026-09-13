import { useEffect, type RefObject } from "react"
import { reduceMotion } from "@/lib/motion"

/* Port of shared.js's Character Design hero .hcg-box parallax block. */
export function useCharGalleryParallax(heroRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const heroSec = heroRef.current
    if (!heroSec) return
    const boxes = [...heroSec.querySelectorAll<HTMLElement>(".hcg-box")]
    if (!boxes.length || reduceMotion) return
    let ticking = false
    function apply() {
      const h = heroSec!.offsetHeight || 700
      const y = Math.min(Math.max(window.scrollY, 0), h)
      boxes.forEach((b) => {
        const speed = parseFloat(b.dataset.parallax || "0")
        b.style.transform = "translateY(" + y * speed + "px)"
      })
      ticking = false
    }
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(apply)
        ticking = true
      }
    }
    addEventListener("scroll", onScroll, { passive: true })
    apply()
    return () => removeEventListener("scroll", onScroll)
  }, [heroRef])
}

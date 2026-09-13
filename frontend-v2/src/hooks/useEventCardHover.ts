import { useEffect, type RefObject } from "react"
import { reduceMotion } from "@/lib/motion"

/* ---------- event-card hover: lift + cursor glow ----------
   Port of shared.js's .event-card mousemove/mouseleave block. Reveal-
   in-progress cards (no .in yet) are left alone so this never fights
   the scroll-in slide. */
export function useEventCardHover(containerRef: RefObject<HTMLElement | null>, deps: unknown[] = []) {
  useEffect(() => {
    if (reduceMotion || matchMedia("(pointer: coarse)").matches) return
    const container = containerRef.current
    if (!container) return
    const cards = container.querySelectorAll<HTMLElement>(".event-card")
    const cleanups: (() => void)[] = []
    cards.forEach((card) => {
      card.classList.add("tilt-ready")
      card.style.transition = "transform .5s cubic-bezier(.19,.68,.24,.99), box-shadow .5s cubic-bezier(.16,.8,.3,1)"
      const onMove = (e: MouseEvent) => {
        if (!card.classList.contains("in")) return
        const r = card.getBoundingClientRect()
        const px = e.clientX - r.left
        const py = e.clientY - r.top
        card.style.transition = "transform .08s linear"
        card.style.transform = "translateY(-6px)"
        card.style.setProperty("--mx", px + "px")
        card.style.setProperty("--my", py + "px")
        card.style.boxShadow = "0 20px 44px -14px rgb(0 0 0 / .3)"
      }
      const onLeave = () => {
        card.style.transition = "transform .5s cubic-bezier(.19,.68,.24,.99), box-shadow .5s cubic-bezier(.16,.8,.3,1)"
        card.style.transform = ""
        card.style.boxShadow = ""
      }
      card.addEventListener("mousemove", onMove)
      card.addEventListener("mouseleave", onLeave)
      cleanups.push(() => {
        card.removeEventListener("mousemove", onMove)
        card.removeEventListener("mouseleave", onLeave)
      })
    })
    return () => cleanups.forEach((fn) => fn())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

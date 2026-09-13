import { useEffect, type RefObject } from "react"
import { reduceMotion } from "@/lib/motion"

/* ---------- scroll reveal ----------
   Direct port of shared.js's revealNodes(): adds .reveal, staggers a
   transition-delay per node (capped at 6 steps of .05s), then adds
   .in once each node crosses the viewport (IntersectionObserver,
   threshold .1, -10% bottom margin). once=true (default) stops
   observing after the first reveal; once=false toggles .in back off
   when the node leaves, so it can replay. Also kicks off any
   .track-video inside a revealed node, same as the original. */
export function useReveal(
  containerRef: RefObject<HTMLElement | null>,
  selector: string,
  opts?: { once?: boolean },
  deps: unknown[] = []
) {
  const once = opts?.once !== false
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const nodes = [...container.querySelectorAll<HTMLElement>(selector)]
    if (!nodes.length) return

    if (reduceMotion) {
      nodes.forEach((el) => {
        const v = el.querySelector<HTMLVideoElement>(".track-video")
        if (v && v.src) v.play().catch(() => {})
      })
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in")
            const v = en.target.querySelector<HTMLVideoElement>(".track-video")
            if (v && v.src) v.play().catch(() => {})
            if (once) io.unobserve(en.target)
          } else if (!once) {
            en.target.classList.remove("in")
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    )
    nodes.forEach((el, i) => {
      el.classList.add("reveal")
      el.style.transitionDelay = Math.min(i % 6, 5) * 0.05 + "s"
      io.observe(el)
    })
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, selector, once, ...deps])
}

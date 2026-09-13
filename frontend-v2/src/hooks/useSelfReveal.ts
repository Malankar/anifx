import { useEffect, type RefObject } from "react"
import { reduceMotion } from "@/lib/motion"

/* Same scroll-reveal behavior as useReveal, but observes the ref's own
   element directly instead of querying children — for a single
   persistent element (e.g. the shared <Footer>) that isn't inside a
   per-page reveal container. Mirrors shared.js's revealNodes() call
   that included `footer` in its selector list. */
export function useSelfReveal(ref: RefObject<HTMLElement | null>, opts?: { once?: boolean }) {
  const once = opts?.once !== false
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduceMotion) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in")
            if (once) io.unobserve(en.target)
          } else if (!once) {
            en.target.classList.remove("in")
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    )
    el.classList.add("reveal")
    io.observe(el)
    return () => io.disconnect()
  }, [ref, once])
}

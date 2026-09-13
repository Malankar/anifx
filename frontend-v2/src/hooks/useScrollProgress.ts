import { useEffect, useState } from "react"

/* Port of shared.js's scroll-progress bar + compact-nav-on-scroll block,
   as state instead of direct DOM writes (React owns these elements). */
export function useScrollProgress() {
  const [progressPct, setProgressPct] = useState(0)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let ticking = false
    function apply() {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      setProgressPct(max > 0 ? (h.scrollTop / max) * 100 : 0)
      setScrolled(h.scrollTop > 40)
      ticking = false
    }
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(apply)
        ticking = true
      }
    }
    addEventListener("scroll", onScroll, { passive: true })
    apply()
    return () => removeEventListener("scroll", onScroll)
  }, [])

  return { progressPct, scrolled }
}

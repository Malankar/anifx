import { useEffect, type RefObject } from "react"
import { reduceMotion } from "@/lib/motion"

/* Port of shared.js's stat-strip count-up block. */
export function useStatCountUp(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (reduceMotion) return
    const container = containerRef.current
    if (!container) return
    const nums = [...container.querySelectorAll<HTMLElement>(".strip-num")]
    if (!nums.length) return

    function countUp(el: HTMLElement) {
      const text = el.textContent || ""
      const match = text.match(/[\d,]+/)
      if (!match) return
      const target = parseInt(match[0].replace(/,/g, ""), 10)
      if (isNaN(target)) return
      const prefix = text.slice(0, match.index)
      const suffix = text.slice((match.index || 0) + match[0].length)
      const dur = 1100
      const start = performance.now()
      function frame(now: number) {
        const p = Math.min((now - start) / dur, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        el.textContent = prefix + Math.round(target * eased).toLocaleString("en-IN") + suffix
        if (p < 1) requestAnimationFrame(frame)
        else el.textContent = text
      }
      requestAnimationFrame(frame)
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            countUp(en.target as HTMLElement)
            io.unobserve(en.target)
          }
        })
      },
      { threshold: 0.5 }
    )
    nums.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [containerRef])
}

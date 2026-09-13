import { useEffect } from "react"
import { reduceMotion } from "@/lib/motion"

/* ---------- magnetic hover: Register buttons + plain nav links ----------
   Port of shared.js's tail-end magnetic-hover block. Re-binds whenever
   `deps` changes (route change re-renders the nav/CTAs). Skipped under
   prefers-reduced-motion and on coarse (touch) pointers, same as the
   original. */
export function useMagneticHover(deps: unknown[] = []) {
  useEffect(() => {
    if (reduceMotion || matchMedia("(pointer: coarse)").matches) return
    const MAX = 7
    const els = document.querySelectorAll<HTMLElement>("[data-open-reg], .nav-links a:not(.nav-cta)")
    const cleanups: (() => void)[] = []
    els.forEach((btn) => {
      btn.style.transition = "transform .25s cubic-bezier(.19,.68,.24,.99)"
      const onMove = (e: MouseEvent) => {
        const r = btn.getBoundingClientRect()
        const x = ((e.clientX - r.left) / r.width - 0.5) * 2
        const y = ((e.clientY - r.top) / r.height - 0.5) * 2
        btn.style.transition = "transform .08s linear"
        btn.style.transform = "translate(" + (x * MAX).toFixed(1) + "px," + (y * MAX).toFixed(1) + "px)"
      }
      const onLeave = () => {
        btn.style.transition = "transform .25s cubic-bezier(.19,.68,.24,.99)"
        btn.style.transform = "translate(0,0)"
      }
      btn.addEventListener("mousemove", onMove)
      btn.addEventListener("mouseleave", onLeave)
      cleanups.push(() => {
        btn.removeEventListener("mousemove", onMove)
        btn.removeEventListener("mouseleave", onLeave)
      })
    })
    return () => cleanups.forEach((fn) => fn())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

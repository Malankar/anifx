import { useEffect, type RefObject } from "react"
import { reduceMotion } from "@/lib/motion"

/* ---------- FC26 hero: ball genuinely random each loop ----------
   Direct port of shared.js's Web Animations API ball-kick block —
   picks a new direction, style (lob/low/weave) and timing each loop
   so it never retraces the same motion twice in a row. */
export function useFcBallAnimation(ballRef: RefObject<HTMLElement | null>, playersRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (reduceMotion) return
    const ball = ballRef.current
    if (!ball) return
    const rand = (min: number, max: number) => min + Math.random() * (max - min)
    const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]

    function buildPath() {
      const toRight = Math.random() < 0.5
      const style = pick(["lob", "low", "weave"] as const)
      const startX = toRight ? rand(5, 12) : rand(88, 95)
      const endX = toRight ? rand(93, 96) : rand(4, 7)
      const midX = startX + (endX - startX) * rand(0.4, 0.6)
      const baseY = rand(58, 68)

      let frames: Keyframe[]
      if (style === "lob") {
        frames = [
          { left: startX + "%", top: baseY + "%", transform: "scale(1)", opacity: 0, offset: 0 },
          { opacity: 1, offset: 0.08 },
          { left: midX + "%", top: rand(22, 32) + "%", transform: "scale(.75)", offset: 0.5 },
          { left: endX + "%", top: "50%", transform: "scale(.4)", opacity: 0.7, offset: 0.94 },
          { left: endX + "%", top: "50%", transform: "scale(.2)", opacity: 0, offset: 1 },
        ]
      } else if (style === "low") {
        frames = [
          { left: startX + "%", top: baseY + "%", transform: "scale(1)", opacity: 0, offset: 0 },
          { opacity: 1, offset: 0.08 },
          { left: midX + "%", top: rand(56, 64) + "%", transform: "scale(.85)", offset: 0.5 },
          { left: endX + "%", top: "50%", transform: "scale(.45)", opacity: 0.75, offset: 0.93 },
          { left: endX + "%", top: "50%", transform: "scale(.2)", opacity: 0, offset: 1 },
        ]
      } else {
        const dip = rand(48, 58)
        frames = [
          { left: startX + "%", top: baseY + "%", transform: "scale(1)", opacity: 0, offset: 0 },
          { opacity: 1, offset: 0.06 },
          { left: (startX + midX) / 2 + "%", top: rand(30, 38) + "%", transform: "scale(.8)", offset: 0.32 },
          { left: midX + "%", top: dip + "%", transform: "scale(.7)", offset: 0.55 },
          { left: (midX + endX) / 2 + "%", top: rand(28, 36) + "%", transform: "scale(.6)", offset: 0.78 },
          { left: endX + "%", top: "50%", transform: "scale(.4)", opacity: 0.7, offset: 0.94 },
          { left: endX + "%", top: "50%", transform: "scale(.2)", opacity: 0, offset: 1 },
        ]
      }
      return { frames, duration: rand(4600, 7400), startX, endX, baseY }
    }

    const playersEl = playersRef.current
    const dots = playersEl
      ? [0, 1].map(() => {
          const d = document.createElement("span")
          d.className = "fc-dot"
          playersEl.appendChild(d)
          return d
        })
      : []

    let cancelled = false
    let currentAnim: Animation | null = null
    function playKick() {
      if (cancelled) return
      const { frames, duration, startX, endX, baseY } = buildPath()
      currentAnim = ball!.animate(frames, { duration, easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" })
      if (dots.length === 2) {
        dots[0].style.left = startX + "%"
        dots[0].style.top = baseY + "%"
        dots[1].style.left = endX + "%"
        dots[1].style.top = "50%"
        dots[0].animate(
          [
            { transform: "scale(.7)", opacity: 0.5 },
            { transform: "scale(1.3)", opacity: 1, offset: 0.08 },
            { transform: "scale(1)", opacity: 0.85 },
          ],
          { duration: duration * 0.18, easing: "cubic-bezier(.4,0,.2,1)" }
        )
        setTimeout(() => {
          if (cancelled) return
          dots[1].animate(
            [
              { transform: "scale(.7)", opacity: 0.5 },
              { transform: "scale(1.3)", opacity: 1, offset: 0.3 },
              { transform: "scale(1)", opacity: 0.85 },
            ],
            { duration: duration * 0.18, easing: "cubic-bezier(.4,0,.2,1)" }
          )
        }, duration * 0.82)
      }
      currentAnim.onfinish = playKick
    }
    playKick()

    return () => {
      cancelled = true
      if (currentAnim) currentAnim.onfinish = null
      dots.forEach((d) => d.remove())
    }
  }, [ballRef, playersRef])
}

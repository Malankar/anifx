import { useEffect, type RefObject } from "react"

/* Port of shared.js's .fm-strip intersection-gated video playback —
   only plays a cell's video once it's actually near the visible
   strip, pauses again once it scrolls out, to avoid the browser's
   concurrent-video-decode limits. */
export function useFilmReelVideos(stripRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const strip = stripRef.current
    if (!strip) return
    const videos = [...strip.querySelectorAll<HTMLVideoElement>(".fm-cell video")]
    if (!videos.length) return
    if (!window.IntersectionObserver) {
      videos.forEach((v) => v.play().catch(() => {}))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) (en.target as HTMLVideoElement).play().catch(() => {})
          else (en.target as HTMLVideoElement).pause()
        })
      },
      { root: strip, rootMargin: "200px" }
    )
    videos.forEach((v) => io.observe(v))
    return () => io.disconnect()
  }, [stripRef])
}

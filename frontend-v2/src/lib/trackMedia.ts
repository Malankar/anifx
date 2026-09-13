import { CONFIG, type Track } from "@/lib/config"

/* ---------- track media slot ----------
   Port of shared.js's wireTrackVideos()/wireTrackMedia(): every track
   card (index page) and track overview (event page) uses the same
   video → image → gallery → none priority, driven straight off
   CONFIG. Kept as one pure function so both call sites (EventCard,
   TrackOverview) stay in sync — same DRY intent as the original
   sharing one wiring function for both. */
export type TrackCardMedia =
  | { kind: "video"; src: string }
  | { kind: "img"; src: string; alt: string }
  | { kind: "gallery"; srcs: string[] }
  | { kind: "none" }

export function getTrackCardMedia(t: Track): TrackCardMedia {
  if (t.video) return { kind: "video", src: t.video }
  if (t.cardImage) return { kind: "img", src: t.cardImage, alt: t.name + " — event photo" }
  if (t.cardGallery && t.cardGallery.length) return { kind: "gallery", srcs: t.cardGallery }
  return { kind: "none" }
}

/* ---------- hero media slot (landing hero + each event page's own
   hero) — port of the top-of-file hero-video IIFE in shared.js. ---- */
export type HeroMedia = { src?: string; poster?: string; hasMedia: boolean }

export function getHeroMedia(track?: Track): HeroMedia {
  if (track) {
    if (track.video) return { src: track.video, hasMedia: true }
    if (track.cardImage && !track.cardImageOnly) return { poster: track.cardImage, hasMedia: true }
    return { hasMedia: false }
  }
  if (CONFIG.heroVideo) return { src: CONFIG.heroVideo, hasMedia: true }
  if (CONFIG.heroPoster) return { poster: CONFIG.heroPoster, hasMedia: true }
  return { hasMedia: false }
}

import { useEffect, useState } from "react"
import { CONFIG } from "@/lib/config"

export type CountdownState = { live: boolean; units: [string, string, string, string] | null; hidden: boolean }

/* Port of shared.js's countdown block. Re-renders the 4 unit values
   once a second; the per-digit "tick" flash is applied via CSS
   (.cd-num re-keyed each render triggers the .tick animation same as
   the original's classList dance) is left to CSS :not needed — see
   Countdown component for the visual detail. */
const FESTIVAL_START = new Date(CONFIG.festivalStart).getTime()
const INVALID_START = isNaN(FESTIVAL_START)

export function useCountdown(): CountdownState {
  const [state, setState] = useState<CountdownState>({ live: false, units: null, hidden: INVALID_START })

  useEffect(() => {
    if (INVALID_START) return
    const target = FESTIVAL_START
    function tick() {
      const diff = target - Date.now()
      if (diff <= 0) {
        setState({ live: true, units: null, hidden: false })
        return
      }
      const d = Math.floor(diff / 864e5)
      const h = Math.floor(diff / 36e5) % 24
      const m = Math.floor(diff / 6e4) % 60
      const s = Math.floor(diff / 1e3) % 60
      const pad = (n: number) => String(n).padStart(2, "0")
      setState({ live: false, units: [String(d), pad(h), pad(m), pad(s)], hidden: false })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return state
}

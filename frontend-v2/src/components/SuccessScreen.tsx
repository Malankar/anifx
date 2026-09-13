import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { CONFIG } from "@/lib/config"
import { useModal } from "@/context/ModalContext"

export function SuccessScreen() {
  const { successOpen, successTrackId, openSuccess, closeSuccess } = useModal()
  const [params, setParams] = useSearchParams()

  // Payment redirect back with ?paid=1&track=id — same gate as shared.js's checkPaid().
  useEffect(() => {
    if (params.get("paid")) openSuccess(params.get("track"))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    document.body.style.overflow = successOpen ? "hidden" : ""
  }, [successOpen])

  const track = CONFIG.tracks.find((t) => t.id === successTrackId)
  let line = track
    ? "Your " + track.name + " entry is in. We verify every payment against our account and confirm your " + (track.isTeam ? "team" : "entry") + " by email within 48 hours."
    : ""
  if (!CONFIG.whatsappLink && !CONFIG.discordLink) line += " Group links are sent to you by email."

  function dismiss() {
    closeSuccess()
    setParams((p) => {
      p.delete("paid")
      p.delete("track")
      return p
    })
  }

  return (
    <div className={"success-bg" + (successOpen ? " open" : "")} role="dialog" aria-modal="true" aria-labelledby="successTitle">
      <div className="success">
        <div className="tick" aria-hidden="true">
          ✓
        </div>
        <h2 id="successTitle">Payment received</h2>
        <p id="successLine">{line || "Your entry is in. We verify every payment against our account and confirm it by email within 48 hours."}</p>
        {CONFIG.whatsappLink && (
          <a className="join" href={CONFIG.whatsappLink} target="_blank" rel="noopener">
            Join the WhatsApp group
          </a>
        )}
        {CONFIG.discordLink && (
          <a className="join secondary" href={CONFIG.discordLink} target="_blank" rel="noopener">
            Join the Discord
          </a>
        )}
        <p className="fine">
          Match schedules go out in the group first. Missing a match because you did not join is not grounds for a reschedule. Keep your
          payment reference — if you have not received confirmation in 48 hours, email us with it.
        </p>
        <a
          className="dismiss"
          href="#"
          onClick={(e) => {
            e.preventDefault()
            dismiss()
          }}
        >
          Back to the site
        </a>
      </div>
    </div>
  )
}

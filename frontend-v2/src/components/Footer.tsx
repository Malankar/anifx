import { useRef } from "react"
import { Link } from "react-router-dom"
import { CONFIG } from "@/lib/config"
import { useModal } from "@/context/ModalContext"
import { useSelfReveal } from "@/hooks/useSelfReveal"

export function Footer() {
  const { openLegal } = useModal()
  const ref = useRef<HTMLElement>(null)
  useSelfReveal(ref, { once: false })

  return (
    <footer ref={ref}>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="foot-h">AniFX 2026</div>
            <p>23–24 October 2026</p>
            <p>School of Creative Studies</p>
            <p>DY Patil Deemed to be University</p>
            <p>Navi Mumbai, Maharashtra</p>
          </div>
          <div>
            <div className="foot-h">Contact</div>
            {CONFIG.contactEmail ? (
              <a href={"mailto:" + CONFIG.contactEmail}>{CONFIG.contactEmail}</a>
            ) : (
              <a href="#" className="todo" title="Set contactEmail in CONFIG" onClick={(e) => e.preventDefault()}>
                add contact email
              </a>
            )}
            {CONFIG.contactPhone ? (
              <a href={"tel:" + CONFIG.contactPhone.replace(/\s/g, "")}>{CONFIG.contactPhone}</a>
            ) : (
              <a href="#" className="todo" title="Set contactPhone in CONFIG" onClick={(e) => e.preventDefault()}>
                add contact number
              </a>
            )}
            <a href="https://instagram.com/dypu.socs" target="_blank" rel="noopener">
              @dypu.socs
            </a>
          </div>
          <div>
            <div className="foot-h">Competitions</div>
            <Link to="/valorant">VALORANT</Link>
            <Link to="/fc26">FC26</Link>
            <Link to="/game-jam">Game jam</Link>
            <Link to="/film-festival">Film and animation</Link>
            <Link to="/character-design">Character design</Link>
          </div>
          <div>
            <div className="foot-h">Legal</div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                openLegal("terms")
              }}
            >
              Terms and conditions
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                openLegal("refund")
              }}
            >
              Refund and cancellation
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                openLegal("privacy")
              }}
            >
              Privacy policy
            </a>
            <a href="#" className="todo" title="Required before payment onboarding" onClick={(e) => e.preventDefault()}>
              Contact us
            </a>
          </div>
        </div>
        <div className="foot-bottom">
          <span>AniFX 2026 — School of Creative Studies, DY Patil Deemed to be University</span>
          <span>Anything not covered by these rules is decided by the Tournament Director</span>
        </div>
        <p className="foot-disclaimer">
          This website and event are not associated with Riot Games or any other company. VALORANT is a trademark of Riot Games, Inc.
        </p>
      </div>
    </footer>
  )
}

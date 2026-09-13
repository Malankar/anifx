import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useModal } from "@/context/ModalContext"

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/valorant", label: "VALORANT" },
  { to: "/fc26", label: "FC26" },
  { to: "/game-jam", label: "Game Jam" },
  { to: "/film-festival", label: "Film Festival" },
  { to: "/character-design", label: "Character Design" },
]

export function Header({ scrolled }: { scrolled: boolean }) {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { openRegistration } = useModal()

  return (
    <header className={scrolled ? "scrolled" : ""}>
      <div className="wrap nav">
        <Link className="brand" to="/">
          <span className="brand-name">
            Ani<em>FX</em>
          </span>
        </Link>
        <button className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          ☰
        </button>
        <nav className={"nav-links" + (open ? " open" : "")}>
          {NAV_LINKS.map((l) => (
            <Link key={l.to} to={l.to} className={pathname === l.to ? "current" : ""} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <a
            className="nav-cta"
            href="#"
            data-open-reg
            onClick={(e) => {
              e.preventDefault()
              setOpen(false)
              openRegistration()
            }}
          >
            Register
          </a>
        </nav>
      </div>
    </header>
  )
}

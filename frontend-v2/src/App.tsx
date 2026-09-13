import { useEffect } from "react"
import { Route, Routes, useLocation } from "react-router-dom"
import { ModalProvider } from "@/context/ModalContext"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { QuickContactRail } from "@/components/QuickContactRail"
import { RegistrationModal } from "@/components/RegistrationModal"
import { LegalModal } from "@/components/LegalModal"
import { SuccessScreen } from "@/components/SuccessScreen"
import { useScrollProgress } from "@/hooks/useScrollProgress"
import { useMagneticHover } from "@/hooks/useMagneticHover"
import Home from "@/pages/Home"
import TrackPage from "@/pages/TrackPage"

// Browsers restore the last scroll position on reload/revisit by default —
// force manual restoration so every route change genuinely starts at the
// top, same intent as shared.js's history.scrollRestoration override
// (there it only ran once per full page load; here it also runs on every
// client-side route change, which is this SPA's equivalent of "a fresh
// page load").
if ("scrollRestoration" in history) history.scrollRestoration = "manual"

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  const { pathname } = useLocation()
  const { progressPct, scrolled } = useScrollProgress()
  useMagneticHover([pathname])

  return (
    <ModalProvider>
      <ScrollToTop />
      <div className="scroll-progress" style={{ width: progressPct + "%" }} aria-hidden="true" />
      <Header scrolled={scrolled} />
      <main id="top">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/valorant" element={<TrackPage trackId="valorant" />} />
          <Route path="/fc26" element={<TrackPage trackId="fc26" />} />
          <Route path="/game-jam" element={<TrackPage trackId="gamejam" />} />
          <Route path="/film-festival" element={<TrackPage trackId="film" />} />
          <Route path="/character-design" element={<TrackPage trackId="character" />} />
        </Routes>
      </main>
      <Footer />
      <SuccessScreen />
      <RegistrationModal />
      <LegalModal />
      <QuickContactRail />
    </ModalProvider>
  )
}

import { createContext, useContext, useState, type ReactNode } from "react"

/* Global modal state — replaces shared.js's document-level click
   delegation on [data-open-reg] / [data-open-legal] with plain
   context + onClick handlers, the idiomatic React equivalent. */

type ModalState = {
  regOpen: boolean
  regTrackId: string | null
  regLocked: boolean
  legalOpen: boolean
  legalKey: string | null
  successOpen: boolean
  successTrackId: string | null
  openRegistration: (trackId?: string | null, locked?: boolean) => void
  closeRegistration: () => void
  openLegal: (key: string) => void
  closeLegal: () => void
  openSuccess: (trackId: string | null) => void
  closeSuccess: () => void
}

const ModalContext = createContext<ModalState | null>(null)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [regOpen, setRegOpen] = useState(false)
  const [regTrackId, setRegTrackId] = useState<string | null>(null)
  const [regLocked, setRegLocked] = useState(false)
  const [legalOpen, setLegalOpen] = useState(false)
  const [legalKey, setLegalKey] = useState<string | null>(null)
  const [successOpen, setSuccessOpen] = useState(false)
  const [successTrackId, setSuccessTrackId] = useState<string | null>(null)

  const value: ModalState = {
    regOpen,
    regTrackId,
    regLocked,
    legalOpen,
    legalKey,
    successOpen,
    successTrackId,
    openRegistration(trackId, locked) {
      setRegTrackId(trackId ?? null)
      setRegLocked(!!locked)
      setRegOpen(true)
    },
    closeRegistration() {
      setRegOpen(false)
    },
    openLegal(key) {
      setLegalKey(key)
      setLegalOpen(true)
    },
    closeLegal() {
      setLegalOpen(false)
    },
    openSuccess(trackId) {
      setSuccessTrackId(trackId)
      setSuccessOpen(true)
    },
    closeSuccess() {
      setSuccessOpen(false)
    },
  }

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
}

// Small context module — splitting the hook into its own file isn't worth it here.
// eslint-disable-next-line react-refresh/only-export-components
export function useModal() {
  const ctx = useContext(ModalContext)
  if (!ctx) throw new Error("useModal must be used within ModalProvider")
  return ctx
}

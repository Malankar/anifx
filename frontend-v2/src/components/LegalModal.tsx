import { LEGAL } from "@/lib/legal"
import { useModal } from "@/context/ModalContext"

export function LegalModal() {
  const { legalOpen, legalKey, closeLegal } = useModal()
  const entry = legalKey ? LEGAL[legalKey] : null

  return (
    <div className={"modal-bg" + (legalOpen ? " open" : "")} role="dialog" aria-modal="true" aria-labelledby="legalTitle">
      <div className="modal">
        <div className="modal-head">
          <h3 id="legalTitle">{entry?.title || "Legal"}</h3>
          <button className="modal-x" aria-label="Close" onClick={closeLegal}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="legal-body" dangerouslySetInnerHTML={{ __html: entry?.body || "" }} />
        </div>
      </div>
    </div>
  )
}

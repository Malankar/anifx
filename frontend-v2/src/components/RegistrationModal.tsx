import { useEffect, useRef, useState } from "react"
import { CONFIG, type Track } from "@/lib/config"
import { useModal } from "@/context/ModalContext"

/* ---------- registration gate ----------
   Port of shared.js's trackState(): no slot-capacity check — every
   track accepts entries until its closesAt date passes or it's
   explicitly closed (open:false). */
function trackState(t: Track) {
  if (t.open === false) return { open: false, why: "closed" as const }
  if (t.closesAt && Date.now() > new Date(t.closesAt).getTime()) return { open: false, why: "passed" as const }
  return { open: true, why: "open" as const }
}

type Msg = { text: string; kind: "" | "ok" | "err" }

export function RegistrationModal() {
  const { regOpen, regTrackId, regLocked, closeRegistration, openSuccess } = useModal()

  const [trackId, setTrackId] = useState(regTrackId || CONFIG.tracks[0].id)
  const [feeTier, setFeeTier] = useState<string>("")
  const [step, setStep] = useState<1 | 2>(1)
  const [cdropOpen, setCdropOpen] = useState(false)
  const [msg, setMsg] = useState<Msg>({ text: "", kind: "" })
  const [submitting, setSubmitting] = useState(false)
  const [teamName, setTeamName] = useState("")
  const [captainName, setCaptainName] = useState("")
  const [phone, setPhone] = useState("")
  const [roster, setRoster] = useState("")

  const fEmail = useRef<HTMLInputElement>(null)
  const fAge = useRef<HTMLInputElement>(null)
  const fClassYear = useRef<HTMLInputElement>(null)
  const fBoard = useRef<HTMLInputElement>(null)
  const fCollege = useRef<HTMLInputElement>(null)
  const fAddress = useRef<HTMLTextAreaElement>(null)
  const fAgree = useRef<HTMLInputElement>(null)
  const fTeam = useRef<HTMLInputElement>(null)
  const fCaptain = useRef<HTMLInputElement>(null)
  const fPhone = useRef<HTMLInputElement>(null)
  const fRoster = useRef<HTMLTextAreaElement>(null)
  const fTxnId = useRef<HTMLInputElement>(null)
  const fPayScreenshot = useRef<HTMLInputElement>(null)
  const cdropRef = useRef<HTMLDivElement>(null)

  const track = CONFIG.tracks.find((t) => t.id === trackId) || CONFIG.tracks[0]
  const st = trackState(track)
  const isTeam = !!track.isTeam
  const lead = track.leadLabel || ""
  const tier = track.feeTiers ? track.feeTiers.find((x) => x.key === feeTier) || track.feeTiers[0] : null
  const fee = track.feeTiers ? tier!.amount : track.fee
  const feeLabel = track.feeTiers ? "Entry fee" : track.feeNote || "Entry fee"
  const needsPayStep = st.open && fee > 0
  const wantsRoster = !!track.rosterLabel && isTeam
  const rosterRequired = wantsRoster && !!track.rosterRequired
  const rosterCount = roster
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean).length

  // Reopening the modal (or switching track) always starts at step 1 —
  // a half-paid step 2 for a track you just left makes no sense.
  useEffect(() => {
    if (!regOpen) return
    const initial = regTrackId || track.id
    // Resetting the form's own local state to match how the modal was
    // just opened (not syncing with an external system), so this is
    // deliberately excluded from react-hooks/set-state-in-effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTrackId(initial)
    const t = CONFIG.tracks.find((x) => x.id === initial) || CONFIG.tracks[0]
    setFeeTier(t.feeTiers ? t.feeTiers[0].key : "")
    setStep(1)
    setMsg({ text: "", kind: "" })
    const id = setTimeout(() => fTeam.current?.focus(), 60)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regOpen, regTrackId])

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (cdropRef.current && !cdropRef.current.contains(e.target as Node)) setCdropOpen(false)
    }
    function onDocKey(e: KeyboardEvent) {
      if (e.key === "Escape") setCdropOpen(false)
    }
    document.addEventListener("click", onDocClick)
    document.addEventListener("keydown", onDocKey)
    return () => {
      document.removeEventListener("click", onDocClick)
      document.removeEventListener("keydown", onDocKey)
    }
  }, [])

  function selectTrack(id: string) {
    setTrackId(id)
    const t = CONFIG.tracks.find((x) => x.id === id) || CONFIG.tracks[0]
    setFeeTier(t.feeTiers ? t.feeTiers[0].key : "")
    setStep(1)
    setMsg({ text: "", kind: "" })
    setCdropOpen(false)
  }

  function flagField(el: HTMLElement | null) {
    if (!el) return
    document.querySelectorAll(".field-invalid").forEach((f) => f.classList.remove("field-invalid"))
    const wrap = el.closest(".field") || el.closest(".checkline") || el
    wrap.classList.add("field-invalid")
    el.scrollIntoView({ block: "center", behavior: "smooth" })
    ;(el as HTMLInputElement).focus?.({ preventScroll: true })
    const clear = () => {
      wrap.classList.remove("field-invalid")
      el.removeEventListener("input", clear)
      el.removeEventListener("change", clear)
    }
    el.addEventListener("input", clear)
    el.addEventListener("change", clear)
  }

  function fieldProblem(): { el: HTMLElement; msg: string } | null {
    const leadWord = isTeam ? (lead || "lead").toLowerCase() : "your"
    if (isTeam && !fTeam.current?.checkValidity())
      return { el: fTeam.current!, msg: "Enter a team name." }
    if (!fCaptain.current?.checkValidity())
      return { el: fCaptain.current!, msg: "Enter " + leadWord + (isTeam ? "'s" : "") + " full name." }
    if (!fPhone.current?.checkValidity())
      return { el: fPhone.current!, msg: "Enter " + leadWord + (isTeam ? "'s" : "") + " WhatsApp number." }
    if (!fEmail.current?.checkValidity()) return { el: fEmail.current!, msg: "Enter a valid email address." }
    if (!fCollege.current?.checkValidity())
      return { el: fCollege.current!, msg: "Enter your college or institution." }
    if (!fAge.current?.checkValidity()) {
      const av = fAge.current!.validity
      const ageMsg = av.rangeUnderflow
        ? "Age must be at least " + fAge.current!.min + "."
        : av.rangeOverflow
          ? "Age must be " + fAge.current!.max + " or under."
          : "Enter your age."
      return { el: fAge.current!, msg: ageMsg }
    }
    if (!fClassYear.current?.checkValidity())
      return { el: fClassYear.current!, msg: "Enter your class, year or graduation status." }
    if (!fAddress.current?.checkValidity()) return { el: fAddress.current!, msg: "Enter your address." }
    if (rosterRequired && !fRoster.current?.checkValidity())
      return { el: fRoster.current!, msg: "Add your " + (track.rosterLabel || "").toLowerCase() + "." }
    if (!fAgree.current?.checked) return { el: fAgree.current!, msg: "Please confirm you have read the rules." }
    return null
  }

  function payFieldProblem(): { el: HTMLElement; msg: string } | null {
    if (!fTxnId.current?.checkValidity())
      return { el: fTxnId.current!, msg: "Enter your transaction ID / UTR." }
    if (!fPayScreenshot.current?.checkValidity())
      return { el: fPayScreenshot.current!, msg: "Attach a screenshot of your payment." }
    return null
  }

  function handleNext() {
    const problem = fieldProblem()
    if (problem) {
      setMsg({ text: problem.msg, kind: "err" })
      flagField(problem.el)
      return
    }
    let p = phone.replace(/\D/g, "")
    if (p.length === 12 && p.startsWith("91")) p = p.slice(2)
    if (p.length < 10) {
      setMsg({ text: "Enter a valid 10-digit WhatsApp number.", kind: "err" })
      flagField(fPhone.current)
      return
    }
    if (needsPayStep) {
      setStep(2)
      setMsg({ text: "", kind: "" })
      setTimeout(() => fTxnId.current?.focus(), 60)
    } else {
      doSubmit()
    }
  }

  function handleBack() {
    setStep(1)
    setMsg({ text: "", kind: "" })
  }

  async function doSubmit() {
    let p = phone.replace(/\D/g, "")
    if (p.length === 12 && p.startsWith("91")) p = p.slice(2)

    if (!CONFIG.sheetEndpoint) {
      setMsg({ text: "We can't take entries yet. Follow @" + CONFIG.instagram + " — registration opens shortly.", kind: "err" })
      return
    }
    if (!st.open) {
      setMsg({ text: "Registration for " + track.name + " is closed.", kind: "err" })
      return
    }

    const paid = needsPayStep
    const screenshotFile = paid ? fPayScreenshot.current?.files?.[0] || null : null

    setSubmitting(true)

    let screenshotBase64 = ""
    if (screenshotFile) {
      try {
        screenshotBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve((reader.result as string).split(",")[1] || "")
          reader.onerror = reject
          reader.readAsDataURL(screenshotFile)
        })
      } catch {
        setMsg({ text: "Couldn't read that screenshot. Try a different file.", kind: "err" })
        setSubmitting(false)
        return
      }
    }

    const payload = {
      track: track.name,
      trackId: track.id,
      fee,
      teamName: isTeam ? teamName.trim() : "",
      leadRole: isTeam ? lead : "Solo entrant",
      registrantName: captainName.trim(),
      registrantPhone: p,
      registrantEmail: fEmail.current?.value.trim() || "",
      college: fCollege.current?.value.trim() || "",
      age: fAge.current?.value.trim() || "",
      classYear: fClassYear.current?.value.trim() || "",
      board: fBoard.current?.value.trim() || "",
      address: fAddress.current?.value.trim() || "",
      roster: isTeam ? roster.trim() : "",
      txnId: paid ? fTxnId.current?.value.trim() || "" : "",
      paymentScreenshotName: screenshotFile ? screenshotFile.name : "",
      paymentScreenshotType: screenshotFile ? screenshotFile.type : "",
      paymentScreenshotBase64: screenshotBase64,
      submittedAt: new Date().toISOString(),
    }

    try {
      await fetch(CONFIG.sheetEndpoint, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      })

      setTeamName("")
      setCaptainName("")
      setPhone("")
      setRoster("")
      if (fEmail.current) fEmail.current.value = ""
      if (fAge.current) fAge.current.value = ""
      if (fClassYear.current) fClassYear.current.value = ""
      if (fBoard.current) fBoard.current.value = ""
      if (fCollege.current) fCollege.current.value = ""
      if (fAddress.current) fAddress.current.value = ""
      if (fAgree.current) fAgree.current.checked = false
      if (fTxnId.current) fTxnId.current.value = ""
      if (fPayScreenshot.current) fPayScreenshot.current.value = ""

      if (paid) {
        setMsg({ text: "Payment reference received. Your slot is confirmed once we verify it — usually under 48 hours.", kind: "ok" })
      } else {
        setMsg({ text: "Entry saved. Check your email — we've sent your entry ID.", kind: "ok" })
      }
      setTimeout(() => {
        closeRegistration()
        setSubmitting(false)
        openSuccess(track.id)
      }, 1600)
    } catch {
      setMsg({ text: "We couldn't save that. Check your connection and try again, or email us directly.", kind: "err" })
      setSubmitting(false)
    }
  }

  const nextLabel = !st.open ? "Registration closed" : fee > 0 ? "Proceed to Pay" : "Submit entry"
  const btnDisabled = !st.open || submitting

  return (
    <div className={"modal-bg" + (regOpen ? " open" : "")} role="dialog" aria-modal="true" aria-labelledby="regTitle">
      <div className="modal">
        <div className="modal-head">
          <h3 id="regTitle">Register</h3>
          <button className="modal-x" aria-label="Close" onClick={closeRegistration}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault()
              const problem = payFieldProblem()
              if (problem) {
                setMsg({ text: problem.msg, kind: "err" })
                flagField(problem.el)
                return
              }
              doSubmit()
            }}
          >
            <div className="form-step" hidden={step !== 1}>
              <div className="field">
                <label htmlFor="fTrack">Competition</label>
                {!regLocked ? (
                  <div className={"cdrop" + (cdropOpen ? " open" : "")} ref={cdropRef}>
                    <button
                      type="button"
                      className="cdrop-btn"
                      aria-haspopup="listbox"
                      aria-expanded={cdropOpen}
                      onClick={() => setCdropOpen((v) => !v)}
                    >
                      {track.name}
                    </button>
                    <ul className="cdrop-list" role="listbox" hidden={!cdropOpen}>
                      {CONFIG.tracks.map((t) => (
                        <li
                          key={t.id}
                          className={"cdrop-opt" + (t.id === trackId ? " active" : "")}
                          role="option"
                          aria-selected={t.id === trackId}
                          onClick={() => selectTrack(t.id)}
                        >
                          {t.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="track-locked">{track.name}</div>
                )}
                <select id="fTrack" name="track" required hidden value={trackId} onChange={() => {}} tabIndex={-1}>
                  {CONFIG.tracks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {track.feeTiers && (
                <div className="field">
                  {track.feeTiers.map((tr, i) => (
                    <label className="checkline" key={tr.key}>
                      <input
                        type="radio"
                        name="feeTier"
                        value={tr.key}
                        checked={feeTier === tr.key || (!feeTier && i === 0)}
                        onChange={() => setFeeTier(tr.key)}
                      />
                      <span>{tr.label}</span>
                    </label>
                  ))}
                </div>
              )}

              <div className="fee-line">
                <span id="feeLabel">{feeLabel}</span>
                <b id="feeAmount">{fee ? "₹" + fee.toLocaleString("en-IN") : "Free"}</b>
              </div>

              {isTeam && (
                <div className="field">
                  <label htmlFor="fTeam">Team name</label>
                  <input
                    ref={fTeam}
                    id="fTeam"
                    name="teamName"
                    maxLength={40}
                    pattern="[A-Za-z0-9 ]+"
                    title="Letters and numbers only"
                    autoComplete="off"
                    required={isTeam}
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value.replace(/[^A-Za-z0-9 ]/g, ""))}
                  />
                </div>
              )}
              {!isTeam && (
                <input ref={fTeam} id="fTeam" name="teamName" hidden value="" readOnly />
              )}

              <div className="field">
                <label htmlFor="fCaptain">{isTeam ? lead + " — full name" : "Student name — full name"}</label>
                <input
                  ref={fCaptain}
                  id="fCaptain"
                  name="registrantName"
                  required
                  maxLength={60}
                  pattern="[A-Za-z .'-]+"
                  title="Letters only"
                  autoComplete="name"
                  value={captainName}
                  onChange={(e) => setCaptainName(e.target.value.replace(/[^A-Za-z .'-]/g, ""))}
                />
              </div>

              <div className="field">
                <label htmlFor="fPhone">{isTeam ? lead + " WhatsApp number" : "WhatsApp number"}</label>
                <input
                  ref={fPhone}
                  id="fPhone"
                  name="registrantPhone"
                  type="tel"
                  required
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  placeholder="10 digits"
                  title="10 digit phone number, numbers only"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))}
                />
              </div>

              <div className="field">
                <label htmlFor="fEmail">{isTeam ? lead + " email" : "Email"}</label>
                <input ref={fEmail} id="fEmail" name="registrantEmail" type="email" required maxLength={80} autoComplete="email" />
              </div>

              <div className="field">
                <label htmlFor="fAge">Age</label>
                <input ref={fAge} id="fAge" name="age" type="number" required min={15} max={99} inputMode="numeric" autoComplete="off" />
              </div>

              <div className="field">
                <label htmlFor="fClassYear">Class / year / graduation</label>
                <input
                  ref={fClassYear}
                  id="fClassYear"
                  name="classYear"
                  required
                  maxLength={40}
                  placeholder="e.g. 12th, or B.Des Year 2"
                  autoComplete="off"
                />
              </div>

              <div className="field">
                <label htmlFor="fBoard">Board (e.g. CBSE) — if applicable</label>
                <input ref={fBoard} id="fBoard" name="board" maxLength={40} autoComplete="off" />
              </div>

              <div className="field">
                <label htmlFor="fCollege">College / institution</label>
                <input ref={fCollege} id="fCollege" name="college" required autoComplete="organization" />
              </div>

              <div className="field">
                <label htmlFor="fAddress">Address</label>
                <textarea ref={fAddress} id="fAddress" name="address" required />
              </div>

              {wantsRoster && (
                <div className="field">
                  <label htmlFor="fRoster">{track.rosterLabel}</label>
                  <textarea
                    ref={fRoster}
                    id="fRoster"
                    name="roster"
                    required={rosterRequired}
                    placeholder={track.rosterPlaceholder || ""}
                    value={roster}
                    onChange={(e) => setRoster(e.target.value)}
                  />
                  <p className="hint">{track.rosterHint}</p>
                  <p className="hint">{rosterCount === 0 ? "" : rosterCount + " line" + (rosterCount === 1 ? "" : "s") + " entered"}</p>
                </div>
              )}

              <label className="checkline">
                <input ref={fAgree} type="checkbox" required />
                <span>
                  I have read the rules for this competition. All listed players are enrolled students and their details are correct.
                  Incorrect details may result in forfeit.
                </span>
              </label>

              <button type="button" className="btn btn-primary" disabled={btnDisabled} onClick={handleNext}>
                {nextLabel}
              </button>
            </div>

            <div className="form-step" hidden={step !== 2}>
              <button type="button" className="step-back" onClick={handleBack}>
                ← Back
              </button>
              <div className="pay-qr-big">
                <img src="/payment-qr.png" alt="DY Patil University payment QR — scan with any UPI app to pay" />
                <p>Scan to pay via UPI/BHIM, RuPay, Visa or Mastercard. Merchant: D Y Patil University Scho. Keep your reference — you'll need it below.</p>
              </div>

              <div className="field">
                <label htmlFor="fTxnId">Transaction ID / UTR</label>
                <input ref={fTxnId} id="fTxnId" name="txnId" required placeholder="e.g. 402911223344" autoComplete="off" />
              </div>

              <div className="field file-field">
                <label htmlFor="fPayScreenshot">Payment screenshot</label>
                <input ref={fPayScreenshot} id="fPayScreenshot" name="paymentScreenshot" type="file" accept="image/*" required />
              </div>

              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Saving your entry…" : "Submit"}
              </button>
            </div>

            <div className={"form-msg" + (msg.text ? " show " + msg.kind : "")}>{msg.text}</div>
          </form>
        </div>
      </div>
    </div>
  )
}

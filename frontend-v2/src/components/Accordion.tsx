import { useState, type ReactNode } from "react"

/* Port of shared.js's .acc / .acc-btn accordion behavior — each item
   owns its own open state instead of a global classList toggle. */
export function AccordionItem({ q, children }: { q: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={"acc" + (open ? " open" : "")} data-acc>
      <button className="acc-btn" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span className="acc-q">{q}</span>
        <span className="acc-sign">+</span>
      </button>
      <div className="acc-body">{children}</div>
    </div>
  )
}

export function FaqAccordion({ faq }: { faq: { q: string; a: string }[] }) {
  return (
    <div className="rules-wrap">
      {faq.map((f) => (
        <AccordionItem q={f.q} key={f.q}>
          <p className="muted">{f.a}</p>
        </AccordionItem>
      ))}
    </div>
  )
}

export function RulesAccordion({
  rules,
}: {
  rules: { q: string; items: string[]; warn?: string }[]
}) {
  return (
    <div className="rules-wrap">
      {rules.map((r) => (
        <AccordionItem q={r.q} key={r.q}>
          <ul>
            {r.items.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
          {r.warn && <div className="warn">{r.warn}</div>}
        </AccordionItem>
      ))}
    </div>
  )
}

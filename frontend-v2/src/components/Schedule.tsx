import { CONFIG } from "@/lib/config"

/* ---------- on-campus schedule ----------
   Port of shared.js's #sched block. Landing page shows the full
   weekend (no trackName); a track page shows only rows whose title
   mentions that track's name. */
export function Schedule({ trackName }: { trackName?: string }) {
  const nameMatch = trackName
  const days = (CONFIG.schedule || [])
    .map((day) => {
      const items = nameMatch
        ? day.items.filter((it) => it.title.toLowerCase().includes(nameMatch.toLowerCase().split(" ")[0]))
        : day.items
      return { day: day.day, items }
    })
    .filter((d) => d.items.length)

  return (
    <>
      {nameMatch && !days.length ? (
        <div className="sched">
          <div className="empty-card">Schedule for this event is not published yet — check the On Campus page once the draw is out.</div>
        </div>
      ) : (
        <div className="sched">
          {days.map((day) => (
            <div className="sched-day" key={day.day}>
              <h3>{day.day}</h3>
              {day.items.map((it, i) => (
                <div className={"slot-row" + (it.feature ? " feature" : "")} key={i}>
                  <span className="sr-time">{it.time}</span>
                  <span>
                    <span className="sr-title">{it.title}</span>
                    {it.where && <span className="sr-where">{it.where}</span>}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      <p className="sched-note">{CONFIG.scheduleNote || ""}</p>
    </>
  )
}

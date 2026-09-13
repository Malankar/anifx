import { Link } from "react-router-dom";
import { TRACKS } from "@/lib/tracks";
import { SCHEDULE, SCHEDULE_NOTE, FAQ } from "@/lib/schedule";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Section order/copy mirrors frontend/index.html 1:1: hero, brand break,
// event navigator, stats strip, on-campus schedule, FAQ, footer.
export function Home() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section
        className="relative flex items-center overflow-hidden"
        style={{ minHeight: "min(88vh, 860px)" }}
      >
        <img
          src="/anifx-banner.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-24">
          <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1 font-heading text-xs uppercase tracking-widest text-muted-foreground">
            <span>
              <strong className="text-foreground">23–24 October 2026</strong>
            </span>
            <span>School of Creative Studies, DY Patil Deemed to be University, Navi Mumbai</span>
          </div>

          <h1 className="font-heading text-6xl font-black uppercase tracking-tight sm:text-8xl">
            AniFX <span className="text-primary">26</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Five competitions. One weekend. One campus. Bring something that works.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="font-heading uppercase tracking-wide">
              <a href="#events">Explore the events</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-heading uppercase tracking-wide">
              <Link to="/events">Register your team</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ============ BRAND BREAK ============ */}
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <p className="font-heading text-4xl font-black uppercase leading-tight sm:text-6xl">
          Five Events.
          <br />
          One Festival.
        </p>
        <p className="mt-4 font-heading text-xs uppercase tracking-[0.2em] text-muted-foreground">
          VALORANT — FC26 — GAME JAM — FILM &amp; ANIMATION — CHARACTER DESIGN
        </p>
      </div>

      {/* ============ EVENT NAVIGATOR ============ */}
      <section id="events" className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 max-w-xl">
          <h2 className="font-heading text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
            Pick your event
          </h2>
          <p className="mt-2 text-muted-foreground">
            Every rule, fee, deadline and tiebreak lives on that event's own page. Nothing gets
            decided on the day.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TRACKS.map((t) => (
            <Link key={t.id} to={`/events/${t.slug}`}>
              <Card className="group h-full overflow-hidden transition-colors hover:border-primary">
                {t.cardImage && (
                  <div className="h-36 w-full overflow-hidden">
                    <img
                      src={`/${t.cardImage}`}
                      alt=""
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                )}
                <CardContent className="space-y-2 pt-4">
                  <h3 className="font-heading text-xl font-bold uppercase tracking-tight">
                    {t.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{t.format}</p>
                  <Badge variant="secondary" className="font-heading uppercase tracking-wide">
                    {t.feeNote}
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ STATS STRIP ============ */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="font-heading text-5xl font-black text-primary">5</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Competitions: VALORANT, FC26, a 100-hour game jam, a film and animation showcase,
              and character design.
            </p>
          </div>
          <div>
            <div className="font-heading text-5xl font-black text-primary">2</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Days on campus, Friday 23 and Saturday 24 October — competitions and prize
              distribution.
            </p>
          </div>
          <div>
            <div className="font-heading text-5xl font-black text-primary">100</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Hours to design, build and ship an original side-scroller. Online, from anywhere.
            </p>
          </div>
        </div>
      </section>

      {/* ============ ON CAMPUS ============ */}
      <section id="campus" className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 max-w-xl">
          <h2 className="font-heading text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
            On campus
          </h2>
          <p className="mt-2 text-muted-foreground">
            Everything that happens in person across the festival weekend at the Centre of
            Excellence, DY Patil Deemed to be University, Navi Mumbai.
          </p>
        </div>
        <div className="space-y-8">
          {SCHEDULE.map((day) => (
            <div key={day.day}>
              <h3 className="mb-3 font-heading text-sm font-bold uppercase tracking-widest text-muted-foreground">
                {day.day}
              </h3>
              <div className="divide-y divide-border rounded-md border border-border">
                {day.items.map((item) => (
                  <div key={item.title} className="flex items-center gap-4 px-4 py-3">
                    <span className="font-heading text-sm text-muted-foreground">{item.time}</span>
                    <span className={item.feature ? "font-semibold text-primary" : ""}>
                      {item.title}
                    </span>
                    <span className="ml-auto text-sm text-muted-foreground">{item.where}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">{SCHEDULE_NOTE}</p>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 max-w-xl">
          <h2 className="font-heading text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
            Frequently asked
          </h2>
          <p className="mt-2 text-muted-foreground">
            The short answers. For rules specific to your event, visit that event's own page.
          </p>
        </div>
        <Accordion type="single" collapsible className="max-w-3xl">
          {FAQ.map((section) => (
            <AccordionItem key={section.q} value={section.q}>
              <AccordionTrigger className="font-heading text-left uppercase tracking-wide">
                {section.q}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </>
  );
}

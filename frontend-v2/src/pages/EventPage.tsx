import { useState, type CSSProperties } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getTrackBySlug } from "@/lib/tracks";
import { SCHEDULE, SCHEDULE_NOTE } from "@/lib/schedule";
import { RegistrationForm } from "@/components/RegistrationForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Mirrors the old frontend/<event>.html page: event hero (eyebrow, title,
// subtitle, pill facts, CTAs) + a content-tabs section (Overview / Rules /
// Schedule / FAQ), same as every one of valorant.html, fc26.html,
// game-jam.html, film-festival.html, character-design.html. Registration
// is a modal, same as the old site's #regModal, not an inline form.
export function EventPage() {
  const { slug } = useParams();
  const track = slug ? getTrackBySlug(slug) : undefined;
  const [regOpen, setRegOpen] = useState(false);

  if (!track) return <Navigate to="/events" replace />;

  // Per-track accent, ported from shared.css [data-track="..."] — scoped
  // to this page only via a CSS variable override, same idea as the old
  // site's data-track attribute switching --accent.
  const accentStyle = { "--primary": track.accent, "--ring": track.accent } as CSSProperties;

  return (
    <div style={accentStyle}>
      {/* ============ EVENT HERO ============ */}
      <section className="relative overflow-hidden border-b border-border">
        {track.cardImage && (
          <>
            <img
              src={`/${track.cardImage}`}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
          </>
        )}
        <div className="relative mx-auto max-w-6xl px-4 py-20">
          <div className="mb-4 font-heading text-xs uppercase tracking-widest text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              AniFX 2026
            </Link>{" "}
            <span className="mx-1">—</span> <span>{track.name}</span>
          </div>

          <h1 className="font-heading text-5xl font-black uppercase tracking-tight text-primary sm:text-7xl">
            {track.name}
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{track.format}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" className="font-heading uppercase tracking-wide" onClick={() => setRegOpen(true)}>
              Register your {track.isTeam ? "team" : "entry"}
            </Button>
            <Button asChild size="lg" variant="outline" className="font-heading uppercase tracking-wide">
              <a href="#rules">Read the rules</a>
            </Button>
          </div>

          <dl className="mt-10 flex flex-wrap gap-6">
            {track.facts.slice(0, 4).map(([k, v]) => (
              <div key={k}>
                <dt className="font-heading text-xs uppercase tracking-widest text-muted-foreground">
                  {k}
                </dt>
                <dd className="mt-1 font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ============ CONTENT TABS ============ */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="rules">Rules</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="max-w-2xl space-y-4 pt-6">
            <p>{track.blurb}</p>
            <p className="text-sm text-muted-foreground">{track.eligibility}</p>
          </TabsContent>

          <TabsContent value="rules" id="rules" className="max-w-2xl pt-6">
            <ul className="list-disc space-y-3 pl-5 text-sm">
              {track.rules.map((r, i) => (
                // Static, hand-authored copy from lib/tracks.ts, not user input.
                <li key={i} dangerouslySetInnerHTML={{ __html: r }} />
              ))}
            </ul>
            {track.warn && (
              <p className="mt-4 rounded-md border border-primary/40 bg-primary/10 p-3 text-sm text-primary">
                {track.warn}
              </p>
            )}
          </TabsContent>

          <TabsContent value="schedule" className="max-w-2xl pt-6">
            <div className="space-y-6">
              {SCHEDULE.map((day) => (
                <div key={day.day}>
                  <h3 className="mb-2 font-heading text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    {day.day}
                  </h3>
                  <div className="divide-y divide-border rounded-md border border-border">
                    {day.items.map((item) => (
                      <div key={item.title} className="flex items-center gap-4 px-4 py-3 text-sm">
                        <span className="font-heading text-muted-foreground">{item.time}</span>
                        <span>{item.title}</span>
                        <span className="ml-auto text-muted-foreground">{item.where}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{SCHEDULE_NOTE}</p>
          </TabsContent>

          <TabsContent value="faq" className="max-w-2xl pt-6 text-sm text-muted-foreground">
            <p>
              General FAQ (payment, refunds, conduct) is on the{" "}
              <Link to="/#faq" className="text-foreground underline">
                home page
              </Link>
              .
            </p>
          </TabsContent>
        </Tabs>
      </section>

      {/* ============ REGISTRATION MODAL ============ */}
      <Dialog open={regOpen} onOpenChange={setRegOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading uppercase tracking-wide">Register</DialogTitle>
          </DialogHeader>
          <RegistrationForm track={track} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { Link } from "react-router-dom";
import { TRACKS } from "@/lib/tracks";

// Same structure/copy as frontend/index.html's <footer>.
export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="font-heading text-base font-bold uppercase text-foreground">
              AniFX 2026
            </div>
            <p>23–24 October 2026</p>
            <p>School of Creative Studies</p>
            <p>DY Patil Deemed to be University</p>
            <p>Navi Mumbai, Maharashtra</p>
          </div>

          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <div className="font-heading text-base font-bold uppercase text-foreground">
              Contact
            </div>
            <a
              href="https://instagram.com/dypu.socs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              @dypu.socs
            </a>
          </div>

          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <div className="font-heading text-base font-bold uppercase text-foreground">
              Competitions
            </div>
            {TRACKS.map((t) => (
              <Link key={t.id} to={`/events/${t.slug}`} className="hover:text-foreground">
                {t.name}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <div className="font-heading text-base font-bold uppercase text-foreground">Legal</div>
            <span>Terms and conditions</span>
            <span>Refund and cancellation</span>
            <span>Privacy policy</span>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-1 border-t border-border pt-6 text-xs text-muted-foreground">
          <span>AniFX 2026 — School of Creative Studies, DY Patil Deemed to be University</span>
          <span>Anything not covered by these rules is decided by the Tournament Director</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          This website and event are not associated with Riot Games or any other company.
          VALORANT is a trademark of Riot Games, Inc.
        </p>
      </div>
    </footer>
  );
}

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { TRACKS } from "@/lib/tracks";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

// Same nav shape as the old frontend/index.html header — brand mark, one
// link per event, then Register. Only change from the old site: "On
// campus" + "FAQ" are replaced with "Home" (both those sections still
// live on the home page, just not in the header anymore).
export function Header() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const navLinks = (
    <>
      <Link to="/" className="hover:text-primary">
        Home
      </Link>
      {TRACKS.map((t) => (
        <Link key={t.id} to={`/events/${t.slug}`} className="hover:text-primary">
          {t.name}
        </Link>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="font-heading text-2xl font-black tracking-tight">
          Ani<em className="not-italic text-primary">FX</em>
        </Link>

        <nav className="hidden items-center gap-6 font-heading text-sm font-semibold uppercase tracking-wide md:flex">
          {navLinks}
        </nav>

        <div className="flex items-center gap-3">
          <Button
            className="hidden font-heading uppercase tracking-wide sm:inline-flex"
            onClick={() => navigate("/events")}
          >
            Register
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {(user.displayName || user.email || "?").slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => navigate("/dashboard")}>
                  Dashboard
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onSelect={() => navigate("/admin")}>Admin</DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={async () => {
                    await signOut();
                    navigate("/");
                  }}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
              Log in
            </Button>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="mt-10 flex flex-col gap-4 px-4 font-heading text-lg font-semibold uppercase">
                {navLinks}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

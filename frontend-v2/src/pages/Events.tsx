import { Link } from "react-router-dom";
import { TRACKS } from "@/lib/tracks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function Events() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-extrabold tracking-tight">Events</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TRACKS.map((t) => (
          <Card key={t.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{t.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{t.format}</p>
                <p className="mt-2 text-sm font-medium">{t.feeNote}</p>
              </div>
              <Button asChild size="sm">
                <Link to={`/events/${t.slug}`}>View & register</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

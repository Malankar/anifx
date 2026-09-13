import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { watchMyRegistrations, type Registration } from "@/lib/registrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const STATUS_LABEL: Record<Registration["status"], string> = {
  pending_payment: "Payment pending",
  awaiting_verification: "Awaiting verification",
  verified: "Confirmed",
  waitlist: "Waitlist",
  free_confirmed: "Confirmed — free entry",
};

const STATUS_VARIANT: Record<Registration["status"], "default" | "secondary" | "destructive"> = {
  pending_payment: "destructive",
  awaiting_verification: "secondary",
  verified: "default",
  waitlist: "secondary",
  free_confirmed: "default",
};

export function Dashboard() {
  const { user } = useAuth();
  const [regs, setRegs] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsub = watchMyRegistrations(user.uid, (r) => {
      setRegs(r);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-1 text-3xl font-extrabold tracking-tight">
        Hi, {user?.displayName || user?.email}
      </h1>
      <p className="mb-8 text-muted-foreground">Events you've registered for.</p>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : regs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <p className="text-muted-foreground">You haven't registered for any event yet.</p>
            <Button asChild>
              <Link to="/events">Browse events</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {regs.map((r) => (
            <Card key={r.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">{r.trackName}</CardTitle>
                <Badge variant={STATUS_VARIANT[r.status]}>{STATUS_LABEL[r.status]}</Badge>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-muted-foreground">
                {r.teamName && <p>Team: {r.teamName}</p>}
                <p>Entrant: {r.registrantName}</p>
                <p>Fee: {r.fee ? `₹${r.fee}` : "Free"}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

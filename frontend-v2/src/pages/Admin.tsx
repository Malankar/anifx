import { useEffect, useState } from "react";
import {
  watchAllRegistrations,
  verifyRegistration,
  waitlistRegistration,
  type Registration,
} from "@/lib/registrations";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function Admin() {
  const [regs, setRegs] = useState<Registration[]>([]);

  useEffect(() => watchAllRegistrations(setRegs), []);

  async function verify(id: string) {
    try {
      await verifyRegistration(id);
      toast.success("Marked verified.");
    } catch {
      toast.error("Failed — check you have admin access.");
    }
  }

  async function waitlist(id: string) {
    try {
      await waitlistRegistration(id);
      toast.success("Marked waitlist.");
    } catch {
      toast.error("Failed — check you have admin access.");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-extrabold tracking-tight">Admin — Entries</h1>
      <div className="overflow-x-auto rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Track</TableHead>
              <TableHead>Team / Player</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>College</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Ref</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {regs.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.trackName}</TableCell>
                <TableCell>{r.teamName || r.registrantName}</TableCell>
                <TableCell>
                  {r.registrantPhone}
                  <br />
                  {r.registrantEmail}
                </TableCell>
                <TableCell>{r.college}</TableCell>
                <TableCell>{r.fee ? `₹${r.fee}` : "Free"}</TableCell>
                <TableCell>{r.paymentRef || "—"}</TableCell>
                <TableCell>
                  <Badge>{r.status}</Badge>
                </TableCell>
                <TableCell className="space-x-2">
                  <Button size="sm" onClick={() => verify(r.id)}>
                    Verify
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => waitlist(r.id)}>
                    Waitlist
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

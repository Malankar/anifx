import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { setPaymentRef } from "@/lib/registrations";
import { toast } from "sonner";

const UPI_ID = import.meta.env.VITE_UPI_ID || "";
const PAYEE_NAME = import.meta.env.VITE_UPI_PAYEE_NAME || "AniFX 2026";

export function PaymentPanel({
  registrationId,
  amount,
  entryLabel,
}: {
  registrationId: string;
  amount: number;
  entryLabel: string;
}) {
  const [utr, setUtr] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const upiLink = UPI_ID
    ? `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(
        PAYEE_NAME
      )}&am=${amount}&cu=INR&tn=${encodeURIComponent(entryLabel)}`
    : "";

  async function submit() {
    if (!utr.trim()) return toast.error("Enter your UPI transaction / UTR reference.");
    setSubmitting(true);
    try {
      await setPaymentRef(registrationId, utr.trim());
      setSubmitted(true);
      toast.success("Payment reference submitted. We'll verify it within 48 hours.");
    } catch {
      toast.error("Could not save your reference. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pay ₹{amount.toLocaleString("en-IN")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {UPI_ID ? (
          <div className="flex flex-col items-center gap-3 rounded-md border border-border bg-muted/30 p-4">
            <QRCodeSVG value={upiLink} size={180} />
            <p className="text-sm text-muted-foreground">
              Scan with any UPI app, or pay to <span className="font-medium text-foreground">{UPI_ID}</span>
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Payment QR is not configured yet — contact the organisers for payment details.
          </p>
        )}

        {submitted ? (
          <p className="text-sm text-emerald-500">
            Reference received. Your slot is not confirmed until we verify payment — usually
            under 48 hours.
          </p>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="utr">UPI transaction ID / UTR</Label>
            <Input id="utr" value={utr} onChange={(e) => setUtr(e.target.value)} placeholder="e.g. 402911223344" />
            <Button className="w-full" onClick={submit} disabled={submitting}>
              {submitting ? "Submitting…" : "I've paid — submit reference"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

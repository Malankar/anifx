import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { needsPayment, resolveFee, type Track } from "@/lib/tracks";
import { createRegistration } from "@/lib/registrations";
import { useAuth } from "@/lib/auth-context";
import { PaymentPanel } from "@/components/PaymentPanel";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  teamName: z.string().max(40).optional().or(z.literal("")),
  registrantName: z.string().min(2, "Required").max(60),
  registrantPhone: z.string().regex(/^[0-9]{10}$/, "10 digit phone number"),
  registrantEmail: z.string().email(),
  age: z.number({ error: "Required" }).min(10).max(99),
  classYear: z.string().min(1, "Required").max(40),
  board: z.string().max(40).optional().or(z.literal("")),
  college: z.string().min(1, "Required"),
  address: z.string().min(1, "Required"),
  roster: z.string().optional().or(z.literal("")),
  feeTierKey: z.string().optional(),
  agree: z.literal(true, { message: "You must agree to the rules" }),
});

type FormValues = z.infer<typeof schema>;

export function RegistrationForm({ track }: { track: Track }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [createdAmount, setCreatedAmount] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { feeTierKey: track.feeTiers?.[0]?.key },
  });

  const feeTierKey = watch("feeTierKey");
  const fee = useMemo(() => resolveFee(track, feeTierKey), [track, feeTierKey]);
  const showPayment = createdId !== null && needsPayment(track, feeTierKey);

  async function onSubmit(values: FormValues) {
    if (!user) {
      toast.error("Log in first to register.");
      navigate("/login");
      return;
    }
    try {
      const id = await createRegistration(user.uid, {
        trackId: track.id,
        trackName: track.name,
        teamName: values.teamName || undefined,
        registrantName: values.registrantName,
        registrantPhone: values.registrantPhone,
        registrantEmail: values.registrantEmail,
        age: values.age,
        classYear: values.classYear,
        board: values.board || undefined,
        college: values.college,
        address: values.address,
        roster: values.roster || undefined,
        feeTierKey: values.feeTierKey,
        fee: fee.amount,
      });
      setCreatedId(id);
      setCreatedAmount(fee.amount);
      toast.success("Entry received.");
    } catch {
      toast.error("Could not submit. Try again.");
    }
  }

  if (createdId && !showPayment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>You're registered</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Entry for <span className="text-foreground font-medium">{track.name}</span> received — no
            payment needed. Check your dashboard for status updates.
          </p>
          <Button className="mt-4" onClick={() => navigate("/dashboard")}>
            Go to dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (createdId && showPayment) {
    return (
      <PaymentPanel registrationId={createdId} amount={createdAmount} entryLabel={track.name} />
    );
  }

  return (
    <div>
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          {track.feeTiers && (
            <div className="space-y-2">
              <Label>Entry tier</Label>
              <RadioGroup
                defaultValue={track.feeTiers[0].key}
                onValueChange={(v) => setValue("feeTierKey", v)}
              >
                {track.feeTiers.map((tier) => (
                  <label key={tier.key} className="flex items-center gap-2 text-sm">
                    <RadioGroupItem value={tier.key} />
                    {tier.label}
                  </label>
                ))}
              </RadioGroup>
            </div>
          )}

          <div className="flex items-center justify-between rounded-md border border-border bg-muted/30 px-3 py-2 text-sm">
            <span className="text-muted-foreground">Entry fee</span>
            <span className="font-semibold">{fee.amount ? `₹${fee.amount}` : "Free"}</span>
          </div>

          {track.isTeam && (
            <Field label="Team name" error={errors.teamName?.message}>
              <Input {...register("teamName")} maxLength={40} />
            </Field>
          )}

          <Field label={track.leadLabel ? `${track.leadLabel} — full name` : "Full name"} error={errors.registrantName?.message}>
            <Input {...register("registrantName")} maxLength={60} />
          </Field>

          <Field label="WhatsApp number" error={errors.registrantPhone?.message}>
            <Input {...register("registrantPhone")} inputMode="numeric" maxLength={10} placeholder="10 digits" />
          </Field>

          <Field label="Email" error={errors.registrantEmail?.message}>
            <Input type="email" {...register("registrantEmail")} maxLength={80} />
          </Field>

          <Field label="Age" error={errors.age?.message}>
            <Input type="number" {...register("age", { valueAsNumber: true })} min={10} max={99} />
          </Field>

          <Field label="Class / year / graduation" error={errors.classYear?.message}>
            <Input {...register("classYear")} placeholder="e.g. 12th, or B.Des Year 2" maxLength={40} />
          </Field>

          <Field label="Board (e.g. CBSE) — if applicable">
            <Input {...register("board")} maxLength={40} />
          </Field>

          <Field label="College / institution" error={errors.college?.message}>
            <Input {...register("college")} />
          </Field>

          <Field label="Address" error={errors.address?.message}>
            <Textarea {...register("address")} />
          </Field>

          {track.rosterLabel && (
            <Field label={track.rosterLabel}>
              <Textarea {...register("roster")} placeholder={track.rosterPlaceholder} />
              {track.rosterHint && <p className="text-xs text-muted-foreground">{track.rosterHint}</p>}
            </Field>
          )}

          <label className="flex items-start gap-2 text-sm">
            <Checkbox onCheckedChange={(v) => setValue("agree", v === true ? true : (undefined as unknown as true))} />
            <span>
              I have read the rules for this competition. All listed players are enrolled students
              and their details are correct. Incorrect details may result in forfeit.
            </span>
          </label>
          {errors.agree && <p className="text-xs text-destructive">{errors.agree.message}</p>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting…" : needsPayment(track, feeTierKey) ? "Continue to payment" : "Submit entry"}
          </Button>
        </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

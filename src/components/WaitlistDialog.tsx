import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  isSupabaseConfigured,
  PORTAL_TRIP_SLUG,
  supabase,
} from "@/lib/supabase";

type WaitlistDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripName: string;
};

type WaitlistForm = {
  name: string;
  email: string;
  mobile: string;
  website: string;
};

const initialForm: WaitlistForm = {
  name: "",
  email: "",
  mobile: "",
  website: "",
};

export function WaitlistDialog({ open, onOpenChange, tripName }: WaitlistDialogProps) {
  const [form, setForm] = useState<WaitlistForm>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateField = (field: keyof WaitlistForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setError(null);
      setIsSubmitted(false);
    }

    onOpenChange(nextOpen);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!isSupabaseConfigured || !supabase) {
        throw new Error("The waitlist is temporarily unavailable. Please try again shortly.");
      }

      if (form.website) {
        setForm(initialForm);
        setIsSubmitted(true);
        return;
      }

      const { error: insertError } = await supabase.from("waitlist_signups").insert({
        trip_slug: PORTAL_TRIP_SLUG,
        full_name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        mobile: form.mobile.trim(),
      });

      if (insertError && insertError.code !== "23505") {
        throw new Error("We couldn't submit your waitlist request. Please try again.");
      }

      setForm(initialForm);
      setIsSubmitted(true);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "We couldn't submit your waitlist request. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle className="pr-6 text-2xl text-slate-900">Join the waitlist</DialogTitle>
          <DialogDescription className="leading-6">
            {tripName} is sold out. Share your details and we'll contact you if a place becomes available.
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="rounded-xl border border-primary/30 bg-primary/10 p-4 text-sm leading-6 text-slate-700">
            You're on the waitlist. We'll be in touch if a place becomes available.
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="waitlist-name">Full name</Label>
              <Input
                id="waitlist-name"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                autoComplete="name"
                maxLength={100}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="waitlist-email">Email address</Label>
              <Input
                id="waitlist-email"
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                autoComplete="email"
                maxLength={255}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="waitlist-mobile">Mobile / phone number</Label>
              <Input
                id="waitlist-mobile"
                type="tel"
                value={form.mobile}
                onChange={(event) => updateField("mobile", event.target.value)}
                autoComplete="tel"
                maxLength={30}
                required
              />
            </div>

            <div className="hidden" aria-hidden="true">
              <Label htmlFor="waitlist-website">Website</Label>
              <Input
                id="waitlist-website"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(event) => updateField("website", event.target.value)}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button className="w-full rounded-xl" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Joining waitlist..." : "Join waitlist"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

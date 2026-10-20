import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import {
  PASSPORT_CONFIRMATION, TRAVELLER_DETAILS_TABLE, todayDate, validateTravellers,
  type TravellerDetails, type TravellerInput,
} from "@/lib/travellerDetails";

export default function TravellerDetailsForm({ bookingId, guestCount, preview = false }: {
  bookingId: string;
  guestCount: number;
  preview?: boolean;
}) {
  const isLocalPreview = (import.meta.env.DEV || import.meta.env.VITE_PASSPORT_PREVIEW === "true") && preview;
  const [travellers, setTravellers] = useState<TravellerInput[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setLoadError(false);
      setError("");
      setMessage("");
      setConfirmed(false);
      if (isLocalPreview) {
        setTravellers([{ given_names: "", surname: "", date_of_birth: "" }]);
        setLoading(false);
        return;
      }
      try {
        if (!supabase) throw new Error("Portal unavailable");
        const { data, error: queryError } = await supabase.from(TRAVELLER_DETAILS_TABLE)
          .select("*").eq("guest_booking_id", bookingId).order("traveller_number");
        if (queryError) throw queryError;
        if (cancelled) return;
        const saved = (data ?? []) as TravellerDetails[];
        setTravellers(Array.from({ length: guestCount }, (_, index) => {
          const entry = saved.find((row) => row.traveller_number === index + 1);
          return {
            given_names: entry?.given_names ?? "",
            surname: entry?.surname ?? "",
            date_of_birth: entry?.date_of_birth ?? "",
          };
        }));
        if (saved.filter((row) => row.traveller_number <= guestCount).length === guestCount) {
          setMessage("Your traveller details have been saved. To make a correction, edit the details and confirm them again.");
        }
      } catch {
        if (!cancelled) {
          setLoadError(true);
          setError("We couldn't load your traveller details. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [bookingId, guestCount, retry, isLocalPreview]);

  function edit(index: number, field: keyof TravellerInput, value: string) {
    setTravellers((current) => current.map((row, i) => i === index ? { ...row, [field]: value } : row));
    setConfirmed(false);
    setMessage("");
    setError("");
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    const validation = validateTravellers(travellers, confirmed);
    if (validation) { setError(validation); return; }
    if (isLocalPreview) {
      setConfirmed(false);
      setMessage("Preview only — your details have not been saved.");
      return;
    }
    setSaving(true);
    setError("");
    setMessage("");
    try {
      if (!supabase) throw new Error("Portal unavailable");
      const { error: saveError } = await supabase.rpc("save_amigas_traveller_details", {
        input_booking_id: bookingId,
        input_travellers: travellers.map((row) => ({
          ...row, given_names: row.given_names.trim(), surname: row.surname.trim(),
        })),
        input_confirmed: confirmed,
      });
      if (saveError) throw saveError;
      setConfirmed(false);
      setMessage("Your passport details are saved and confirmed for your domestic flight in Vietnam.");
    } catch {
      setError("We couldn't save your details. Your entries are still here. Please try again; if this continues, contact our team.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm" aria-labelledby="traveller-details-title">
      <h2 id="traveller-details-title" className="text-xl font-bold text-primary">Your passport details</h2>
      <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm leading-6">
        <p className="font-semibold text-foreground">Please enter your details exactly as shown on your passport.</p>
        <p className="mt-1 text-muted-foreground">These will be used to book your domestic flight in Vietnam.</p>
      </div>
      {loading ? <p className="mt-4 text-sm" role="status">Loading traveller details...</p> : loadError ? (
        <Button className="mt-4" variant="outline" onClick={() => setRetry((value) => value + 1)}>Try again</Button>
      ) : (
        <form className="mt-5 space-y-5" onSubmit={save}>
          <fieldset disabled={saving} className="space-y-5">
            {travellers.map((traveller, index) => (
              <fieldset key={index} className={guestCount > 1 ? "rounded-lg border p-4" : ""}>
                <legend className={guestCount > 1 ? "px-2 text-sm font-semibold" : "sr-only"}>
                  {guestCount > 1 ? `Traveller ${index + 1}` : "Your details"}
                </legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor={`given-names-${index}`} className="mb-2 block text-sm font-medium">Given Names (First + Middle) <span aria-hidden="true">*</span></label>
                    <Input id={`given-names-${index}`} value={traveller.given_names} required maxLength={150}
                      aria-describedby={`given-names-help-${index}`}
                      autoComplete="off" onChange={(event) => edit(index, "given_names", event.target.value)} />
                    <p id={`given-names-help-${index}`} className="mt-2 text-xs leading-5 text-muted-foreground">
                      Include all names listed under GIVEN NAMES on your passport.
                    </p>
                  </div>
                  <div>
                    <label htmlFor={`surname-${index}`} className="mb-2 block text-sm font-medium">Surname (Last Name) <span aria-hidden="true">*</span></label>
                    <Input id={`surname-${index}`} value={traveller.surname} required maxLength={150}
                      autoComplete="off" onChange={(event) => edit(index, "surname", event.target.value)} />
                  </div>
                  <div>
                    <label htmlFor={`dob-${index}`} className="mb-2 block text-sm font-medium">Date of Birth <span aria-hidden="true">*</span></label>
                    <Input id={`dob-${index}`} type="date" value={traveller.date_of_birth} required
                      min="1900-01-01" max={todayDate()} autoComplete="off"
                      onChange={(event) => edit(index, "date_of_birth", event.target.value)} />
                  </div>
                </div>
              </fieldset>
            ))}
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm leading-6">
              <input type="checkbox" required checked={confirmed} className="mt-1 h-4 w-4 shrink-0 accent-primary"
                onChange={(event) => setConfirmed(event.target.checked)} />
              <span>{PASSPORT_CONFIRMATION}</span>
            </label>
            <Button type="submit" disabled={!confirmed || saving}>
              {saving ? "Saving..." : "Save my details"}
            </Button>
          </fieldset>
        </form>
      )}
      <p className="mt-4 text-xs leading-5 text-muted-foreground">
        Only you and authorized trip admins can view your details. If you are unsure or need any help, email{" "}
        <a href="mailto:bookings@imaginebeyondtravel.com" className="font-medium text-primary underline underline-offset-2">bookings@imaginebeyondtravel.com</a>.
      </p>
      {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
      {message && <p role="status" className="mt-4 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">{message}</p>}
    </section>
  );
}

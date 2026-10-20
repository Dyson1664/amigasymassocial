import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import {
  PASSPORT_CONFIRMATION, TRAVELLER_DETAILS_TABLE, todayDate, validateTravellers,
  type TravellerDetails, type TravellerInput,
} from "@/lib/travellerDetails";

export default function TravellerDetailsForm({ bookingId, guestCount }: {
  bookingId: string;
  guestCount: number;
}) {
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
  }, [bookingId, guestCount, retry]);

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
      setMessage("Traveller details saved and confirmed. Our team can now view them for your travel bookings.");
    } catch {
      setError("We couldn't save your details. Your entries are still here. Please try again; if this continues, contact our team.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm" aria-labelledby="traveller-details-title">
      <h2 id="traveller-details-title" className="text-xl font-bold text-primary">Traveller details</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Please use the passport you will travel with. We need these details for flight and travel bookings.
        Include all given names, including middle names, exactly as printed on the passport.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Only you and authorized trip admins can view these details. If your passport has only one name, contact our team for help.
      </p>
      {loading ? <p className="mt-4 text-sm" role="status">Loading traveller details...</p> : loadError ? (
        <Button className="mt-4" variant="outline" onClick={() => setRetry((value) => value + 1)}>Try again</Button>
      ) : (
        <form className="mt-5 space-y-5" onSubmit={save}>
          <fieldset disabled={saving} className="space-y-5">
            {travellers.map((traveller, index) => (
              <fieldset key={index} className="rounded-lg border p-4">
                <legend className="px-2 text-sm font-semibold">Traveller {index + 1}</legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor={`given-names-${index}`} className="mb-2 block text-sm font-medium">Given name(s) on passport</label>
                    <Input id={`given-names-${index}`} value={traveller.given_names} required maxLength={150}
                      autoComplete="off" onChange={(event) => edit(index, "given_names", event.target.value)} />
                  </div>
                  <div>
                    <label htmlFor={`surname-${index}`} className="mb-2 block text-sm font-medium">Surname on passport</label>
                    <Input id={`surname-${index}`} value={traveller.surname} required maxLength={150}
                      autoComplete="off" onChange={(event) => edit(index, "surname", event.target.value)} />
                  </div>
                  <div>
                    <label htmlFor={`dob-${index}`} className="mb-2 block text-sm font-medium">Date of birth</label>
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
              {saving ? "Saving..." : "Save traveller details"}
            </Button>
          </fieldset>
        </form>
      )}
      {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
      {message && <p role="status" className="mt-4 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">{message}</p>}
    </section>
  );
}

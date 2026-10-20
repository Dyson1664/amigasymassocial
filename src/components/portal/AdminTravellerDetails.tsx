import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { GuestBooking } from "@/lib/portalTypes";
import { supabase } from "@/lib/supabase";
import {
  TRAVELLER_DETAILS_TABLE, TRAVELLER_DETAILS_TRIP, csvCell, formatBirthDate, type TravellerDetails,
} from "@/lib/travellerDetails";

export default function AdminTravellerDetails({ bookings }: { bookings: GuestBooking[] }) {
  const [details, setDetails] = useState<TravellerDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [onlyMissing, setOnlyMissing] = useState(false);
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (!supabase) throw new Error("Portal unavailable");
      const { data, error: queryError } = await supabase.from(TRAVELLER_DETAILS_TABLE)
        .select("*").order("guest_booking_id").order("traveller_number");
      if (queryError) throw queryError;
      setDetails((data ?? []) as TravellerDetails[]);
    } catch {
      setError("Couldn't load traveller details. Please refresh to try again.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { void load(); }, [load, bookings]);

  const rows = bookings.filter((booking) => booking.trip_slug === TRAVELLER_DETAILS_TRIP).flatMap((booking) =>
    Array.from({ length: Math.max(1, booking.guest_count ?? 1) }, (_, index) => ({
      booking,
      number: index + 1,
      detail: details.find((row) => row.guest_booking_id === booking.id && row.traveller_number === index + 1),
    })),
  );
  const completed = rows.filter((row) => row.detail?.passport_details_confirmed).length;
  const visibleRows = onlyMissing ? rows.filter((row) => !row.detail) : rows;

  function download() {
    const header = ["Booking name", "Booking email", "Traveller", "Given name(s)", "Surname", "Date of birth", "Status", "Confirmed at (UTC)"];
    const values = rows.map(({ booking, number, detail }) => [
      booking.guest_name ?? "", booking.guest_email, number, detail?.given_names ?? "",
      detail?.surname ?? "", detail?.date_of_birth ?? "", detail ? "Confirmed" : "Missing",
      detail?.confirmed_at ?? "",
    ]);
    const csv = [header, ...values].map((row) => row.map(csvCell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "amigas-vietnam-traveller-details.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="mb-6 rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Traveller details</h2>
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading passport details..." : error ? "Traveller details unavailable" : `${completed} of ${rows.length} travellers confirmed`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={load} disabled={loading}>Refresh details</Button>
          <Button type="button" variant="outline" onClick={download} disabled={loading || Boolean(error) || !rows.length}>Download CSV</Button>
        </div>
      </div>
      {error ? <p role="alert" className="mt-4 text-sm text-destructive">{error}</p> : !loading && (
        <>
          <label className="mt-4 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={onlyMissing} onChange={(event) => setOnlyMissing(event.target.checked)} />
            Show missing details only
          </label>
          <div className="mt-4 max-h-[480px] overflow-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                <tr>{["Booking / traveller", "Given name(s)", "Surname", "Date of birth", "Confirmation"].map((label) =>
                  <th key={label} className="px-3 py-2 font-medium">{label}</th>)}</tr>
              </thead>
              <tbody>
                {visibleRows.map(({ booking, number, detail }) => (
                  <tr key={`${booking.id}-${number}`} className="border-b last:border-0">
                    <td className="px-3 py-3">
                      <p className="font-medium">{booking.guest_name || "Unnamed booking"} · Traveller {number}</p>
                      <p className="text-xs text-muted-foreground">{booking.guest_email}</p>
                    </td>
                    <td className="px-3 py-3">{detail?.given_names || "—"}</td>
                    <td className="px-3 py-3">{detail?.surname || "—"}</td>
                    <td className="whitespace-nowrap px-3 py-3">{detail ? formatBirthDate(detail.date_of_birth) : "—"}</td>
                    <td className="px-3 py-3">
                      {detail ? <><p className="font-medium text-emerald-700">Confirmed by guest</p>
                        <p className="text-xs text-muted-foreground">{new Date(detail.confirmed_at).toLocaleString("en-GB")}</p></>
                        : <span className="text-amber-700">Missing</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!visibleRows.length && <p className="p-3 text-sm text-muted-foreground">
              {onlyMissing && rows.length ? "All travellers have submitted their details." : "No travellers to show."}
            </p>}
          </div>
        </>
      )}
    </section>
  );
}

export const TRAVELLER_DETAILS_TRIP = "vietnam-amigas-y-mas-social";
export const TRAVELLER_DETAILS_TABLE = "amigas_traveller_details";
export const PASSPORT_CONFIRMATION =
  "I have checked each traveller's passport and confirm that the given name(s), surname and date of birth entered here match it exactly. I understand these details will be used for flight and travel bookings.";

export type TravellerInput = {
  given_names: string;
  surname: string;
  date_of_birth: string;
};

export type TravellerDetails = TravellerInput & {
  guest_booking_id: string;
  traveller_number: number;
  passport_details_confirmed: boolean;
  confirmed_at: string;
};

export function todayDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function validateTravellers(travellers: TravellerInput[], confirmed: boolean) {
  for (const [index, traveller] of travellers.entries()) {
    if (!traveller.given_names.trim() || !traveller.surname.trim()) {
      return `Enter the passport given name(s) and surname for traveller ${index + 1}.`;
    }
    if (traveller.given_names.trim().length > 150 || traveller.surname.trim().length > 150) {
      return `Names for traveller ${index + 1} must be 150 characters or fewer.`;
    }
    const dob = traveller.date_of_birth;
    const parsed = new Date(`${dob}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dob) || Number.isNaN(parsed.getTime())
      || parsed.toISOString().slice(0, 10) !== dob || dob < "1900-01-01" || dob > todayDate()) {
      return `Enter a valid date of birth for traveller ${index + 1}.`;
    }
  }
  return confirmed ? "" : "Please check the passport details and tick the confirmation box.";
}

export function formatBirthDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

// Quote every cell and neutralize spreadsheet formulas in user-entered names.
export function csvCell(value: string | number) {
  const text = String(value);
  const safe = /^[\s]*[=+\-@]/.test(text) || /^[\t\r\n]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

import TravellerDetailsForm from "@/components/portal/TravellerDetailsForm";

export default function TravellerDetailsPreview() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <p className="mb-6 text-sm text-muted-foreground">Local preview · Amigas y Más Social Vietnam guest portal · Nothing entered here is saved.</p>
        <TravellerDetailsForm bookingId="local-preview" guestCount={1} preview />
      </div>
    </main>
  );
}

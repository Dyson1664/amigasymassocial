-- Isolated waitlist storage for the Amigas y Más Social Vietnam trip.
-- This migration creates a new table only; it does not alter bookings or payments.

create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  trip_slug text not null check (trip_slug = 'vietnam-amigas-y-mas-social'),
  full_name text not null check (char_length(btrim(full_name)) between 1 and 100),
  email text not null check (email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  mobile text not null check (char_length(btrim(mobile)) between 1 and 30),
  created_at timestamptz not null default now(),
  unique (trip_slug, email)
);

alter table public.waitlist_signups enable row level security;

revoke all on table public.waitlist_signups from anon, authenticated;
grant insert on table public.waitlist_signups to anon, authenticated;
grant select on table public.waitlist_signups to authenticated;

drop policy if exists "Anyone can join the Amigas waitlist" on public.waitlist_signups;
create policy "Anyone can join the Amigas waitlist"
  on public.waitlist_signups
  for insert
  to anon, authenticated
  with check (trip_slug = 'vietnam-amigas-y-mas-social');

drop policy if exists "Amigas administrators can view the waitlist" on public.waitlist_signups;
create policy "Amigas administrators can view the waitlist"
  on public.waitlist_signups
  for select
  to authenticated
  using (public.is_portal_admin_for_trip(trip_slug));

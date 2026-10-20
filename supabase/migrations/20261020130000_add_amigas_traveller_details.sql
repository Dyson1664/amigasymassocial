-- Isolated collection for Amigas Vietnam. Existing booking/payment tables and
-- their policies are intentionally untouched.
create table public.amigas_traveller_details (
  guest_booking_id uuid not null references public.guest_bookings(id) on delete cascade,
  traveller_number integer not null check (traveller_number > 0),
  given_names text not null check (char_length(btrim(given_names)) between 1 and 150),
  surname text not null check (char_length(btrim(surname)) between 1 and 150),
  date_of_birth date not null check (date_of_birth >= date '1900-01-01'),
  passport_details_confirmed boolean not null check (passport_details_confirmed = true),
  confirmed_at timestamptz not null default now(),
  primary key (guest_booking_id, traveller_number)
);

alter table public.amigas_traveller_details enable row level security;
revoke all on public.amigas_traveller_details from public, anon, authenticated;
grant select, insert on public.amigas_traveller_details to authenticated;
grant update (given_names, surname, date_of_birth, passport_details_confirmed)
  on public.amigas_traveller_details to authenticated;
grant all on public.amigas_traveller_details to service_role;

create policy amigas_traveller_read
on public.amigas_traveller_details for select to authenticated
using (
  exists (
    select 1 from public.guest_bookings b
    where b.id = guest_booking_id
      and b.trip_slug = 'vietnam-amigas-y-mas-social'
      and (
        lower(btrim(b.guest_email)) = lower(btrim((select auth.email())))
        or (select public.is_portal_admin_for_trip('vietnam-amigas-y-mas-social'))
      )
  )
);

create policy amigas_traveller_insert
on public.amigas_traveller_details for insert to authenticated
with check (
  exists (
    select 1 from public.guest_bookings b
    where b.id = guest_booking_id
      and b.trip_slug = 'vietnam-amigas-y-mas-social'
      and traveller_number <= greatest(1, coalesce(b.guest_count, 1))
      and lower(btrim(b.guest_email)) = lower(btrim((select auth.email())))
  )
);

create policy amigas_traveller_update
on public.amigas_traveller_details for update to authenticated
using (
  exists (
    select 1 from public.guest_bookings b
    where b.id = guest_booking_id
      and b.trip_slug = 'vietnam-amigas-y-mas-social'
      and lower(btrim(b.guest_email)) = lower(btrim((select auth.email())))
  )
)
with check (
  exists (
    select 1 from public.guest_bookings b
    where b.id = guest_booking_id
      and b.trip_slug = 'vietnam-amigas-y-mas-social'
      and traveller_number <= greatest(1, coalesce(b.guest_count, 1))
      and lower(btrim(b.guest_email)) = lower(btrim((select auth.email())))
  )
);

create function public.validate_amigas_traveller_details()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if tg_op = 'UPDATE' then
    if new.guest_booking_id <> old.guest_booking_id
       or new.traveller_number <> old.traveller_number then
      raise exception 'Traveller details cannot be moved to a different booking or traveller.';
    end if;
  end if;

  if not exists (
    select 1 from public.guest_bookings b
    where b.id = new.guest_booking_id
      and b.trip_slug = 'vietnam-amigas-y-mas-social'
      and new.traveller_number <= greatest(1, coalesce(b.guest_count, 1))
  ) then
    raise exception 'Traveller details require an Amigas Vietnam booking and a valid traveller number.';
  end if;

  if new.date_of_birth > current_date then
    raise exception 'Date of birth cannot be in the future.';
  end if;
  new.given_names := btrim(new.given_names);
  new.surname := btrim(new.surname);
  new.confirmed_at := clock_timestamp();
  return new;
end;
$$;

revoke all on function public.validate_amigas_traveller_details() from public, anon, authenticated;
create trigger validate_amigas_traveller_details
before insert or update on public.amigas_traveller_details
for each row execute function public.validate_amigas_traveller_details();

-- An invoker function saves every traveller atomically without granting guests
-- access to booking/payment updates. Row-level security applies to every write.
create function public.save_amigas_traveller_details(
  input_booking_id uuid,
  input_travellers jsonb,
  input_confirmed boolean
)
returns setof public.amigas_traveller_details
language plpgsql
security invoker
set search_path = ''
as $$
declare
  expected_count integer;
  traveller jsonb;
  traveller_index integer := 0;
begin
  if auth.uid() is null or input_confirmed is distinct from true then
    raise exception 'Please confirm the details match each traveller''s passport.';
  end if;
  select greatest(1, coalesce(b.guest_count, 1)) into expected_count
  from public.guest_bookings b
  where b.id = input_booking_id
    and b.trip_slug = 'vietnam-amigas-y-mas-social'
    and lower(btrim(b.guest_email)) = lower(btrim(auth.email()));
  if expected_count is null then
    raise exception 'This booking is not available to your account.' using errcode = '42501';
  end if;
  if jsonb_typeof(input_travellers) is distinct from 'array' then
    raise exception 'Traveller details must be a list.';
  end if;
  if jsonb_array_length(input_travellers) <> expected_count then
    raise exception 'Please provide details for all % travellers.', expected_count;
  end if;
  for traveller in select value from jsonb_array_elements(input_travellers)
  loop
    traveller_index := traveller_index + 1;
    insert into public.amigas_traveller_details (
      guest_booking_id, traveller_number, given_names, surname,
      date_of_birth, passport_details_confirmed
    ) values (
      input_booking_id, traveller_index, traveller ->> 'given_names',
      traveller ->> 'surname', (traveller ->> 'date_of_birth')::date, true
    )
    on conflict (guest_booking_id, traveller_number) do update set
      given_names = excluded.given_names,
      surname = excluded.surname,
      date_of_birth = excluded.date_of_birth,
      passport_details_confirmed = excluded.passport_details_confirmed;
  end loop;
  return query
    select d.* from public.amigas_traveller_details d
    where d.guest_booking_id = input_booking_id
    order by d.traveller_number;
end;
$$;
revoke all on function public.save_amigas_traveller_details(uuid, jsonb, boolean)
  from public, anon;
grant execute on function public.save_amigas_traveller_details(uuid, jsonb, boolean)
  to authenticated;

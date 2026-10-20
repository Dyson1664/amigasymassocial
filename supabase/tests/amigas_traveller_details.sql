-- Integration checks against existing bookings. All test details are rolled back;
-- no booking, payment, auth account, or real passport detail is changed.
begin;
set local statement_timeout = '15s';

do $test$
declare
  owner_booking public.guest_bookings%rowtype;
  other_booking public.guest_bookings%rowtype;
  another_trip public.guest_bookings%rowtype;
  admin_email text;
  payload jsonb := '[{"given_names":"Test Middle","surname":"O''Test","date_of_birth":"1990-04-12"}]'::jsonb;
  observed integer;
  before_confirmed timestamptz;
  after_confirmed timestamptz;
begin
  select * into strict owner_booking from public.guest_bookings
    where trip_slug = 'vietnam-amigas-y-mas-social' and coalesce(guest_count, 1) = 1
      and id not in (select guest_booking_id from public.amigas_traveller_details)
    order by id limit 1;
  select * into strict other_booking from public.guest_bookings
    where trip_slug = 'vietnam-amigas-y-mas-social' and guest_email <> owner_booking.guest_email
    order by id limit 1;
  select * into strict another_trip from public.guest_bookings
    where trip_slug <> 'vietnam-amigas-y-mas-social' order by id limit 1;
  select a.email into strict admin_email from public.admin_users a
    join public.admin_trip_access t on t.admin_user_id = a.id
    where t.trip_slug = 'vietnam-amigas-y-mas-social' limit 1;

  perform set_config('request.jwt.claims', jsonb_build_object(
    'sub', gen_random_uuid(), 'email', owner_booking.guest_email, 'role', 'authenticated'
  )::text, true);
  set local role authenticated;

  perform public.save_amigas_traveller_details(owner_booking.id, payload, true);
  select count(*), max(confirmed_at) into observed, before_confirmed
    from public.amigas_traveller_details where guest_booking_id = owner_booking.id;
  assert observed = 1, 'Owner save/read failed';

  perform public.save_amigas_traveller_details(owner_booking.id,
    '[{"given_names":"Corrected Middle","surname":"O''Test","date_of_birth":"1990-04-12"}]', true);
  select confirmed_at into after_confirmed from public.amigas_traveller_details
    where guest_booking_id = owner_booking.id and given_names = 'Corrected Middle';
  assert after_confirmed > before_confirmed, 'Correction did not refresh confirmation';

  begin
    perform public.save_amigas_traveller_details(owner_booking.id, payload, false);
    raise exception 'Unchecked confirmation was accepted' using errcode = 'P9001';
  exception when sqlstate 'P0001' then null;
  end;
  begin
    perform public.save_amigas_traveller_details(owner_booking.id, '[]', true);
    raise exception 'Incomplete traveller list was accepted' using errcode = 'P9001';
  exception when sqlstate 'P0001' then null;
  end;
  begin
    perform public.save_amigas_traveller_details(owner_booking.id,
      '[{"given_names":"Test","surname":"Test","date_of_birth":"2999-01-01"}]', true);
    raise exception 'Future DOB was accepted' using errcode = 'P9001';
  exception when sqlstate 'P0001' then null;
  end;
  begin
    perform public.save_amigas_traveller_details(owner_booking.id,
      '[{"given_names":" ","surname":"Test","date_of_birth":"1990-01-01"}]', true);
    raise exception 'Blank name was accepted' using errcode = 'P9001';
  exception when check_violation then null;
  end;
  begin
    update public.amigas_traveller_details set passport_details_confirmed = false
      where guest_booking_id = owner_booking.id;
    raise exception 'Unconfirmed direct write was accepted' using errcode = 'P9001';
  exception when check_violation then null;
  end;
  begin
    update public.amigas_traveller_details set guest_booking_id = other_booking.id
      where guest_booking_id = owner_booking.id;
    raise exception 'Booking reassignment was accepted' using errcode = 'P9001';
  exception when insufficient_privilege then null;
  end;
  begin
    delete from public.amigas_traveller_details where guest_booking_id = owner_booking.id;
    raise exception 'Guest deletion was accepted' using errcode = 'P9001';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.save_amigas_traveller_details(other_booking.id, payload, true);
    raise exception 'Other guest write was accepted' using errcode = 'P9001';
  exception when insufficient_privilege then null;
  end;
  reset role;

  perform set_config('request.jwt.claims', jsonb_build_object(
    'sub', gen_random_uuid(), 'email', other_booking.guest_email, 'role', 'authenticated'
  )::text, true);
  set local role authenticated;
  select count(*) into observed from public.amigas_traveller_details
    where guest_booking_id = owner_booking.id;
  assert observed = 0, 'Other guest could read passport details';
  update public.amigas_traveller_details set given_names = 'Unauthorized'
    where guest_booking_id = owner_booking.id;
  get diagnostics observed = row_count;
  assert observed = 0, 'Other guest could update passport details';
  reset role;

  perform set_config('request.jwt.claims', jsonb_build_object(
    'sub', gen_random_uuid(), 'email', another_trip.guest_email, 'role', 'authenticated'
  )::text, true);
  set local role authenticated;
  begin
    perform public.save_amigas_traveller_details(another_trip.id, payload, true);
    raise exception 'Another trip could use the save function' using errcode = 'P9001';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.amigas_traveller_details
      (guest_booking_id, traveller_number, given_names, surname, date_of_birth, passport_details_confirmed)
    values (another_trip.id, 1, 'Test', 'Test', '1990-01-01', true);
    raise exception 'Another trip could insert directly' using errcode = 'P9001';
  exception when sqlstate 'P0001' or insufficient_privilege then null;
  end;
  reset role;

  perform set_config('request.jwt.claims', jsonb_build_object(
    'sub', gen_random_uuid(), 'email', admin_email, 'role', 'authenticated'
  )::text, true);
  set local role authenticated;
  select count(*) into observed from public.amigas_traveller_details
    where guest_booking_id = owner_booking.id;
  assert observed = 1, 'Trip admin could not read submitted details';
  reset role;

  perform set_config('request.jwt.claims', '{"role":"anon"}', true);
  set local role anon;
  begin
    perform * from public.amigas_traveller_details;
    raise exception 'Anonymous read was accepted' using errcode = 'P9001';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.save_amigas_traveller_details(owner_booking.id, payload, true);
    raise exception 'Anonymous save was accepted' using errcode = 'P9001';
  exception when insufficient_privilege then null;
  end;
  reset role;
end;
$test$;
rollback;
select 'PASS: owner save/read/correction, confirmation, DOB, names, guest isolation, trip isolation, admin read, anonymous denial; all test data rolled back.' as result;

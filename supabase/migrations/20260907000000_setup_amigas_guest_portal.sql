-- Additive setup for the Amigas y Mas Social guest portal.
-- All seeded data is scoped to vietnam-amigas-y-mas-social.

insert into public.trips (
  slug,
  name,
  destination,
  partner_name,
  currency,
  is_active
)
values (
  'vietnam-amigas-y-mas-social',
  'Vietnam with Amigas y Más Social',
  'Vietnam',
  'Amigas y Más Social',
  'USD',
  true
)
on conflict (slug) do update
set
  name = excluded.name,
  destination = excluded.destination,
  partner_name = excluded.partner_name,
  currency = excluded.currency,
  is_active = excluded.is_active;

insert into public.payment_plan_templates (
  trip_slug,
  package_key,
  package_name,
  payment_type,
  payment_label,
  amount,
  currency,
  due_date,
  sort_order
)
values
  ('vietnam-amigas-y-mas-social', 'early_bird', 'Vietnam with Amigas y Más Social – Early Bird', 'deposit', 'Deposit', 350, 'USD', null, 0),
  ('vietnam-amigas-y-mas-social', 'early_bird', 'Vietnam with Amigas y Más Social – Early Bird', 'balance_1', 'Balance Payment 1', 725, 'USD', '2026-11-03', 1),
  ('vietnam-amigas-y-mas-social', 'early_bird', 'Vietnam with Amigas y Más Social – Early Bird', 'balance_2', 'Balance Payment 2', 725, 'USD', '2027-01-18', 2),
  ('vietnam-amigas-y-mas-social', 'early_bird_single_room', 'Vietnam with Amigas y Más Social – Early Bird + Single Room', 'deposit', 'Deposit', 350, 'USD', null, 0),
  ('vietnam-amigas-y-mas-social', 'early_bird_single_room', 'Vietnam with Amigas y Más Social – Early Bird + Single Room', 'balance_1', 'Balance Payment 1', 1190, 'USD', '2026-11-03', 1),
  ('vietnam-amigas-y-mas-social', 'early_bird_single_room', 'Vietnam with Amigas y Más Social – Early Bird + Single Room', 'balance_2', 'Balance Payment 2', 725, 'USD', '2027-01-18', 2),
  ('vietnam-amigas-y-mas-social', 'standard', 'Vietnam with Amigas y Más Social – Regular', 'deposit', 'Deposit', 400, 'USD', null, 0),
  ('vietnam-amigas-y-mas-social', 'standard', 'Vietnam with Amigas y Más Social – Regular', 'balance_1', 'Balance Payment 1', 775, 'USD', '2026-11-03', 1),
  ('vietnam-amigas-y-mas-social', 'standard', 'Vietnam with Amigas y Más Social – Regular', 'balance_2', 'Balance Payment 2', 775, 'USD', '2027-01-18', 2),
  ('vietnam-amigas-y-mas-social', 'standard_single_room', 'Vietnam with Amigas y Más Social – Regular + Single Room', 'deposit', 'Deposit', 400, 'USD', null, 0),
  ('vietnam-amigas-y-mas-social', 'standard_single_room', 'Vietnam with Amigas y Más Social – Regular + Single Room', 'balance_1', 'Balance Payment 1', 1240, 'USD', '2026-11-03', 1),
  ('vietnam-amigas-y-mas-social', 'standard_single_room', 'Vietnam with Amigas y Más Social – Regular + Single Room', 'balance_2', 'Balance Payment 2', 775, 'USD', '2027-01-18', 2)
on conflict (trip_slug, package_key, payment_type)
  where payment_type <> 'other'
do update
set
  package_name = excluded.package_name,
  payment_label = excluded.payment_label,
  amount = excluded.amount,
  currency = excluded.currency,
  due_date = excluded.due_date,
  sort_order = excluded.sort_order;

insert into public.admin_trip_access (admin_user_id, trip_slug)
select
  admin_user.id,
  'vietnam-amigas-y-mas-social'
from public.admin_users admin_user
where lower(btrim(admin_user.email)) in (
  'darrin@imaginebeyondtravel.com',
  'david@imaginebeyondtravel.com',
  'jordan@imaginebeyondtravel.com',
  'partnerships@imaginebeyondtravel.com'
)
on conflict (admin_user_id, trip_slug) do nothing;

create or replace function public.save_portal_booking(
  input_trip_slug text,
  input_booking jsonb,
  input_installments jsonb,
  input_deleted_installments jsonb default '[]'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  booking_id uuid;
  installment_id uuid;
  normalized_trip_slug text := lower(btrim(input_trip_slug));
  normalized_email text := lower(btrim(input_booking ->> 'guest_email'));
  expected_booking_updated_at timestamptz;
  expected_installment_updated_at timestamptz;
  installment jsonb;
  deleted_installment jsonb;
  affected_rows integer;
  installment_sort_order integer := 0;
begin
  if not public.is_portal_admin_for_trip(normalized_trip_slug) then
    raise exception 'You do not have admin access to this trip.' using errcode = '42501';
  end if;

  if normalized_email is null or normalized_email = '' then
    raise exception 'A guest email is required.' using errcode = '22023';
  end if;

  if jsonb_typeof(coalesce(input_installments, '[]'::jsonb)) <> 'array'
     or jsonb_typeof(coalesce(input_deleted_installments, '[]'::jsonb)) <> 'array' then
    raise exception 'Installment inputs must be arrays.' using errcode = '22023';
  end if;

  if nullif(input_booking ->> 'id', '') is null then
    insert into public.guest_bookings (
      trip_slug,
      guest_name,
      guest_email,
      trip_name,
      package_type,
      package_name,
      itinerary_pdf_url,
      total_trip_price,
      deposit_amount,
      balance_remaining,
      room_upgrade_enabled,
      room_upgrade_name,
      room_upgrade_total,
      guest_count,
      booking_status
    )
    values (
      normalized_trip_slug,
      nullif(btrim(input_booking ->> 'guest_name'), ''),
      normalized_email,
      coalesce(nullif(btrim(input_booking ->> 'trip_name'), ''), (select name from public.trips where slug = normalized_trip_slug)),
      nullif(input_booking ->> 'package_type', ''),
      nullif(btrim(input_booking ->> 'package_name'), ''),
      nullif(btrim(input_booking ->> 'itinerary_pdf_url'), ''),
      coalesce(nullif(input_booking ->> 'total_trip_price', '')::numeric, 0),
      coalesce(nullif(input_booking ->> 'deposit_amount', '')::numeric, 0),
      0,
      coalesce((input_booking ->> 'room_upgrade_enabled')::boolean, false),
      nullif(btrim(input_booking ->> 'room_upgrade_name'), ''),
      coalesce(nullif(input_booking ->> 'room_upgrade_total', '')::numeric, 0),
      greatest(1, coalesce(nullif(input_booking ->> 'guest_count', '')::integer, 1)),
      coalesce(nullif(btrim(input_booking ->> 'booking_status'), ''), 'active')
    )
    returning id into booking_id;
  else
    booking_id := (input_booking ->> 'id')::uuid;
    expected_booking_updated_at := nullif(input_booking ->> 'expected_updated_at', '')::timestamptz;

    if expected_booking_updated_at is null then
      raise exception 'The booking version is required for an update.' using errcode = '22023';
    end if;

    update public.guest_bookings
    set
      guest_name = nullif(btrim(input_booking ->> 'guest_name'), ''),
      guest_email = normalized_email,
      trip_name = coalesce(nullif(btrim(input_booking ->> 'trip_name'), ''), trip_name),
      package_type = nullif(input_booking ->> 'package_type', ''),
      package_name = nullif(btrim(input_booking ->> 'package_name'), ''),
      itinerary_pdf_url = nullif(btrim(input_booking ->> 'itinerary_pdf_url'), ''),
      total_trip_price = coalesce(nullif(input_booking ->> 'total_trip_price', '')::numeric, 0),
      deposit_amount = coalesce(nullif(input_booking ->> 'deposit_amount', '')::numeric, 0),
      room_upgrade_enabled = coalesce((input_booking ->> 'room_upgrade_enabled')::boolean, false),
      room_upgrade_name = nullif(btrim(input_booking ->> 'room_upgrade_name'), ''),
      room_upgrade_total = coalesce(nullif(input_booking ->> 'room_upgrade_total', '')::numeric, 0),
      guest_count = greatest(1, coalesce(nullif(input_booking ->> 'guest_count', '')::integer, 1)),
      booking_status = coalesce(nullif(btrim(input_booking ->> 'booking_status'), ''), 'active')
    where id = booking_id
      and trip_slug = normalized_trip_slug
      and updated_at = expected_booking_updated_at;

    get diagnostics affected_rows = row_count;
    if affected_rows <> 1 then
      raise exception 'This booking changed in another admin session. Reload before saving.' using errcode = '40001';
    end if;
  end if;

  for installment in
    select value from jsonb_array_elements(coalesce(input_installments, '[]'::jsonb))
  loop
    if coalesce(installment ->> 'id', '') ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then
      installment_id := (installment ->> 'id')::uuid;
      expected_installment_updated_at := nullif(installment ->> 'expected_updated_at', '')::timestamptz;

      if expected_installment_updated_at is null then
        raise exception 'The payment version is required for an update.' using errcode = '22023';
      end if;

      update public.payment_installments
      set
        payment_label = nullif(btrim(installment ->> 'payment_label'), ''),
        payment_type = coalesce(nullif(installment ->> 'payment_type', ''), 'other'),
        base_amount = coalesce(nullif(installment ->> 'base_amount', '')::numeric, 0),
        upgrade_portion = coalesce(nullif(installment ->> 'upgrade_portion', '')::numeric, 0),
        discount_amount = coalesce(nullif(installment ->> 'discount_amount', '')::numeric, 0),
        total_amount = coalesce(nullif(installment ->> 'total_amount', '')::numeric, 0),
        currency = upper(coalesce(nullif(btrim(installment ->> 'currency'), ''), 'USD')),
        due_date = nullif(installment ->> 'due_date', '')::date,
        status = coalesce(nullif(installment ->> 'status', ''), 'upcoming'),
        shopify_payment_link = nullif(btrim(installment ->> 'shopify_payment_link'), ''),
        paid_at = case
          when coalesce(installment ->> 'status', 'upcoming') = 'paid'
            then coalesce(nullif(installment ->> 'paid_at', '')::timestamptz, now())
          else null
        end,
        admin_notes = nullif(btrim(installment ->> 'admin_notes'), ''),
        sort_order = installment_sort_order
      where id = installment_id
        and guest_booking_id = booking_id
        and updated_at = expected_installment_updated_at;

      get diagnostics affected_rows = row_count;
      if affected_rows <> 1 then
        raise exception 'A payment changed in another admin session. Reload before saving.' using errcode = '40001';
      end if;
    else
      insert into public.payment_installments (
        guest_booking_id,
        payment_label,
        payment_type,
        base_amount,
        upgrade_portion,
        discount_amount,
        total_amount,
        currency,
        due_date,
        status,
        shopify_payment_link,
        paid_at,
        admin_notes,
        sort_order
      )
      values (
        booking_id,
        nullif(btrim(installment ->> 'payment_label'), ''),
        coalesce(nullif(installment ->> 'payment_type', ''), 'other'),
        coalesce(nullif(installment ->> 'base_amount', '')::numeric, 0),
        coalesce(nullif(installment ->> 'upgrade_portion', '')::numeric, 0),
        coalesce(nullif(installment ->> 'discount_amount', '')::numeric, 0),
        coalesce(nullif(installment ->> 'total_amount', '')::numeric, 0),
        upper(coalesce(nullif(btrim(installment ->> 'currency'), ''), 'USD')),
        nullif(installment ->> 'due_date', '')::date,
        coalesce(nullif(installment ->> 'status', ''), 'upcoming'),
        nullif(btrim(installment ->> 'shopify_payment_link'), ''),
        case
          when coalesce(installment ->> 'status', 'upcoming') = 'paid'
            then coalesce(nullif(installment ->> 'paid_at', '')::timestamptz, now())
          else null
        end,
        nullif(btrim(installment ->> 'admin_notes'), ''),
        installment_sort_order
      );
    end if;

    installment_sort_order := installment_sort_order + 1;
  end loop;

  for deleted_installment in
    select value from jsonb_array_elements(coalesce(input_deleted_installments, '[]'::jsonb))
  loop
    installment_id := (deleted_installment ->> 'id')::uuid;
    expected_installment_updated_at := nullif(deleted_installment ->> 'expected_updated_at', '')::timestamptz;

    if expected_installment_updated_at is null then
      raise exception 'The deleted payment version is required.' using errcode = '22023';
    end if;

    delete from public.payment_installments
    where id = installment_id
      and guest_booking_id = booking_id
      and updated_at = expected_installment_updated_at;

    get diagnostics affected_rows = row_count;
    if affected_rows <> 1 then
      raise exception 'A payment changed in another admin session. Reload before saving.' using errcode = '40001';
    end if;
  end loop;

  update public.guest_bookings
  set balance_remaining = coalesce((
    select sum(payment.total_amount)
    from public.payment_installments payment
    where payment.guest_booking_id = booking_id
      and payment.payment_type <> 'deposit'
      and payment.status <> 'paid'
  ), 0)
  where id = booking_id
    and trip_slug = normalized_trip_slug;

  return booking_id;
end;
$$;

revoke all on function public.save_portal_booking(text, jsonb, jsonb, jsonb) from public;
grant execute on function public.save_portal_booking(text, jsonb, jsonb, jsonb) to authenticated, service_role;

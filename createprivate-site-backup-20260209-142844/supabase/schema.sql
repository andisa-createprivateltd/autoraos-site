-- CreatePrivate Dealer OS Beta schema (exact beta-ready data contract)
create extension if not exists pgcrypto;

-- A) dealers
create table if not exists public.dealers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brands text[] not null default '{}',
  country text not null default 'South Africa',
  city text not null,
  timezone text not null default 'Africa/Johannesburg',
  business_hours jsonb not null default '{"mon":{"open":"08:00","close":"17:00"},"tue":{"open":"08:00","close":"17:00"},"wed":{"open":"08:00","close":"17:00"},"thu":{"open":"08:00","close":"17:00"},"fri":{"open":"08:00","close":"17:00"}}',
  whatsapp_phone_number text,
  plan text not null default 'starter' check (plan in ('starter', 'growth', 'scale')),
  status text not null default 'active' check (status in ('active', 'paused')),
  ai_config jsonb not null default '{"faqs":[],"booking_rules":{},"escalation_rules":{},"handoff_contacts":[]}',
  created_at timestamptz not null default now()
);

create unique index if not exists dealers_name_city_unique_idx
  on public.dealers (lower(name), lower(city));
create index if not exists dealers_plan_idx on public.dealers (plan);
create index if not exists dealers_status_idx on public.dealers (status);

-- B) users
create table if not exists public.users (
  id uuid primary key,
  dealer_id uuid not null references public.dealers(id) on delete cascade,
  name text not null,
  email text not null,
  role text not null check (role in ('dealer_admin', 'dealer_sales', 'dealer_marketing')),
  is_active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  constraint users_unique_dealer_email unique (dealer_id, email)
);

create index if not exists users_dealer_idx on public.users (dealer_id);
create index if not exists users_role_idx on public.users (role);
create index if not exists users_active_idx on public.users (is_active);

-- C) leads
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null references public.dealers(id) on delete cascade,
  source text not null check (source in ('whatsapp', 'website', 'ads', 'oem')),
  first_contact_at timestamptz not null,
  name text,
  phone text not null,
  vehicle_interest text,
  budget_range text,
  status text not null default 'new' check (status in ('new', 'contacted', 'booked', 'visited', 'sold', 'lost')),
  assigned_user_id uuid references public.users(id) on delete set null,
  last_activity_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists leads_dealer_contact_idx on public.leads (dealer_id, first_contact_at desc);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_source_idx on public.leads (source);
create index if not exists leads_assigned_user_idx on public.leads (assigned_user_id);
create index if not exists leads_last_activity_idx on public.leads (last_activity_at desc);

-- D) conversations
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null references public.dealers(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  channel text not null check (channel in ('whatsapp', 'web')),
  is_open boolean not null default true,
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint conversations_unique_lead unique (lead_id)
);

create index if not exists conversations_dealer_last_message_idx
  on public.conversations (dealer_id, last_message_at desc);
create index if not exists conversations_open_idx on public.conversations (is_open);

-- E) messages
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null references public.dealers(id) on delete cascade,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  direction text not null check (direction in ('inbound', 'outbound')),
  sender_type text not null check (sender_type in ('lead', 'ai', 'human', 'system')),
  sender_user_id uuid references public.users(id) on delete set null,
  content text not null,
  message_type text not null default 'text' check (message_type in ('text', 'button', 'image')),
  provider_message_id text,
  created_at timestamptz not null default now()
);

create index if not exists messages_conversation_created_idx
  on public.messages (conversation_id, created_at desc);
create index if not exists messages_dealer_created_idx
  on public.messages (dealer_id, created_at desc);
create index if not exists messages_sender_type_idx on public.messages (sender_type);

-- F) response_metrics
create table if not exists public.response_metrics (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null references public.dealers(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  first_inbound_at timestamptz not null,
  first_response_at timestamptz not null,
  first_response_by text not null check (first_response_by in ('ai', 'human')),
  response_seconds int not null check (response_seconds >= 0)
);

create unique index if not exists response_metrics_lead_unique_idx
  on public.response_metrics (lead_id);
create index if not exists response_metrics_dealer_response_idx
  on public.response_metrics (dealer_id, first_response_at desc);

-- G) bookings
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null references public.dealers(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  type text not null check (type in ('test_drive', 'call', 'appointment')),
  requested_at timestamptz not null,
  scheduled_for timestamptz not null,
  status text not null default 'booked' check (status in ('booked', 'completed', 'no_show', 'cancelled')),
  created_by text not null check (created_by in ('ai', 'human')),
  created_at timestamptz not null default now()
);

create index if not exists bookings_scheduled_idx on public.bookings (scheduled_for);
create index if not exists bookings_status_idx on public.bookings (status);
create index if not exists bookings_dealer_idx on public.bookings (dealer_id);
create unique index if not exists bookings_unique_scheduled_slot_idx
  on public.bookings (scheduled_for)
  where status in ('booked', 'completed');

-- H) ai_events
create table if not exists public.ai_events (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null references public.dealers(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  event_type text not null check (event_type in ('faq', 'lead_capture', 'booking', 'followup', 'handoff')),
  success boolean not null,
  meta jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists ai_events_dealer_created_idx
  on public.ai_events (dealer_id, created_at desc);
create index if not exists ai_events_event_type_idx on public.ai_events (event_type);

-- I) followups
create table if not exists public.followups (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null references public.dealers(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  type text not null check (type in ('reminder', 'nudge', 'no_show')),
  sent_via text not null check (sent_via in ('template', 'freeform')),
  sent_at timestamptz,
  responded boolean not null default false,
  response_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists followups_dealer_created_idx
  on public.followups (dealer_id, created_at desc);
create index if not exists followups_lead_idx on public.followups (lead_id);

-- J) subscriptions
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null unique references public.dealers(id) on delete cascade,
  plan text not null check (plan in ('starter', 'growth', 'scale')),
  monthly_price int not null check (monthly_price >= 0),
  status text not null check (status in ('trial', 'active', 'overdue', 'cancelled')),
  start_date date not null,
  end_date date,
  created_at timestamptz not null default now()
);

create index if not exists subscriptions_plan_idx on public.subscriptions (plan);
create index if not exists subscriptions_status_idx on public.subscriptions (status);

-- Support tables for site functionality
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  dealership_name text,
  contact_person text not null,
  phone text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists contacts_created_at_idx on public.contacts (created_at desc);

create table if not exists public.availability_windows (
  id bigserial primary key,
  weekday int not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint availability_window_unique unique (weekday, start_time, end_time)
);

create table if not exists public.dealerships_seed (
  id text primary key,
  name text not null,
  brand text not null check (brand in ('Chery', 'Haval', 'Omoda', 'Jaecoo', 'BYD', 'GWM')),
  city text not null,
  suburb text not null,
  province text not null,
  address text not null,
  phone text,
  lat numeric not null,
  lng numeric not null,
  created_at timestamptz not null default now()
);

-- Row-level security
alter table public.dealers enable row level security;
alter table public.users enable row level security;
alter table public.leads enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.response_metrics enable row level security;
alter table public.bookings enable row level security;
alter table public.ai_events enable row level security;
alter table public.followups enable row level security;
alter table public.subscriptions enable row level security;
alter table public.contacts enable row level security;
alter table public.availability_windows enable row level security;
alter table public.dealerships_seed enable row level security;

-- Remove previously permissive policies before applying service-role-only policy set
drop policy if exists public_select_dealers on public.dealers;
drop policy if exists public_insert_dealers on public.dealers;
drop policy if exists public_update_dealers on public.dealers;
drop policy if exists public_select_users on public.users;
drop policy if exists public_insert_users on public.users;
drop policy if exists public_update_users on public.users;
drop policy if exists public_select_leads on public.leads;
drop policy if exists public_insert_leads on public.leads;
drop policy if exists public_update_leads on public.leads;
drop policy if exists public_select_conversations on public.conversations;
drop policy if exists public_insert_conversations on public.conversations;
drop policy if exists public_update_conversations on public.conversations;
drop policy if exists public_select_messages on public.messages;
drop policy if exists public_insert_messages on public.messages;
drop policy if exists public_select_response_metrics on public.response_metrics;
drop policy if exists public_insert_response_metrics on public.response_metrics;
drop policy if exists public_select_bookings on public.bookings;
drop policy if exists public_insert_bookings on public.bookings;
drop policy if exists public_update_bookings on public.bookings;
drop policy if exists public_select_ai_events on public.ai_events;
drop policy if exists public_insert_ai_events on public.ai_events;
drop policy if exists public_select_followups on public.followups;
drop policy if exists public_insert_followups on public.followups;
drop policy if exists public_update_followups on public.followups;
drop policy if exists public_select_subscriptions on public.subscriptions;
drop policy if exists public_insert_subscriptions on public.subscriptions;
drop policy if exists public_update_subscriptions on public.subscriptions;
drop policy if exists public_select_contacts on public.contacts;
drop policy if exists public_insert_contacts on public.contacts;
drop policy if exists public_select_availability_windows on public.availability_windows;
drop policy if exists public_select_dealerships_seed on public.dealerships_seed;

do $$
begin
  -- dealers
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'dealers' and policyname = 'public_select_dealers') then
    create policy public_select_dealers on public.dealers for select to service_role using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'dealers' and policyname = 'public_insert_dealers') then
    create policy public_insert_dealers on public.dealers for insert to service_role with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'dealers' and policyname = 'public_update_dealers') then
    create policy public_update_dealers on public.dealers for update to service_role using (true) with check (true);
  end if;

  -- users
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'users' and policyname = 'public_select_users') then
    create policy public_select_users on public.users for select to service_role using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'users' and policyname = 'public_insert_users') then
    create policy public_insert_users on public.users for insert to service_role with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'users' and policyname = 'public_update_users') then
    create policy public_update_users on public.users for update to service_role using (true) with check (true);
  end if;

  -- leads
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'leads' and policyname = 'public_select_leads') then
    create policy public_select_leads on public.leads for select to service_role using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'leads' and policyname = 'public_insert_leads') then
    create policy public_insert_leads on public.leads for insert to service_role with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'leads' and policyname = 'public_update_leads') then
    create policy public_update_leads on public.leads for update to service_role using (true) with check (true);
  end if;

  -- conversations
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'conversations' and policyname = 'public_select_conversations') then
    create policy public_select_conversations on public.conversations for select to service_role using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'conversations' and policyname = 'public_insert_conversations') then
    create policy public_insert_conversations on public.conversations for insert to service_role with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'conversations' and policyname = 'public_update_conversations') then
    create policy public_update_conversations on public.conversations for update to service_role using (true) with check (true);
  end if;

  -- messages
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'messages' and policyname = 'public_select_messages') then
    create policy public_select_messages on public.messages for select to service_role using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'messages' and policyname = 'public_insert_messages') then
    create policy public_insert_messages on public.messages for insert to service_role with check (true);
  end if;

  -- response_metrics
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'response_metrics' and policyname = 'public_select_response_metrics') then
    create policy public_select_response_metrics on public.response_metrics for select to service_role using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'response_metrics' and policyname = 'public_insert_response_metrics') then
    create policy public_insert_response_metrics on public.response_metrics for insert to service_role with check (true);
  end if;

  -- bookings
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'bookings' and policyname = 'public_select_bookings') then
    create policy public_select_bookings on public.bookings for select to service_role using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'bookings' and policyname = 'public_insert_bookings') then
    create policy public_insert_bookings on public.bookings for insert to service_role with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'bookings' and policyname = 'public_update_bookings') then
    create policy public_update_bookings on public.bookings for update to service_role using (true) with check (true);
  end if;

  -- ai_events
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'ai_events' and policyname = 'public_select_ai_events') then
    create policy public_select_ai_events on public.ai_events for select to service_role using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'ai_events' and policyname = 'public_insert_ai_events') then
    create policy public_insert_ai_events on public.ai_events for insert to service_role with check (true);
  end if;

  -- followups
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'followups' and policyname = 'public_select_followups') then
    create policy public_select_followups on public.followups for select to service_role using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'followups' and policyname = 'public_insert_followups') then
    create policy public_insert_followups on public.followups for insert to service_role with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'followups' and policyname = 'public_update_followups') then
    create policy public_update_followups on public.followups for update to service_role using (true) with check (true);
  end if;

  -- subscriptions
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'subscriptions' and policyname = 'public_select_subscriptions') then
    create policy public_select_subscriptions on public.subscriptions for select to service_role using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'subscriptions' and policyname = 'public_insert_subscriptions') then
    create policy public_insert_subscriptions on public.subscriptions for insert to service_role with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'subscriptions' and policyname = 'public_update_subscriptions') then
    create policy public_update_subscriptions on public.subscriptions for update to service_role using (true) with check (true);
  end if;

  -- contacts
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'contacts' and policyname = 'public_select_contacts') then
    create policy public_select_contacts on public.contacts for select to service_role using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'contacts' and policyname = 'public_insert_contacts') then
    create policy public_insert_contacts on public.contacts for insert to service_role with check (true);
  end if;

  -- availability_windows
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'availability_windows' and policyname = 'public_select_availability_windows') then
    create policy public_select_availability_windows on public.availability_windows for select to service_role using (true);
  end if;

  -- dealerships_seed
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'dealerships_seed' and policyname = 'public_select_dealerships_seed') then
    create policy public_select_dealerships_seed on public.dealerships_seed for select to service_role using (true);
  end if;
end $$;

-- Default booking availability (Mon-Fri)
insert into public.availability_windows (weekday, start_time, end_time, active)
values
  (1, '08:00', '17:00', true),
  (2, '08:00', '17:00', true),
  (3, '08:00', '17:00', true),
  (4, '08:00', '17:00', true),
  (5, '08:00', '17:00', true)
on conflict do nothing;

-- Investor/OEM proof metrics (last 30 days)
drop view if exists public.investor_metrics_30d;

create view public.investor_metrics_30d as
with params as (
  select now() - interval '30 days' as since_ts
),
lead_window as (
  select
    l.id as lead_id,
    l.dealer_id,
    d.name as dealer_name,
    d.timezone,
    d.business_hours,
    l.first_contact_at,
    lower(trim(to_char(timezone(coalesce(d.timezone, 'Africa/Johannesburg'), l.first_contact_at), 'Dy'))) as local_day,
    extract(hour from timezone(coalesce(d.timezone, 'Africa/Johannesburg'), l.first_contact_at))::int as local_hour,
    extract(minute from timezone(coalesce(d.timezone, 'Africa/Johannesburg'), l.first_contact_at))::int as local_minute
  from public.leads l
  join public.dealers d on d.id = l.dealer_id
  where l.first_contact_at >= (select since_ts from params)
),
lead_hours as (
  select
    lw.*,
    coalesce(lw.business_hours -> lw.local_day ->> 'open', '08:00') as open_hhmm,
    coalesce(lw.business_hours -> lw.local_day ->> 'close', '17:00') as close_hhmm
  from lead_window lw
),
lead_flags as (
  select
    lh.*,
    (
      lh.local_hour * 60 + lh.local_minute
    ) as local_minutes,
    (
      split_part(lh.open_hhmm, ':', 1)::int * 60 + split_part(lh.open_hhmm, ':', 2)::int
    ) as open_minutes,
    (
      split_part(lh.close_hhmm, ':', 1)::int * 60 + split_part(lh.close_hhmm, ':', 2)::int
    ) as close_minutes
  from lead_hours lh
),
response_window as (
  select
    rm.dealer_id,
    rm.lead_id,
    rm.response_seconds,
    rm.first_response_by
  from public.response_metrics rm
  where rm.first_inbound_at >= (select since_ts from params)
),
message_window as (
  select
    m.dealer_id,
    count(*) as messages_per_month,
    count(distinct date(timezone('Africa/Johannesburg', m.created_at))) as active_days_30d
  from public.messages m
  where m.created_at >= (select since_ts from params)
  group by m.dealer_id
),
booking_window as (
  select
    b.dealer_id,
    count(*) filter (where b.status in ('booked', 'completed', 'no_show')) as bookings_per_month
  from public.bookings b
  where b.created_at >= (select since_ts from params)
  group by b.dealer_id
),
lead_agg as (
  select
    lf.dealer_id,
    max(lf.dealer_name) as dealer_name,
    count(*) as leads_captured_30d,
    round((count(*)::numeric / 4.2857), 2) as leads_per_week,
    count(*) filter (where (lf.local_minutes < lf.open_minutes or lf.local_minutes >= lf.close_minutes)) as after_hours_leads,
    count(*) filter (
      where (lf.local_minutes < lf.open_minutes or lf.local_minutes >= lf.close_minutes)
        and coalesce(rw.response_seconds, 999999) <= 300
    ) as after_hours_saved,
    percentile_cont(0.5) within group (order by rw.response_seconds) as median_response_seconds,
    avg(rw.response_seconds)::numeric(10,2) as avg_response_seconds,
    round((100.0 * count(*) filter (where rw.first_response_by = 'ai') / nullif(count(rw.lead_id), 0))::numeric, 2) as pct_first_response_by_ai,
    round((100.0 * count(*) filter (where rw.lead_id is not null) / nullif(count(*), 0))::numeric, 2) as response_coverage_pct
  from lead_flags lf
  left join response_window rw on rw.lead_id = lf.lead_id
  group by lf.dealer_id
)
select
  la.dealer_id,
  la.dealer_name,
  coalesce(la.leads_captured_30d, 0) as leads_captured_30d,
  coalesce(la.leads_per_week, 0) as leads_per_week,
  coalesce(mw.messages_per_month, 0) as messages_per_month,
  coalesce(bw.bookings_per_month, 0) as bookings_per_month,
  coalesce(round(la.median_response_seconds::numeric, 2), 0) as median_response_seconds,
  coalesce(la.avg_response_seconds, 0) as avg_response_seconds,
  coalesce(la.pct_first_response_by_ai, 0) as pct_first_response_by_ai,
  coalesce(
    round((100.0 * la.after_hours_saved::numeric / nullif(la.after_hours_leads, 0))::numeric, 2),
    0
  ) as pct_after_hours_leads_saved,
  coalesce(la.response_coverage_pct, 0) as response_coverage_pct,
  coalesce(mw.active_days_30d, 0) as active_days_30d,
  case
    when coalesce(mw.active_days_30d, 0) >= 20 then 'daily'
    when coalesce(mw.active_days_30d, 0) >= 4 then 'weekly'
    else 'low'
  end as usage_frequency
from lead_agg la
left join message_window mw on mw.dealer_id = la.dealer_id
left join booking_window bw on bw.dealer_id = la.dealer_id
order by la.leads_captured_30d desc;

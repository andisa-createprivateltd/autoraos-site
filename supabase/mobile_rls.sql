-- Mobile app RLS policy set for authenticated dealer users.
-- Apply after schema.sql to allow iOS clients to query dealer-scoped rows with anon key + JWT.

begin;

create or replace function public.current_dealer_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select u.dealer_id
  from public.users u
  where u.id = auth.uid()
    and u.is_active = true
  limit 1
$$;

create or replace function public.current_dealer_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select u.role
  from public.users u
  where u.id = auth.uid()
    and u.is_active = true
  limit 1
$$;

create or replace function public.marketing_can_view_messages(target_dealer uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((d.ai_config ->> 'marketing_view_messages')::boolean, false)
  from public.dealers d
  where d.id = target_dealer
  limit 1
$$;

revoke all on function public.current_dealer_id() from public;
revoke all on function public.current_dealer_role() from public;
revoke all on function public.marketing_can_view_messages(uuid) from public;

grant execute on function public.current_dealer_id() to authenticated, service_role;
grant execute on function public.current_dealer_role() to authenticated, service_role;
grant execute on function public.marketing_can_view_messages(uuid) to authenticated, service_role;

grant select on public.dealers to authenticated;
grant select, update on public.users to authenticated;
grant select, update on public.leads to authenticated;
grant select, update on public.conversations to authenticated;
grant select, insert on public.messages to authenticated;
grant select on public.response_metrics to authenticated;
grant select, insert, update on public.bookings to authenticated;
grant select, insert on public.ai_events to authenticated;
grant select, update on public.followups to authenticated;
grant select on public.subscriptions to authenticated;

drop policy if exists users_authenticated_select on public.users;
drop policy if exists users_authenticated_update_admin on public.users;
drop policy if exists dealers_authenticated_select on public.dealers;
drop policy if exists dealers_authenticated_update_admin on public.dealers;
drop policy if exists leads_authenticated_select on public.leads;
drop policy if exists leads_authenticated_write_sales_admin on public.leads;
drop policy if exists conversations_authenticated_select on public.conversations;
drop policy if exists conversations_authenticated_write_sales_admin on public.conversations;
drop policy if exists messages_authenticated_select on public.messages;
drop policy if exists messages_authenticated_insert_sales_admin on public.messages;
drop policy if exists response_metrics_authenticated_select on public.response_metrics;
drop policy if exists bookings_authenticated_select on public.bookings;
drop policy if exists bookings_authenticated_insert_sales_admin on public.bookings;
drop policy if exists bookings_authenticated_update_sales_admin on public.bookings;
drop policy if exists ai_events_authenticated_select on public.ai_events;
drop policy if exists ai_events_authenticated_insert_sales_admin on public.ai_events;
drop policy if exists followups_authenticated_select on public.followups;
drop policy if exists followups_authenticated_update_sales_admin on public.followups;
drop policy if exists subscriptions_authenticated_select on public.subscriptions;

-- users
create policy users_authenticated_select on public.users
  for select to authenticated
  using (dealer_id = public.current_dealer_id());

create policy users_authenticated_update_admin on public.users
  for update to authenticated
  using (
    dealer_id = public.current_dealer_id()
    and public.current_dealer_role() = 'dealer_admin'
  )
  with check (
    dealer_id = public.current_dealer_id()
    and public.current_dealer_role() = 'dealer_admin'
  );

-- dealers
create policy dealers_authenticated_select on public.dealers
  for select to authenticated
  using (id = public.current_dealer_id());

create policy dealers_authenticated_update_admin on public.dealers
  for update to authenticated
  using (
    id = public.current_dealer_id()
    and public.current_dealer_role() = 'dealer_admin'
  )
  with check (
    id = public.current_dealer_id()
    and public.current_dealer_role() = 'dealer_admin'
  );

-- leads
create policy leads_authenticated_select on public.leads
  for select to authenticated
  using (dealer_id = public.current_dealer_id());

create policy leads_authenticated_write_sales_admin on public.leads
  for update to authenticated
  using (
    dealer_id = public.current_dealer_id()
    and public.current_dealer_role() in ('dealer_admin', 'dealer_sales')
  )
  with check (
    dealer_id = public.current_dealer_id()
    and public.current_dealer_role() in ('dealer_admin', 'dealer_sales')
  );

-- conversations
create policy conversations_authenticated_select on public.conversations
  for select to authenticated
  using (dealer_id = public.current_dealer_id());

create policy conversations_authenticated_write_sales_admin on public.conversations
  for update to authenticated
  using (
    dealer_id = public.current_dealer_id()
    and public.current_dealer_role() in ('dealer_admin', 'dealer_sales')
  )
  with check (
    dealer_id = public.current_dealer_id()
    and public.current_dealer_role() in ('dealer_admin', 'dealer_sales')
  );

-- messages
create policy messages_authenticated_select on public.messages
  for select to authenticated
  using (
    dealer_id = public.current_dealer_id()
    and (
      public.current_dealer_role() in ('dealer_admin', 'dealer_sales')
      or (
        public.current_dealer_role() = 'dealer_marketing'
        and public.marketing_can_view_messages(dealer_id)
      )
    )
  );

create policy messages_authenticated_insert_sales_admin on public.messages
  for insert to authenticated
  with check (
    dealer_id = public.current_dealer_id()
    and public.current_dealer_role() in ('dealer_admin', 'dealer_sales')
  );

-- response_metrics
create policy response_metrics_authenticated_select on public.response_metrics
  for select to authenticated
  using (dealer_id = public.current_dealer_id());

-- bookings
create policy bookings_authenticated_select on public.bookings
  for select to authenticated
  using (dealer_id = public.current_dealer_id());

create policy bookings_authenticated_insert_sales_admin on public.bookings
  for insert to authenticated
  with check (
    dealer_id = public.current_dealer_id()
    and public.current_dealer_role() in ('dealer_admin', 'dealer_sales')
  );

create policy bookings_authenticated_update_sales_admin on public.bookings
  for update to authenticated
  using (
    dealer_id = public.current_dealer_id()
    and public.current_dealer_role() in ('dealer_admin', 'dealer_sales')
  )
  with check (
    dealer_id = public.current_dealer_id()
    and public.current_dealer_role() in ('dealer_admin', 'dealer_sales')
  );

-- ai_events
create policy ai_events_authenticated_select on public.ai_events
  for select to authenticated
  using (dealer_id = public.current_dealer_id());

create policy ai_events_authenticated_insert_sales_admin on public.ai_events
  for insert to authenticated
  with check (
    dealer_id = public.current_dealer_id()
    and public.current_dealer_role() in ('dealer_admin', 'dealer_sales')
  );

-- followups
create policy followups_authenticated_select on public.followups
  for select to authenticated
  using (dealer_id = public.current_dealer_id());

create policy followups_authenticated_update_sales_admin on public.followups
  for update to authenticated
  using (
    dealer_id = public.current_dealer_id()
    and public.current_dealer_role() in ('dealer_admin', 'dealer_sales')
  )
  with check (
    dealer_id = public.current_dealer_id()
    and public.current_dealer_role() in ('dealer_admin', 'dealer_sales')
  );

-- subscriptions
create policy subscriptions_authenticated_select on public.subscriptions
  for select to authenticated
  using (dealer_id = public.current_dealer_id());

grant select on public.investor_metrics_30d to authenticated;

commit;

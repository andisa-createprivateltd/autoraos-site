begin;

create or replace function public.v_kpi_sla_compliance(
  p_window text default '7d',
  p_dealership_id uuid default null,
  p_group_id uuid default null,
  p_dealership_ids uuid[] default null,
  p_start timestamptz default null,
  p_end timestamptz default null
)
returns table(
  timeframe text,
  compliance_pct numeric,
  compliant_count integer,
  total_count integer,
  numerator text,
  denominator text
)
language sql
stable
as $$
  with bounds as (
    select * from public.autora_window_bounds(p_window, p_start, p_end)
  ),
  scoped as (
    select o.*
    from public.autora_operational_opportunities o
    cross join bounds b
    where o.lead_created_at between b.window_start and b.window_end
      and (p_group_id is null or o.group_id = p_group_id)
      and (p_dealership_id is null or o.dealership_id = p_dealership_id)
      and (p_dealership_ids is null or o.dealership_id = any(p_dealership_ids))
      and o.status not in ('completed', 'lost')
  )
  select
    p_window,
    coalesce(round((count(*) filter (where not coalesce(scoped.is_overdue, false) and scoped.breached_at is null)::numeric / nullif(count(*), 0)) * 100, 2), 100),
    count(*) filter (where not coalesce(scoped.is_overdue, false) and scoped.breached_at is null)::integer,
    count(*)::integer,
    concat(count(*) filter (where not coalesce(scoped.is_overdue, false) and scoped.breached_at is null), ' compliant opportunities'),
    concat(count(*) filter (where not coalesce(scoped.is_overdue, false) and scoped.breached_at is null), '/', count(*))
  from scoped
$$;

create or replace function public.v_kpi_hot_unbooked(
  p_window text default '7d',
  p_dealership_id uuid default null,
  p_group_id uuid default null,
  p_dealership_ids uuid[] default null,
  p_start timestamptz default null,
  p_end timestamptz default null
)
returns table(
  timeframe text,
  hot_unbooked_count integer,
  total_hot_count integer,
  numerator text,
  denominator text
)
language sql
stable
as $$
  with bounds as (
    select * from public.autora_window_bounds(p_window, p_start, p_end)
  ),
  scoped as (
    select o.*
    from public.autora_operational_opportunities o
    cross join bounds b
    where o.lead_created_at between b.window_start and b.window_end
      and (p_group_id is null or o.group_id = p_group_id)
      and (p_dealership_id is null or o.dealership_id = p_dealership_id)
      and (p_dealership_ids is null or o.dealership_id = any(p_dealership_ids))
      and o.status not in ('completed', 'lost')
  )
  select
    p_window,
    count(*) filter (where scoped.hot_not_booked)::integer,
    count(*) filter (where scoped.temperature = 'hot')::integer,
    concat(count(*) filter (where scoped.hot_not_booked), ' hot leads not booked'),
    concat(count(*) filter (where scoped.hot_not_booked), '/', count(*) filter (where scoped.temperature = 'hot'))
  from scoped
$$;

create or replace function public.v_kpi_breaches_7d(
  p_dealership_id uuid default null,
  p_group_id uuid default null,
  p_dealership_ids uuid[] default null
)
returns table(
  timeframe text,
  breach_count integer,
  open_breach_count integer,
  numerator text,
  denominator text
)
language sql
stable
as $$
  with bounds as (
    select * from public.autora_window_bounds('7d', null, null)
  ),
  scoped as (
    select e.*
    from public.autora_sla_events e
    cross join bounds b
    where e.created_at between b.window_start and b.window_end
      and (p_group_id is null or e.group_id = p_group_id)
      and (p_dealership_id is null or e.dealership_id = p_dealership_id)
      and (p_dealership_ids is null or e.dealership_id = any(p_dealership_ids))
  )
  select
    '7d'::text,
    count(*) filter (where breached_at is not null)::integer,
    count(*) filter (where breached_at is not null and satisfied_at is null)::integer,
    concat(count(*) filter (where breached_at is not null and satisfied_at is null), ' open breaches'),
    concat(count(*) filter (where breached_at is not null), '/', count(*))
  from scoped
$$;

drop materialized view if exists public.autora_store_command_metrics_mv;
create materialized view public.autora_store_command_metrics_mv as
with windows as (
  select
    'today'::text as timeframe,
    date_trunc('day', timezone('Africa/Johannesburg', now())) at time zone 'Africa/Johannesburg' as window_start,
    now() as window_end
  union all
  select '7d', now() - interval '7 day', now()
  union all
  select '30d', now() - interval '30 day', now()
),
scoped as (
  select
    w.timeframe,
    w.window_start,
    w.window_end,
    o.group_id,
    o.dealership_id,
    o.estimated_value,
    o.close_probability,
    o.sla_risk_weight,
    o.predicted_breach_risk_pct,
    o.hot_not_booked,
    o.is_overdue,
    o.breached_at,
    o.status,
    o.lead_id
  from windows w
  join public.autora_operational_opportunities o
    on o.lead_created_at between w.window_start and w.window_end
   and o.status not in ('completed', 'lost')
),
response_rollup as (
  select
    w.timeframe,
    e.dealership_id,
    percentile_cont(0.5) within group (order by extract(epoch from (e.satisfied_at - e.created_at)))::numeric(12,2) as median_response_seconds
  from windows w
  join public.autora_sla_events e
    on e.created_at between w.window_start and w.window_end
   and e.satisfied_at is not null
  group by w.timeframe, e.dealership_id
)
select
  s.timeframe,
  s.group_id,
  s.dealership_id,
  d.name as dealership_name,
  d.city as dealership_city,
  count(distinct s.lead_id)::integer as active_lead_count,
  coalesce(sum(s.estimated_value * s.close_probability * s.sla_risk_weight), 0)::numeric(14,2) as revenue_at_risk,
  coalesce(round((count(*) filter (where not coalesce(s.is_overdue, false) and s.breached_at is null)::numeric / nullif(count(*), 0)) * 100, 2), 100) as sla_compliance_pct,
  count(*) filter (where s.breached_at is not null)::integer as breach_count,
  count(*) filter (where s.hot_not_booked)::integer as hot_unbooked_count,
  coalesce(round(avg(s.predicted_breach_risk_pct), 2), 0)::numeric(8,2) as risk_score_pct,
  coalesce(r.median_response_seconds, 0)::numeric(12,2) as median_response_seconds,
  now() as last_refreshed_at
from scoped s
join public.autora_dealerships d on d.id = s.dealership_id
left join response_rollup r on r.timeframe = s.timeframe and r.dealership_id = s.dealership_id
group by s.timeframe, s.group_id, s.dealership_id, d.name, d.city, r.median_response_seconds;

create unique index if not exists idx_autora_store_command_metrics_mv_timeframe_dealer
  on public.autora_store_command_metrics_mv(timeframe, dealership_id);
create index if not exists idx_autora_store_command_metrics_mv_group_timeframe
  on public.autora_store_command_metrics_mv(group_id, timeframe);
create index if not exists idx_autora_store_command_metrics_mv_risk
  on public.autora_store_command_metrics_mv(timeframe, risk_score_pct desc, revenue_at_risk desc);

create or replace function public.autora_refresh_store_command_metrics()
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  v_refreshed_at timestamptz := now();
begin
  refresh materialized view public.autora_store_command_metrics_mv;
  return v_refreshed_at;
end;
$$;

grant execute on function public.autora_refresh_store_command_metrics() to authenticated, service_role;

create or replace function public.v_store_risk_heatmap(
  p_window text default '7d',
  p_dealership_id uuid default null,
  p_group_id uuid default null,
  p_dealership_ids uuid[] default null
)
returns table(
  timeframe text,
  group_id uuid,
  dealership_id uuid,
  dealership_name text,
  dealership_city text,
  active_lead_count integer,
  revenue_at_risk numeric,
  sla_compliance_pct numeric,
  breach_count integer,
  hot_unbooked_count integer,
  risk_score_pct numeric,
  median_response_seconds numeric,
  severity text,
  last_refreshed_at timestamptz
)
language sql
stable
as $$
  select
    m.timeframe,
    m.group_id,
    m.dealership_id,
    m.dealership_name,
    m.dealership_city,
    m.active_lead_count,
    m.revenue_at_risk,
    m.sla_compliance_pct,
    m.breach_count,
    m.hot_unbooked_count,
    m.risk_score_pct,
    m.median_response_seconds,
    case
      when m.sla_compliance_pct >= 95 then 'green'
      when m.sla_compliance_pct >= 85 then 'amber'
      else 'red'
    end,
    m.last_refreshed_at
  from public.autora_store_command_metrics_mv m
  where m.timeframe = p_window
    and (p_group_id is null or m.group_id = p_group_id)
    and (p_dealership_id is null or m.dealership_id = p_dealership_id)
    and (p_dealership_ids is null or m.dealership_id = any(p_dealership_ids))
  order by m.risk_score_pct desc, m.revenue_at_risk desc, m.dealership_name asc
$$;

create index if not exists idx_autora_bookings_dealer_status_scheduled
  on public.autora_bookings(dealership_id, status, scheduled_for);
create index if not exists idx_autora_leads_dealer_status_created
  on public.autora_leads(dealership_id, status, created_at desc);
create index if not exists idx_autora_messages_dealer_direction_created
  on public.autora_messages(dealership_id, direction, created_at desc);

create or replace function public.v_recover_now_queue(
  p_dealership_id uuid default null,
  p_group_id uuid default null,
  p_dealership_ids uuid[] default null,
  p_include_all_time boolean default false
)
returns table(
  sla_event_id uuid,
  dealership_id uuid,
  dealership_name text,
  lead_id uuid,
  lead_name text,
  conversation_id uuid,
  risk_score_pct integer,
  revenue_at_risk numeric,
  issue_type text,
  queue_state text,
  due_at timestamptz,
  breached_at timestamptz,
  countdown_seconds integer,
  age_hours numeric
)
language sql
stable
as $$
  select
    o.sla_event_id,
    o.dealership_id,
    d.name,
    o.lead_id,
    coalesce(o.full_name, 'Unknown lead'),
    o.conversation_id,
    o.predicted_breach_risk_pct,
    (o.estimated_value * o.close_probability * o.sla_risk_weight)::numeric(14,2),
    case
      when o.after_hours_flag then 'After-hours response pressure'
      when o.no_show_risk then 'No-show risk without reminder'
      when o.hot_not_booked then 'Hot lead not booked'
      when o.assigned_to is null then 'Unassigned revenue opportunity'
      when o.breached_at is not null then 'Open SLA breach'
      else 'Critical response deadline'
    end,
    case
      when o.breached_at is not null then 'breached'
      when o.response_due_at <= now() then 'due_now'
      else 'critical'
    end,
    o.response_due_at,
    o.breached_at,
    case
      when o.response_due_at is null then null
      else round(extract(epoch from (o.response_due_at - now())))::integer
    end,
    case
      when o.breached_at is null then 0
      else round(extract(epoch from (now() - o.breached_at)) / 3600, 2)
    end
  from public.autora_operational_opportunities o
  join public.autora_dealerships d on d.id = o.dealership_id
  where o.sla_event_id is not null
    and (
      o.breached_at is not null
      or (o.response_due_at is not null and o.response_due_at <= now() + interval '15 minute' and o.predicted_breach_risk_pct >= 70)
    )
    and (p_include_all_time or o.breached_at is null or o.breached_at >= now() - interval '48 hour')
    and o.status not in ('completed', 'lost')
    and (p_group_id is null or o.group_id = p_group_id)
    and (p_dealership_id is null or o.dealership_id = p_dealership_id)
    and (p_dealership_ids is null or o.dealership_id = any(p_dealership_ids))
    and not exists (
      select 1
      from public.autora_sla_escalations se
      where se.sla_event_id = o.sla_event_id
        and se.action in ('closed', 'written_off')
    )
  order by
    case when o.breached_at is not null then 0 else 1 end,
    o.predicted_breach_risk_pct desc,
    (o.estimated_value * o.close_probability * o.sla_risk_weight) desc,
    coalesce(o.response_due_at, o.breached_at) asc
$$;

create or replace function public.v_exec_forecast_30_60_90(
  p_dealership_id uuid default null,
  p_group_id uuid default null,
  p_dealership_ids uuid[] default null,
  p_sla_improvement_delta numeric default 0
)
returns table(
  revenue_at_risk_30d numeric,
  conversion_impact_60d numeric,
  recovery_potential_90d numeric,
  baseline_close_rate numeric,
  current_sla_compliance numeric,
  degradation_factor numeric,
  average_opportunity_value numeric,
  simulated_sla_compliance numeric,
  numerator_30d text,
  numerator_60d text,
  numerator_90d text
)
language sql
stable
as $$
  with scoped as (
    select *
    from public.autora_operational_opportunities o
    where (p_group_id is null or o.group_id = p_group_id)
      and (p_dealership_id is null or o.dealership_id = p_dealership_id)
      and (p_dealership_ids is null or o.dealership_id = any(p_dealership_ids))
      and o.status not in ('completed', 'lost')
  ),
  summary as (
    select
      count(*)::numeric as lead_volume,
      count(*) filter (where breached_at is not null)::numeric as open_breaches,
      count(*) filter (where hot_not_booked)::numeric as missed_hot,
      coalesce(avg(estimated_value), 0)::numeric as avg_value,
      coalesce(avg(close_probability), 0)::numeric as baseline_close_rate,
      coalesce(avg(case when not coalesce(is_overdue, false) and breached_at is null then 1 else 0 end), 1)::numeric as current_sla_compliance
    from scoped
  ),
  adjusted as (
    select
      lead_volume,
      open_breaches,
      missed_hot,
      avg_value,
      baseline_close_rate,
      current_sla_compliance,
      least(1::numeric, current_sla_compliance + greatest(0::numeric, p_sla_improvement_delta) / 100::numeric) as simulated_sla_compliance
    from summary
  )
  select
    round(open_breaches * avg_value * baseline_close_rate * greatest(0.05::numeric, 1 - current_sla_compliance), 2),
    round(missed_hot * avg_value * least(0.65::numeric, baseline_close_rate + (greatest(0::numeric, p_sla_improvement_delta) / 100::numeric * 0.35)), 2),
    round((simulated_sla_compliance - current_sla_compliance) * lead_volume * avg_value, 2),
    baseline_close_rate,
    current_sla_compliance,
    greatest(0.05::numeric, 1 - current_sla_compliance),
    avg_value,
    simulated_sla_compliance,
    'open_breaches × avg_opportunity_value × baseline_close_rate × degradation_factor',
    'missed_hot_leads × avg_opportunity_value × adjusted_close_rate',
    'sla_delta × lead_volume × avg_opportunity_value'
  from adjusted
$$;

create or replace function public.autora_dashboard_snapshot(
  p_window text default '7d',
  p_dealership_id uuid default null,
  p_group_id uuid default null,
  p_dealership_ids uuid[] default null,
  p_start timestamptz default null,
  p_end timestamptz default null,
  p_sla_improvement_delta numeric default 0
)
returns jsonb
language plpgsql
stable
as $$
declare
  v_revenue record;
  v_sla record;
  v_breaches record;
  v_breaches_7d record;
  v_response record;
  v_hot_unbooked record;
  v_bookings record;
  v_forecast record;
  v_distribution jsonb;
  v_recover jsonb;
  v_audit jsonb;
  v_heatmap jsonb;
  v_window record;
  v_last_updated timestamptz;
begin
  select * into v_revenue from public.v_kpi_revenue_at_risk(p_window, p_dealership_id, p_group_id, p_dealership_ids, p_start, p_end);
  select * into v_sla from public.v_kpi_sla_compliance(p_window, p_dealership_id, p_group_id, p_dealership_ids, p_start, p_end);
  select * into v_breaches from public.v_kpi_sla_breaches(p_window, p_dealership_id, p_group_id, p_dealership_ids, p_start, p_end);
  select * into v_breaches_7d from public.v_kpi_breaches_7d(p_dealership_id, p_group_id, p_dealership_ids);
  select * into v_response from public.v_kpi_response_time_median(p_window, p_dealership_id, p_group_id, p_dealership_ids, p_start, p_end);
  select * into v_hot_unbooked from public.v_kpi_hot_unbooked(p_window, p_dealership_id, p_group_id, p_dealership_ids, p_start, p_end);
  select * into v_bookings from public.v_kpi_bookings_summary(p_window, p_dealership_id, p_group_id, p_dealership_ids, p_start, p_end);
  select * into v_forecast from public.v_exec_forecast_30_60_90(p_dealership_id, p_group_id, p_dealership_ids, p_sla_improvement_delta);
  select * into v_window from public.autora_window_bounds(p_window, p_start, p_end);

  select max(last_refreshed_at) into v_last_updated
  from public.v_store_risk_heatmap(p_window, p_dealership_id, p_group_id, p_dealership_ids);

  select coalesce(jsonb_agg(jsonb_build_object(
    'temperature', temperature,
    'count', lead_count,
    'numerator', numerator,
    'denominator', denominator
  )), '[]'::jsonb)
  into v_distribution
  from public.v_kpi_hot_warm_cold_distribution(p_window, p_dealership_id, p_group_id, p_dealership_ids, p_start, p_end);

  select coalesce(jsonb_agg(jsonb_build_object(
    'timeframe', timeframe,
    'group_id', group_id,
    'dealership_id', dealership_id,
    'dealership_name', dealership_name,
    'dealership_city', dealership_city,
    'active_lead_count', active_lead_count,
    'revenue_at_risk', revenue_at_risk,
    'sla_compliance_pct', sla_compliance_pct,
    'breach_count', breach_count,
    'hot_unbooked_count', hot_unbooked_count,
    'risk_score_pct', risk_score_pct,
    'median_response_seconds', median_response_seconds,
    'severity', severity,
    'last_refreshed_at', last_refreshed_at
  ) order by risk_score_pct desc, revenue_at_risk desc), '[]'::jsonb)
  into v_heatmap
  from public.v_store_risk_heatmap(p_window, p_dealership_id, p_group_id, p_dealership_ids);

  select coalesce(jsonb_agg(jsonb_build_object(
    'sla_event_id', sla_event_id,
    'dealership_id', dealership_id,
    'dealership_name', dealership_name,
    'lead_id', lead_id,
    'lead_name', lead_name,
    'conversation_id', conversation_id,
    'risk_score_pct', risk_score_pct,
    'revenue_at_risk', revenue_at_risk,
    'issue_type', issue_type,
    'queue_state', queue_state,
    'due_at', due_at,
    'breached_at', breached_at,
    'countdown_seconds', countdown_seconds,
    'age_hours', age_hours
  )), '[]'::jsonb)
  into v_recover
  from public.v_recover_now_queue(p_dealership_id, p_group_id, p_dealership_ids, false);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id,
    'at', a.created_at,
    'action', a.action,
    'entity_type', a.entity_type,
    'entity_id', a.entity_id,
    'dealer_id', a.dealership_id,
    'metadata', a.metadata
  ) order by a.created_at desc), '[]'::jsonb)
  into v_audit
  from (
    select *
    from public.autora_audit_logs a
    where (p_group_id is null or a.group_id = p_group_id)
      and (p_dealership_id is null or a.dealership_id = p_dealership_id)
      and (p_dealership_ids is null or a.dealership_id = any(p_dealership_ids))
      and a.created_at between v_window.window_start and v_window.window_end
    order by a.created_at desc
    limit 25
  ) a;

  return jsonb_build_object(
    'timeframe', p_window,
    'window_start', v_window.window_start,
    'window_end', v_window.window_end,
    'revenue_at_risk', coalesce(v_revenue.revenue_at_risk, 0),
    'revenue_at_risk_count', coalesce(v_revenue.opportunity_count, 0),
    'average_deal_value', coalesce(v_revenue.average_deal_value, 0),
    'average_close_probability', coalesce(v_revenue.average_close_probability, 0),
    'sla_compliance_pct', coalesce(v_sla.compliance_pct, 100),
    'sla_compliance_count', coalesce(v_sla.compliant_count, 0),
    'sla_compliance_total', coalesce(v_sla.total_count, 0),
    'sla_compliance_numerator', coalesce(v_sla.numerator, '0 compliant opportunities'),
    'sla_compliance_denominator', coalesce(v_sla.denominator, '0/0'),
    'sla_breaches_total', coalesce(v_breaches.breach_count, 0),
    'sla_breaches_open', coalesce(v_breaches.open_breach_count, 0),
    'breaches_7d_total', coalesce(v_breaches_7d.breach_count, 0),
    'breaches_7d_open', coalesce(v_breaches_7d.open_breach_count, 0),
    'hot_unbooked_total', coalesce(v_hot_unbooked.hot_unbooked_count, 0),
    'hot_total', coalesce(v_hot_unbooked.total_hot_count, 0),
    'response_time_median_seconds', coalesce(v_response.median_response_seconds, 0),
    'response_time_count', coalesce(v_response.response_count, 0),
    'bookings', jsonb_build_object(
      'requested', coalesce(v_bookings.requested_count, 0),
      'confirmed', coalesce(v_bookings.confirmed_count, 0),
      'rescheduled', coalesce(v_bookings.rescheduled_count, 0),
      'no_show', coalesce(v_bookings.no_show_count, 0),
      'completed', coalesce(v_bookings.completed_count, 0),
      'cancelled', coalesce(v_bookings.cancelled_count, 0),
      'due_today', coalesce(v_bookings.due_today_count, 0)
    ),
    'temperature_distribution', v_distribution,
    'store_heatmap', v_heatmap,
    'recover_now', v_recover,
    'forecast', jsonb_build_object(
      'revenue_at_risk_30d', coalesce(v_forecast.revenue_at_risk_30d, 0),
      'conversion_impact_60d', coalesce(v_forecast.conversion_impact_60d, 0),
      'recovery_potential_90d', coalesce(v_forecast.recovery_potential_90d, 0),
      'baseline_close_rate', coalesce(v_forecast.baseline_close_rate, 0),
      'current_sla_compliance', coalesce(v_forecast.current_sla_compliance, 0),
      'degradation_factor', coalesce(v_forecast.degradation_factor, 0),
      'average_opportunity_value', coalesce(v_forecast.average_opportunity_value, 0),
      'simulated_sla_compliance', coalesce(v_forecast.simulated_sla_compliance, 0),
      'simulation_delta_pct', greatest(coalesce(p_sla_improvement_delta, 0), 0),
      'formula_30d', v_forecast.numerator_30d,
      'formula_60d', v_forecast.numerator_60d,
      'formula_90d', v_forecast.numerator_90d
    ),
    'audit_logs', v_audit,
    'last_updated', coalesce(v_last_updated, now())
  );
end;
$$;

grant execute on function public.v_kpi_sla_compliance(text, uuid, uuid, uuid[], timestamptz, timestamptz) to authenticated, service_role;
grant execute on function public.v_kpi_hot_unbooked(text, uuid, uuid, uuid[], timestamptz, timestamptz) to authenticated, service_role;
grant execute on function public.v_kpi_breaches_7d(uuid, uuid, uuid[]) to authenticated, service_role;
grant execute on function public.v_store_risk_heatmap(text, uuid, uuid, uuid[]) to authenticated, service_role;
grant execute on function public.v_recover_now_queue(uuid, uuid, uuid[], boolean) to authenticated, service_role;
grant execute on function public.v_exec_forecast_30_60_90(uuid, uuid, uuid[], numeric) to authenticated, service_role;
grant execute on function public.autora_dashboard_snapshot(text, uuid, uuid, uuid[], timestamptz, timestamptz, numeric) to authenticated, service_role;

grant select on public.autora_store_command_metrics_mv to authenticated, service_role;

alter table public.autora_sla_policies enable row level security;

drop policy if exists autora_sla_policies_select on public.autora_sla_policies;
drop policy if exists autora_sla_policies_mutate_admin on public.autora_sla_policies;
drop policy if exists autora_sla_policies_select_enterprise on public.autora_sla_policies;
drop policy if exists autora_sla_policies_mutate_enterprise on public.autora_sla_policies;

create policy autora_sla_policies_select_enterprise on public.autora_sla_policies
for select to authenticated
using (
  public.autora_is_platform()
  or (
    public.autora_ctx_role() = 'dealer_admin'
    and (dealership_id = public.autora_ctx_dealership_id() or group_id = public.autora_ctx_group_id())
  )
);

create policy autora_sla_policies_mutate_enterprise on public.autora_sla_policies
for all to authenticated
using (
  public.autora_is_platform()
  or (
    public.autora_ctx_role() = 'dealer_admin'
    and (dealership_id = public.autora_ctx_dealership_id() or group_id = public.autora_ctx_group_id())
  )
)
with check (
  public.autora_is_platform()
  or (
    public.autora_ctx_role() = 'dealer_admin'
    and (dealership_id = public.autora_ctx_dealership_id() or group_id = public.autora_ctx_group_id())
  )
);

commit;

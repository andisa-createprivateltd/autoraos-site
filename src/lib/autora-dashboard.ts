import "server-only";

import { env, hasSupabase } from "@/lib/env";
import { getSupabaseClient } from "@/lib/supabase";
import type { DealerSession } from "@/lib/dealer-auth";
import {
  getEffectiveDealerIdsForSession,
  getSessionDealerScope,
  sanitizeDealerIdForSession
} from "@/lib/dealer-session";

export type CanonicalTimeRange = "today" | "7d" | "30d" | "custom";

export type DashboardFilterInput = {
  dealer?: string;
  range?: string;
  from?: string;
  to?: string;
  simulation?: string;
};

export type DashboardScope = {
  dealerId?: string;
  dealerIds?: string[];
  range: CanonicalTimeRange;
  from?: string;
  to?: string;
  simulationDeltaPct: number;
};

type SessionScopeLike = Pick<DealerSession, "email" | "name" | "role" | "dealerScope" | "defaultDealerId">;

type TooltipDefinition = {
  definition: string;
  formula: string;
  timeframe: string;
  lastUpdated: string;
};

type DashboardSnapshotRow = {
  timeframe: CanonicalTimeRange;
  window_start: string;
  window_end: string;
  revenue_at_risk: number;
  revenue_at_risk_count: number;
  average_deal_value: number;
  average_close_probability: number;
  sla_compliance_pct: number;
  sla_compliance_count: number;
  sla_compliance_total: number;
  sla_compliance_numerator: string;
  sla_compliance_denominator: string;
  sla_breaches_total: number;
  sla_breaches_open: number;
  breaches_7d_total: number;
  breaches_7d_open: number;
  hot_unbooked_total: number;
  hot_total: number;
  response_time_median_seconds: number;
  response_time_count: number;
  bookings: {
    requested: number;
    confirmed: number;
    rescheduled: number;
    no_show: number;
    completed: number;
    cancelled: number;
    due_today: number;
  };
  temperature_distribution: Array<{
    temperature: "hot" | "warm" | "cold";
    count: number;
    numerator: string;
    denominator: string;
  }>;
  store_heatmap: Array<{
    timeframe: string;
    group_id: string | null;
    dealership_id: string;
    dealership_name: string;
    dealership_city: string | null;
    active_lead_count: number;
    revenue_at_risk: number;
    sla_compliance_pct: number;
    breach_count: number;
    hot_unbooked_count: number;
    risk_score_pct: number;
    median_response_seconds: number;
    severity: "green" | "amber" | "red";
    last_refreshed_at: string;
  }>;
  recover_now: Array<{
    sla_event_id: string;
    dealership_id: string;
    dealership_name: string;
    lead_id: string;
    lead_name: string;
    conversation_id: string;
    risk_score_pct: number;
    revenue_at_risk: number;
    issue_type: string;
    queue_state: "breached" | "due_now" | "critical";
    due_at: string | null;
    breached_at: string | null;
    countdown_seconds: number | null;
    age_hours: number;
  }>;
  forecast: {
    revenue_at_risk_30d: number;
    conversion_impact_60d: number;
    recovery_potential_90d: number;
    baseline_close_rate: number;
    current_sla_compliance: number;
    degradation_factor: number;
    average_opportunity_value: number;
    simulated_sla_compliance: number;
    simulation_delta_pct: number;
    formula_30d: string;
    formula_60d: string;
    formula_90d: string;
  };
  audit_logs: Array<{
    id: string;
    at: string;
    action: string;
    entity_type: string;
    entity_id?: string;
    dealer_id?: string;
    metadata?: Record<string, unknown>;
  }>;
  last_updated: string;
};

type AuditLogRow = {
  id: string;
  created_at: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  dealership_id: string | null;
};

type QueueOpportunityRow = {
  lead_id: string;
  dealership_id: string;
  dealership_name: string | null;
  full_name: string | null;
  phone: string | null;
  source: string | null;
  status: string;
  vehicle_interest: string | null;
  assigned_to: string | null;
  last_activity_at: string | null;
  lead_created_at: string;
  predicted_breach_risk_pct: number;
  response_due_at: string | null;
  breached_at: string | null;
  hot_not_booked: boolean;
};

function normalizeRange(value?: string): CanonicalTimeRange {
  const normalized = value?.trim().toLowerCase();
  if (normalized === "today" || normalized === "30d" || normalized === "custom") return normalized;
  return "7d";
}

function normalizeSimulation(value?: string) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return Math.min(parsed, 20);
}

export function resolveDashboardScope(session: SessionScopeLike, filters: DashboardFilterInput): DashboardScope {
  const requestedDealer = filters.dealer?.trim();
  const dealerId = sanitizeDealerIdForSession(session as DealerSession, requestedDealer && requestedDealer !== "all" ? requestedDealer : undefined);
  const dealerIds = getEffectiveDealerIdsForSession(session as DealerSession, dealerId);
  return {
    dealerId,
    dealerIds,
    range: normalizeRange(filters.range),
    from: filters.from,
    to: filters.to,
    simulationDeltaPct: normalizeSimulation(filters.simulation)
  };
}

function formatDelay(seconds: number) {
  const safe = Math.max(0, Math.round(seconds || 0));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, "0")}m ${String(secs).padStart(2, "0")}s`;
}

function formatZar(value: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0
  }).format(Math.round(value || 0));
}

function scopeLabelForSession(session: SessionScopeLike, scope: DashboardScope) {
  if (session.role === "platform_owner" || session.role === "platform_support") {
    return scope.dealerId ? "Store View" : "Network View";
  }
  const scoped = getSessionDealerScope(session as DealerSession);
  if (!scoped?.length) return scope.dealerId ? "Store View" : "Network View";
  return scope.dealerId ? "Store View" : scoped.length > 1 ? "Network View" : "Store View";
}

function tooltip(definition: string, formula: string, timeframe: string, lastUpdated: string): TooltipDefinition {
  return {
    definition,
    formula,
    timeframe,
    lastUpdated
  };
}

function queueStateLabel(state: "breached" | "due_now" | "critical") {
  if (state === "breached") return "Breached";
  if (state === "due_now") return "Due Now";
  return "Critical";
}

export async function getCanonicalDashboardData(session: SessionScopeLike, scope: DashboardScope) {
  if (!hasSupabase()) {
    throw new Error("Supabase is required for canonical dashboard metrics.");
  }

  const supabase = getSupabaseClient();
  const scopedDealerIds = scope.dealerIds?.length ? scope.dealerIds : undefined;
  const rpcArgs = {
    p_window: scope.range,
    p_dealership_id: scope.dealerId ?? null,
    p_group_id: null,
    p_dealership_ids: scopedDealerIds ?? null,
    p_start: scope.range === "custom" && scope.from ? `${scope.from}T00:00:00+02:00` : null,
    p_end: scope.range === "custom" && scope.to ? `${scope.to}T23:59:59+02:00` : null,
    p_sla_improvement_delta: scope.simulationDeltaPct
  };

  const { data: snapshotData, error: snapshotError } = await supabase.rpc("autora_dashboard_snapshot", rpcArgs);
  if (snapshotError) throw snapshotError;

  const snapshot = snapshotData as unknown as DashboardSnapshotRow;
  const hot = snapshot.temperature_distribution.find((entry) => entry.temperature === "hot")?.count || 0;
  const warm = snapshot.temperature_distribution.find((entry) => entry.temperature === "warm")?.count || 0;
  const cold = snapshot.temperature_distribution.find((entry) => entry.temperature === "cold")?.count || 0;
  const predictedRiskPct = snapshot.store_heatmap.length
    ? Math.max(
        1,
        Math.round(
          snapshot.store_heatmap.reduce((sum, row) => sum + Number(row.risk_score_pct || 0), 0) /
            snapshot.store_heatmap.length
        )
      )
    : Math.max(snapshot.sla_breaches_total > 0 ? 1 : 0, snapshot.hot_unbooked_total > 0 ? 1 : 0);
  const lastUpdated = snapshot.last_updated || new Date().toISOString();
  const marketingRedacted = session.role === "dealer_marketing";

  return {
    scope: {
      dealerId: scope.dealerId,
      dealerIds: scopedDealerIds,
      label: scopeLabelForSession(session, scope)
    },
    timeframe: snapshot.timeframe,
    windowStart: snapshot.window_start,
    windowEnd: snapshot.window_end,
    lastUpdated,
    simulationDeltaPct: scope.simulationDeltaPct,
    revenueAtRisk: snapshot.revenue_at_risk,
    revenueAtRiskFormatted: formatZar(snapshot.revenue_at_risk),
    revenueAtRiskCount: snapshot.revenue_at_risk_count,
    averageDealValue: snapshot.average_deal_value,
    averageDealValueFormatted: formatZar(snapshot.average_deal_value),
    averageCloseProbabilityPct: Math.round((snapshot.average_close_probability || 0) * 100),
    breachCount: snapshot.sla_breaches_total,
    breachCount7d: snapshot.breaches_7d_total,
    openBreaches: snapshot.sla_breaches_open,
    openBreaches7d: snapshot.breaches_7d_open,
    hotUnbooked: snapshot.hot_unbooked_total,
    totalHot: snapshot.hot_total,
    predictedRiskPct,
    hotWarmCold: { hot, warm, cold },
    bookings: snapshot.bookings,
    responseTimeMedianSeconds: Math.round(snapshot.response_time_median_seconds || 0),
    responseTimeMedianLabel: formatDelay(snapshot.response_time_median_seconds || 0),
    slaCompliancePct: Math.round(snapshot.sla_compliance_pct || 0),
    slaComplianceCount: snapshot.sla_compliance_count,
    slaComplianceTotal: snapshot.sla_compliance_total,
    heatmap: snapshot.store_heatmap.map((row) => ({
      ...row,
      revenue_at_risk_formatted: formatZar(row.revenue_at_risk),
      median_response_label: formatDelay(Number(row.median_response_seconds || 0))
    })),
    recoverNow: marketingRedacted
      ? []
      : snapshot.recover_now.map((row) => ({
          ...row,
          queueStateLabel: queueStateLabel(row.queue_state),
          revenue_at_risk_formatted: formatZar(row.revenue_at_risk)
        })),
    forecast: {
      ...snapshot.forecast,
      baselineCloseRatePct: Math.round((snapshot.forecast.baseline_close_rate || 0) * 100),
      currentSlaCompliancePct: Math.round((snapshot.forecast.current_sla_compliance || 0) * 100),
      simulatedSlaCompliancePct: Math.round((snapshot.forecast.simulated_sla_compliance || 0) * 100),
      degradationFactorPct: Math.round((snapshot.forecast.degradation_factor || 0) * 100),
      averageOpportunityValueFormatted: formatZar(snapshot.forecast.average_opportunity_value),
      revenueAtRisk30dFormatted: formatZar(snapshot.forecast.revenue_at_risk_30d),
      conversionImpact60dFormatted: formatZar(snapshot.forecast.conversion_impact_60d),
      recoveryPotential90dFormatted: formatZar(snapshot.forecast.recovery_potential_90d)
    },
    auditLogs: marketingRedacted
      ? []
      : snapshot.audit_logs.map((row) => ({
          id: row.id,
          created_at: row.at,
          action: row.action,
          entity_type: row.entity_type,
          entity_id: row.entity_id,
          metadata: row.metadata,
          dealership_id: row.dealer_id
        })),
    tooltips: {
      revenueAtRisk: tooltip(
        "Revenue currently exposed if the open opportunity set continues under current SLA pressure.",
        "sum(estimated_value × close_probability × sla_risk_weight)",
        scope.range === "custom" && scope.from && scope.to ? `${scope.from} to ${scope.to}` : scope.range,
        lastUpdated
      ),
      slaCompliance: tooltip(
        "Percentage of in-scope opportunities without overdue or breached response state.",
        `${snapshot.sla_compliance_numerator} / ${snapshot.sla_compliance_denominator}`,
        scope.range === "custom" && scope.from && scope.to ? `${scope.from} to ${scope.to}` : scope.range,
        lastUpdated
      ),
      breaches7d: tooltip(
        "Open and newly breached SLA events over the last seven days.",
        `${snapshot.breaches_7d_open} open / ${snapshot.breaches_7d_total} total`,
        "last 7 days",
        lastUpdated
      ),
      hotUnbooked: tooltip(
        "Hot opportunities without a confirmed booking path in the selected window.",
        `${snapshot.hot_unbooked_total} / ${snapshot.hot_total}`,
        scope.range === "custom" && scope.from && scope.to ? `${scope.from} to ${scope.to}` : scope.range,
        lastUpdated
      ),
      forecast: tooltip(
        "Forecast values are tied to current compliance, baseline close rate, and simulated SLA improvement.",
        snapshot.forecast.formula_90d,
        "30 / 60 / 90 day horizon",
        lastUpdated
      )
    }
  };
}

export async function getCanonicalAuditFeed(
  session: SessionScopeLike,
  scope: DashboardScope,
  filters?: { sla?: string; user?: string },
  pagination?: { page?: number; pageSize?: number }
) {
  if (!hasSupabase()) {
    return { rows: [], users: [], total: 0, page: 1, pageSize: 25, totalPages: 1 };
  }

  const supabase = getSupabaseClient();
  const dealerIds = scope.dealerIds?.length ? scope.dealerIds : [scope.dealerId].filter(Boolean);
  const page = Math.max(1, pagination?.page || 1);
  const pageSize = Math.min(100, Math.max(10, pagination?.pageSize || 25));
  const fromIndex = (page - 1) * pageSize;
  const toIndex = fromIndex + pageSize - 1;

  let query = supabase
    .from("autora_audit_logs")
    .select("id,created_at,action,entity_type,entity_id,metadata,dealership_id", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(fromIndex, toIndex);

  if (dealerIds.length) {
    query = query.in("dealership_id", dealerIds);
  }
  if (filters?.sla && filters.sla !== "all") {
    query = query.eq("action", filters.sla);
  }
  if (filters?.user && filters.user !== "all") {
    query = query.contains("metadata", { actor_email: filters.user });
  }
  if (scope.range === "custom" && scope.from && scope.to) {
    query = query
      .gte("created_at", `${scope.from}T00:00:00+02:00`)
      .lte("created_at", `${scope.to}T23:59:59+02:00`);
  }

  const { data, error, count } = await query;
  if (error) throw error;

  const rows = ((data || []) as AuditLogRow[]).map((row) => ({
    ...row,
    metadata:
      session.role === "dealer_marketing"
        ? {
            actor_email: row.metadata?.actor_email || "redacted",
            note: "Immutable operational log"
          }
        : row.metadata
  }));

  const distinctUsers = Array.from(
    new Set(
      rows
        .map((row) => String(row.metadata?.actor_email || ""))
        .filter(Boolean)
    )
  ).sort();

  return {
    rows,
    users: distinctUsers,
    total: count || 0,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil((count || 0) / pageSize))
  };
}

export async function getCanonicalQueueRows(
  session: SessionScopeLike,
  params: {
    dealerId?: string;
    status?: string;
    source?: string;
    assigned?: string;
    queue?: string;
    leadId?: string;
    page?: number;
    pageSize?: number;
  }
) {
  if (!hasSupabase()) return null;

  const supabase = getSupabaseClient();
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.min(100, Math.max(10, params.pageSize || 25));
  const fromIndex = (page - 1) * pageSize;
  const toIndex = fromIndex + pageSize - 1;
  const dealerIds = getEffectiveDealerIdsForSession(session as DealerSession, params.dealerId);

  let query = supabase
    .from("autora_operational_opportunities")
    .select(
      "lead_id,dealership_id,dealership_name,full_name,phone,source,status,vehicle_interest,assigned_to,last_activity_at,lead_created_at,predicted_breach_risk_pct,response_due_at,breached_at,hot_not_booked",
      { count: "exact" }
    )
    .order("predicted_breach_risk_pct", { ascending: false })
    .order("response_due_at", { ascending: true, nullsFirst: false })
    .range(fromIndex, toIndex);

  if (dealerIds?.length) {
    query = query.in("dealership_id", dealerIds);
  }
  if (params.leadId) {
    query = query.eq("lead_id", params.leadId);
  }
  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status);
  }
  if (params.source && params.source !== "all") {
    query = query.eq("source", params.source);
  }
  if (params.assigned === "unassigned") {
    query = query.is("assigned_to", null);
  }
  if (params.queue === "hot") {
    query = query.eq("hot_not_booked", true);
  }
  if (params.queue === "recover") {
    query = query.not("breached_at", "is", null);
  }
  if (params.queue === "slow") {
    query = query.gte("predicted_breach_risk_pct", 70);
  }
  if (params.queue === "stuck") {
    query = query.eq("status", "contacted");
  }

  const { data, error, count } = await query;
  if (error) throw error;

  const rows = ((data || []) as QueueOpportunityRow[]).map((row) => ({
    id: row.lead_id,
    dealershipId: row.dealership_id,
    dealershipName: row.dealership_name || "Dealership",
    name: row.full_name || "Unknown lead",
    phone: row.phone || "Not available",
    source: row.source || "website",
    status: row.status,
    vehicleInterest: row.vehicle_interest || "Vehicle enquiry",
    assignedTo: row.assigned_to || "Unassigned",
    lastActivityAt: row.last_activity_at || row.lead_created_at,
    firstContactAt: row.lead_created_at,
    riskScorePct: Math.round(row.predicted_breach_risk_pct || 0),
    dueAt: row.response_due_at,
    breachedAt: row.breached_at,
    hotNotBooked: row.hot_not_booked
  }));

  return {
    rows,
    total: count || 0,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil((count || 0) / pageSize))
  };
}

export async function getCanonicalHealth() {
  if (!hasSupabase()) {
    return {
      db: { ok: false, reason: "Supabase env missing" },
      sla: { ok: false, reason: "Supabase env missing" }
    };
  }

  const supabase = getSupabaseClient();
  const [{ error: dbError }, { data: jobRun, error: jobError }] = await Promise.all([
    supabase.from("autora_groups").select("id", { head: true, count: "exact" }).limit(1),
    supabase.from("autora_job_runs").select("job_name,last_run_at,last_status,last_duration_ms,metadata").eq("job_name", "sla_enforcer").maybeSingle()
  ]);

  return {
    db: {
      ok: !dbError,
      reason: dbError?.message || null
    },
    sla: {
      ok: !jobError && Boolean(jobRun?.last_run_at),
      reason: jobError?.message || null,
      lastRunAt: jobRun?.last_run_at || null,
      lastStatus: jobRun?.last_status || null,
      lastDurationMs: jobRun?.last_duration_ms || null,
      metadata: jobRun?.metadata || null
    }
  };
}

export async function getCanonicalDealerOptions(session: SessionScopeLike) {
  if (!hasSupabase()) return [];

  const supabase = getSupabaseClient();
  const scope = getSessionDealerScope(session as DealerSession);
  let query = supabase.from("autora_dealerships").select("id,name,city").order("name");
  if (scope?.length) {
    query = query.in("id", scope);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map((row) => ({
    id: row.id as string,
    label: row.city ? `${row.name} · ${row.city}` : (row.name as string)
  }));
}

export function getDashboardBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://127.0.0.1:3000";
}

export function getDashboardQuery(scope: DashboardScope) {
  const params = new URLSearchParams();
  if (scope.dealerId) params.set("dealer", scope.dealerId);
  if (scope.range !== "7d") params.set("range", scope.range);
  if (scope.range === "custom" && scope.from && scope.to) {
    params.set("from", scope.from);
    params.set("to", scope.to);
  }
  if (scope.simulationDeltaPct > 0) {
    params.set("simulation", String(scope.simulationDeltaPct));
  }
  return params.toString();
}

export function isCanonicalDashboardEnabled() {
  return hasSupabase() && Boolean(env.SUPABASE_SERVICE_ROLE_KEY);
}

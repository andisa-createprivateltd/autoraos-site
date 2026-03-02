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

export type OsMetric = {
  key: string;
  label: string;
  value: number | null;
  display: string;
  unit: "ZAR" | "count" | "percent" | "seconds" | "minutes";
  window: CanonicalTimeRange;
  computed_at: string | null;
  provenance: "live" | "sample" | "not_configured";
  source: string;
  store_scope: "store" | "network";
  tooltip: TooltipDefinition;
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

type ConversationRow = {
  id: string;
  lead_id: string;
  dealership_id: string;
  channel: string | null;
  last_inbound_at: string | null;
  last_outbound_at: string | null;
  created_at: string;
  updated_at: string | null;
};

type LeadConversationRow = {
  id: string;
  full_name: string | null;
  phone: string | null;
  source: string | null;
  status: string | null;
  assigned_to: string | null;
  temperature: "hot" | "warm" | "cold" | null;
};

type ConversationMessageRow = {
  conversation_id: string;
  direction: string | null;
  body: string | null;
  created_at: string;
};

type ConversationOpportunityRow = {
  conversation_id: string;
  sla_event_id: string | null;
  predicted_breach_risk_pct: number | null;
  response_due_at: string | null;
  breached_at: string | null;
};

type EscalationRow = {
  sla_event_id: string;
  action: string;
  created_at: string;
};

type GovernancePolicyRow = {
  id: string;
  group_id: string | null;
  dealership_id: string | null;
  response_seconds_hot: number | null;
  response_seconds_warm: number | null;
  response_seconds_cold: number | null;
  after_hours_mode: string | null;
  updated_at: string | null;
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

function formatMetricValue(value: number | null, unit: OsMetric["unit"]) {
  if (value === null || !Number.isFinite(value)) return "Not configured";
  if (unit === "ZAR") return formatZar(value);
  if (unit === "percent") return `${Math.round(value)}%`;
  if (unit === "seconds") return `${Math.round(value)}s`;
  if (unit === "minutes") return `${Math.round(value)}m`;
  return String(Math.round(value));
}

function scopeMode(scope: DashboardScope): "store" | "network" {
  return scope.dealerId ? "store" : "network";
}

function resolveWindowBounds(scope: DashboardScope) {
  const end = scope.range === "custom" && scope.to ? new Date(`${scope.to}T23:59:59+02:00`) : new Date();
  let start: Date;

  if (scope.range === "today") {
    const now = new Date();
    start = new Date(now);
    start.setHours(0, 0, 0, 0);
  } else if (scope.range === "30d") {
    start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
  } else if (scope.range === "custom" && scope.from) {
    start = new Date(`${scope.from}T00:00:00+02:00`);
  } else {
    start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  return {
    start: start.toISOString(),
    end: end.toISOString()
  };
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

function titleCaseWord(value: string) {
  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function canonicalLeadStatusLabel(status?: string | null) {
  if (!status) return "New";
  const normalized = status.trim().toLowerCase();
  if (normalized === "visited" || normalized === "sold") return "Completed";
  return titleCaseWord(normalized);
}

function normalizeConversationTag(statusLabel: string, temperature?: string | null, riskScore = 0) {
  if (temperature === "hot" || riskScore >= 80) return "Hot";
  if (statusLabel === "Booked") return "Booked";
  if (statusLabel === "Completed") return "Completed";
  if (statusLabel === "Lost") return "Lost";
  if (statusLabel === "Qualified") return "Qualified";
  if (statusLabel === "Contacted") return "Contacted";
  return "New";
}

function countdownLabel(dueAt?: string | null, breachedAt?: string | null) {
  if (breachedAt) {
    const elapsed = Math.max(0, Math.round((Date.now() - new Date(breachedAt).getTime()) / 1000));
    return `Breached ${formatDelay(elapsed)} ago`;
  }
  if (!dueAt) return "Awaiting response";
  const diff = Math.round((new Date(dueAt).getTime() - Date.now()) / 1000);
  if (diff >= 0) return `Due in ${formatDelay(diff)}`;
  return `Overdue ${formatDelay(Math.abs(diff))}`;
}

function severityFromCompliance(compliancePct: number) {
  if (compliancePct >= 95) return "Healthy" as const;
  if (compliancePct >= 85) return "Watch" as const;
  return "Critical" as const;
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
    responseTimeCount: snapshot.response_time_count,
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

export async function getOsMetrics(session: SessionScopeLike, scope: DashboardScope): Promise<{
  provenance: "live" | "sample" | "not_configured";
  computedAt: string | null;
  metrics: OsMetric[];
}> {
  if (!hasSupabase()) {
    const notConfigured = (key: string, label: string, unit: OsMetric["unit"], source: string): OsMetric => ({
      key,
      label,
      value: null,
      display: "Not configured",
      unit,
      window: scope.range,
      computed_at: null,
      provenance: "not_configured",
      source,
      store_scope: scopeMode(scope),
      tooltip: tooltip(
        `${label} is unavailable until the canonical Supabase metric path is configured.`,
        source,
        scope.range,
        new Date().toISOString()
      )
    });

    return {
      provenance: "not_configured",
      computedAt: null,
      metrics: [
        notConfigured("sla_response_time_avg", "SLA Response Time Avg", "seconds", "autora_sla_events"),
        notConfigured("sla_response_time_median", "SLA Response Time Median", "seconds", "autora_sla_events"),
        notConfigured("opportunities_not_answered_5m", "Opportunities Not Answered <5m", "count", "autora_operational_opportunities"),
        notConfigured("after_hours_pending", "After-Hours Pending", "count", "autora_operational_opportunities"),
        notConfigured("hot_opportunities_not_booked", "Hot Opportunities Not Booked", "count", "autora_operational_opportunities"),
        notConfigured("ai_urgency_queue_24h", "AI Urgency Queue (24h)", "count", "autora_operational_opportunities"),
        notConfigured("revenue_actions_booked", "Revenue Actions Booked", "count", "autora_bookings"),
        notConfigured("revenue_at_risk", "Revenue at Risk", "ZAR", "v_kpi_revenue_at_risk"),
        notConfigured("margin_in_play", "Margin in Play", "ZAR", "Not configured"),
        notConfigured("sla_compliance_pct", "SLA Compliance", "percent", "v_kpi_sla_compliance")
      ]
    };
  }

  const supabase = getSupabaseClient();
  const data = await getCanonicalDashboardData(session, scope);
  const dealerIds = scope.dealerIds?.length ? scope.dealerIds : undefined;
  const bounds = resolveWindowBounds(scope);

  let opportunitiesQuery = supabase
    .from("autora_operational_opportunities")
    .select(
      "lead_id,lead_created_at,last_outbound_at,response_due_at,is_overdue,after_hours_flag,hot_not_booked,predicted_breach_risk_pct",
      { count: "exact" }
    )
    .gte("lead_created_at", bounds.start)
    .lte("lead_created_at", bounds.end);

  if (dealerIds?.length) {
    opportunitiesQuery = opportunitiesQuery.in("dealership_id", dealerIds);
  } else if (scope.dealerId) {
    opportunitiesQuery = opportunitiesQuery.eq("dealership_id", scope.dealerId);
  }

  let marginConfiguredQuery = supabase
    .from("autora_leads")
    .select("estimated_value", { count: "exact", head: true })
    .not("estimated_value", "is", null);

  if (dealerIds?.length) {
    marginConfiguredQuery = marginConfiguredQuery.in("dealership_id", dealerIds);
  } else if (scope.dealerId) {
    marginConfiguredQuery = marginConfiguredQuery.eq("dealership_id", scope.dealerId);
  }

  const [opportunitiesResult, marginConfiguredResult] = await Promise.all([
    opportunitiesQuery,
    marginConfiguredQuery
  ]);

  if (opportunitiesResult.error) throw opportunitiesResult.error;
  if (marginConfiguredResult.error) throw marginConfiguredResult.error;

  const opportunityRows = opportunitiesResult.data || [];
  const now = Date.now();
  const unansweredFiveMinutes = opportunityRows.filter((row) => {
    const createdAt = new Date(row.lead_created_at).getTime();
    const noOutbound = !row.last_outbound_at;
    return noOutbound && now - createdAt >= 5 * 60 * 1000;
  }).length;
  const afterHoursPending = opportunityRows.filter((row) => row.after_hours_flag && (!row.last_outbound_at || row.is_overdue)).length;
  const aiUrgencyQueue24h = opportunityRows.filter((row) => {
    const createdAt = new Date(row.lead_created_at).getTime();
    const within24h = now - createdAt <= 24 * 60 * 60 * 1000;
    return within24h && (Number(row.predicted_breach_risk_pct || 0) >= 70 || row.hot_not_booked || row.is_overdue);
  }).length;

  const metrics: OsMetric[] = [
    {
      key: "sla_response_time_avg",
      label: "SLA Response Time Avg",
      value: null,
      display: "Not configured",
      unit: "seconds",
      window: scope.range,
      computed_at: data.lastUpdated,
      provenance: "not_configured",
      source: "Average response time view not yet published",
      store_scope: scopeMode(scope),
      tooltip: tooltip(
        "Average response time is not yet published as a canonical database view.",
        "pending canonical average-response view",
        scope.range,
        data.lastUpdated
      )
    },
    {
      key: "sla_response_time_median",
      label: "SLA Response Time Median",
      value: data.responseTimeMedianSeconds,
      display: data.responseTimeMedianLabel,
      unit: "seconds",
      window: scope.range,
      computed_at: data.lastUpdated,
      provenance: "live",
      source: "v_kpi_response_time_median",
      store_scope: scopeMode(scope),
      tooltip: tooltip(
        "Median elapsed time from SLA event creation to first qualifying response.",
        "median(satisfied_at - created_at)",
        scope.range,
        data.lastUpdated
      )
    },
    {
      key: "opportunities_not_answered_5m",
      label: "Opportunities Not Answered <5m",
      value: unansweredFiveMinutes,
      display: formatMetricValue(unansweredFiveMinutes, "count"),
      unit: "count",
      window: scope.range,
      computed_at: data.lastUpdated,
      provenance: "live",
      source: "autora_operational_opportunities",
      store_scope: scopeMode(scope),
      tooltip: tooltip(
        "Open opportunities without an outbound response five minutes after lead creation.",
        "count(no outbound and age >= 5 minutes)",
        scope.range,
        data.lastUpdated
      )
    },
    {
      key: "after_hours_pending",
      label: "After-Hours Pending",
      value: afterHoursPending,
      display: formatMetricValue(afterHoursPending, "count"),
      unit: "count",
      window: scope.range,
      computed_at: data.lastUpdated,
      provenance: "live",
      source: "autora_operational_opportunities",
      store_scope: scopeMode(scope),
      tooltip: tooltip(
        "After-hours opportunities with no outbound recovery or overdue response state.",
        "count(after_hours_flag and (no outbound or overdue))",
        scope.range,
        data.lastUpdated
      )
    },
    {
      key: "hot_opportunities_not_booked",
      label: "Hot Opportunities Not Booked",
      value: data.hotUnbooked,
      display: formatMetricValue(data.hotUnbooked, "count"),
      unit: "count",
      window: scope.range,
      computed_at: data.lastUpdated,
      provenance: "live",
      source: "v_kpi_hot_unbooked",
      store_scope: scopeMode(scope),
      tooltip: data.tooltips.hotUnbooked
    },
    {
      key: "ai_urgency_queue_24h",
      label: "AI Urgency Queue (24h)",
      value: aiUrgencyQueue24h,
      display: formatMetricValue(aiUrgencyQueue24h, "count"),
      unit: "count",
      window: scope.range,
      computed_at: data.lastUpdated,
      provenance: "live",
      source: "autora_operational_opportunities",
      store_scope: scopeMode(scope),
      tooltip: tooltip(
        "Priority opportunities from the last 24 hours where risk is elevated, overdue, or hot and not booked.",
        "count(predicted_risk >= 70 or overdue or hot_not_booked) within 24h",
        "24h",
        data.lastUpdated
      )
    },
    {
      key: "revenue_actions_booked",
      label: "Revenue Actions Booked",
      value: data.bookings.confirmed,
      display: formatMetricValue(data.bookings.confirmed, "count"),
      unit: "count",
      window: scope.range,
      computed_at: data.lastUpdated,
      provenance: "live",
      source: "v_kpi_bookings_summary",
      store_scope: scopeMode(scope),
      tooltip: tooltip(
        "Confirmed booking actions recorded in the selected window.",
        "count(bookings where status = confirmed)",
        scope.range,
        data.lastUpdated
      )
    },
    {
      key: "revenue_at_risk",
      label: "Revenue at Risk",
      value: data.revenueAtRisk,
      display: data.revenueAtRiskFormatted,
      unit: "ZAR",
      window: scope.range,
      computed_at: data.lastUpdated,
      provenance: "live",
      source: "v_kpi_revenue_at_risk",
      store_scope: scopeMode(scope),
      tooltip: data.tooltips.revenueAtRisk
    },
    {
      key: "margin_in_play",
      label: "Margin in Play",
      value: marginConfiguredResult.count ? data.revenueAtRisk : null,
      display: marginConfiguredResult.count ? data.revenueAtRiskFormatted : "Not configured",
      unit: "ZAR",
      window: scope.range,
      computed_at: data.lastUpdated,
      provenance: marginConfiguredResult.count ? "live" : "not_configured",
      source: marginConfiguredResult.count ? "estimated_value proxy until explicit margin field exists" : "No margin field configured",
      store_scope: scopeMode(scope),
      tooltip: tooltip(
        "Current opportunity value exposed to response-discipline pressure. Uses estimated opportunity value until a margin field is configured.",
        "sum(estimated_value at risk) or null if no configured values",
        scope.range,
        data.lastUpdated
      )
    },
    {
      key: "sla_compliance_pct",
      label: "SLA Compliance",
      value: data.slaCompliancePct,
      display: formatMetricValue(data.slaCompliancePct, "percent"),
      unit: "percent",
      window: scope.range,
      computed_at: data.lastUpdated,
      provenance: "live",
      source: "v_kpi_sla_compliance",
      store_scope: scopeMode(scope),
      tooltip: data.tooltips.slaCompliance
    }
  ];

  return {
    provenance: "live",
    computedAt: data.lastUpdated,
    metrics
  };
}

export async function getCanonicalExecutionRows(
  session: SessionScopeLike,
  params: { dealerId?: string; window?: CanonicalTimeRange; page?: number; pageSize?: number; leadId?: string }
) {
  if (!hasSupabase()) {
    return { rows: [], total: 0, page: 1, pageSize: 25, totalPages: 1, provenance: "not_configured" as const };
  }

  const supabase = getSupabaseClient();
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.min(100, Math.max(10, params.pageSize || 25));
  const fromIndex = (page - 1) * pageSize;
  const toIndex = fromIndex + pageSize - 1;
  const dealerIds = getEffectiveDealerIdsForSession(session as DealerSession, params.dealerId);
  const effectiveScope: DashboardScope = {
    dealerId: params.dealerId,
    dealerIds,
    range: params.window || "7d",
    simulationDeltaPct: 0
  };
  const bounds = resolveWindowBounds(effectiveScope);

  let bookingsQuery = supabase
    .from("autora_bookings")
    .select("id,lead_id,group_id,dealership_id,scheduled_for,status,created_at", { count: "exact" })
    .gte("created_at", bounds.start)
    .lte("created_at", bounds.end)
    .order("scheduled_for", { ascending: true })
    .range(fromIndex, toIndex);

  if (dealerIds?.length) {
    bookingsQuery = bookingsQuery.in("dealership_id", dealerIds);
  }
  if (params.leadId) {
    bookingsQuery = bookingsQuery.eq("lead_id", params.leadId);
  }

  const { data: bookings, error, count } = await bookingsQuery;
  if (error) throw error;

  const leadIds = Array.from(new Set((bookings || []).map((row) => row.lead_id)));
  const dealershipIds = Array.from(new Set((bookings || []).map((row) => row.dealership_id)));

  const [leadsResult, dealersResult, opsResult] = await Promise.all([
    leadIds.length
      ? supabase.from("autora_leads").select("id,full_name,source,vehicle_interest,estimated_value").in("id", leadIds)
      : Promise.resolve({ data: [], error: null }),
    dealershipIds.length
      ? supabase.from("autora_dealerships").select("id,name,city").in("id", dealershipIds)
      : Promise.resolve({ data: [], error: null }),
    leadIds.length
      ? supabase
          .from("autora_operational_opportunities")
          .select("lead_id,predicted_breach_risk_pct,breached_at,response_due_at")
          .in("lead_id", leadIds)
      : Promise.resolve({ data: [], error: null })
  ]);

  if (leadsResult.error) throw leadsResult.error;
  if (dealersResult.error) throw dealersResult.error;
  if (opsResult.error) throw opsResult.error;

  const leads = new Map((leadsResult.data || []).map((row) => [row.id, row]));
  const dealers = new Map((dealersResult.data || []).map((row) => [row.id, row]));
  const ops = new Map((opsResult.data || []).map((row) => [row.lead_id, row]));

  const rows = (bookings || []).map((booking) => {
    const lead = leads.get(booking.lead_id);
    const dealer = dealers.get(booking.dealership_id);
    const op = ops.get(booking.lead_id);
    const risk = Math.round(Number(op?.predicted_breach_risk_pct || 0));
    const slaStatus =
      op?.breached_at ? "Breached" : risk >= 70 ? "At Risk" : risk >= 50 ? "Compliant" : "Compliant";

    return {
      id: booking.id,
      leadId: booking.lead_id,
      dealerId: booking.dealership_id,
      dealershipName: dealer?.name || "Dealership",
      city: dealer?.city || "Unknown city",
      contactPerson: lead?.full_name || "Unknown lead",
      source: lead?.source || "website",
      vehicleInterest: lead?.vehicle_interest || "Vehicle enquiry",
      scheduledFor: booking.scheduled_for,
      status: booking.status,
      bookingValue: Number(lead?.estimated_value || 0),
      showBookingValue: Number(lead?.estimated_value || 0) > 0,
      slaStatus,
      riskScorePct: risk,
      dueAt: op?.response_due_at || null,
      breachedAt: op?.breached_at || null
    };
  });

  return {
    rows,
    total: count || 0,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil((count || 0) / pageSize)),
    provenance: "live" as const
  };
}

export async function getCanonicalInboxThreads(
  session: SessionScopeLike,
  params: { dealerId?: string; leadId?: string; pageSize?: number }
) {
  if (!hasSupabase()) {
    return { threads: [], provenance: "not_configured" as const };
  }

  const supabase = getSupabaseClient();
  const dealerIds = getEffectiveDealerIdsForSession(session as DealerSession, params.dealerId);
  const pageSize = Math.min(50, Math.max(10, params.pageSize || 20));

  let conversationsQuery = supabase
    .from("autora_conversations")
    .select("id,lead_id,dealership_id,channel,last_inbound_at,last_outbound_at,created_at,updated_at")
    .order("created_at", { ascending: false })
    .limit(pageSize);

  if (dealerIds?.length) {
    conversationsQuery = conversationsQuery.in("dealership_id", dealerIds);
  }
  if (params.leadId) {
    conversationsQuery = conversationsQuery.eq("lead_id", params.leadId);
  }

  const { data: conversations, error: conversationsError } = await conversationsQuery;
  if (conversationsError) throw conversationsError;

  const sortedConversations = ((conversations || []) as ConversationRow[]).sort((a, b) => {
    const aTime = new Date(a.last_inbound_at || a.last_outbound_at || a.updated_at || a.created_at).getTime();
    const bTime = new Date(b.last_inbound_at || b.last_outbound_at || b.updated_at || b.created_at).getTime();
    return bTime - aTime;
  });

  const conversationIds = sortedConversations.map((row) => row.id);
  const leadIds = Array.from(new Set(sortedConversations.map((row) => row.lead_id)));

  const [leadsResult, messagesResult, opsResult] = await Promise.all([
    leadIds.length
      ? supabase.from("autora_leads").select("id,full_name,phone,source,status,assigned_to,temperature").in("id", leadIds)
      : Promise.resolve({ data: [], error: null }),
    conversationIds.length
      ? supabase
          .from("autora_messages")
          .select("conversation_id,direction,body,created_at")
          .in("conversation_id", conversationIds)
          .order("created_at", { ascending: false })
          .limit(pageSize * 8)
      : Promise.resolve({ data: [], error: null }),
    conversationIds.length
      ? supabase
          .from("autora_operational_opportunities")
          .select("conversation_id,sla_event_id,predicted_breach_risk_pct,response_due_at,breached_at")
          .in("conversation_id", conversationIds)
      : Promise.resolve({ data: [], error: null })
  ]);

  if (leadsResult.error) throw leadsResult.error;
  if (messagesResult.error) throw messagesResult.error;
  if (opsResult.error) throw opsResult.error;

  const assignedUserIds = Array.from(
    new Set(
      ((leadsResult.data || []) as LeadConversationRow[])
        .map((row) => row.assigned_to)
        .filter((value): value is string => Boolean(value))
    )
  );
  const escalationEventIds = Array.from(
    new Set(
      ((opsResult.data || []) as ConversationOpportunityRow[])
        .map((row) => row.sla_event_id)
        .filter((value): value is string => Boolean(value))
    )
  );

  const [usersResult, escalationsResult] = await Promise.all([
    assignedUserIds.length
      ? supabase.from("autora_users").select("user_id,full_name").in("user_id", assignedUserIds)
      : Promise.resolve({ data: [], error: null }),
    escalationEventIds.length
      ? supabase
          .from("autora_sla_escalations")
          .select("sla_event_id,action,created_at")
          .in("sla_event_id", escalationEventIds)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [], error: null })
  ]);

  if (usersResult.error) throw usersResult.error;
  if (escalationsResult.error) throw escalationsResult.error;

  const leads = new Map(((leadsResult.data || []) as LeadConversationRow[]).map((row) => [row.id, row]));
  const users = new Map(((usersResult.data || []) as Array<{ user_id: string; full_name: string | null }>).map((row) => [row.user_id, row.full_name || "Assigned user"]));
  const opportunities = new Map(((opsResult.data || []) as ConversationOpportunityRow[]).map((row) => [row.conversation_id, row]));

  const latestEscalationByEvent = new Map<string, EscalationRow>();
  for (const escalation of (escalationsResult.data || []) as EscalationRow[]) {
    if (!latestEscalationByEvent.has(escalation.sla_event_id)) {
      latestEscalationByEvent.set(escalation.sla_event_id, escalation);
    }
  }

  const messagesByConversation = new Map<string, ConversationMessageRow[]>();
  for (const message of (messagesResult.data || []) as ConversationMessageRow[]) {
    const existing = messagesByConversation.get(message.conversation_id) || [];
    if (existing.length < 4) {
      existing.push(message);
      messagesByConversation.set(message.conversation_id, existing);
    }
  }

  const threads = sortedConversations.map((conversation) => {
    const lead = leads.get(conversation.lead_id);
    const opportunity = opportunities.get(conversation.id);
    const riskScore = Math.round(Number(opportunity?.predicted_breach_risk_pct || 0));
    const statusLabel = canonicalLeadStatusLabel(lead?.status);
    const latestEscalation = opportunity?.sla_event_id ? latestEscalationByEvent.get(opportunity.sla_event_id) : null;

    return {
      id: conversation.id,
      leadId: conversation.lead_id,
      leadName: lead?.full_name || "Unknown lead",
      leadPhone: lead?.phone || "Not available",
      channel: conversation.channel === "whatsapp" ? "WhatsApp" : "Web",
      source: titleCaseWord(lead?.source || "website"),
      tag: normalizeConversationTag(statusLabel, lead?.temperature, riskScore),
      status: statusLabel as "New" | "Contacted" | "Qualified" | "Booked" | "Completed" | "Lost" | "Visited" | "Sold",
      assignedTo: lead?.assigned_to ? users.get(lead.assigned_to) || "Assigned user" : "Unassigned",
      assignedUserId: lead?.assigned_to || null,
      lastResponseTime: countdownLabel(opportunity?.response_due_at, opportunity?.breached_at),
      aiEnabled: latestEscalation ? latestEscalation.action !== "handoff" : true,
      lastActivity: conversation.last_inbound_at || conversation.last_outbound_at || conversation.updated_at || conversation.created_at,
      messages: (messagesByConversation.get(conversation.id) || [])
        .slice()
        .reverse()
        .map((message) => ({
          speaker:
            message.direction === "inbound"
              ? ("Lead" as const)
              : message.direction === "system"
                ? ("AI" as const)
                : ("Human" as const),
          text: message.body || "No message body",
          at: message.created_at
        })),
      riskScorePct: riskScore
    };
  });

  return { threads, provenance: "live" as const };
}

export async function getCanonicalInsightsSnapshot(session: SessionScopeLike, dealerId?: string) {
  const scope = resolveDashboardScope(session, {
    dealer: dealerId,
    range: "7d"
  });
  const metricPayload = await getOsMetrics(session, scope);
  const metricMap = new Map(metricPayload.metrics.map((metric) => [metric.key, metric]));
  const computedAt = metricPayload.computedAt || new Date().toISOString();

  return {
    provenance: metricPayload.provenance,
    generatedAt: new Date(computedAt).toLocaleString("en-ZA"),
    averageResponseTime: metricMap.get("sla_response_time_median")?.display || "Not configured",
    leadsVsBookings: `${metricMap.get("hot_opportunities_not_booked")?.display || "0"} queue / ${metricMap.get("revenue_actions_booked")?.display || "0"} booked`,
    afterHoursMissedLeads: metricMap.get("after_hours_pending")?.display || "0",
    metrics: metricPayload.metrics
  };
}

export async function getCanonicalGovernanceSnapshot(session: SessionScopeLike, dealerId?: string) {
  if (!hasSupabase()) {
    return {
      provenance: "not_configured" as const,
      auditSummary: {
        totalEvents30d: 0,
        overrideEvents30d: 0,
        breachEvents30d: 0,
        lastGeneratedAt: "Not configured"
      },
      policies: [],
      flags: [],
      overrideLeaders: [],
      leakageByRegion: []
    };
  }

  const supabase = getSupabaseClient();
  const scope = resolveDashboardScope(session, { dealer: dealerId, range: "30d" });
  const dealerIds = scope.dealerIds?.length ? scope.dealerIds : undefined;

  let policiesQuery = supabase
    .from("autora_sla_policies")
    .select("id,group_id,dealership_id,response_seconds_hot,response_seconds_warm,response_seconds_cold,after_hours_mode,updated_at")
    .order("updated_at", { ascending: false });
  let dealersQuery = supabase.from("autora_dealerships").select("id,name,city,group_id").order("name");
  const groupsQuery = supabase.from("autora_groups").select("id,name");
  let auditQuery = supabase
    .from("autora_audit_logs")
    .select("id,created_at,action,metadata,dealership_id")
    .gte("created_at", resolveWindowBounds(scope).start)
    .order("created_at", { ascending: false })
    .limit(500);
  let heatmapQuery = supabase
    .from("autora_store_command_metrics_mv")
    .select("dealership_id,dealership_name,dealership_city,revenue_at_risk,sla_compliance_pct,breach_count,last_refreshed_at")
    .eq("timeframe", "30d")
    .order("revenue_at_risk", { ascending: false });

  if (dealerIds?.length) {
    policiesQuery = policiesQuery.or(`dealership_id.in.(${dealerIds.join(",")}),dealership_id.is.null`);
    dealersQuery = dealersQuery.in("id", dealerIds);
    auditQuery = auditQuery.in("dealership_id", dealerIds);
    heatmapQuery = heatmapQuery.in("dealership_id", dealerIds);
  }

  const [policiesResult, dealersResult, groupsResult, auditResult, heatmapResult] = await Promise.all([
    policiesQuery,
    dealersQuery,
    groupsQuery,
    auditQuery,
    heatmapQuery
  ]);

  if (policiesResult.error) throw policiesResult.error;
  if (dealersResult.error) throw dealersResult.error;
  if (groupsResult.error) throw groupsResult.error;
  if (auditResult.error) throw auditResult.error;
  if (heatmapResult.error) throw heatmapResult.error;

  const dealers = new Map(((dealersResult.data || []) as Array<{ id: string; name: string; city: string | null; group_id: string | null }>).map((row) => [row.id, row]));
  const groups = new Map(((groupsResult.data || []) as Array<{ id: string; name: string }>).map((row) => [row.id, row.name]));
  const storeMetrics = new Map(
    ((heatmapResult.data || []) as Array<{
      dealership_id: string;
      dealership_name: string;
      dealership_city: string | null;
      revenue_at_risk: number;
      sla_compliance_pct: number;
      breach_count: number;
      last_refreshed_at: string;
    }>).map((row) => [row.dealership_id, row])
  );

  const policiesByDealer = new Map<string, GovernancePolicyRow>();
  const defaultPolicies: GovernancePolicyRow[] = [];
  for (const policy of (policiesResult.data || []) as GovernancePolicyRow[]) {
    if (policy.dealership_id && !policiesByDealer.has(policy.dealership_id)) {
      policiesByDealer.set(policy.dealership_id, policy);
      continue;
    }
    if (!policy.dealership_id) {
      defaultPolicies.push(policy);
    }
  }
  const defaultPolicy = defaultPolicies[0] || null;

  const policies = Array.from(dealers.values()).map((dealer) => {
    const policy = policiesByDealer.get(dealer.id) || defaultPolicy;
    const metric = storeMetrics.get(dealer.id);
    const compliancePct = Math.round(Number(metric?.sla_compliance_pct || 0));
    return {
      dealerId: dealer.id,
      storeName: dealer.name,
      groupName: groups.get(dealer.group_id || "") || "Group",
      inheritedPolicy: policy
        ? `${policy.response_seconds_hot || 0}s hot / ${policy.response_seconds_warm || 0}s warm / ${policy.response_seconds_cold || 0}s cold`
        : "Not configured",
      overrideFields: policiesByDealer.has(dealer.id) ? "Store override active" : "Group default",
      complianceFlag:
        !policy
          ? "No policy configured"
          : compliancePct >= 95
            ? "Within governance threshold"
            : compliancePct >= 85
              ? "Monitor closely"
              : "Remediation required",
      complianceState: severityFromCompliance(compliancePct),
      lastAuditAt: metric?.last_refreshed_at ? new Date(metric.last_refreshed_at).toLocaleString("en-ZA") : "Not configured"
    };
  });

  const auditRows = (auditResult.data || []) as Array<{
    id: string;
    created_at: string;
    action: string;
    metadata: Record<string, unknown> | null;
    dealership_id: string | null;
  }>;
  const totalEvents30d = auditRows.length;
  const overrideEvents30d = auditRows.filter((row) => row.action === "policy_update" || row.action === "conversation_handoff_toggle").length;
  const breachEvents30d = auditRows.filter((row) => row.action === "sla_breached").length;

  const overrideLeaderCounts = new Map<string, { count: number; dealershipId: string | null }>();
  for (const row of auditRows) {
    if (row.action !== "policy_update" && row.action !== "conversation_handoff_toggle") continue;
    const actor = String(row.metadata?.actor_email || "system");
    const current = overrideLeaderCounts.get(actor) || { count: 0, dealershipId: row.dealership_id };
    current.count += 1;
    overrideLeaderCounts.set(actor, current);
  }

  const overrideLeaders = Array.from(overrideLeaderCounts.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10)
    .map(([name, value], index) => ({
      rank: index + 1,
      name,
      value: value.count,
      context: value.dealershipId ? dealers.get(value.dealershipId)?.name || "Store" : "Network"
    }));

  const flags = policies
    .filter((row) => row.complianceState !== "Healthy" || row.complianceFlag === "No policy configured")
    .map((row) => ({
      storeName: row.storeName,
      managerName: row.groupName,
      flag: row.complianceFlag,
      severity: row.complianceState === "Critical" ? "Critical" : "Watch",
      nextAction:
        row.complianceFlag === "No policy configured"
          ? "Apply group default SLA policy"
          : row.complianceState === "Critical"
            ? "Review breach queue and manager overrides today"
            : "Monitor store compliance and confirm escalation coverage"
    }));

  const leakageMap = new Map<string, { stores: number; breaches: number; revenueAtRisk: number }>();
  for (const metric of storeMetrics.values()) {
    const region = metric.dealership_city || "Unmapped";
    const current = leakageMap.get(region) || { stores: 0, breaches: 0, revenueAtRisk: 0 };
    current.stores += 1;
    current.breaches += Number(metric.breach_count || 0);
    current.revenueAtRisk += Number(metric.revenue_at_risk || 0);
    leakageMap.set(region, current);
  }

  return {
    provenance: "live" as const,
    auditSummary: {
      totalEvents30d,
      overrideEvents30d,
      breachEvents30d,
      lastGeneratedAt: new Date().toLocaleString("en-ZA")
    },
    policies,
    flags,
    overrideLeaders,
    leakageByRegion: Array.from(leakageMap.entries()).map(([region, value]) => ({
      region,
      stores: value.stores,
      breaches: value.breaches,
      revenueAtRisk: value.revenueAtRisk
    }))
  };
}

export async function getSettingsSnapshot(session: SessionScopeLike, dealerId?: string) {
  if (!hasSupabase()) {
    return {
      provenance: "not_configured" as const,
      users: [],
      stores: [],
      whatsapp: {
        status: "Not configured",
        lastWebhookAt: null,
        messageVolumeToday: null,
        maskedPhoneNumberId: null,
        reconnectInstructions: "Configure SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, Meta credentials, and dealership integration rows."
      }
    };
  }

  const supabase = getSupabaseClient();
  const dealerIds = getEffectiveDealerIdsForSession(session as DealerSession, dealerId);
  let usersQuery = supabase.from("autora_users").select("user_id,full_name,role,dealership_id").order("created_at", { ascending: false });
  let storesQuery = supabase.from("autora_dealerships").select("id,name,city,updated_at").order("name");
  let whatsappQuery = supabase.from("autora_integrations_whatsapp").select("dealership_id,status,phone_number_id,updated_at").order("updated_at", { ascending: false });
  let messageVolumeQuery = supabase
    .from("autora_messages")
    .select("id", { count: "exact", head: true })
    .gte("created_at", resolveWindowBounds({ dealerId, dealerIds, range: "today", simulationDeltaPct: 0 }).start);

  if (dealerIds?.length) {
    usersQuery = usersQuery.in("dealership_id", dealerIds);
    storesQuery = storesQuery.in("id", dealerIds);
    whatsappQuery = whatsappQuery.in("dealership_id", dealerIds);
    messageVolumeQuery = messageVolumeQuery.in("dealership_id", dealerIds);
  }

  const [usersResult, storesResult, whatsappResult, messageVolumeResult] = await Promise.all([
    usersQuery,
    storesQuery,
    whatsappQuery.limit(1).maybeSingle(),
    messageVolumeQuery
  ]);

  if (usersResult.error) throw usersResult.error;
  if (storesResult.error) throw storesResult.error;
  if (whatsappResult.error && whatsappResult.status !== 406) throw whatsappResult.error;
  if (messageVolumeResult.error) throw messageVolumeResult.error;

  const integration = whatsappResult.data;
  const phoneNumberId = integration?.phone_number_id as string | null | undefined;

  return {
    provenance: "live" as const,
    users: usersResult.data || [],
    stores: storesResult.data || [],
    whatsapp: {
      status: integration?.status || "Disconnected",
      lastWebhookAt: integration?.updated_at || null,
      messageVolumeToday: messageVolumeResult.count || 0,
      maskedPhoneNumberId: phoneNumberId ? `${"*".repeat(Math.max(phoneNumberId.length - 4, 1))}${phoneNumberId.slice(-4)}` : null,
      reconnectInstructions:
        "If disconnected, verify Meta webhook delivery, confirm the phone number ID, and re-authenticate the AUTORA platform integration."
    }
  };
}

export async function getCanonicalAssignableUsers(session: SessionScopeLike, dealerId?: string) {
  if (!hasSupabase()) return [];

  const supabase = getSupabaseClient();
  const dealerIds = getEffectiveDealerIdsForSession(session as DealerSession, dealerId);
  let query = supabase
    .from("autora_users")
    .select("user_id,full_name,role,dealership_id")
    .in("role", ["dealer_admin", "dealer_sales"])
    .order("full_name");

  if (dealerIds?.length) {
    query = query.in("dealership_id", dealerIds);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map((row) => ({
    id: row.user_id as string,
    name: (row.full_name as string) || "Unassigned user",
    role: row.role as string,
    dealershipId: row.dealership_id as string | null
  }));
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

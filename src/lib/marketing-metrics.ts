import "server-only";

import { hasSupabase } from "@/lib/env";
import { getSupabaseClient } from "@/lib/supabase";

export type MarketingMetricsWindow = "today" | "7d" | "30d";

export type MarketingMetric = {
  value: number | null;
  unit: "ZAR" | "count" | "percent";
  time_window: MarketingMetricsWindow;
  computed_at: string | null;
  provenance: "live" | "sample" | "configured";
  methodology_link: string;
  source: string;
  definition: string;
  calculation_summary: string;
};

export type MarketingMetricsResponse = {
  available: boolean;
  window: MarketingMetricsWindow;
  last_updated: string | null;
  provenance: "live" | "sample" | "configured";
  revenue_at_risk_zar: MarketingMetric;
  sla_breaches_count: MarketingMetric;
  urgency_covered_pct: MarketingMetric;
  stores_active_count: MarketingMetric;
  sla_compliance_pct: MarketingMetric;
  definitions: {
    revenue_at_risk: string;
    sla_breaches: string;
    urgency_covered: string;
    sla_compliance: string;
  };
};

type SnapshotRow = {
  revenue_at_risk: number;
  sla_breaches_total: number;
  last_updated: string;
};

type OpportunityRow = {
  dealership_id: string;
  temperature: "hot" | "warm" | "cold";
  hot_not_booked: boolean;
  is_overdue: boolean | null;
  breached_at: string | null;
};

const DEFINITIONS = {
  revenue_at_risk:
    "Revenue at risk = estimated opportunity value × close probability × SLA risk weighting across the selected time window.",
  sla_breaches: "Count of open or newly breached SLA events recorded in the selected window.",
  urgency_covered:
    "Urgency covered = hot leads with a booking or active owner response path ÷ total hot leads in the selected window.",
  sla_compliance:
    "SLA compliance = opportunities without overdue or breached response state ÷ total opportunities in the selected window."
} as const;

const METHODOLOGY_LINK = "/platform#metric-methodology";

function normalizeWindow(input?: string): MarketingMetricsWindow {
  if (input === "today" || input === "30d") return input;
  return "7d";
}

function getWindowStart(window: MarketingMetricsWindow) {
  const now = new Date();
  if (window === "today") {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    return start.toISOString();
  }

  const start = new Date(now.getTime() - (window === "30d" ? 30 : 7) * 24 * 60 * 60 * 1000);
  return start.toISOString();
}

export async function getMarketingMetrics(windowInput?: string): Promise<MarketingMetricsResponse> {
  const window = normalizeWindow(windowInput);
  const buildMetric = ({
    value,
    unit,
    provenance,
    computedAt,
    source,
    definition,
    calculationSummary
  }: {
    value: number | null;
    unit: MarketingMetric["unit"];
    provenance: MarketingMetric["provenance"];
    computedAt: string | null;
    source: string;
    definition: string;
    calculationSummary: string;
  }): MarketingMetric => ({
    value,
    unit,
    time_window: window,
    computed_at: computedAt,
    provenance,
    methodology_link: METHODOLOGY_LINK,
    source,
    definition,
    calculation_summary: calculationSummary
  });

  if (!hasSupabase()) {
    return {
      available: false,
      window,
      last_updated: null,
      provenance: "configured",
      revenue_at_risk_zar: buildMetric({
        value: null,
        unit: "ZAR",
        provenance: "configured",
        computedAt: null,
        source: "autora_dashboard_snapshot",
        definition: DEFINITIONS.revenue_at_risk,
        calculationSummary: "Configured methodology. Live source not connected."
      }),
      sla_breaches_count: buildMetric({
        value: null,
        unit: "count",
        provenance: "configured",
        computedAt: null,
        source: "autora_dashboard_snapshot",
        definition: DEFINITIONS.sla_breaches,
        calculationSummary: "Configured methodology. Live source not connected."
      }),
      urgency_covered_pct: buildMetric({
        value: null,
        unit: "percent",
        provenance: "configured",
        computedAt: null,
        source: "autora_operational_opportunities",
        definition: DEFINITIONS.urgency_covered,
        calculationSummary: "Configured methodology. Live source not connected."
      }),
      stores_active_count: buildMetric({
        value: null,
        unit: "count",
        provenance: "configured",
        computedAt: null,
        source: "autora_operational_opportunities",
        definition: "Active stores contributing in-scope operational records.",
        calculationSummary: "count(distinct dealership_id)"
      }),
      sla_compliance_pct: buildMetric({
        value: null,
        unit: "percent",
        provenance: "configured",
        computedAt: null,
        source: "autora_operational_opportunities",
        definition: DEFINITIONS.sla_compliance,
        calculationSummary: "Configured methodology. Live source not connected."
      }),
      definitions: DEFINITIONS
    };
  }

  const supabase = getSupabaseClient();
  const windowStart = getWindowStart(window);

  try {
    const [{ data: snapshotData, error: snapshotError }, { data: opportunityData, error: opportunityError }] =
      await Promise.all([
        supabase.rpc("autora_dashboard_snapshot", {
          p_window: window,
          p_dealership_id: null,
          p_group_id: null,
          p_dealership_ids: null,
          p_start: null,
          p_end: null
        }),
        supabase
          .from("autora_operational_opportunities")
          .select("dealership_id,temperature,hot_not_booked,is_overdue,breached_at")
          .gte("lead_created_at", windowStart)
      ]);

    if (snapshotError) throw snapshotError;
    if (opportunityError) throw opportunityError;

    const snapshot = snapshotData as unknown as SnapshotRow | null;
    const opportunities = (opportunityData || []) as OpportunityRow[];
    const activeStores = new Set(opportunities.map((row) => row.dealership_id).filter(Boolean)).size;
    const hotLeads = opportunities.filter((row) => row.temperature === "hot");
    const coveredHotLeads = hotLeads.filter((row) => !row.hot_not_booked).length;
    const compliantCount = opportunities.filter((row) => !row.is_overdue && !row.breached_at).length;

    const available = Boolean(snapshot && (activeStores > 0 || Number(snapshot.revenue_at_risk || 0) > 0));

    return {
      available,
      window,
      last_updated: snapshot?.last_updated || null,
      provenance: available ? "live" : "configured",
      revenue_at_risk_zar: buildMetric({
        value: available ? Math.round(snapshot?.revenue_at_risk || 0) : null,
        unit: "ZAR",
        provenance: available ? "live" : "configured",
        computedAt: snapshot?.last_updated || null,
        source: "autora_dashboard_snapshot",
        definition: DEFINITIONS.revenue_at_risk,
        calculationSummary: "sum(estimated_value × close_probability × sla_risk_weight)"
      }),
      sla_breaches_count: buildMetric({
        value: available ? Math.round(snapshot?.sla_breaches_total || 0) : null,
        unit: "count",
        provenance: available ? "live" : "configured",
        computedAt: snapshot?.last_updated || null,
        source: "autora_dashboard_snapshot",
        definition: DEFINITIONS.sla_breaches,
        calculationSummary: "count(open or newly breached SLA events)"
      }),
      urgency_covered_pct: buildMetric({
        value: hotLeads.length ? Math.round((coveredHotLeads / hotLeads.length) * 100) : available ? 100 : null,
        unit: "percent",
        provenance: available ? "live" : "configured",
        computedAt: snapshot?.last_updated || null,
        source: "autora_operational_opportunities",
        definition: DEFINITIONS.urgency_covered,
        calculationSummary: "hot leads with booking or active owner response ÷ total hot leads"
      }),
      stores_active_count: buildMetric({
        value: available ? activeStores : null,
        unit: "count",
        provenance: available ? "live" : "configured",
        computedAt: snapshot?.last_updated || null,
        source: "autora_operational_opportunities",
        definition: "Stores contributing operational records in the selected window.",
        calculationSummary: "count(distinct dealership_id)"
      }),
      sla_compliance_pct: buildMetric({
        value: opportunities.length ? Math.round((compliantCount / opportunities.length) * 100) : available ? 100 : null,
        unit: "percent",
        provenance: available ? "live" : "configured",
        computedAt: snapshot?.last_updated || null,
        source: "autora_operational_opportunities",
        definition: DEFINITIONS.sla_compliance,
        calculationSummary: "opportunities without overdue or breached response state ÷ total opportunities"
      }),
      definitions: DEFINITIONS
    };
  } catch (error) {
    console.error("Failed to load marketing metrics", error);
    return {
      available: false,
      window,
      last_updated: null,
      provenance: "configured",
      revenue_at_risk_zar: buildMetric({
        value: null,
        unit: "ZAR",
        provenance: "configured",
        computedAt: null,
        source: "autora_dashboard_snapshot",
        definition: DEFINITIONS.revenue_at_risk,
        calculationSummary: "Configured methodology. Live source unavailable."
      }),
      sla_breaches_count: buildMetric({
        value: null,
        unit: "count",
        provenance: "configured",
        computedAt: null,
        source: "autora_dashboard_snapshot",
        definition: DEFINITIONS.sla_breaches,
        calculationSummary: "Configured methodology. Live source unavailable."
      }),
      urgency_covered_pct: buildMetric({
        value: null,
        unit: "percent",
        provenance: "configured",
        computedAt: null,
        source: "autora_operational_opportunities",
        definition: DEFINITIONS.urgency_covered,
        calculationSummary: "Configured methodology. Live source unavailable."
      }),
      stores_active_count: buildMetric({
        value: null,
        unit: "count",
        provenance: "configured",
        computedAt: null,
        source: "autora_operational_opportunities",
        definition: "Stores contributing operational records in the selected window.",
        calculationSummary: "count(distinct dealership_id)"
      }),
      sla_compliance_pct: buildMetric({
        value: null,
        unit: "percent",
        provenance: "configured",
        computedAt: null,
        source: "autora_operational_opportunities",
        definition: DEFINITIONS.sla_compliance,
        calculationSummary: "Configured methodology. Live source unavailable."
      }),
      definitions: DEFINITIONS
    };
  }
}

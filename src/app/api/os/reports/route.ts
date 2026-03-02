import { NextResponse } from "next/server";
import { getCanonicalDashboardData, resolveDashboardScope } from "@/lib/autora-dashboard";
import { requireWebSessionAuth } from "@/lib/web-api-auth";

function toCsv(rows: Array<Record<string, string | number>>) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const headerLine = headers.join(",");
  const bodyLines = rows.map((row) =>
    headers
      .map((header) => {
        const value = String(row[header] ?? "");
        return `"${value.replace(/"/g, '""')}"`;
      })
      .join(",")
  );
  return [headerLine, ...bodyLines].join("\n");
}

export async function GET(request: Request) {
  const auth = await requireWebSessionAuth({
    allowedRoles: ["platform_owner", "platform_support", "dealer_admin", "dealer_marketing"]
  });

  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const type = (searchParams.get("type") || "executive").toLowerCase();
    const format = (searchParams.get("format") || "csv").toLowerCase();
    const scope = resolveDashboardScope(auth.session, {
      dealer: searchParams.get("dealer") || undefined,
      range: searchParams.get("range") || undefined,
      from: searchParams.get("from") || undefined,
      to: searchParams.get("to") || undefined,
      simulation: searchParams.get("simulation") || undefined
    });

    if (format !== "csv") {
      return NextResponse.json({ message: "Only CSV export is enabled." }, { status: 400 });
    }

    const data = await getCanonicalDashboardData(auth.session, scope);
    const generatedAt = new Date().toISOString();

    const rows =
      type === "oem"
        ? [
            {
              timeframe: data.timeframe,
              scope: data.scope.label,
              sla_compliance_pct: data.slaCompliancePct,
              revenue_at_risk_zar: data.revenueAtRisk,
              open_breaches: data.openBreaches,
              generated_at: generatedAt
            }
          ]
        : [
            {
              metric: "revenue_at_risk_zar",
              value: data.revenueAtRisk,
              formula: "estimated_value × close_probability × sla_risk_weight",
              timeframe: data.timeframe,
              generated_at: generatedAt
            },
            {
              metric: "predicted_breach_risk_pct",
              value: data.predictedRiskPct,
              formula: "weighted(delay, overdue, after_hours, hot_not_booked, unassigned)",
              timeframe: data.timeframe,
              generated_at: generatedAt
            },
            {
              metric: "recovery_potential_90d_zar",
              value: data.forecast.recovery_potential_90d,
              formula: data.forecast.formula_90d,
              timeframe: data.timeframe,
              generated_at: generatedAt
            }
          ];

    const csv = toCsv(rows);
    const filename = `${type}-report-${generatedAt.slice(0, 10)}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`
      }
    });
  } catch (error) {
    console.error("AUTORA report export failed", error);
    return NextResponse.json({ message: "Failed to export report." }, { status: 500 });
  }
}

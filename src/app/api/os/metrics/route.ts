import { NextResponse } from "next/server";
import { getOsMetrics, resolveDashboardScope } from "@/lib/autora-dashboard";
import { requireWebSessionAuth } from "@/lib/web-api-auth";

export async function GET(request: Request) {
  const auth = await requireWebSessionAuth({
    allowedRoles: ["platform_owner", "platform_support", "dealer_admin", "dealer_sales", "dealer_marketing"]
  });

  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const scope = resolveDashboardScope(auth.session, {
      dealer: searchParams.get("storeId") || searchParams.get("dealer") || undefined,
      range: searchParams.get("window") || searchParams.get("range") || undefined,
      from: searchParams.get("from") || undefined,
      to: searchParams.get("to") || undefined
    });
    const payload = await getOsMetrics(auth.session, scope);
    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "private, max-age=30, stale-while-revalidate=30"
      }
    });
  } catch (error) {
    console.error("OS metrics API failed", error);
    return NextResponse.json({ message: "Failed to load OS metrics." }, { status: 500 });
  }
}

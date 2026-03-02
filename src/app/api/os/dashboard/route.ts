import { NextResponse } from "next/server";
import { getCanonicalDashboardData, resolveDashboardScope } from "@/lib/autora-dashboard";
import { requireWebSessionAuth } from "@/lib/web-api-auth";

export async function GET(request: Request) {
  const auth = await requireWebSessionAuth({
    allowedRoles: ["platform_owner", "platform_support", "dealer_admin", "dealer_sales", "dealer_marketing"]
  });

  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const scope = resolveDashboardScope(auth.session, {
      dealer: searchParams.get("dealer") || undefined,
      range: searchParams.get("range") || undefined,
      from: searchParams.get("from") || undefined,
      to: searchParams.get("to") || undefined,
      simulation: searchParams.get("simulation") || undefined
    });

    const data = await getCanonicalDashboardData(auth.session, scope);
    return NextResponse.json(data);
  } catch (error) {
    console.error("AUTORA dashboard API failed", error);
    return NextResponse.json({ message: "Failed to load canonical dashboard metrics." }, { status: 500 });
  }
}

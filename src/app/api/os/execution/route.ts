import { NextResponse } from "next/server";
import { getCanonicalExecutionRows, resolveDashboardScope } from "@/lib/autora-dashboard";
import { requireWebSessionAuth } from "@/lib/web-api-auth";

export async function GET(request: Request) {
  const auth = await requireWebSessionAuth({
    allowedRoles: ["platform_owner", "platform_support", "dealer_admin", "dealer_sales"]
  });

  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const scope = resolveDashboardScope(auth.session, {
      dealer: searchParams.get("storeId") || searchParams.get("dealer") || undefined,
      range: searchParams.get("window") || searchParams.get("range") || undefined
    });

    const payload = await getCanonicalExecutionRows(auth.session, {
      dealerId: scope.dealerId,
      window: scope.range,
      page: Number(searchParams.get("page") || "1"),
      pageSize: Number(searchParams.get("pageSize") || "25"),
      leadId: searchParams.get("leadId") || undefined
    });

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "private, max-age=30, stale-while-revalidate=30"
      }
    });
  } catch (error) {
    console.error("OS execution API failed", error);
    return NextResponse.json({ message: "Failed to load execution data." }, { status: 500 });
  }
}

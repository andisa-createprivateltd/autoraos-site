import { NextResponse } from "next/server";
import { getCanonicalQueueRows, resolveDashboardScope } from "@/lib/autora-dashboard";
import { requireWebSessionAuth } from "@/lib/web-api-auth";

export async function GET(request: Request) {
  const auth = await requireWebSessionAuth({
    allowedRoles: ["platform_owner", "platform_support", "dealer_admin", "dealer_sales"]
  });

  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const scope = resolveDashboardScope(auth.session, {
      dealer: searchParams.get("storeId") || searchParams.get("dealer") || undefined
    });
    const payload = await getCanonicalQueueRows(auth.session, {
      dealerId: scope.dealerId,
      status: searchParams.get("status") || undefined,
      source: searchParams.get("source") || undefined,
      assigned: searchParams.get("assigned") || undefined,
      queue: searchParams.get("queue") || undefined,
      leadId: searchParams.get("leadId") || undefined,
      page: Number(searchParams.get("page") || "1"),
      pageSize: Number(searchParams.get("pageSize") || "25")
    });

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "private, max-age=30, stale-while-revalidate=30"
      }
    });
  } catch (error) {
    console.error("OS queue API failed", error);
    return NextResponse.json({ message: "Failed to load queue." }, { status: 500 });
  }
}

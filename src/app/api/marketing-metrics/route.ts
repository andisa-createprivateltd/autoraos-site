import { NextResponse } from "next/server";
import { getMarketingMetrics } from "@/lib/marketing-metrics";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const window = searchParams.get("window") || "7d";
  const payload = await getMarketingMetrics(window);

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": payload.available ? "s-maxage=120, stale-while-revalidate=300" : "no-store"
    }
  });
}

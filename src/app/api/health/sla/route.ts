import { NextResponse } from "next/server";
import { getCanonicalHealth } from "@/lib/autora-dashboard";

export async function GET() {
  const health = await getCanonicalHealth();
  return NextResponse.json(health.sla, { status: health.sla.ok ? 200 : 503 });
}

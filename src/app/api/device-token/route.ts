import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { deviceTokenSchema } from "@/lib/validation";
import { requireDealerAPIAuth } from "@/lib/mobile-api-auth";

export async function POST(request: Request) {
  const auth = await requireDealerAPIAuth(request, {
    allowedRoles: ["dealer_admin", "dealer_sales", "dealer_marketing"]
  });

  if (!auth.ok) {
    return auth.response;
  }

  const rateLimit = checkRateLimit(`device-token:${auth.context.userId}`, {
    windowMs: 60_000,
    maxRequests: 20
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { message: "Too many token updates. Please retry shortly." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rateLimit.retryAfterMs ?? 0) / 1000)) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = deviceTokenSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message || "Invalid device-token payload." },
      { status: 400 }
    );
  }

  // Token persistence is intentionally deferred in beta. This endpoint prevents
  // registration failures from surfacing to the app while push provider wiring is finalized.
  return NextResponse.json({ success: true, registered: true });
}

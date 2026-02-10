import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { getSupabaseClient } from "@/lib/supabase";
import { handoffSchema } from "@/lib/validation";
import { requireDealerAPIAuth } from "@/lib/mobile-api-auth";

async function notifyHandoffWebhook(payload: {
  dealerId: string;
  conversationId: string;
  leadId: string;
  reason: string;
  triggeredBy: string;
}) {
  const url = process.env.HANDOFF_WEBHOOK_URL;
  if (!url) return;

  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
}

export async function POST(request: Request) {
  const auth = await requireDealerAPIAuth(request, {
    allowedRoles: ["dealer_admin", "dealer_sales"]
  });

  if (!auth.ok) {
    return auth.response;
  }

  const rateLimit = checkRateLimit(`handoff:${auth.context.userId}`, {
    windowMs: 60_000,
    maxRequests: 20
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { message: "Too many handoff requests. Please retry shortly." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rateLimit.retryAfterMs ?? 0) / 1000)) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = handoffSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message || "Invalid handoff payload." },
      { status: 400 }
    );
  }

  const input = parsed.data;
  const supabase = getSupabaseClient();

  const conversationResult = await supabase
    .from("conversations")
    .select("id,lead_id,dealer_id")
    .eq("id", input.conversation_id)
    .eq("dealer_id", auth.context.dealerId)
    .limit(1)
    .maybeSingle();

  if (conversationResult.error || !conversationResult.data) {
    return NextResponse.json({ message: "Conversation not found." }, { status: 404 });
  }

  if (conversationResult.data.lead_id !== input.lead_id) {
    return NextResponse.json({ message: "Lead mismatch for handoff." }, { status: 400 });
  }

  const eventInsert = await supabase.from("ai_events").insert({
    dealer_id: auth.context.dealerId,
    lead_id: input.lead_id,
    conversation_id: input.conversation_id,
    event_type: "handoff",
    success: true,
    meta: {
      reason: input.reason,
      initiated_by: auth.context.userId,
      initiated_by_email: auth.context.email
    }
  });

  if (eventInsert.error) {
    return NextResponse.json({ message: "Failed to log handoff event." }, { status: 500 });
  }

  await notifyHandoffWebhook({
    dealerId: auth.context.dealerId,
    conversationId: input.conversation_id,
    leadId: input.lead_id,
    reason: input.reason,
    triggeredBy: auth.context.userId
  });

  return NextResponse.json({ success: true });
}

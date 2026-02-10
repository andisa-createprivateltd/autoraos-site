import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { getSupabaseClient } from "@/lib/supabase";
import { sendMessageSchema } from "@/lib/validation";
import { requireDealerAPIAuth } from "@/lib/mobile-api-auth";

type MetaSendResult = {
  providerMessageId: string | null;
  mode: "sent" | "mock";
};

async function sendWhatsAppViaMeta(phone: string, content: string): Promise<MetaSendResult> {
  const token = process.env.META_CLOUD_API_TOKEN;
  const phoneNumberId = process.env.META_WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    return { providerMessageId: null, mode: "mock" };
  }

  const response = await fetch(`https://graph.facebook.com/v22.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: phone.replace(/\D/g, ""),
      type: "text",
      text: {
        preview_url: false,
        body: content
      }
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Meta send failed (${response.status}): ${text}`);
  }

  const payload = (await response.json()) as {
    messages?: Array<{ id?: string }>;
  };

  return {
    providerMessageId: payload.messages?.[0]?.id ?? null,
    mode: "sent"
  };
}

export async function POST(request: Request) {
  const auth = await requireDealerAPIAuth(request, {
    allowedRoles: ["dealer_admin", "dealer_sales"]
  });

  if (!auth.ok) {
    return auth.response;
  }

  const rateLimit = checkRateLimit(`send-message:${auth.context.userId}`, {
    windowMs: 60_000,
    maxRequests: 30
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { message: "Too many send attempts. Please retry shortly." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rateLimit.retryAfterMs ?? 0) / 1000)) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = sendMessageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message || "Invalid send-message payload." },
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
    return NextResponse.json({ message: "Lead mismatch for conversation." }, { status: 400 });
  }

  const leadResult = await supabase
    .from("leads")
    .select("id,phone")
    .eq("id", input.lead_id)
    .eq("dealer_id", auth.context.dealerId)
    .limit(1)
    .maybeSingle();

  if (leadResult.error || !leadResult.data) {
    return NextResponse.json({ message: "Lead not found." }, { status: 404 });
  }

  let metaResult: MetaSendResult;
  try {
    metaResult = await sendWhatsAppViaMeta(leadResult.data.phone as string, input.content);
  } catch {
    return NextResponse.json({ message: "WhatsApp delivery failed." }, { status: 502 });
  }

  const insertResult = await supabase.from("messages").insert({
    dealer_id: auth.context.dealerId,
    conversation_id: input.conversation_id,
    lead_id: input.lead_id,
    direction: "outbound",
    sender_type: "human",
    sender_user_id: auth.context.userId,
    content: input.content,
    message_type: "text",
    provider_message_id: metaResult.providerMessageId
  });

  if (insertResult.error) {
    return NextResponse.json({ message: "Failed to persist outbound message." }, { status: 500 });
  }

  await supabase
    .from("conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", input.conversation_id)
    .eq("dealer_id", auth.context.dealerId);

  return NextResponse.json({
    success: true,
    mode: metaResult.mode
  });
}

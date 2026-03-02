import { NextResponse } from "next/server";
import { recordAutoraAuditLog } from "@/lib/autora-audit";
import { hasSupabase } from "@/lib/env";
import { getSupabaseClient } from "@/lib/supabase";
import { osSendMessageSchema } from "@/lib/validation";
import { requireWebSessionAuth } from "@/lib/web-api-auth";

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
  const auth = await requireWebSessionAuth({
    allowedRoles: [
      "platform_owner",
      "platform_support",
      "dealer_admin",
      "dealer_sales"
    ]
  });

  if (!auth.ok) {
    return auth.response;
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = osSendMessageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message || "Invalid send-message payload." },
      { status: 400 }
    );
  }

  const input = parsed.data;

  if (!hasSupabase()) {
    return NextResponse.json({ message: "Canonical data path is not configured." }, { status: 503 });
  }

  const supabase = getSupabaseClient();

  try {
    const conversationResult = await supabase
      .from("autora_conversations")
      .select("id,lead_id,dealership_id,group_id")
      .eq("id", input.conversation_id)
      .limit(1)
      .maybeSingle();

    if (conversationResult.error || !conversationResult.data) {
      return NextResponse.json({ message: "Conversation not found." }, { status: 404 });
    }

    if (conversationResult.data.lead_id !== input.lead_id) {
      return NextResponse.json({ message: "Lead mismatch for conversation." }, { status: 400 });
    }

    const leadResult = await supabase
      .from("autora_leads")
      .select("id,phone")
      .eq("id", input.lead_id)
      .limit(1)
      .maybeSingle();

    if (leadResult.error || !leadResult.data) {
      return NextResponse.json({ message: "Lead not found." }, { status: 404 });
    }

    const metaResult = await sendWhatsAppViaMeta(leadResult.data.phone as string, input.content);

    const insertResult = await supabase.from("autora_messages").insert({
      group_id: (conversationResult.data as { group_id?: string | null }).group_id || null,
      dealership_id: conversationResult.data.dealership_id,
      conversation_id: input.conversation_id,
      lead_id: input.lead_id,
      direction: "outbound",
      body: input.content
    });

    if (insertResult.error) {
      throw insertResult.error;
    }

    await supabase
      .from("autora_conversations")
      .update({
        last_outbound_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("id", input.conversation_id);

    await recordAutoraAuditLog({
      role: auth.session.role,
      email: auth.session.email,
      action: "message_send",
      entityType: "conversation",
      entityId: input.conversation_id,
      dealershipId: conversationResult.data.dealership_id as string,
      groupId: (conversationResult.data as { group_id?: string | null }).group_id || null,
      metadata: {
        lead_id: input.lead_id,
        provider_mode: metaResult.mode,
        provider_message_id: metaResult.providerMessageId
      }
    });

    return NextResponse.json({
      success: true,
      mode: metaResult.mode
    });
  } catch (error) {
    console.error("Web send-message failed", error);
    return NextResponse.json({ message: "Failed to send message." }, { status: 500 });
  }
}

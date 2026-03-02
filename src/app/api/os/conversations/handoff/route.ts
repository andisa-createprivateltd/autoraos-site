import { NextResponse } from "next/server";
import { recordAutoraAuditLog } from "@/lib/autora-audit";
import { hasSupabase } from "@/lib/env";
import { getSupabaseClient } from "@/lib/supabase";
import { osHandoffSchema } from "@/lib/validation";
import { requireWebSessionAuth } from "@/lib/web-api-auth";

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

  const parsed = osHandoffSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message || "Invalid handoff payload." },
      { status: 400 }
    );
  }

  const input = parsed.data;

  if (!hasSupabase()) {
    return NextResponse.json({ message: "Canonical data path is not configured." }, { status: 503 });
  }

  try {
    const supabase = getSupabaseClient();
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
      return NextResponse.json({ message: "Lead mismatch for handoff." }, { status: 400 });
    }

    const slaLookup = await supabase
      .from("autora_operational_opportunities")
      .select("sla_event_id")
      .eq("conversation_id", input.conversation_id)
      .limit(1)
      .maybeSingle();

    if (slaLookup.error) throw slaLookup.error;

    if (slaLookup.data?.sla_event_id) {
      const escalationInsert = await supabase.from("autora_sla_escalations").insert({
        sla_event_id: slaLookup.data.sla_event_id,
        group_id: (conversationResult.data as { group_id?: string | null }).group_id,
        dealership_id: conversationResult.data.dealership_id,
        stage: input.enabled ? 0 : 1,
        escalation_target: input.enabled ? "ai" : "human",
        action: input.enabled ? "ai_resume" : "handoff",
        payload: {
          enabled: input.enabled,
          reason: input.reason || null,
          by: auth.session.role,
          by_email: auth.session.email
        }
      });

      if (escalationInsert.error) throw escalationInsert.error;
    }

    await recordAutoraAuditLog({
      role: auth.session.role,
      email: auth.session.email,
      action: "conversation_handoff_toggle",
      entityType: "conversation",
      entityId: input.conversation_id,
      dealershipId: conversationResult.data.dealership_id as string,
      groupId: (conversationResult.data as { group_id?: string | null }).group_id || null,
      metadata: {
        lead_id: input.lead_id,
        enabled: input.enabled,
        reason: input.reason || null
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Handoff toggle failed", error);
    return NextResponse.json({ message: "Failed to update handoff state." }, { status: 500 });
  }
}

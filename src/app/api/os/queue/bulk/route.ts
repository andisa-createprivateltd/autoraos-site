import { NextResponse } from "next/server";
import { recordAutoraAuditLog } from "@/lib/autora-audit";
import { hasSupabase } from "@/lib/env";
import { getSupabaseClient } from "@/lib/supabase";
import { osQueueBulkActionSchema } from "@/lib/validation";
import { requireWebSessionAuth } from "@/lib/web-api-auth";

export async function POST(request: Request) {
  const auth = await requireWebSessionAuth({
    allowedRoles: ["platform_owner", "platform_support", "dealer_admin"]
  });

  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = osQueueBulkActionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message || "Invalid bulk queue payload." },
      { status: 400 }
    );
  }

  if (!hasSupabase()) {
    return NextResponse.json({ message: "Canonical data path is not configured." }, { status: 503 });
  }

  const input = parsed.data;
  const supabase = getSupabaseClient();

  try {
    const leadsResult = await supabase
      .from("autora_leads")
      .select("id,group_id,dealership_id,full_name,phone")
      .in("id", input.lead_ids);

    if (leadsResult.error) throw leadsResult.error;

    const leads = leadsResult.data || [];
    if (!leads.length) {
      return NextResponse.json({ message: "No matching leads found." }, { status: 404 });
    }

    if (auth.session.dealerScope?.length) {
      const allowed = new Set(auth.session.dealerScope);
      const unauthorizedLead = leads.find((lead) => !allowed.has(String(lead.dealership_id)));
      if (unauthorizedLead) {
        return NextResponse.json({ message: "Forbidden for one or more selected leads." }, { status: 403 });
      }
    }

    if (input.action === "assign_selected") {
      const updateResult = await supabase
        .from("autora_leads")
        .update({
          assigned_to: input.assigned_user_id || null,
          last_activity_at: new Date().toISOString()
        })
        .in("id", input.lead_ids);

      if (updateResult.error) throw updateResult.error;
    }

    if (input.action === "mark_contacted") {
      const updateResult = await supabase
        .from("autora_leads")
        .update({
          status: "contacted",
          last_activity_at: new Date().toISOString()
        })
        .in("id", input.lead_ids);

      if (updateResult.error) throw updateResult.error;
    }

    if (input.action === "send_template_reminder") {
      const conversationsResult = await supabase
        .from("autora_conversations")
        .select("id,lead_id,dealership_id,group_id")
        .in("lead_id", input.lead_ids);

      if (conversationsResult.error) throw conversationsResult.error;

      const nowIso = new Date().toISOString();
      const messageInserts = (conversationsResult.data || []).map((conversation) => ({
        group_id: conversation.group_id,
        dealership_id: conversation.dealership_id,
        conversation_id: conversation.id,
        lead_id: conversation.lead_id,
        direction: "outbound",
        body: "Reminder from AUTORA OS: a response or booking action is still required on this opportunity."
      }));

      if (messageInserts.length) {
        const insertResult = await supabase.from("autora_messages").insert(messageInserts);
        if (insertResult.error) throw insertResult.error;

        const conversationIds = Array.from(new Set(messageInserts.map((item) => item.conversation_id)));
        const touchResult = await supabase
          .from("autora_conversations")
          .update({ last_outbound_at: nowIso, updated_at: nowIso })
          .in("id", conversationIds);
        if (touchResult.error) throw touchResult.error;
      }
    }

    for (const lead of leads) {
      await recordAutoraAuditLog({
        role: auth.session.role,
        email: auth.session.email,
        action: `queue_bulk_${input.action}`,
        entityType: "lead",
        entityId: lead.id,
        dealershipId: lead.dealership_id as string,
        groupId: lead.group_id as string,
        metadata: {
          lead_name: lead.full_name || "Unknown lead",
          assigned_user_id: input.assigned_user_id || null
        }
      });
    }

    return NextResponse.json({ success: true, updated: leads.length });
  } catch (error) {
    console.error("Queue bulk action failed", error);
    return NextResponse.json({ message: "Failed to process queue bulk action." }, { status: 500 });
  }
}

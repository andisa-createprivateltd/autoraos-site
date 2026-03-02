import { NextResponse } from "next/server";
import { recordAutoraAuditLog } from "@/lib/autora-audit";
import { hasSupabase } from "@/lib/env";
import { getSupabaseClient } from "@/lib/supabase";
import { osLeadUpdateSchema } from "@/lib/validation";
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

  const parsed = osLeadUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message || "Invalid lead update payload." },
      { status: 400 }
    );
  }

  const input = parsed.data;
  if (!input.status && input.assigned_user_id === undefined) {
    return NextResponse.json(
      { message: "Nothing to update." },
      { status: 400 }
    );
  }

  if (!hasSupabase()) {
    return NextResponse.json({ message: "Canonical data path is not configured." }, { status: 503 });
  }

  try {
    const supabase = getSupabaseClient();
    const updatePayload: Record<string, unknown> = {
      last_activity_at: new Date().toISOString()
    };

    if (input.status) updatePayload.status = input.status;
    if (input.assigned_user_id !== undefined) updatePayload.assigned_to = input.assigned_user_id;

    const updateResult = await supabase
      .from("autora_leads")
      .update(updatePayload)
      .eq("id", input.lead_id)
      .select("id,group_id,dealership_id,assigned_to,status")
      .single();

    if (updateResult.error) throw updateResult.error;

    await recordAutoraAuditLog({
      role: auth.session.role,
      email: auth.session.email,
      action: "lead_update",
      entityType: "lead",
      entityId: input.lead_id,
      dealershipId: updateResult.data.dealership_id as string,
      groupId: updateResult.data.group_id as string,
      metadata: {
        assigned_user_id: updateResult.data.assigned_to,
        status: updateResult.data.status
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead update failed", error);
    return NextResponse.json({ message: "Failed to update lead." }, { status: 500 });
  }
}

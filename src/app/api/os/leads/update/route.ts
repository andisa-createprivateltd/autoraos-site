import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { osLeadUpdateSchema } from "@/lib/validation";
import { requireWebSessionAuth } from "@/lib/web-api-auth";

export async function POST(request: Request) {
  const auth = requireWebSessionAuth({
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

  try {
    const supabase = getSupabaseClient();
    const updatePayload: Record<string, unknown> = {
      last_activity_at: new Date().toISOString()
    };

    if (input.status) {
      updatePayload.status = input.status;
    }
    if (input.assigned_user_id !== undefined) {
      updatePayload.assigned_user_id = input.assigned_user_id;
    }

    const updateResult = await supabase
      .from("leads")
      .update(updatePayload)
      .eq("id", input.lead_id)
      .select("id")
      .single();

    if (updateResult.error) throw updateResult.error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead update failed", error);
    return NextResponse.json({ message: "Failed to update lead." }, { status: 500 });
  }
}

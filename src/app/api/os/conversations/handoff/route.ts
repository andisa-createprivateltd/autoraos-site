import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { osHandoffSchema } from "@/lib/validation";
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

  const parsed = osHandoffSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message || "Invalid handoff payload." },
      { status: 400 }
    );
  }

  const input = parsed.data;

  try {
    const supabase = getSupabaseClient();
    const conversationResult = await supabase
      .from("conversations")
      .select("id,lead_id,dealer_id")
      .eq("id", input.conversation_id)
      .limit(1)
      .maybeSingle();

    if (conversationResult.error || !conversationResult.data) {
      return NextResponse.json({ message: "Conversation not found." }, { status: 404 });
    }

    if (conversationResult.data.lead_id !== input.lead_id) {
      return NextResponse.json({ message: "Lead mismatch for handoff." }, { status: 400 });
    }

    const eventInsert = await supabase.from("ai_events").insert({
      dealer_id: conversationResult.data.dealer_id,
      lead_id: input.lead_id,
      conversation_id: input.conversation_id,
      event_type: "handoff",
      success: true,
      meta: {
        enabled: input.enabled,
        reason: input.reason || null,
        by: auth.session.role,
        by_email: auth.session.email
      }
    });

    if (eventInsert.error) throw eventInsert.error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Handoff toggle failed", error);
    return NextResponse.json({ message: "Failed to update handoff state." }, { status: 500 });
  }
}

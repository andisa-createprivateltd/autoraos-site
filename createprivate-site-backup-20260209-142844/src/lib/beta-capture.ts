import type { SupabaseClient } from "@supabase/supabase-js";
import { normalizePhone } from "@/lib/utils";

export type LeadSource = "whatsapp" | "website" | "ads" | "oem";
export type SubscriptionPlan = "starter" | "growth" | "scale";

const DEFAULT_TIMEZONE = "Africa/Johannesburg";
const DEFAULT_COUNTRY = "South Africa";

function planMonthlyPrice(plan: SubscriptionPlan) {
  if (plan === "starter") return 8500;
  if (plan === "growth") return 15000;
  return 45000;
}

function normalizeBrand(brand?: string) {
  const trimmed = brand?.trim();
  return trimmed ? [trimmed] : [];
}

export function mapLeadSource(input?: string): LeadSource {
  const value = (input || "").toLowerCase();
  if (value.includes("oem")) return "oem";
  if (value.includes("ad")) return "ads";
  if (value.includes("wa") || value.includes("whatsapp")) return "whatsapp";
  return "website";
}

function sourceToChannel(source: LeadSource) {
  return source === "whatsapp" ? "whatsapp" : "web";
}

export async function ensureDealerAccount(
  supabase: SupabaseClient,
  params: {
    dealershipName?: string;
    brand?: string;
    city?: string;
    timezone?: string;
    whatsappNumber?: string;
    plan?: SubscriptionPlan;
  }
) {
  const name = params.dealershipName?.trim() || "CreatePrivate Inbound";
  const city = params.city?.trim() || "Johannesburg";
  const timezone = params.timezone?.trim() || DEFAULT_TIMEZONE;
  const plan = params.plan || "growth";

  const existing = await supabase
    .from("dealers")
    .select("id,brands")
    .ilike("name", name)
    .ilike("city", city)
    .maybeSingle();

  if (existing.error) throw existing.error;

  let dealerId: string;

  if (existing.data?.id) {
    dealerId = existing.data.id as string;
    const nextBrands = Array.from(new Set([...(existing.data.brands || []), ...normalizeBrand(params.brand)]));

    const updateResult = await supabase
      .from("dealers")
      .update({
        brands: nextBrands,
        timezone,
        whatsapp_phone_number: params.whatsappNumber ? normalizePhone(params.whatsappNumber) : null,
        plan,
        status: "active"
      })
      .eq("id", dealerId);

    if (updateResult.error) throw updateResult.error;
  } else {
    const insertResult = await supabase
      .from("dealers")
      .insert({
        name,
        brands: normalizeBrand(params.brand),
        country: DEFAULT_COUNTRY,
        city,
        timezone,
        business_hours: {
          mon: { open: "08:00", close: "17:00" },
          tue: { open: "08:00", close: "17:00" },
          wed: { open: "08:00", close: "17:00" },
          thu: { open: "08:00", close: "17:00" },
          fri: { open: "08:00", close: "17:00" }
        },
        whatsapp_phone_number: params.whatsappNumber ? normalizePhone(params.whatsappNumber) : null,
        ai_config: {
          faqs: [],
          booking_rules: "default",
          escalation_rules: "default",
          handoff_contacts: []
        },
        plan,
        status: "active"
      })
      .select("id")
      .single();

    if (insertResult.error || !insertResult.data?.id) {
      throw insertResult.error || new Error("Could not create dealer account");
    }

    dealerId = insertResult.data.id as string;
  }

  const subResult = await supabase
    .from("subscriptions")
    .upsert(
      {
        dealer_id: dealerId,
        plan,
        monthly_price: planMonthlyPrice(plan),
        status: "trial",
        start_date: new Date().toISOString().slice(0, 10)
      },
      { onConflict: "dealer_id" }
    );

  if (subResult.error) throw subResult.error;

  return dealerId;
}

export async function captureLeadThread(
  supabase: SupabaseClient,
  params: {
    dealerId: string;
    source: LeadSource;
    name?: string;
    phone: string;
    vehicleInterest?: string;
    budgetRange?: string;
    status?: "new" | "contacted" | "booked" | "visited" | "sold" | "lost";
    assignedUserId?: string | null;
    leadMessage?: string;
    firstResponseBy?: "ai" | "human";
    responseMessage?: string;
    aiEventType: "faq" | "lead_capture" | "booking" | "followup" | "handoff";
    aiEventSuccess?: boolean;
    aiEventMeta?: Record<string, unknown>;
    createFollowup?: boolean;
    followupType?: "reminder" | "nudge" | "no_show";
  }
) {
  const now = new Date().toISOString();

  const leadResult = await supabase
    .from("leads")
    .insert({
      dealer_id: params.dealerId,
      source: params.source,
      first_contact_at: now,
      name: params.name?.trim() || null,
      phone: normalizePhone(params.phone),
      vehicle_interest: params.vehicleInterest?.trim() || null,
      budget_range: params.budgetRange?.trim() || null,
      status: params.status || "new",
      assigned_user_id: params.assignedUserId || null,
      last_activity_at: now
    })
    .select("id")
    .single();

  if (leadResult.error || !leadResult.data?.id) {
    throw leadResult.error || new Error("Could not create lead");
  }

  const leadId = leadResult.data.id as string;

  const conversationResult = await supabase
    .from("conversations")
    .insert({
      dealer_id: params.dealerId,
      lead_id: leadId,
      channel: sourceToChannel(params.source),
      is_open: true,
      last_message_at: now
    })
    .select("id")
    .single();

  if (conversationResult.error || !conversationResult.data?.id) {
    throw conversationResult.error || new Error("Could not create conversation");
  }

  const conversationId = conversationResult.data.id as string;

  const outboundResponseAt = params.responseMessage?.trim() ? new Date().toISOString() : null;
  const messageRows: Array<Record<string, unknown>> = [];

  if (params.leadMessage?.trim()) {
    messageRows.push({
      dealer_id: params.dealerId,
      conversation_id: conversationId,
      lead_id: leadId,
      direction: "inbound",
      sender_type: "lead",
      sender_user_id: null,
      content: params.leadMessage.trim(),
      message_type: "text"
    });
  }

  if (params.responseMessage?.trim()) {
    messageRows.push({
      dealer_id: params.dealerId,
      conversation_id: conversationId,
      lead_id: leadId,
      direction: "outbound",
      sender_type: params.firstResponseBy === "human" ? "human" : "ai",
      sender_user_id: null,
      content: params.responseMessage.trim(),
      message_type: "text"
    });
  }

  if (messageRows.length) {
    const messageInsert = await supabase.from("messages").insert(messageRows);
    if (messageInsert.error) throw messageInsert.error;
  }

  if (outboundResponseAt) {
    const responseSeconds = Math.max(0, Math.round((new Date(outboundResponseAt).getTime() - new Date(now).getTime()) / 1000));

    const responseInsert = await supabase.from("response_metrics").insert({
      dealer_id: params.dealerId,
      lead_id: leadId,
      conversation_id: conversationId,
      first_inbound_at: now,
      first_response_at: outboundResponseAt,
      first_response_by: params.firstResponseBy || "ai",
      response_seconds: responseSeconds
    });

    if (responseInsert.error) throw responseInsert.error;
  }

  const aiEventInsert = await supabase.from("ai_events").insert({
    dealer_id: params.dealerId,
    lead_id: leadId,
    conversation_id: conversationId,
    event_type: params.aiEventType,
    success: params.aiEventSuccess ?? true,
    meta: params.aiEventMeta || {}
  });

  if (aiEventInsert.error) throw aiEventInsert.error;

  if (params.createFollowup) {
    const followupInsert = await supabase.from("followups").insert({
      dealer_id: params.dealerId,
      lead_id: leadId,
      type: params.followupType || "reminder",
      sent_via: "template",
      sent_at: null,
      responded: false,
      response_at: null
    });

    if (followupInsert.error) throw followupInsert.error;
  }

  return {
    leadId,
    conversationId,
    firstContactAt: now,
    firstResponseAt: outboundResponseAt
  };
}

export function bookingLeadStatus() {
  return "booked" as const;
}

export function contactLeadStatus() {
  return "new" as const;
}

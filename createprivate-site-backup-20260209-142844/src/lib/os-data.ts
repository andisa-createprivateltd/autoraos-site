import "server-only";

import { format } from "date-fns";
import { getSupabaseClient } from "@/lib/supabase";

export type DashboardMetrics = {
  newLeads24h: number;
  responseTimeAvg: string;
  bookingsCreated: number;
  missedLeadsAlert: number;
  conversionSnapshot: string;
  mode: "live" | "sample";
};

export type ConversationThread = {
  id: string;
  leadName: string;
  channel: "WhatsApp" | "Web";
  source: "WhatsApp" | "Ads" | "Website" | "OEM";
  tag: "New" | "Hot" | "Booked" | "Visited" | "Sold" | "Lost";
  lastActivity: string;
  messages: Array<{
    speaker: "AI" | "Human" | "Lead";
    text: string;
    at: string;
  }>;
};

export type BookingRow = {
  id: string;
  dealershipName: string;
  contactPerson: string;
  brand: string;
  city: string;
  preferredDateTime: string;
  status: "Booked" | "Completed" | "No-show" | "Cancelled";
};

export type LeadsRow = {
  id: string;
  name: string;
  phone: string;
  source: "WhatsApp" | "Ads" | "Website" | "OEM";
  status: "New" | "Contacted" | "Booked" | "Visited" | "Sold" | "Lost";
  vehicleInterest: string;
  assignedTo: string;
  lastActivityAt: string;
  firstContactAt: string;
};

type LeadMetricRow = {
  id: string;
  dealer_id: string;
  first_contact_at: string;
};

type ResponseMetricRow = {
  lead_id: string;
  response_seconds: number | null;
  first_response_at: string | null;
};

type DealerHoursRow = {
  id: string;
  timezone: string | null;
  business_hours: Record<string, { open?: string; close?: string }> | null;
};

type ConversationRow = {
  id: string;
  lead_id: string;
  channel: string;
  last_message_at: string;
};

type LeadThreadRow = {
  id: string;
  name: string | null;
  source: string | null;
  status: string | null;
};

type MessageRow = {
  conversation_id: string;
  sender_type: string | null;
  content: string;
  created_at: string;
};

type BookingRecordRow = {
  id: string;
  dealer_id: string;
  lead_id: string;
  scheduled_for: string;
  status: string | null;
};

type DealerRow = {
  id: string;
  name: string | null;
  city: string | null;
};

type LeadBookingRow = {
  id: string;
  name: string | null;
  vehicle_interest: string | null;
};

type LeadListRow = {
  id: string;
  name: string | null;
  phone: string;
  source: string | null;
  status: string | null;
  vehicle_interest: string | null;
  assigned_user_id: string | null;
  first_contact_at: string;
  last_activity_at: string;
};

type UserRow = {
  id: string;
  name: string;
  email: string;
};

const SAMPLE_DASHBOARD: DashboardMetrics = {
  newLeads24h: 18,
  responseTimeAvg: "01m 42s",
  bookingsCreated: 7,
  missedLeadsAlert: 2,
  conversionSnapshot: "39%",
  mode: "sample"
};

const SAMPLE_THREADS: ConversationThread[] = [
  {
    id: "sample-1",
    leadName: "Khumo M.",
    channel: "WhatsApp",
    source: "Ads",
    tag: "Hot",
    lastActivity: new Date().toISOString(),
    messages: [
      {
        speaker: "Lead",
        text: "Hi, I want to book a Chery test drive this week.",
        at: new Date().toISOString()
      },
      {
        speaker: "AI",
        text: "Great. I can help you secure a slot. Which day works best?",
        at: new Date().toISOString()
      }
    ]
  }
];

const SAMPLE_BOOKINGS: BookingRow[] = [
  {
    id: "sample-booking-1",
    dealershipName: "Chery Midrand",
    contactPerson: "Khumo M.",
    brand: "Chery Tiggo 8 Pro",
    city: "Midrand",
    preferredDateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    status: "Booked"
  }
];

const SAMPLE_LEADS: LeadsRow[] = [
  {
    id: "sample-lead-1",
    name: "Khumo M.",
    phone: "+27821234567",
    source: "Ads",
    status: "Contacted",
    vehicleInterest: "Chery Tiggo 8 Pro",
    assignedTo: "Dealer Sales",
    firstContactAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    lastActivityAt: new Date(Date.now() - 4 * 60 * 1000).toISOString()
  }
];

function formatDelay(seconds: number | null) {
  if (typeof seconds !== "number" || Number.isNaN(seconds)) return "N/A";
  const safe = Math.max(0, Math.round(seconds));
  const min = Math.floor(safe / 60);
  const sec = safe % 60;
  return `${String(min).padStart(2, "0")}m ${String(sec).padStart(2, "0")}s`;
}

function sourceToUi(source: string | null): ConversationThread["source"] {
  const value = (source || "website").toLowerCase();
  if (value === "whatsapp") return "WhatsApp";
  if (value === "ads") return "Ads";
  if (value === "oem") return "OEM";
  return "Website";
}

function statusToTag(status: string | null): ConversationThread["tag"] {
  const value = (status || "new").toLowerCase();
  if (value === "contacted") return "Hot";
  if (value === "booked") return "Booked";
  if (value === "visited") return "Visited";
  if (value === "sold") return "Sold";
  if (value === "lost") return "Lost";
  return "New";
}

function senderToSpeaker(senderType: string | null): "AI" | "Human" | "Lead" {
  const value = (senderType || "lead").toLowerCase();
  if (value === "ai") return "AI";
  if (value === "human") return "Human";
  if (value === "system") return "AI";
  return "Lead";
}

function bookingStatusToUi(status: string | null): BookingRow["status"] {
  const value = (status || "booked").toLowerCase();
  if (value === "completed") return "Completed";
  if (value === "no_show") return "No-show";
  if (value === "cancelled") return "Cancelled";
  return "Booked";
}

function leadStatusToUi(status: string | null): LeadsRow["status"] {
  const value = (status || "new").toLowerCase();
  if (value === "contacted") return "Contacted";
  if (value === "booked") return "Booked";
  if (value === "visited") return "Visited";
  if (value === "sold") return "Sold";
  if (value === "lost") return "Lost";
  return "New";
}

function isAfterHours(
  dateISO: string,
  timezone?: string | null,
  businessHours?: Record<string, { open?: string; close?: string }> | null
) {
  const tz = timezone || "Africa/Johannesburg";
  const localized = new Date(new Date(dateISO).toLocaleString("en-US", { timeZone: tz }));
  const day = localized.getDay();
  const hour = localized.getHours();
  const minute = localized.getMinutes();
  const total = hour * 60 + minute;

  const mapDay = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
  const key = mapDay[day];

  const schedule = businessHours?.[key];
  if (!schedule?.open || !schedule?.close) {
    return total < 8 * 60 || total >= 17 * 60;
  }

  const [openHour, openMinute] = schedule.open.split(":").map((v) => Number(v));
  const [closeHour, closeMinute] = schedule.close.split(":").map((v) => Number(v));

  const open = openHour * 60 + openMinute;
  const close = closeHour * 60 + closeMinute;
  return total < open || total >= close;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    const supabase = getSupabaseClient();
    const sinceIso = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const [leadCountRes, bookingCountRes, leadRowsRes, responseRowsRes] = await Promise.all([
      supabase.from("leads").select("*", { count: "exact", head: true }).gte("first_contact_at", sinceIso),
      supabase.from("bookings").select("*", { count: "exact", head: true }).gte("created_at", sinceIso),
      supabase.from("leads").select("id,dealer_id,first_contact_at").gte("first_contact_at", sinceIso).limit(600),
      supabase
        .from("response_metrics")
        .select("lead_id,response_seconds,first_response_at")
        .gte("first_inbound_at", sinceIso)
        .limit(600)
    ]);

    if (leadCountRes.error) throw leadCountRes.error;
    if (bookingCountRes.error) throw bookingCountRes.error;
    if (leadRowsRes.error) throw leadRowsRes.error;
    if (responseRowsRes.error) throw responseRowsRes.error;

    const leadRows = (leadRowsRes.data || []) as LeadMetricRow[];
    const responseRows = (responseRowsRes.data || []) as ResponseMetricRow[];

    const dealerIds = Array.from(new Set(leadRows.map((row) => row.dealer_id)));
    let dealerRows: DealerHoursRow[] = [];

    if (dealerIds.length) {
      const dealerRes = await supabase.from("dealers").select("id,timezone,business_hours").in("id", dealerIds);
      if (dealerRes.error) throw dealerRes.error;
      dealerRows = (dealerRes.data || []) as DealerHoursRow[];
    }

    const dealerById = new Map(dealerRows.map((row) => [row.id, row]));
    const responseByLeadId = new Map(responseRows.map((row) => [row.lead_id, row]));

    const responseSeconds = responseRows
      .map((row) => row.response_seconds)
      .filter((value): value is number => typeof value === "number");

    const averageSeconds =
      responseSeconds.length > 0 ? responseSeconds.reduce((acc, current) => acc + current, 0) / responseSeconds.length : null;

    const missedLeadsAlert = leadRows.filter((lead) => {
      const response = responseByLeadId.get(lead.id);
      const dealer = dealerById.get(lead.dealer_id);
      const afterHours = isAfterHours(lead.first_contact_at, dealer?.timezone, dealer?.business_hours);
      return afterHours && (!response || typeof response.response_seconds !== "number" || response.response_seconds > 300);
    }).length;

    const leadCount = leadCountRes.count || 0;
    const bookingsCount = bookingCountRes.count || 0;

    return {
      newLeads24h: leadCount,
      responseTimeAvg: formatDelay(averageSeconds),
      bookingsCreated: bookingsCount,
      missedLeadsAlert,
      conversionSnapshot: leadCount > 0 ? `${Math.round((bookingsCount / leadCount) * 100)}%` : "0%",
      mode: "live"
    };
  } catch {
    return SAMPLE_DASHBOARD;
  }
}

export async function getConversationThreads(): Promise<{ threads: ConversationThread[]; mode: "live" | "sample" }> {
  try {
    const supabase = getSupabaseClient();
    const conversationRes = await supabase
      .from("conversations")
      .select("id,lead_id,channel,last_message_at")
      .order("last_message_at", { ascending: false })
      .limit(16);

    if (conversationRes.error) throw conversationRes.error;

    const conversations = (conversationRes.data || []) as ConversationRow[];
    if (!conversations.length) {
      return { threads: SAMPLE_THREADS, mode: "sample" };
    }

    const leadIds = Array.from(new Set(conversations.map((row) => row.lead_id)));
    const conversationIds = conversations.map((row) => row.id);

    const [leadRes, messageRes] = await Promise.all([
      supabase.from("leads").select("id,name,source,status").in("id", leadIds),
      supabase
        .from("messages")
        .select("conversation_id,sender_type,content,created_at")
        .in("conversation_id", conversationIds)
        .order("created_at", { ascending: false })
        .limit(400)
    ]);

    if (leadRes.error) throw leadRes.error;
    if (messageRes.error) throw messageRes.error;

    const leads = (leadRes.data || []) as LeadThreadRow[];
    const messages = (messageRes.data || []) as MessageRow[];

    const leadById = new Map(leads.map((lead) => [lead.id, lead]));
    const messagesByConversation = new Map<string, MessageRow[]>();

    for (const message of messages) {
      const list = messagesByConversation.get(message.conversation_id) || [];
      list.push(message);
      messagesByConversation.set(message.conversation_id, list);
    }

    const threads: ConversationThread[] = conversations.map((conversation) => {
      const lead = leadById.get(conversation.lead_id);
      const threadMessages = (messagesByConversation.get(conversation.id) || [])
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        .slice(-5)
        .map((message) => ({
          speaker: senderToSpeaker(message.sender_type),
          text: message.content,
          at: message.created_at
        }));

      const source = sourceToUi(lead?.source || "website");

      return {
        id: conversation.id,
        leadName: lead?.name || "Unknown Lead",
        channel: conversation.channel === "whatsapp" ? "WhatsApp" : "Web",
        source,
        tag: statusToTag(lead?.status || "new"),
        lastActivity: conversation.last_message_at,
        messages:
          threadMessages.length > 0
            ? threadMessages
            : [
                {
                  speaker: "AI",
                  text: "Conversation initialized.",
                  at: conversation.last_message_at
                }
              ]
      };
    });

    return { threads, mode: "live" };
  } catch {
    return { threads: SAMPLE_THREADS, mode: "sample" };
  }
}

export async function getLeadsOverview(filters?: {
  status?: string;
  source?: string;
  assigned?: string;
}): Promise<{ leads: LeadsRow[]; mode: "live" | "sample" }> {
  try {
    const supabase = getSupabaseClient();

    let query = supabase
      .from("leads")
      .select("id,name,phone,source,status,vehicle_interest,assigned_user_id,first_contact_at,last_activity_at")
      .order("last_activity_at", { ascending: false })
      .limit(120);

    if (filters?.status && filters.status !== "all") {
      query = query.eq("status", filters.status);
    }

    if (filters?.source && filters.source !== "all") {
      query = query.eq("source", filters.source);
    }

    if (filters?.assigned && filters.assigned !== "all") {
      if (filters.assigned === "unassigned") {
        query = query.is("assigned_user_id", null);
      } else {
        query = query.eq("assigned_user_id", filters.assigned);
      }
    }

    const leadRes = await query;
    if (leadRes.error) throw leadRes.error;

    const leads = (leadRes.data || []) as LeadListRow[];
    if (!leads.length) {
      return { leads: SAMPLE_LEADS, mode: "sample" };
    }

    const assignedIds = Array.from(
      new Set(
        leads
          .map((lead) => lead.assigned_user_id)
          .filter((value): value is string => Boolean(value))
      )
    );

    let userById = new Map<string, UserRow>();
    if (assignedIds.length) {
      const userRes = await supabase.from("users").select("id,name,email").in("id", assignedIds);
      if (userRes.error) throw userRes.error;
      userById = new Map(((userRes.data || []) as UserRow[]).map((user) => [user.id, user]));
    }

    const rows: LeadsRow[] = leads.map((lead) => {
      const assignedUser = lead.assigned_user_id ? userById.get(lead.assigned_user_id) : null;

      return {
        id: lead.id,
        name: lead.name || "Unknown Lead",
        phone: lead.phone,
        source: sourceToUi(lead.source),
        status: leadStatusToUi(lead.status),
        vehicleInterest: lead.vehicle_interest || "Not captured",
        assignedTo: assignedUser?.name || "Unassigned",
        firstContactAt: lead.first_contact_at,
        lastActivityAt: lead.last_activity_at
      };
    });

    return { leads: rows, mode: "live" };
  } catch {
    return { leads: SAMPLE_LEADS, mode: "sample" };
  }
}

export async function getUpcomingBookings(): Promise<{ bookings: BookingRow[]; mode: "live" | "sample" }> {
  try {
    const supabase = getSupabaseClient();
    const bookingRes = await supabase
      .from("bookings")
      .select("id,dealer_id,lead_id,scheduled_for,status")
      .gte("scheduled_for", new Date().toISOString())
      .order("scheduled_for", { ascending: true })
      .limit(40);

    if (bookingRes.error) throw bookingRes.error;

    const bookings = (bookingRes.data || []) as BookingRecordRow[];
    if (!bookings.length) {
      return { bookings: SAMPLE_BOOKINGS, mode: "sample" };
    }

    const dealerIds = Array.from(new Set(bookings.map((row) => row.dealer_id)));
    const leadIds = Array.from(new Set(bookings.map((row) => row.lead_id)));

    const [dealerRes, leadRes] = await Promise.all([
      supabase.from("dealers").select("id,name,city").in("id", dealerIds),
      supabase.from("leads").select("id,name,vehicle_interest").in("id", leadIds)
    ]);

    if (dealerRes.error) throw dealerRes.error;
    if (leadRes.error) throw leadRes.error;

    const dealers = (dealerRes.data || []) as DealerRow[];
    const leads = (leadRes.data || []) as LeadBookingRow[];
    const dealerById = new Map(dealers.map((dealer) => [dealer.id, dealer]));
    const leadById = new Map(leads.map((lead) => [lead.id, lead]));

    const rows: BookingRow[] = bookings.map((booking) => {
      const dealer = dealerById.get(booking.dealer_id);
      const lead = leadById.get(booking.lead_id);

      return {
        id: booking.id,
        dealershipName: dealer?.name || "Unknown Dealership",
        contactPerson: lead?.name || "Unknown Contact",
        brand: lead?.vehicle_interest || "Unknown",
        city: dealer?.city || "Unknown",
        preferredDateTime: booking.scheduled_for,
        status: bookingStatusToUi(booking.status)
      };
    });

    return { bookings: rows, mode: "live" };
  } catch {
    return { bookings: SAMPLE_BOOKINGS, mode: "sample" };
  }
}

export async function getInsightsSnapshot() {
  try {
    const supabase = getSupabaseClient();
    const sinceIso = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const [leadRes, bookingRes, responseRes] = await Promise.all([
      supabase.from("leads").select("id,dealer_id,first_contact_at").gte("first_contact_at", sinceIso),
      supabase.from("bookings").select("id,status").gte("created_at", sinceIso),
      supabase.from("response_metrics").select("lead_id,response_seconds").gte("first_inbound_at", sinceIso)
    ]);

    if (leadRes.error) throw leadRes.error;
    if (bookingRes.error) throw bookingRes.error;
    if (responseRes.error) throw responseRes.error;

    const leads = (leadRes.data || []) as LeadMetricRow[];
    const responses = (responseRes.data || []) as ResponseMetricRow[];

    const responseSeconds = responses
      .map((row) => row.response_seconds)
      .filter((value): value is number => typeof value === "number");

    const averageSeconds =
      responseSeconds.length > 0 ? responseSeconds.reduce((acc, current) => acc + current, 0) / responseSeconds.length : null;

    const responseByLead = new Set(responses.map((row) => row.lead_id));

    const dealerIds = Array.from(new Set(leads.map((row) => row.dealer_id)));
    let dealerRows: DealerHoursRow[] = [];

    if (dealerIds.length) {
      const dealerRes = await supabase.from("dealers").select("id,timezone,business_hours").in("id", dealerIds);
      if (dealerRes.error) throw dealerRes.error;
      dealerRows = (dealerRes.data || []) as DealerHoursRow[];
    }

    const dealerById = new Map(dealerRows.map((row) => [row.id, row]));

    const afterHoursMissed = leads.filter((lead) => {
      const dealer = dealerById.get(lead.dealer_id);
      const afterHours = isAfterHours(lead.first_contact_at, dealer?.timezone, dealer?.business_hours);
      return afterHours && !responseByLead.has(lead.id);
    }).length;

    const bookedCount = (bookingRes.data || []).filter((row) => row.status === "booked" || row.status === "completed").length;

    return {
      averageResponseTime: formatDelay(averageSeconds),
      leadsVsBookings: `${leads.length} leads / ${bookedCount} bookings`,
      afterHoursMissedLeads: afterHoursMissed,
      generatedAt: format(new Date(), "PPP p"),
      mode: "live" as const
    };
  } catch {
    const dashboard = SAMPLE_DASHBOARD;
    return {
      averageResponseTime: dashboard.responseTimeAvg,
      leadsVsBookings: `${dashboard.newLeads24h} leads / ${dashboard.bookingsCreated} bookings`,
      afterHoursMissedLeads: dashboard.missedLeadsAlert,
      generatedAt: format(new Date(), "PPP p"),
      mode: "sample" as const
    };
  }
}

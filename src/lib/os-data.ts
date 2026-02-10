import "server-only";

import { format } from "date-fns";
import { getSupabaseClient } from "@/lib/supabase";

export type DashboardMetrics = {
  newLeads24h: number;
  responseTimeAvg: string;
  bookingsCreated: number;
  missedLeadsAlert: number;
  conversionSnapshot: string;
  unansweredFiveMinutes: number;
  afterHoursPending: number;
  hotLeadsNotBooked: number;
  mode: "live" | "sample";
};

export type ConversationThread = {
  id: string;
  leadId: string;
  leadName: string;
  leadPhone: string;
  channel: "WhatsApp" | "Web";
  source: "WhatsApp" | "Ads" | "Website" | "OEM";
  tag: "New" | "Hot" | "Booked" | "Visited" | "Sold" | "Lost";
  status: "New" | "Contacted" | "Booked" | "Visited" | "Sold" | "Lost";
  assignedTo: string;
  assignedUserId: string | null;
  lastResponseTime: string;
  aiEnabled: boolean;
  lastActivity: string;
  messages: Array<{
    speaker: "AI" | "Human" | "Lead";
    text: string;
    at: string;
  }>;
};

export type BookingRow = {
  id: string;
  dealerId: string;
  leadId: string;
  dealershipName: string;
  contactPerson: string;
  brand: string;
  city: string;
  source: "WhatsApp" | "Ads" | "Website" | "OEM";
  assignedTo: string;
  notes: string;
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

export type RecoverNowRow = {
  id: string;
  leadId: string;
  dealershipName: string;
  leadName: string;
  phone: string;
  issueType:
    | "No reply in 5 minutes"
    | "After-hours follow-up pending"
    | "Contacted but not booked (24h)"
    | "No-show reminder missing";
  ageLabel: string;
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
  dealer_id: string;
  lead_id: string;
  channel: string;
  last_message_at: string;
};

type LeadThreadRow = {
  id: string;
  name: string | null;
  phone?: string;
  source: string | null;
  status: string | null;
  assigned_user_id?: string | null;
};

type MessageRow = {
  conversation_id: string;
  sender_type: string | null;
  content: string;
  created_at: string;
};

type HandoffEventRow = {
  conversation_id: string;
  meta: {
    enabled?: boolean;
  } | null;
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
  source?: string | null;
  assigned_user_id?: string | null;
  budget_range?: string | null;
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

type FollowupRow = {
  id: string;
  lead_id: string;
  type: string | null;
  sent_at: string | null;
};

type BookingCompactRow = {
  id: string;
  lead_id: string;
  scheduled_for: string;
  status: string | null;
};

const SAMPLE_DASHBOARD: DashboardMetrics = {
  newLeads24h: 18,
  responseTimeAvg: "01m 42s",
  bookingsCreated: 7,
  missedLeadsAlert: 2,
  conversionSnapshot: "39%",
  unansweredFiveMinutes: 2,
  afterHoursPending: 1,
  hotLeadsNotBooked: 3,
  mode: "sample"
};

const SAMPLE_THREADS: ConversationThread[] = [
  {
    id: "sample-1",
    leadId: "sample-lead-1",
    leadName: "Khumo M.",
    leadPhone: "+27821234567",
    channel: "WhatsApp",
    source: "Ads",
    tag: "Hot",
    status: "Contacted",
    assignedTo: "Dealer Sales",
    assignedUserId: null,
    lastResponseTime: "01m 16s",
    aiEnabled: true,
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
    dealerId: "sample-dealer-1",
    leadId: "sample-lead-1",
    dealershipName: "Chery Midrand",
    contactPerson: "Khumo M.",
    brand: "Chery Tiggo 8 Pro",
    city: "Midrand",
    source: "Ads",
    assignedTo: "Dealer Sales",
    notes: "Requested finance options.",
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

const SAMPLE_RECOVER_NOW: RecoverNowRow[] = [
  {
    id: "recover-1",
    leadId: "sample-lead-1",
    dealershipName: "Chery Midrand",
    leadName: "Khumo M.",
    phone: "+27821234567",
    issueType: "No reply in 5 minutes",
    ageLabel: "6 minutes ago"
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

function minutesBetween(nowMs: number, dateIso: string) {
  return Math.max(0, Math.round((nowMs - new Date(dateIso).getTime()) / (60 * 1000)));
}

function formatRelativeAge(minutes: number) {
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export async function getDealerContextOptions() {
  try {
    const supabase = getSupabaseClient();
    const res = await supabase
      .from("dealers")
      .select("id,name,city")
      .order("name", { ascending: true })
      .limit(100);

    if (res.error) throw res.error;

    const dealers = (res.data || []) as DealerRow[];
    if (!dealers.length) return [];

    return dealers.map((dealer) => ({
      id: dealer.id,
      label: dealer.city ? `${dealer.name || "Unnamed"} (${dealer.city})` : dealer.name || "Unnamed Dealer"
    }));
  } catch {
    return [];
  }
}

export async function getAssignableUsers(dealerId?: string) {
  try {
    const supabase = getSupabaseClient();
    let query = supabase
      .from("users")
      .select("id,name,email,role,is_active,dealer_id")
      .eq("is_active", true)
      .order("name", { ascending: true })
      .limit(100);

    if (dealerId) {
      query = query.eq("dealer_id", dealerId);
    }

    const res = await query;
    if (res.error) throw res.error;

    return ((res.data || []) as Array<{
      id: string;
      name: string | null;
      email: string | null;
      role: string;
    }>).map((row) => ({
      id: row.id,
      name: row.name || row.email || "User",
      role: row.role
    }));
  } catch {
    return [];
  }
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

export async function getDashboardMetrics(options?: { dealerId?: string }): Promise<DashboardMetrics> {
  try {
    const supabase = getSupabaseClient();
    const sinceIso = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const sevenDaysIso = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    let leadCountQuery = supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .gte("first_contact_at", sinceIso);
    let bookingCountQuery = supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .gte("created_at", sevenDaysIso);
    let leadRowsQuery = supabase
      .from("leads")
      .select("id,dealer_id,first_contact_at,status")
      .gte("first_contact_at", sevenDaysIso)
      .limit(1200);
    let responseRowsQuery = supabase
        .from("response_metrics")
        .select("lead_id,response_seconds,first_response_at")
        .gte("first_inbound_at", sevenDaysIso)
        .limit(1200);

    if (options?.dealerId) {
      leadCountQuery = leadCountQuery.eq("dealer_id", options.dealerId);
      bookingCountQuery = bookingCountQuery.eq("dealer_id", options.dealerId);
      leadRowsQuery = leadRowsQuery.eq("dealer_id", options.dealerId);
      responseRowsQuery = responseRowsQuery.eq("dealer_id", options.dealerId);
    }

    const [leadCountRes, bookingCountRes, leadRowsRes, responseRowsRes] = await Promise.all([
      leadCountQuery,
      bookingCountQuery,
      leadRowsQuery,
      responseRowsQuery
    ]);

    if (leadCountRes.error) throw leadCountRes.error;
    if (bookingCountRes.error) throw bookingCountRes.error;
    if (leadRowsRes.error) throw leadRowsRes.error;
    if (responseRowsRes.error) throw responseRowsRes.error;

    const leadRows = (leadRowsRes.data || []) as Array<LeadMetricRow & { status: string | null }>;
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

    const nowMs = Date.now();
    const missedLeadsAlert = leadRows.filter((lead) => {
      const response = responseByLeadId.get(lead.id);
      const dealer = dealerById.get(lead.dealer_id);
      const afterHours = isAfterHours(lead.first_contact_at, dealer?.timezone, dealer?.business_hours);
      return afterHours && (!response || typeof response.response_seconds !== "number" || response.response_seconds > 300);
    }).length;

    const unansweredFiveMinutes = leadRows.filter((lead) => {
      const response = responseByLeadId.get(lead.id);
      const leadAgeMinutes = minutesBetween(nowMs, lead.first_contact_at);
      return leadAgeMinutes >= 5 && (!response || typeof response.response_seconds !== "number" || response.response_seconds > 300);
    }).length;

    const hotLeadsNotBooked = leadRows.filter((lead) => {
      const normalized = (lead.status || "").toLowerCase();
      return normalized === "contacted";
    }).length;

    const leadCount = leadCountRes.count || 0;
    const bookingsCount = bookingCountRes.count || 0;

    return {
      newLeads24h: leadCount,
      responseTimeAvg: formatDelay(averageSeconds),
      bookingsCreated: bookingsCount,
      missedLeadsAlert,
      conversionSnapshot: leadCount > 0 ? `${Math.round((bookingsCount / leadCount) * 100)}%` : "0%",
      unansweredFiveMinutes,
      afterHoursPending: missedLeadsAlert,
      hotLeadsNotBooked,
      mode: "live"
    };
  } catch {
    return SAMPLE_DASHBOARD;
  }
}

export async function getConversationThreads(options?: {
  dealerId?: string;
  leadId?: string;
}): Promise<{ threads: ConversationThread[]; mode: "live" | "sample" }> {
  try {
    const supabase = getSupabaseClient();
    let query = supabase
      .from("conversations")
      .select("id,dealer_id,lead_id,channel,last_message_at")
      .order("last_message_at", { ascending: false })
      .limit(16);

    if (options?.dealerId) {
      query = query.eq("dealer_id", options.dealerId);
    }

    if (options?.leadId) {
      query = query.eq("lead_id", options.leadId);
    }

    const conversationRes = await query;

    if (conversationRes.error) throw conversationRes.error;

    const conversations = (conversationRes.data || []) as ConversationRow[];
    if (!conversations.length) {
      return { threads: SAMPLE_THREADS, mode: "sample" };
    }

    const leadIds = Array.from(new Set(conversations.map((row) => row.lead_id)));
    const conversationIds = conversations.map((row) => row.id);
    const dealerIds = Array.from(new Set(conversations.map((row) => row.dealer_id)));

    const [leadRes, messageRes, responseRes, handoffRes, usersRes] = await Promise.all([
      supabase.from("leads").select("id,name,phone,source,status,assigned_user_id").in("id", leadIds),
      supabase
        .from("messages")
        .select("conversation_id,sender_type,content,created_at")
        .in("conversation_id", conversationIds)
        .order("created_at", { ascending: false })
        .limit(600),
      supabase
        .from("response_metrics")
        .select("lead_id,response_seconds")
        .in("lead_id", leadIds),
      supabase
        .from("ai_events")
        .select("conversation_id,meta,created_at")
        .in("conversation_id", conversationIds)
        .eq("event_type", "handoff")
        .order("created_at", { ascending: false })
        .limit(200),
      supabase
        .from("users")
        .select("id,name,email")
        .in("dealer_id", dealerIds)
        .eq("is_active", true)
        .limit(200)
    ]);

    if (leadRes.error) throw leadRes.error;
    if (messageRes.error) throw messageRes.error;
    if (responseRes.error) throw responseRes.error;
    if (handoffRes.error) throw handoffRes.error;
    if (usersRes.error) throw usersRes.error;

    const leads = (leadRes.data || []) as LeadThreadRow[];
    const messages = (messageRes.data || []) as MessageRow[];
    const responses = (responseRes.data || []) as ResponseMetricRow[];
    const handoffEvents = (handoffRes.data || []) as HandoffEventRow[];
    const users = (usersRes.data || []) as UserRow[];

    const leadById = new Map(leads.map((lead) => [lead.id, lead]));
    const responseByLeadId = new Map(responses.map((row) => [row.lead_id, row]));
    const userById = new Map(users.map((row) => [row.id, row]));
    const messagesByConversation = new Map<string, MessageRow[]>();
    const handoffByConversation = new Map<string, HandoffEventRow>();

    for (const message of messages) {
      const list = messagesByConversation.get(message.conversation_id) || [];
      list.push(message);
      messagesByConversation.set(message.conversation_id, list);
    }

    for (const event of handoffEvents) {
      if (!handoffByConversation.has(event.conversation_id)) {
        handoffByConversation.set(event.conversation_id, event);
      }
    }

    const threads: ConversationThread[] = conversations.map((conversation) => {
      const lead = leadById.get(conversation.lead_id);
      const assignedUser = lead?.assigned_user_id ? userById.get(lead.assigned_user_id) : null;
      const response = responseByLeadId.get(conversation.lead_id);
      const latestHandoff = handoffByConversation.get(conversation.id);
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
        leadId: conversation.lead_id,
        leadName: lead?.name || "Unknown Lead",
        leadPhone: lead?.phone || "",
        channel: conversation.channel === "whatsapp" ? "WhatsApp" : "Web",
        source,
        tag: statusToTag(lead?.status || "new"),
        status: leadStatusToUi(lead?.status || "new"),
        assignedTo: assignedUser?.name || "Unassigned",
        assignedUserId: lead?.assigned_user_id || null,
        lastResponseTime: formatDelay(response?.response_seconds ?? null),
        aiEnabled: latestHandoff?.meta?.enabled ?? true,
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
  dealerId?: string;
  recentWindow?: "24h";
  queue?: "slow" | "recover" | "stuck" | "hot";
  leadId?: string;
}): Promise<{ leads: LeadsRow[]; mode: "live" | "sample" }> {
  try {
    const supabase = getSupabaseClient();

    let query = supabase
      .from("leads")
      .select("id,name,phone,source,status,vehicle_interest,assigned_user_id,first_contact_at,last_activity_at")
      .order("last_activity_at", { ascending: false })
      .limit(300);

    if (filters?.dealerId) {
      query = query.eq("dealer_id", filters.dealerId);
    }

    if (filters?.leadId) {
      query = query.eq("id", filters.leadId);
    }

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

    let leads = (leadRes.data || []) as LeadListRow[];
    if (!leads.length) {
      return { leads: SAMPLE_LEADS, mode: "sample" };
    }

    const leadIds = leads.map((lead) => lead.id);
    const [responseRes, bookingRes] = await Promise.all([
      supabase
        .from("response_metrics")
        .select("lead_id,response_seconds")
        .in("lead_id", leadIds),
      supabase
        .from("bookings")
        .select("id,lead_id,scheduled_for,status")
        .in("lead_id", leadIds)
    ]);

    if (responseRes.error) throw responseRes.error;
    if (bookingRes.error) throw bookingRes.error;

    const responses = (responseRes.data || []) as ResponseMetricRow[];
    const bookings = (bookingRes.data || []) as BookingCompactRow[];
    const responseByLeadId = new Map(responses.map((row) => [row.lead_id, row]));
    const bookingsByLeadId = new Map<string, BookingCompactRow[]>();
    for (const booking of bookings) {
      const list = bookingsByLeadId.get(booking.lead_id) || [];
      list.push(booking);
      bookingsByLeadId.set(booking.lead_id, list);
    }

    if (filters?.recentWindow === "24h") {
      const cutoff = Date.now() - 24 * 60 * 60 * 1000;
      leads = leads.filter((lead) => new Date(lead.first_contact_at).getTime() >= cutoff);
    }

    if (filters?.queue) {
      const nowMs = Date.now();

      leads = leads.filter((lead) => {
        const response = responseByLeadId.get(lead.id);
        const leadAgeMinutes = minutesBetween(nowMs, lead.first_contact_at);
        const leadBookings = bookingsByLeadId.get(lead.id) || [];
        const hasActiveBooking = leadBookings.some((booking) => {
          const normalizedStatus = (booking.status || "").toLowerCase();
          return normalizedStatus === "booked" || normalizedStatus === "completed";
        });

        if (filters.queue === "slow") {
          return !response || typeof response.response_seconds !== "number" || response.response_seconds > 300;
        }

        if (filters.queue === "recover") {
          const isContacted = (lead.status || "").toLowerCase() === "contacted";
          const contactedNotBooked = isContacted && leadAgeMinutes >= 24 * 60 && !hasActiveBooking;
          const noReply = leadAgeMinutes >= 5 && (!response || typeof response.response_seconds !== "number");
          return noReply || contactedNotBooked;
        }

        if (filters.queue === "stuck") {
          const normalized = (lead.status || "").toLowerCase();
          return (normalized === "new" || normalized === "contacted") && !hasActiveBooking;
        }

        if (filters.queue === "hot") {
          return (lead.status || "").toLowerCase() === "contacted" && !hasActiveBooking;
        }

        return true;
      });
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

export async function getUpcomingBookings(options?: {
  dealerId?: string;
  window?: "week";
  leadId?: string;
}): Promise<{ bookings: BookingRow[]; mode: "live" | "sample" }> {
  try {
    const supabase = getSupabaseClient();
    const nowIso = new Date().toISOString();
    let bookingQuery = supabase
      .from("bookings")
      .select("id,dealer_id,lead_id,scheduled_for,status")
      .gte("scheduled_for", nowIso)
      .order("scheduled_for", { ascending: true })
      .limit(80);

    if (options?.dealerId) {
      bookingQuery = bookingQuery.eq("dealer_id", options.dealerId);
    }

    if (options?.leadId) {
      bookingQuery = bookingQuery.eq("lead_id", options.leadId);
    }

    if (options?.window === "week") {
      const weekIso = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      bookingQuery = bookingQuery.lte("scheduled_for", weekIso);
    }

    const bookingRes = await bookingQuery;

    if (bookingRes.error) throw bookingRes.error;

    const bookings = (bookingRes.data || []) as BookingRecordRow[];
    if (!bookings.length) {
      return { bookings: SAMPLE_BOOKINGS, mode: "sample" };
    }

    const dealerIds = Array.from(new Set(bookings.map((row) => row.dealer_id)));
    const leadIds = Array.from(new Set(bookings.map((row) => row.lead_id)));

    const [dealerRes, leadRes, usersRes] = await Promise.all([
      supabase.from("dealers").select("id,name,city").in("id", dealerIds),
      supabase
        .from("leads")
        .select("id,name,vehicle_interest,source,assigned_user_id,budget_range")
        .in("id", leadIds),
      supabase.from("users").select("id,name,email").in("dealer_id", dealerIds)
    ]);

    if (dealerRes.error) throw dealerRes.error;
    if (leadRes.error) throw leadRes.error;
    if (usersRes.error) throw usersRes.error;

    const dealers = (dealerRes.data || []) as DealerRow[];
    const leads = (leadRes.data || []) as LeadBookingRow[];
    const users = (usersRes.data || []) as UserRow[];
    const dealerById = new Map(dealers.map((dealer) => [dealer.id, dealer]));
    const leadById = new Map(leads.map((lead) => [lead.id, lead]));
    const userById = new Map(users.map((user) => [user.id, user]));

    const rows: BookingRow[] = bookings.map((booking) => {
      const dealer = dealerById.get(booking.dealer_id);
      const lead = leadById.get(booking.lead_id);

      return {
        id: booking.id,
        dealerId: booking.dealer_id,
        leadId: booking.lead_id,
        dealershipName: dealer?.name || "Unknown Dealership",
        contactPerson: lead?.name || "Unknown Contact",
        brand: lead?.vehicle_interest || "Unknown",
        city: dealer?.city || "Unknown",
        source: sourceToUi(lead?.source || "website"),
        assignedTo: lead?.assigned_user_id ? userById.get(lead.assigned_user_id)?.name || "Assigned" : "Unassigned",
        notes: lead?.budget_range ? `Budget: ${lead.budget_range}` : "No notes",
        preferredDateTime: booking.scheduled_for,
        status: bookingStatusToUi(booking.status)
      };
    });

    return { bookings: rows, mode: "live" };
  } catch {
    return { bookings: SAMPLE_BOOKINGS, mode: "sample" };
  }
}

export async function getRecoverNowQueue(options?: {
  dealerId?: string;
}): Promise<{ rows: RecoverNowRow[]; mode: "live" | "sample" }> {
  try {
    const supabase = getSupabaseClient();
    const sinceIso = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    let leadsQuery = supabase
      .from("leads")
      .select("id,dealer_id,name,phone,status,first_contact_at")
      .gte("first_contact_at", sinceIso)
      .order("first_contact_at", { ascending: false })
      .limit(200);

    if (options?.dealerId) {
      leadsQuery = leadsQuery.eq("dealer_id", options.dealerId);
    }

    const leadsRes = await leadsQuery;
    if (leadsRes.error) throw leadsRes.error;

    const leadRows = (leadsRes.data || []) as Array<{
      id: string;
      dealer_id: string;
      name: string | null;
      phone: string;
      status: string | null;
      first_contact_at: string;
    }>;

    if (!leadRows.length) {
      return { rows: SAMPLE_RECOVER_NOW, mode: "sample" };
    }

    const leadIds = leadRows.map((lead) => lead.id);
    const dealerIds = Array.from(new Set(leadRows.map((lead) => lead.dealer_id)));

    const [responsesRes, bookingsRes, followupsRes, dealersRes] = await Promise.all([
      supabase
        .from("response_metrics")
        .select("lead_id,response_seconds")
        .in("lead_id", leadIds),
      supabase
        .from("bookings")
        .select("id,lead_id,scheduled_for,status")
        .in("lead_id", leadIds),
      supabase
        .from("followups")
        .select("id,lead_id,type,sent_at")
        .in("lead_id", leadIds),
      supabase
        .from("dealers")
        .select("id,name,timezone,business_hours")
        .in("id", dealerIds)
    ]);

    if (responsesRes.error) throw responsesRes.error;
    if (bookingsRes.error) throw bookingsRes.error;
    if (followupsRes.error) throw followupsRes.error;
    if (dealersRes.error) throw dealersRes.error;

    const responses = (responsesRes.data || []) as ResponseMetricRow[];
    const bookings = (bookingsRes.data || []) as BookingCompactRow[];
    const followups = (followupsRes.data || []) as FollowupRow[];
    const dealers = (dealersRes.data || []) as Array<DealerHoursRow & { name: string | null }>;

    const responseByLead = new Map(responses.map((row) => [row.lead_id, row]));
    const dealerById = new Map(dealers.map((dealer) => [dealer.id, dealer]));
    const bookingsByLead = new Map<string, BookingCompactRow[]>();
    const followupsByLead = new Map<string, FollowupRow[]>();

    for (const booking of bookings) {
      const list = bookingsByLead.get(booking.lead_id) || [];
      list.push(booking);
      bookingsByLead.set(booking.lead_id, list);
    }

    for (const followup of followups) {
      const list = followupsByLead.get(followup.lead_id) || [];
      list.push(followup);
      followupsByLead.set(followup.lead_id, list);
    }

    const nowMs = Date.now();
    const queue: RecoverNowRow[] = [];

    for (const lead of leadRows) {
      const dealer = dealerById.get(lead.dealer_id);
      const response = responseByLead.get(lead.id);
      const leadBookings = bookingsByLead.get(lead.id) || [];
      const leadFollowups = followupsByLead.get(lead.id) || [];
      const ageMinutes = minutesBetween(nowMs, lead.first_contact_at);
      const hasBooked = leadBookings.some((booking) => {
        const normalized = (booking.status || "").toLowerCase();
        return normalized === "booked" || normalized === "completed";
      });

      if (ageMinutes >= 5 && (!response || (response.response_seconds ?? 0) > 300)) {
        queue.push({
          id: `recover-no-reply-${lead.id}`,
          leadId: lead.id,
          dealershipName: dealer?.name || "Unknown Dealership",
          leadName: lead.name || "Unknown Lead",
          phone: lead.phone,
          issueType: "No reply in 5 minutes",
          ageLabel: formatRelativeAge(ageMinutes)
        });
        continue;
      }

      if (
        isAfterHours(lead.first_contact_at, dealer?.timezone, dealer?.business_hours) &&
        !leadFollowups.some((followup) => followup.type === "reminder")
      ) {
        queue.push({
          id: `recover-after-hours-${lead.id}`,
          leadId: lead.id,
          dealershipName: dealer?.name || "Unknown Dealership",
          leadName: lead.name || "Unknown Lead",
          phone: lead.phone,
          issueType: "After-hours follow-up pending",
          ageLabel: formatRelativeAge(ageMinutes)
        });
        continue;
      }

      if ((lead.status || "").toLowerCase() === "contacted" && ageMinutes >= 24 * 60 && !hasBooked) {
        queue.push({
          id: `recover-contacted-${lead.id}`,
          leadId: lead.id,
          dealershipName: dealer?.name || "Unknown Dealership",
          leadName: lead.name || "Unknown Lead",
          phone: lead.phone,
          issueType: "Contacted but not booked (24h)",
          ageLabel: formatRelativeAge(ageMinutes)
        });
        continue;
      }

      const upcomingBooking = leadBookings.find((booking) => {
        const status = (booking.status || "").toLowerCase();
        if (status !== "booked") return false;
        const scheduledMs = new Date(booking.scheduled_for).getTime();
        return scheduledMs > nowMs && scheduledMs <= nowMs + 24 * 60 * 60 * 1000;
      });

      if (
        upcomingBooking &&
        !leadFollowups.some(
          (followup) =>
            followup.type === "reminder" &&
            followup.sent_at &&
            new Date(followup.sent_at).getTime() >= nowMs - 24 * 60 * 60 * 1000
        )
      ) {
        queue.push({
          id: `recover-no-show-${lead.id}`,
          leadId: lead.id,
          dealershipName: dealer?.name || "Unknown Dealership",
          leadName: lead.name || "Unknown Lead",
          phone: lead.phone,
          issueType: "No-show reminder missing",
          ageLabel: "Before appointment"
        });
      }
    }

    return { rows: queue.slice(0, 20), mode: "live" };
  } catch {
    return { rows: SAMPLE_RECOVER_NOW, mode: "sample" };
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

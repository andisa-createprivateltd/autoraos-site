import "server-only";

import { format } from "date-fns";
import fs from "node:fs";
import path from "node:path";
import { hasSupabase } from "@/lib/env";
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

export type DashboardTimeRange = "today" | "7d" | "30d" | "custom";

export type DashboardRoleView = "platform" | "principal" | "manager" | "agent" | "marketing";

export type RevenueRiskCardTone = "positive" | "warning" | "critical" | "neutral";

export type DashboardRiskBreakdown = {
  delayCount: number;
  afterHoursCount: number;
  dropOffCount: number;
  noShowCount: number;
  predictedRiskPct: number;
};

export type DashboardHeatmapRow = {
  region: string;
  stores: number;
  compliancePct: number;
  trendDeltaPct: number;
  tone: RevenueRiskCardTone;
};

export type PolicyMetric = {
  label: string;
  target: string;
  compliancePct: number;
  breachesToday: number;
};

export type AuditLogRow = {
  id: string;
  at: string;
  actor: string;
  action: string;
  context: string;
  dealer: string;
  slaType: "First Response" | "After Hours" | "Booking" | "No-show" | "Assignment";
  user: string;
};

export type RevenueRiskSnapshot = {
  mode: "live" | "sample";
  timeRange: DashboardTimeRange;
  storeScopeLabel: string;
  roleView: DashboardRoleView;
  revenueAtRisk: number;
  revenueAtRiskCount: number;
  averageDealValue: number;
  averageCloseRatePct: number;
  projectedMarginExposureText: string;
  aiUrgencyQueue24h: number;
  medianResponseTime: string;
  bookingsDueCount: number;
  activeBreaches: number;
  hotLeadsNotBooked: number;
  slaCompliancePct: number;
  revenueCardTone: RevenueRiskCardTone;
  riskBreakdown: DashboardRiskBreakdown;
  forecast30Day: number;
  forecast60Day: number;
  forecast90Day: number;
  policyMetrics: PolicyMetric[];
  heatmapRows: DashboardHeatmapRow[];
  auditRows: AuditLogRow[];
  recoveredTodayCount: number;
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
  dealValue?: number;
  probabilityPct?: number;
  slaStatus?: "Compliant" | "At Risk" | "Breached" | "Escalated";
};

export type LeadsRow = {
  id: string;
  dealerId: string;
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
  dealer_id: string;
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

const SAMPLE_DEALER_IDS = [
  "demo-store-01",
  "demo-store-02",
  "demo-store-03",
  "demo-store-04",
  "demo-store-05",
  "demo-store-06",
  "demo-store-07"
] as const;

const SAMPLE_LEAD_IDS = [
  "22222222-2222-4222-8222-222222222221",
  "22222222-2222-4222-8222-222222222222",
  "22222222-2222-4222-8222-222222222223",
  "22222222-2222-4222-8222-222222222224",
  "22222222-2222-4222-8222-222222222225",
  "22222222-2222-4222-8222-222222222226",
  "22222222-2222-4222-8222-222222222227"
] as const;

const SAMPLE_CONVERSATION_IDS = [
  "33333333-3333-4333-8333-333333333331",
  "33333333-3333-4333-8333-333333333332",
  "33333333-3333-4333-8333-333333333333",
  "33333333-3333-4333-8333-333333333334",
  "33333333-3333-4333-8333-333333333335",
  "33333333-3333-4333-8333-333333333336",
  "33333333-3333-4333-8333-333333333337"
] as const;

const SAMPLE_BOOKING_IDS = [
  "44444444-4444-4444-8444-444444444441",
  "44444444-4444-4444-8444-444444444442",
  "44444444-4444-4444-8444-444444444443",
  "44444444-4444-4444-8444-444444444444",
  "44444444-4444-4444-8444-444444444445",
  "44444444-4444-4444-8444-444444444446",
  "44444444-4444-4444-8444-444444444447"
] as const;

const SAMPLE_ASSIGNABLE_USERS = [
  {
    id: "55555555-5555-4555-8555-555555555555",
    name: "Dealer Admin",
    role: "dealer_admin"
  },
  {
    id: "66666666-6666-4666-8666-666666666666",
    name: "Dealer Sales",
    role: "dealer_sales"
  }
] as const;

type DemoState = {
  threads: ConversationThread[];
  bookings: BookingRow[];
  leads: LeadsRow[];
};

type DemoSeedRecord = {
  dealerId: string;
  leadId: string;
  conversationId: string;
  bookingId: string;
  dealershipName: string;
  city: string;
  leadName: string;
  phone: string;
  source: BookingRow["source"];
  status: LeadsRow["status"];
  tag: ConversationThread["tag"];
  vehicleInterest: string;
  assignedTo: string;
  assignedUserId: string | null;
  bookingStatus: BookingRow["status"];
  bookingHoursFromNow: number;
  leadFirstContactMinutesAgo: number;
  lastActivityMinutesAgo: number;
  notes: string;
  leadMessage: string;
  aiMessage: string;
};

const DEMO_STATE_FILE = path.join(process.cwd(), ".local", "os-demo-state.json");
let demoStateCache: DemoState | null = null;
const MIN_DEMO_SEED_RECORDS = 7;
const SAMPLE_DEALER_ID_SET = new Set<string>(SAMPLE_DEALER_IDS);

const DEMO_SEED_RECORDS: DemoSeedRecord[] = [
  {
    dealerId: SAMPLE_DEALER_IDS[0],
    leadId: SAMPLE_LEAD_IDS[0],
    conversationId: SAMPLE_CONVERSATION_IDS[0],
    bookingId: SAMPLE_BOOKING_IDS[0],
    dealershipName: "JAECOO Ruimsig",
    city: "Roodepoort",
    leadName: "Khumo M.",
    phone: "+27821234567",
    source: "Ads",
    status: "Contacted",
    tag: "Hot",
    vehicleInterest: "JAECOO J7 SHS (PHEV)",
    assignedTo: "Dealer Sales",
    assignedUserId: SAMPLE_ASSIGNABLE_USERS[1].id,
    bookingStatus: "Cancelled",
    bookingHoursFromNow: 1,
    leadFirstContactMinutesAgo: 42,
    lastActivityMinutesAgo: 8,
    notes: "Requested SHS range and charging details.",
    leadMessage: "Hi, I want to test drive the JAECOO J7 SHS this week.",
    aiMessage: "Confirmed. I can secure your slot and share the SHS variant availability."
  },
  {
    dealerId: SAMPLE_DEALER_IDS[1],
    leadId: SAMPLE_LEAD_IDS[1],
    conversationId: SAMPLE_CONVERSATION_IDS[1],
    bookingId: SAMPLE_BOOKING_IDS[1],
    dealershipName: "OMODA on Ontdekkers (38 Ontdekkers Rd, Princess, Roodepoort, 1742)",
    city: "Roodepoort",
    leadName: "Lerato P.",
    phone: "+27764321980",
    source: "Website",
    status: "Contacted",
    tag: "Hot",
    vehicleInterest: "OMODA C5 1.5T",
    assignedTo: "Dealer Sales",
    assignedUserId: SAMPLE_ASSIGNABLE_USERS[1].id,
    bookingStatus: "Booked",
    bookingHoursFromNow: 2,
    leadFirstContactMinutesAgo: 33,
    lastActivityMinutesAgo: 7,
    notes: "Needs trade-in valuation and monthly installment options.",
    leadMessage: "Can I test drive the OMODA C5 tomorrow morning?",
    aiMessage: "Yes. We can reserve your slot. Morning or afternoon works better?"
  },
  {
    dealerId: SAMPLE_DEALER_IDS[0],
    leadId: SAMPLE_LEAD_IDS[2],
    conversationId: SAMPLE_CONVERSATION_IDS[2],
    bookingId: SAMPLE_BOOKING_IDS[2],
    dealershipName: "JAECOO Ruimsig",
    city: "Roodepoort",
    leadName: "Sipho N.",
    phone: "+27835551234",
    source: "WhatsApp",
    status: "New",
    tag: "New",
    vehicleInterest: "JAECOO J5 1.5T",
    assignedTo: "Unassigned",
    assignedUserId: null,
    bookingStatus: "Cancelled",
    bookingHoursFromNow: 4,
    leadFirstContactMinutesAgo: 18,
    lastActivityMinutesAgo: 5,
    notes: "First-time buyer, wants J5 trim comparison.",
    leadMessage: "Hi, I need JAECOO J5 monthly payment guidance.",
    aiMessage: "Thanks. I can share estimates and secure a dealership visit."
  },
  {
    dealerId: SAMPLE_DEALER_IDS[1],
    leadId: SAMPLE_LEAD_IDS[3],
    conversationId: SAMPLE_CONVERSATION_IDS[3],
    bookingId: SAMPLE_BOOKING_IDS[3],
    dealershipName: "OMODA on Ontdekkers (38 Ontdekkers Rd, Princess, Roodepoort, 1742)",
    city: "Roodepoort",
    leadName: "Thando K.",
    phone: "+27817774455",
    source: "OEM",
    status: "Contacted",
    tag: "Hot",
    vehicleInterest: "OMODA C7 SHS (PHEV)",
    assignedTo: "Dealer Sales",
    assignedUserId: SAMPLE_ASSIGNABLE_USERS[1].id,
    bookingStatus: "Booked",
    bookingHoursFromNow: 6,
    leadFirstContactMinutesAgo: 27,
    lastActivityMinutesAgo: 6,
    notes: "Requested weekend PHEV test-drive availability.",
    leadMessage: "Is the OMODA C7 SHS available for test drives this weekend?",
    aiMessage: "Yes. I can secure a weekend slot and share SHS model availability."
  },
  {
    dealerId: SAMPLE_DEALER_IDS[0],
    leadId: SAMPLE_LEAD_IDS[4],
    conversationId: SAMPLE_CONVERSATION_IDS[4],
    bookingId: SAMPLE_BOOKING_IDS[4],
    dealershipName: "JAECOO Ruimsig",
    city: "Roodepoort",
    leadName: "Naledi R.",
    phone: "+27711239876",
    source: "Ads",
    status: "Booked",
    tag: "Booked",
    vehicleInterest: "JAECOO J7 1.6T",
    assignedTo: "Dealer Sales",
    assignedUserId: SAMPLE_ASSIGNABLE_USERS[1].id,
    bookingStatus: "Completed",
    bookingHoursFromNow: 0.5,
    leadFirstContactMinutesAgo: 95,
    lastActivityMinutesAgo: 11,
    notes: "Model comparison and finance discussion completed.",
    leadMessage: "Interested in JAECOO J7 monthly installment options.",
    aiMessage: "Great. I can line up a specialist and confirm your test-drive slot."
  },
  {
    dealerId: SAMPLE_DEALER_IDS[1],
    leadId: SAMPLE_LEAD_IDS[5],
    conversationId: SAMPLE_CONVERSATION_IDS[5],
    bookingId: SAMPLE_BOOKING_IDS[5],
    dealershipName: "OMODA on Ontdekkers (38 Ontdekkers Rd, Princess, Roodepoort, 1742)",
    city: "Roodepoort",
    leadName: "Musa D.",
    phone: "+27798765432",
    source: "Website",
    status: "Contacted",
    tag: "Hot",
    vehicleInterest: "OMODA C9 2.0T",
    assignedTo: "Dealer Sales",
    assignedUserId: SAMPLE_ASSIGNABLE_USERS[1].id,
    bookingStatus: "Cancelled",
    bookingHoursFromNow: 8,
    leadFirstContactMinutesAgo: 51,
    lastActivityMinutesAgo: 9,
    notes: "Executive buyer requested C9 feature walkthrough.",
    leadMessage: "I need an OMODA C9 test drive and feature comparison.",
    aiMessage: "Absolutely. I can arrange your call and reserve a C9 appointment."
  },
  {
    dealerId: SAMPLE_DEALER_IDS[1],
    leadId: SAMPLE_LEAD_IDS[6],
    conversationId: SAMPLE_CONVERSATION_IDS[6],
    bookingId: SAMPLE_BOOKING_IDS[6],
    dealershipName: "OMODA on Ontdekkers (38 Ontdekkers Rd, Princess, Roodepoort, 1742)",
    city: "Roodepoort",
    leadName: "Ayesha M.",
    phone: "+27840011223",
    source: "WhatsApp",
    status: "Contacted",
    tag: "Hot",
    vehicleInterest: "OMODA C7 1.6T",
    assignedTo: "Dealer Sales",
    assignedUserId: SAMPLE_ASSIGNABLE_USERS[1].id,
    bookingStatus: "Booked",
    bookingHoursFromNow: 12,
    leadFirstContactMinutesAgo: 38,
    lastActivityMinutesAgo: 10,
    notes: "Wants monthly installment comparison across C7 trims.",
    leadMessage: "Can I compare OMODA C7 payment options?",
    aiMessage: "Yes. I can share quick estimates and reserve your test-drive."
  }
];

const INITIAL_SAMPLE_THREADS: ConversationThread[] = DEMO_SEED_RECORDS.map((record) => {
  const lastActivityMs = Date.now() - record.lastActivityMinutesAgo * 60 * 1000;
  return {
    id: record.conversationId,
    leadId: record.leadId,
    leadName: record.leadName,
    leadPhone: record.phone,
    channel: "WhatsApp",
    source: record.source,
    tag: record.tag,
    status: record.status,
    assignedTo: record.assignedTo,
    assignedUserId: record.assignedUserId,
    lastResponseTime: "01m 16s",
    aiEnabled: true,
    lastActivity: new Date(lastActivityMs).toISOString(),
    messages: [
      {
        speaker: "Lead",
        text: record.leadMessage,
        at: new Date(lastActivityMs - 3 * 60 * 1000).toISOString()
      },
      {
        speaker: "AI",
        text: record.aiMessage,
        at: new Date(lastActivityMs - 1 * 60 * 1000).toISOString()
      }
    ]
  };
});

const INITIAL_SAMPLE_BOOKINGS: BookingRow[] = DEMO_SEED_RECORDS.map((record) => ({
  id: record.bookingId,
  dealerId: record.dealerId,
  leadId: record.leadId,
  dealershipName: record.dealershipName,
  contactPerson: record.leadName,
  brand: record.vehicleInterest,
  city: record.city,
  source: record.source,
  assignedTo: record.assignedTo,
  notes: record.notes,
  preferredDateTime: new Date(Date.now() + record.bookingHoursFromNow * 60 * 60 * 1000).toISOString(),
  status: record.bookingStatus
}));

const INITIAL_SAMPLE_LEADS: LeadsRow[] = DEMO_SEED_RECORDS.map((record) => ({
  id: record.leadId,
  dealerId: record.dealerId,
  name: record.leadName,
  phone: record.phone,
  source: record.source,
  status: record.status,
  vehicleInterest: record.vehicleInterest,
  assignedTo: record.assignedTo,
  firstContactAt: new Date(Date.now() - record.leadFirstContactMinutesAgo * 60 * 1000).toISOString(),
  lastActivityAt: new Date(Date.now() - record.lastActivityMinutesAgo * 60 * 1000).toISOString()
}));

function cloneDemoState(state: DemoState): DemoState {
  return JSON.parse(JSON.stringify(state)) as DemoState;
}

function initialDemoState(): DemoState {
  return cloneDemoState({
    threads: INITIAL_SAMPLE_THREADS,
    bookings: INITIAL_SAMPLE_BOOKINGS,
    leads: INITIAL_SAMPLE_LEADS
  });
}

function persistDemoState(state: DemoState) {
  demoStateCache = cloneDemoState(state);

  try {
    fs.mkdirSync(path.dirname(DEMO_STATE_FILE), { recursive: true });
    fs.writeFileSync(DEMO_STATE_FILE, JSON.stringify(demoStateCache), "utf8");
  } catch {
    // Best effort persistence for local demo mode.
  }
}

function loadDemoState(): DemoState {
  if (demoStateCache) {
    return cloneDemoState(demoStateCache);
  }

  try {
    if (fs.existsSync(DEMO_STATE_FILE)) {
      const raw = fs.readFileSync(DEMO_STATE_FILE, "utf8");
      const parsed = JSON.parse(raw) as Partial<DemoState>;
      if (
        Array.isArray(parsed.threads) &&
        Array.isArray(parsed.bookings) &&
        Array.isArray(parsed.leads) &&
        parsed.threads.length >= MIN_DEMO_SEED_RECORDS &&
        parsed.bookings.length >= MIN_DEMO_SEED_RECORDS &&
        parsed.leads.length >= MIN_DEMO_SEED_RECORDS &&
        parsed.leads.every(
          (lead) =>
            typeof (lead as LeadsRow).dealerId === "string" &&
            SAMPLE_DEALER_ID_SET.has((lead as LeadsRow).dealerId)
        ) &&
        parsed.bookings.every(
          (booking) =>
            typeof (booking as BookingRow).dealerId === "string" &&
            SAMPLE_DEALER_ID_SET.has((booking as BookingRow).dealerId)
        )
      ) {
        demoStateCache = {
          threads: parsed.threads as ConversationThread[],
          bookings: parsed.bookings as BookingRow[],
          leads: parsed.leads as LeadsRow[]
        };
        return cloneDemoState(demoStateCache);
      }
    }
  } catch {
    // Fall through to defaults.
  }

  const fallback = initialDemoState();
  persistDemoState(fallback);
  return cloneDemoState(fallback);
}

function getSampleRecoverNow(options?: { dealerId?: string }): RecoverNowRow[] {
  const state = loadDemoState();
  const bookingByLeadId = new Map(state.bookings.map((booking) => [booking.leadId, booking]));
  const filteredLeads = options?.dealerId
    ? state.leads.filter((lead) => lead.dealerId === options.dealerId)
    : state.leads;

  return filteredLeads
    .filter((lead) => lead.status === "Contacted" || lead.status === "New")
    .map((lead) => {
      const booking = bookingByLeadId.get(lead.id);
      const ageMinutes = minutesBetween(Date.now(), lead.firstContactAt);
      return {
        id: `recover-no-reply-${lead.id}`,
        leadId: lead.id,
        dealershipName: booking?.dealershipName || "Dealership",
        leadName: lead.name,
        phone: lead.phone,
        issueType: "No reply in 5 minutes",
        ageLabel: formatRelativeAge(ageMinutes)
      } satisfies RecoverNowRow;
    })
    .slice(0, 20);
}

function getSampleDashboard(options?: { dealerId?: string }): DashboardMetrics {
  const state = loadDemoState();
  const leads = options?.dealerId ? state.leads.filter((lead) => lead.dealerId === options.dealerId) : state.leads;
  const bookings = options?.dealerId
    ? state.bookings.filter((booking) => booking.dealerId === options.dealerId)
    : state.bookings;

  const newLeads24h = leads.filter(
    (lead) => new Date(lead.firstContactAt).getTime() >= Date.now() - 24 * 60 * 60 * 1000
  ).length;

  const bookingsCreated = bookings.length;
  const unansweredFiveMinutes = getSampleRecoverNow(options).length;
  const hotLeadsNotBooked = leads.filter((lead) => lead.status === "Contacted").length;
  const missedLeadsAlert = unansweredFiveMinutes;

  return {
    newLeads24h,
    responseTimeAvg: "01m 16s",
    bookingsCreated,
    missedLeadsAlert,
    conversionSnapshot: newLeads24h > 0 ? `${Math.round((bookingsCreated / newLeads24h) * 100)}%` : "0%",
    unansweredFiveMinutes,
    afterHoursPending: unansweredFiveMinutes,
    hotLeadsNotBooked,
    mode: "sample"
  };
}

export function isDemoMoneyViewMode() {
  return !hasSupabase();
}

export function getDemoAssignableUsers() {
  return [...SAMPLE_ASSIGNABLE_USERS];
}

export function applyDemoLeadUpdate(input: {
  leadId: string;
  status?: string;
  assignedUserId?: string | null;
}) {
  const now = new Date().toISOString();
  const state = loadDemoState();

  state.leads = state.leads.map((lead) => {
    if (lead.id !== input.leadId) return lead;
    return {
      ...lead,
      status: input.status ? leadStatusToUi(input.status) : lead.status,
      assignedTo:
        input.assignedUserId === undefined
          ? lead.assignedTo
          : input.assignedUserId === null
            ? "Unassigned"
            : (SAMPLE_ASSIGNABLE_USERS.find((user) => user.id === input.assignedUserId)?.name || lead.assignedTo),
      lastActivityAt: now
    };
  });

  state.threads = state.threads.map((thread) => {
    if (thread.leadId !== input.leadId) return thread;
    const nextStatus = input.status ? leadStatusToUi(input.status) : thread.status;
    return {
      ...thread,
      status: nextStatus,
      tag: statusToTag(nextStatus),
      assignedUserId: input.assignedUserId === undefined ? thread.assignedUserId : input.assignedUserId,
      assignedTo:
        input.assignedUserId === undefined
          ? thread.assignedTo
          : input.assignedUserId === null
            ? "Unassigned"
            : (SAMPLE_ASSIGNABLE_USERS.find((user) => user.id === input.assignedUserId)?.name || thread.assignedTo),
      lastActivity: now
    };
  });

  persistDemoState(state);
}

export function appendDemoMessage(input: {
  conversationId: string;
  leadId: string;
  content: string;
}) {
  const now = new Date().toISOString();
  const state = loadDemoState();

  state.threads = state.threads.map((thread) => {
    if (thread.id !== input.conversationId || thread.leadId !== input.leadId) return thread;
    const nextMessage: ConversationThread["messages"][number] = {
      speaker: "Human",
      text: input.content,
      at: now
    };
    return {
      ...thread,
      lastActivity: now,
      lastResponseTime: "00m 08s",
      messages: [...thread.messages, nextMessage].slice(-8)
    };
  });

  state.leads = state.leads.map((lead) => {
    if (lead.id !== input.leadId) return lead;
    return {
      ...lead,
      lastActivityAt: now
    };
  });

  persistDemoState(state);
}

export function setDemoAiEnabled(input: { conversationId: string; enabled: boolean }) {
  const state = loadDemoState();
  state.threads = state.threads.map((thread) =>
    thread.id === input.conversationId ? { ...thread, aiEnabled: input.enabled } : thread
  );
  persistDemoState(state);
}

export function applyDemoBookingAction(input: {
  bookingId: string;
  action: "confirm" | "reschedule" | "complete" | "no_show" | "send_reminder";
}) {
  const state = loadDemoState();

  state.bookings = state.bookings.map((booking) => {
    if (booking.id !== input.bookingId) return booking;
    if (input.action === "confirm") {
      return { ...booking, status: "Booked" };
    }
    if (input.action === "reschedule") {
      return {
        ...booking,
        status: "Booked",
        preferredDateTime: new Date(new Date(booking.preferredDateTime).getTime() + 24 * 60 * 60 * 1000).toISOString()
      };
    }
    if (input.action === "complete") {
      return { ...booking, status: "Completed" };
    }
    if (input.action === "no_show") {
      return { ...booking, status: "No-show" };
    }
    return booking;
  });

  persistDemoState(state);
}

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

type DashboardOpportunity = {
  leadId: string;
  dealerId: string;
  dealershipName: string;
  city: string;
  leadName: string;
  phone: string;
  source: BookingRow["source"];
  status: LeadsRow["status"];
  vehicleInterest: string;
  budgetRange?: string | null;
  assignedTo: string;
  firstContactAt: string;
  lastActivityAt: string;
  responseSeconds: number | null;
  firstResponseAt?: string | null;
  isAfterHours: boolean;
  bookingId?: string;
  bookingStatus?: BookingRow["status"];
  preferredDateTime?: string;
  reminderSentAt?: string | null;
  note?: string;
};

type DashboardWindow = {
  startIso: string;
  endIso: string;
  label: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function parseResponseDelayLabel(value: string) {
  const match = value.match(/(\d+)m\s+(\d+)s/i);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

function median(values: number[]) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  return sorted[middle];
}

function resolveDashboardWindow(range: DashboardTimeRange, start?: string, end?: string): DashboardWindow {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (range === "today") {
    return {
      startIso: startOfToday.toISOString(),
      endIso: now.toISOString(),
      label: "Today"
    };
  }

  if (range === "30d") {
    return {
      startIso: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      endIso: now.toISOString(),
      label: "Last 30 Days"
    };
  }

  if (range === "custom" && start && end) {
    const startDate = new Date(`${start}T00:00:00`);
    const endDate = new Date(`${end}T23:59:59`);
    if (!Number.isNaN(startDate.getTime()) && !Number.isNaN(endDate.getTime()) && startDate <= endDate) {
      return {
        startIso: startDate.toISOString(),
        endIso: endDate.toISOString(),
        label: `${start} to ${end}`
      };
    }
  }

  return {
    startIso: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    endIso: now.toISOString(),
    label: "Last 7 Days"
  };
}

function estimateDealValue(vehicleInterest: string, budgetRange?: string | null) {
  const normalized = vehicleInterest.toLowerCase();
  if (normalized.includes("c9")) return 785000;
  if (normalized.includes("c7") && (normalized.includes("shs") || normalized.includes("phev"))) return 689900;
  if (normalized.includes("j7") && (normalized.includes("shs") || normalized.includes("phev"))) return 699900;
  if (normalized.includes("c7")) return 619900;
  if (normalized.includes("j7")) return 549900;
  if (normalized.includes("j5")) return 439900;
  if (normalized.includes("c5")) return 419900;

  const budgetMatch = budgetRange?.match(/(\d[\d\s,.]*)/);
  if (budgetMatch) {
    const parsedBudget = Number(budgetMatch[1].replace(/[^\d]/g, ""));
    if (!Number.isNaN(parsedBudget) && parsedBudget > 100000) return parsedBudget;
  }

  return 420000;
}

function getHistoricalCloseRate(source: BookingRow["source"], vehicleInterest: string, status: LeadsRow["status"]) {
  const baseBySource: Record<BookingRow["source"], number> = {
    WhatsApp: 0.24,
    OEM: 0.22,
    Website: 0.19,
    Ads: 0.16
  };
  let rate = baseBySource[source];
  const normalizedVehicle = vehicleInterest.toLowerCase();
  if (normalizedVehicle.includes("shs") || normalizedVehicle.includes("phev") || normalizedVehicle.includes("c9")) {
    rate += 0.02;
  }
  if (status === "Booked" || status === "Visited") {
    rate += 0.03;
  }
  return clamp(rate, 0.12, 0.32);
}

function isHotOpportunity(opportunity: DashboardOpportunity) {
  const vehicle = opportunity.vehicleInterest.toLowerCase();
  return (
    opportunity.status === "Contacted" &&
    (opportunity.source === "WhatsApp" ||
      opportunity.source === "OEM" ||
      vehicle.includes("shs") ||
      vehicle.includes("phev") ||
      vehicle.includes("c9") ||
      estimateDealValue(opportunity.vehicleInterest) >= 500000)
  );
}

function hasConfirmedBooking(status?: BookingRow["status"]) {
  return status === "Booked" || status === "Completed";
}

function getAfterHoursDeadline(firstContactAt: string) {
  const leadDate = new Date(firstContactAt);
  const next = new Date(leadDate);
  next.setDate(next.getDate() + 1);
  next.setHours(8, 15, 0, 0);
  return next.toISOString();
}

function getOpportunityRisk(opportunity: DashboardOpportunity, now = Date.now()) {
  const responseTargetSeconds = isHotOpportunity(opportunity) ? 180 : 300;
  const bookingSlaSeconds = 24 * 60 * 60;
  const delaySeconds =
    typeof opportunity.responseSeconds === "number"
      ? opportunity.responseSeconds
      : Math.round((now - new Date(opportunity.firstContactAt).getTime()) / 1000);

  const responseDelayFactor = clamp(delaySeconds / responseTargetSeconds - 1, 0, 1);
  const afterHoursFactor =
    opportunity.isAfterHours &&
    (!opportunity.firstResponseAt || new Date(opportunity.firstResponseAt).getTime() > new Date(getAfterHoursDeadline(opportunity.firstContactAt)).getTime())
      ? 1
      : 0;
  const unassignedFactor = opportunity.assignedTo === "Unassigned" ? 1 : 0;
  const hotLeadNotBooked = isHotOpportunity(opportunity) && !hasConfirmedBooking(opportunity.bookingStatus);
  const dropOffFactor = hotLeadNotBooked
    ? clamp((now - new Date(opportunity.firstContactAt).getTime()) / 1000 / bookingSlaSeconds, 0, 1)
    : 0;
  const noShowFactor =
    opportunity.bookingStatus === "No-show" ||
    (opportunity.preferredDateTime &&
      hasConfirmedBooking(opportunity.bookingStatus) &&
      new Date(opportunity.preferredDateTime).getTime() - now <= 24 * 60 * 60 * 1000 &&
      !opportunity.reminderSentAt)
      ? 1
      : 0;

  const riskWeight = clamp(
    0.18 + responseDelayFactor * 0.45 + afterHoursFactor * 0.2 + unassignedFactor * 0.1 + dropOffFactor * 0.22 + noShowFactor * 0.18,
    0.1,
    1.4
  );

  const predictedRiskPct = Math.round(
    clamp(
      (responseDelayFactor * 0.35 + afterHoursFactor * 0.2 + dropOffFactor * 0.3 + noShowFactor * 0.15) * 100,
      responseDelayFactor + afterHoursFactor + dropOffFactor + noShowFactor > 0 ? 1 : 0,
      100
    )
  );

  return {
    responseTargetSeconds,
    delaySeconds,
    responseDelayFactor,
    afterHoursFactor,
    unassignedFactor,
    dropOffFactor,
    noShowFactor,
    hotLeadNotBooked,
    riskWeight,
    predictedRiskPct
  };
}

function getSlaStatusForOpportunity(opportunity: DashboardOpportunity, now = Date.now()): NonNullable<BookingRow["slaStatus"]> {
  const risk = getOpportunityRisk(opportunity, now);
  const leadAgeMs = now - new Date(opportunity.firstContactAt).getTime();
  if (risk.responseDelayFactor >= 1 || risk.afterHoursFactor >= 1 || leadAgeMs > 48 * 60 * 60 * 1000) {
    return "Breached";
  }
  if (risk.noShowFactor >= 1 || (risk.responseDelayFactor >= 1 && leadAgeMs > 15 * 60 * 1000)) {
    return "Escalated";
  }
  if (risk.predictedRiskPct >= 70 || risk.hotLeadNotBooked) {
    return "At Risk";
  }
  return "Compliant";
}

function mapRoleToDashboardView(role: string): DashboardRoleView {
  if (role === "platform_owner" || role === "platform_support") return "platform";
  if (role === "dealer_admin") return "principal";
  if (role === "dealer_marketing") return "marketing";
  if (role === "dealer_sales") return "agent";
  return "manager";
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

function getDemoDealerContextOptions() {
  return buildSampleNetworkStores()
    .map((store) => ({
      id: store.dealerId,
      label: `${store.storeName} (${store.region})`
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export async function getDealerContextOptions() {
  if (isDemoMoneyViewMode()) {
    return getDemoDealerContextOptions();
  }

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
  if (isDemoMoneyViewMode()) {
    return getDemoAssignableUsers();
  }

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
    return isDemoMoneyViewMode() ? getDemoAssignableUsers() : [];
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
  if (isDemoMoneyViewMode()) {
    return getSampleDashboard({ dealerId: options?.dealerId });
  }

  try {
    const supabase = getSupabaseClient();
    const sinceIso = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const sevenDaysIso = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    let leadCountQuery = supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .gte("first_contact_at", sinceIso);
    let leadCount7dQuery = supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .gte("first_contact_at", sevenDaysIso);
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
      leadCount7dQuery = leadCount7dQuery.eq("dealer_id", options.dealerId);
      bookingCountQuery = bookingCountQuery.eq("dealer_id", options.dealerId);
      leadRowsQuery = leadRowsQuery.eq("dealer_id", options.dealerId);
      responseRowsQuery = responseRowsQuery.eq("dealer_id", options.dealerId);
    }

    const [leadCountRes, leadCount7dRes, bookingCountRes, leadRowsRes, responseRowsRes] = await Promise.all([
      leadCountQuery,
      leadCount7dQuery,
      bookingCountQuery,
      leadRowsQuery,
      responseRowsQuery
    ]);

    if (leadCountRes.error) throw leadCountRes.error;
    if (leadCount7dRes.error) throw leadCount7dRes.error;
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
    const leadCount7d = leadCount7dRes.count || 0;
    const bookingsCount = bookingCountRes.count || 0;

    return {
      newLeads24h: leadCount,
      responseTimeAvg: formatDelay(averageSeconds),
      bookingsCreated: bookingsCount,
      missedLeadsAlert,
      conversionSnapshot: leadCount7d > 0 ? `${Math.round((bookingsCount / leadCount7d) * 100)}%` : "0%",
      unansweredFiveMinutes,
      afterHoursPending: missedLeadsAlert,
      hotLeadsNotBooked,
      mode: "live"
    };
  } catch {
    return getSampleDashboard();
  }
}

function withinDashboardWindow(dateIso: string, window: DashboardWindow) {
  const ts = new Date(dateIso).getTime();
  return ts >= new Date(window.startIso).getTime() && ts <= new Date(window.endIso).getTime();
}

function shouldIncludeDealer(dealerId: string, dealerFilter?: string, dealerIds?: string[]) {
  if (dealerFilter) return dealerId === dealerFilter;
  if (dealerIds?.length) return dealerIds.includes(dealerId);
  return true;
}

function buildDemoDashboardOpportunities(options: {
  dealerId?: string;
  dealerIds?: string[];
  window: DashboardWindow;
  sessionName?: string;
  roleView: DashboardRoleView;
}): DashboardOpportunity[] {
  const state = loadDemoState();
  const bookingByLeadId = new Map(state.bookings.map((booking) => [booking.leadId, booking]));
  const threadByLeadId = new Map(state.threads.map((thread) => [thread.leadId, thread]));
  const seedByLeadId = new Map(DEMO_SEED_RECORDS.map((record) => [record.leadId, record]));

  return state.leads
    .filter((lead) => shouldIncludeDealer(lead.dealerId, options.dealerId, options.dealerIds))
    .filter((lead) => withinDashboardWindow(lead.firstContactAt, options.window))
    .map((lead) => {
      const booking = bookingByLeadId.get(lead.id);
      const thread = threadByLeadId.get(lead.id);
      const seed = seedByLeadId.get(lead.id);
      const responseSeconds =
        parseResponseDelayLabel(thread?.lastResponseTime || "") ||
        (thread?.messages?.length && thread.messages.length >= 2
          ? Math.round(
              (new Date(thread.messages[1].at).getTime() - new Date(thread.messages[0].at).getTime()) / 1000
            )
          : null);

      return {
        leadId: lead.id,
        dealerId: lead.dealerId,
        dealershipName: booking?.dealershipName || seed?.dealershipName || "Unknown Dealership",
        city: booking?.city || seed?.city || "Roodepoort",
        leadName: lead.name,
        phone: lead.phone,
        source: lead.source,
        status: lead.status,
        vehicleInterest: lead.vehicleInterest,
        assignedTo: lead.assignedTo,
        firstContactAt: lead.firstContactAt,
        lastActivityAt: lead.lastActivityAt,
        responseSeconds,
        firstResponseAt: thread?.messages?.find((message) => message.speaker !== "Lead")?.at || null,
        isAfterHours: isAfterHours(lead.firstContactAt, "Africa/Johannesburg", null),
        bookingId: booking?.id,
        bookingStatus: booking?.status,
        preferredDateTime: booking?.preferredDateTime,
        reminderSentAt:
          booking?.status === "Booked" && Number(lead.id.slice(-1)) % 2 === 0
            ? new Date(Date.now() - 90 * 60 * 1000).toISOString()
            : null,
        note: booking?.notes || seed?.notes,
        budgetRange: null
      } satisfies DashboardOpportunity;
    })
    .filter((opportunity) =>
      options.roleView === "agent" ? opportunity.assignedTo === options.sessionName : true
    );
}

async function buildLiveDashboardOpportunities(options: {
  dealerId?: string;
  dealerIds?: string[];
  window: DashboardWindow;
  sessionName?: string;
  roleView: DashboardRoleView;
}): Promise<DashboardOpportunity[]> {
  const supabase = getSupabaseClient();

  let leadsQuery = supabase
    .from("leads")
    .select(
      "id,dealer_id,name,phone,source,status,vehicle_interest,assigned_user_id,first_contact_at,last_activity_at,budget_range"
    )
    .gte("first_contact_at", options.window.startIso)
    .lte("first_contact_at", options.window.endIso)
    .order("first_contact_at", { ascending: false })
    .limit(1200);

  if (options.dealerId) {
    leadsQuery = leadsQuery.eq("dealer_id", options.dealerId);
  } else if (options.dealerIds?.length) {
    leadsQuery = leadsQuery.in("dealer_id", options.dealerIds);
  }

  const leadsRes = await leadsQuery;
  if (leadsRes.error) throw leadsRes.error;

  const leads = (leadsRes.data || []) as Array<{
    id: string;
    dealer_id: string;
    name: string | null;
    phone: string;
    source: string | null;
    status: string | null;
    vehicle_interest: string | null;
    assigned_user_id: string | null;
    first_contact_at: string;
    last_activity_at: string;
    budget_range: string | null;
  }>;

  if (!leads.length) return [];

  const dealerIds = Array.from(new Set(leads.map((lead) => lead.dealer_id)));
  const leadIds = leads.map((lead) => lead.id);
  const assignedIds = Array.from(
    new Set(leads.map((lead) => lead.assigned_user_id).filter((value): value is string => Boolean(value)))
  );

  const [dealersRes, responsesRes, bookingsRes, followupsRes, usersRes] = await Promise.all([
    supabase.from("dealers").select("id,name,city,timezone,business_hours").in("id", dealerIds),
    supabase
      .from("response_metrics")
      .select("lead_id,response_seconds,first_response_at")
      .in("lead_id", leadIds),
    supabase
      .from("bookings")
      .select("id,dealer_id,lead_id,scheduled_for,status")
      .in("lead_id", leadIds),
    supabase
      .from("followups")
      .select("lead_id,type,sent_at")
      .in("lead_id", leadIds),
    assignedIds.length
      ? supabase.from("users").select("id,name,email").in("id", assignedIds)
      : Promise.resolve({ data: [], error: null })
  ]);

  if (dealersRes.error) throw dealersRes.error;
  if (responsesRes.error) throw responsesRes.error;
  if (bookingsRes.error) throw bookingsRes.error;
  if (followupsRes.error) throw followupsRes.error;
  if ("error" in usersRes && usersRes.error) throw usersRes.error;

  const dealers = (dealersRes.data || []) as Array<DealerHoursRow & { name: string | null; city: string | null }>;
  const responses = (responsesRes.data || []) as ResponseMetricRow[];
  const bookings = (bookingsRes.data || []) as BookingRecordRow[];
  const followups = (followupsRes.data || []) as FollowupRow[];
  const users = ((usersRes as { data?: UserRow[] }).data || []) as UserRow[];

  const dealerById = new Map(dealers.map((dealer) => [dealer.id, dealer]));
  const responseByLeadId = new Map(responses.map((response) => [response.lead_id, response]));
  const userById = new Map(users.map((user) => [user.id, user]));
  const bookingByLeadId = new Map<string, BookingRecordRow>();
  const followupByLeadId = new Map<string, FollowupRow>();

  for (const booking of bookings) {
    const existing = bookingByLeadId.get(booking.lead_id);
    if (!existing || new Date(existing.scheduled_for).getTime() < new Date(booking.scheduled_for).getTime()) {
      bookingByLeadId.set(booking.lead_id, booking);
    }
  }

  for (const followup of followups) {
    const existing = followupByLeadId.get(followup.lead_id);
    if (!existing || (followup.sent_at && existing.sent_at && new Date(followup.sent_at) > new Date(existing.sent_at))) {
      followupByLeadId.set(followup.lead_id, followup);
    }
  }

  return leads
    .map((lead) => {
      const dealer = dealerById.get(lead.dealer_id);
      const booking = bookingByLeadId.get(lead.id);
      const response = responseByLeadId.get(lead.id);
      const followup = followupByLeadId.get(lead.id);
      const assignedUser = lead.assigned_user_id ? userById.get(lead.assigned_user_id) : null;

      return {
        leadId: lead.id,
        dealerId: lead.dealer_id,
        dealershipName: dealer?.name || "Unknown Dealership",
        city: dealer?.city || "Unknown",
        leadName: lead.name || "Unknown Lead",
        phone: lead.phone,
        source: sourceToUi(lead.source),
        status: leadStatusToUi(lead.status),
        vehicleInterest: lead.vehicle_interest || "Not captured",
        budgetRange: lead.budget_range,
        assignedTo: assignedUser?.name || "Unassigned",
        firstContactAt: lead.first_contact_at,
        lastActivityAt: lead.last_activity_at,
        responseSeconds: response?.response_seconds ?? null,
        firstResponseAt: response?.first_response_at ?? null,
        isAfterHours: isAfterHours(lead.first_contact_at, dealer?.timezone, dealer?.business_hours),
        bookingId: booking?.id,
        bookingStatus: bookingStatusToUi(booking?.status || null),
        preferredDateTime: booking?.scheduled_for,
        reminderSentAt: followup?.sent_at || null,
        note: lead.budget_range ? `Budget: ${lead.budget_range}` : "Revenue opportunity",
      } satisfies DashboardOpportunity;
    })
    .filter((opportunity) =>
      options.roleView === "agent" ? opportunity.assignedTo === options.sessionName : true
    );
}

function buildRevenueRiskSnapshotFromOpportunities(options: {
  opportunities: DashboardOpportunity[];
  mode: "live" | "sample";
  timeRange: DashboardTimeRange;
  roleView: DashboardRoleView;
  storeScopeLabel: string;
}) {
  const now = Date.now();
  const opportunities = options.opportunities;
  const riskRows = opportunities.map((opportunity) => {
    const closeRate = getHistoricalCloseRate(opportunity.source, opportunity.vehicleInterest, opportunity.status);
    const dealValue = estimateDealValue(opportunity.vehicleInterest, opportunity.budgetRange);
    const risk = getOpportunityRisk(opportunity, now);
    return {
      opportunity,
      dealValue,
      closeRate,
      risk,
      revenueAtRisk: dealValue * closeRate * risk.riskWeight
    };
  });

  const breachRows = riskRows.filter((row) => getSlaStatusForOpportunity(row.opportunity, now) === "Breached");
  const recoverRows = breachRows
    .filter((row) => now - new Date(row.opportunity.firstContactAt).getTime() <= 48 * 60 * 60 * 1000)
    .filter((row) => !["Sold", "Lost", "Visited"].includes(row.opportunity.status));

  const aiUrgencyQueue24h = riskRows.filter((row) => {
    const ageHours = (now - new Date(row.opportunity.firstContactAt).getTime()) / (60 * 60 * 1000);
    return row.risk.hotLeadNotBooked && ageHours >= 24;
  }).length;

  const medianResponse = median(
    riskRows
      .map((row) => row.opportunity.responseSeconds)
      .filter((value): value is number => typeof value === "number")
  );

  const bookingsDueCount = riskRows.filter((row) => {
    if (!row.opportunity.preferredDateTime || !hasConfirmedBooking(row.opportunity.bookingStatus)) return false;
    const scheduled = new Date(row.opportunity.preferredDateTime).getTime();
    return scheduled >= now && scheduled <= now + 24 * 60 * 60 * 1000;
  }).length;

  const revenueAtRisk = Math.round(breachRows.reduce((sum, row) => sum + row.revenueAtRisk, 0));
  const averageDealValue = breachRows.length
    ? Math.round(breachRows.reduce((sum, row) => sum + row.dealValue, 0) / breachRows.length)
    : 0;
  const averageCloseRatePct = breachRows.length
    ? Math.round((breachRows.reduce((sum, row) => sum + row.closeRate, 0) / breachRows.length) * 100)
    : 0;

  const predictedRiskPct = riskRows.length
    ? Math.round(riskRows.reduce((sum, row) => sum + row.risk.predictedRiskPct, 0) / riskRows.length)
    : 0;

  const responseCompliantCount = riskRows.filter((row) => row.risk.responseDelayFactor <= 0).length;
  const slaCompliancePct = riskRows.length ? Math.round((responseCompliantCount / riskRows.length) * 100) : 100;
  const revenueCardTone: RevenueRiskCardTone =
    revenueAtRisk > 600000 || slaCompliancePct < 85 ? "critical" : revenueAtRisk > 200000 || slaCompliancePct < 92 ? "warning" : "positive";

  const hotLeadsNotBooked = riskRows.filter((row) => row.risk.hotLeadNotBooked).length;
  const delayCount = riskRows.filter((row) => row.risk.responseDelayFactor > 0).length;
  const afterHoursCount = riskRows.filter((row) => row.risk.afterHoursFactor > 0).length;
  const dropOffCount = riskRows.filter((row) => row.risk.dropOffFactor > 0).length;
  const noShowCount = riskRows.filter((row) => row.risk.noShowFactor > 0).length;

  const storeBuckets = Array.from(
    riskRows.reduce((map, row) => {
      const region = mapCityToRegion(row.opportunity.city);
      const current = map.get(region) || { region, stores: new Set<string>(), compliant: 0, total: 0, riskValue: 0 };
      current.stores.add(row.opportunity.dealerId);
      current.total += 1;
      current.compliant += row.risk.responseDelayFactor <= 0 ? 1 : 0;
      current.riskValue += row.revenueAtRisk;
      map.set(region, current);
      return map;
    }, new Map<string, { region: string; stores: Set<string>; compliant: number; total: number; riskValue: number }>())
      .values()
  );

  const heatmapRows: DashboardHeatmapRow[] = storeBuckets.map((bucket) => {
    const compliancePct = bucket.total ? Math.round((bucket.compliant / bucket.total) * 100) : 100;
    const tone: RevenueRiskCardTone = compliancePct > 92 ? "positive" : compliancePct >= 85 ? "warning" : "critical";
    const trendDeltaPct = Math.round((50 - clamp(bucket.riskValue / 15000, 0, 50)) / 10);
    return {
      region: bucket.region,
      stores: bucket.stores.size,
      compliancePct,
      trendDeltaPct,
      tone
    };
  });

  const firstResponseBreachesToday = riskRows.filter((row) => {
    return row.risk.responseDelayFactor > 0 && withinDashboardWindow(row.opportunity.firstContactAt, resolveDashboardWindow("today"));
  }).length;
  const firstResponseCompliance =
    riskRows.length > 0
      ? Math.round((riskRows.filter((row) => row.risk.responseDelayFactor <= 0).length / riskRows.length) * 100)
      : 100;

  const afterHoursRows = riskRows.filter((row) => row.opportunity.isAfterHours);
  const afterHoursCompliance =
    afterHoursRows.length > 0
      ? Math.round((afterHoursRows.filter((row) => row.risk.afterHoursFactor <= 0).length / afterHoursRows.length) * 100)
      : 100;

  const hotBookingRows = riskRows.filter((row) => isHotOpportunity(row.opportunity));
  const hotBookingCompliance =
    hotBookingRows.length > 0
      ? Math.round((hotBookingRows.filter((row) => hasConfirmedBooking(row.opportunity.bookingStatus)).length / hotBookingRows.length) * 100)
      : 100;

  const upcomingRows = riskRows.filter((row) => row.opportunity.preferredDateTime);
  const noShowReminderCompliance =
    upcomingRows.length > 0
      ? Math.round((upcomingRows.filter((row) => row.risk.noShowFactor <= 0).length / upcomingRows.length) * 100)
      : 100;

  const forecast30Day = Math.round(breachRows.length * averageDealValue * (averageCloseRatePct / 100));
  const forecast60Day = Math.round(hotLeadsNotBooked * Math.max(averageDealValue, 420000) * 0.28);
  const improvedResponseRateDelta = clamp((92 - slaCompliancePct) / 100, 0.04, 0.25);
  const forecast90Day = Math.round(improvedResponseRateDelta * Math.max(opportunities.length, 1) * Math.max(averageDealValue, 420000));

  const auditRows: AuditLogRow[] = riskRows
    .filter((row) => row.risk.responseDelayFactor > 0 || row.risk.afterHoursFactor > 0 || row.risk.noShowFactor > 0)
    .sort((a, b) => new Date(b.opportunity.lastActivityAt).getTime() - new Date(a.opportunity.lastActivityAt).getTime())
    .slice(0, 24)
    .map((row) => ({
      id: `${row.opportunity.leadId}-${row.opportunity.lastActivityAt}`,
      at: row.opportunity.lastActivityAt,
      actor:
        row.risk.afterHoursFactor > 0
          ? "Policy Engine"
          : row.opportunity.assignedTo === "Unassigned"
            ? "SLA Engine"
            : row.opportunity.assignedTo,
      action:
        row.risk.noShowFactor > 0
          ? "Reminder SLA breached"
          : row.risk.afterHoursFactor > 0
            ? "After-hours escalation active"
            : "First response SLA breached",
      context: `${row.opportunity.leadName} · ${row.opportunity.vehicleInterest}`,
      dealer: row.opportunity.dealershipName,
      slaType:
        row.risk.noShowFactor > 0
          ? "No-show"
          : row.risk.afterHoursFactor > 0
            ? "After Hours"
            : "First Response",
      user: row.opportunity.assignedTo
    }));

  return {
    snapshot: {
      mode: options.mode,
      timeRange: options.timeRange,
      storeScopeLabel: options.storeScopeLabel,
      roleView: options.roleView,
      revenueAtRisk,
      revenueAtRiskCount: breachRows.length,
      averageDealValue,
      averageCloseRatePct,
      projectedMarginExposureText:
        revenueCardTone === "critical" ? "Projected margin exposure increasing." : "Projected margin exposure controlled.",
      aiUrgencyQueue24h,
      medianResponseTime: formatDelay(medianResponse),
      bookingsDueCount,
      activeBreaches: breachRows.length,
      hotLeadsNotBooked,
      slaCompliancePct,
      revenueCardTone,
      riskBreakdown: {
        delayCount,
        afterHoursCount,
        dropOffCount,
        noShowCount,
        predictedRiskPct
      },
      forecast30Day,
      forecast60Day,
      forecast90Day,
      policyMetrics: [
        {
          label: "First Response SLA",
          target: "< 5 min",
          compliancePct: firstResponseCompliance,
          breachesToday: firstResponseBreachesToday
        },
        {
          label: "After-Hours Escalation",
          target: "08:15 next day",
          compliancePct: afterHoursCompliance,
          breachesToday: afterHoursRows.filter((row) => row.risk.afterHoursFactor > 0).length
        },
        {
          label: "Hot Lead Booking SLA",
          target: "< 24h",
          compliancePct: hotBookingCompliance,
          breachesToday: hotLeadsNotBooked
        },
        {
          label: "No-show Reminder SLA",
          target: "24h + 2h pre-visit",
          compliancePct: noShowReminderCompliance,
          breachesToday: noShowCount
        }
      ],
      heatmapRows,
      auditRows,
      recoveredTodayCount: recoverRows.length
    } satisfies RevenueRiskSnapshot,
    recoverQueueRows: recoverRows.map((row) => ({
      id: `recover-${row.opportunity.leadId}`,
      leadId: row.opportunity.leadId,
      dealershipName: row.opportunity.dealershipName,
      leadName: row.opportunity.leadName,
      phone: row.opportunity.phone,
      issueType:
        row.risk.afterHoursFactor > 0
          ? "After-hours follow-up pending"
          : row.risk.noShowFactor > 0
            ? "No-show reminder missing"
            : row.risk.dropOffFactor > 0
              ? "Contacted but not booked (24h)"
              : "No reply in 5 minutes",
      ageLabel: formatRelativeAge(minutesBetween(now, row.opportunity.firstContactAt))
    })),
    bookingRows: riskRows
      .filter((row) => {
        if (!row.opportunity.preferredDateTime) return false;
        if (row.opportunity.bookingStatus !== "Booked") return false;
        return new Date(row.opportunity.preferredDateTime).getTime() >= now - 60 * 60 * 1000;
      })
      .sort(
        (a, b) =>
          new Date(a.opportunity.preferredDateTime || 0).getTime() -
          new Date(b.opportunity.preferredDateTime || 0).getTime()
      )
      .slice(0, 12)
      .map((row) => ({
        id: row.opportunity.bookingId || row.opportunity.leadId,
        dealerId: row.opportunity.dealerId,
        leadId: row.opportunity.leadId,
        dealershipName: row.opportunity.dealershipName,
        contactPerson: row.opportunity.leadName,
        brand: row.opportunity.vehicleInterest,
        city: row.opportunity.city,
        source: row.opportunity.source,
        assignedTo: row.opportunity.assignedTo,
        notes: row.opportunity.note || "Revenue opportunity",
        preferredDateTime: row.opportunity.preferredDateTime || row.opportunity.firstContactAt,
        status: row.opportunity.bookingStatus || "Booked",
        dealValue: row.dealValue,
        probabilityPct: Math.round(row.closeRate * 100),
        slaStatus: getSlaStatusForOpportunity(row.opportunity, now)
      }))
  };
}

export async function getRevenueRiskDashboardSnapshot(options?: {
  dealerId?: string;
  dealerIds?: string[];
  timeRange?: DashboardTimeRange;
  startDate?: string;
  endDate?: string;
  role?: string;
  sessionName?: string;
}) {
  const timeRange = options?.timeRange || "7d";
  const window = resolveDashboardWindow(timeRange, options?.startDate, options?.endDate);
  const roleView = mapRoleToDashboardView(options?.role || "dealer_admin");
  const storeScopeLabel = options?.dealerId ? "Store View" : options?.dealerIds?.length ? "Network View" : "Global View";

  if (isDemoMoneyViewMode()) {
    const opportunities = buildDemoDashboardOpportunities({
      dealerId: options?.dealerId,
      dealerIds: options?.dealerIds,
      window,
      sessionName: options?.sessionName,
      roleView
    });

    return buildRevenueRiskSnapshotFromOpportunities({
      opportunities,
      mode: "sample",
      timeRange,
      roleView,
      storeScopeLabel
    });
  }

  try {
    const opportunities = await buildLiveDashboardOpportunities({
      dealerId: options?.dealerId,
      dealerIds: options?.dealerIds,
      window,
      sessionName: options?.sessionName,
      roleView
    });

    return buildRevenueRiskSnapshotFromOpportunities({
      opportunities,
      mode: "live",
      timeRange,
      roleView,
      storeScopeLabel
    });
  } catch {
    const opportunities = buildDemoDashboardOpportunities({
      dealerId: options?.dealerId,
      dealerIds: options?.dealerIds,
      window,
      sessionName: options?.sessionName,
      roleView
    });

    return buildRevenueRiskSnapshotFromOpportunities({
      opportunities,
      mode: "sample",
      timeRange,
      roleView,
      storeScopeLabel
    });
  }
}

export async function getConversationThreads(options?: {
  dealerId?: string;
  dealerIds?: string[];
  leadId?: string;
}): Promise<{ threads: ConversationThread[]; mode: "live" | "sample" }> {
  if (isDemoMoneyViewMode()) {
    const state = loadDemoState();
    let threads = [...state.threads];

    if (options?.dealerId || options?.dealerIds?.length) {
      const leadById = new Map(state.leads.map((lead) => [lead.id, lead]));
      threads = threads.filter((thread) => {
        const leadDealerId = leadById.get(thread.leadId)?.dealerId;
        return shouldIncludeDealer(leadDealerId || "", options.dealerId, options.dealerIds);
      });
    }

    if (options?.leadId) {
      threads = threads.filter((thread) => thread.leadId === options.leadId);
    }
    return { threads, mode: "sample" };
  }

  try {
    const supabase = getSupabaseClient();
    let query = supabase
      .from("conversations")
      .select("id,dealer_id,lead_id,channel,last_message_at")
      .order("last_message_at", { ascending: false })
      .limit(16);

    if (options?.dealerId) {
      query = query.eq("dealer_id", options.dealerId);
    } else if (options?.dealerIds?.length) {
      query = query.in("dealer_id", options.dealerIds);
    }

    if (options?.leadId) {
      query = query.eq("lead_id", options.leadId);
    }

    const conversationRes = await query;

    if (conversationRes.error) throw conversationRes.error;

    const conversations = (conversationRes.data || []) as ConversationRow[];
    if (!conversations.length) {
      return { threads: [], mode: "live" };
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
    return { threads: [], mode: "live" };
  }
}

export async function getLeadsOverview(filters?: {
  status?: string;
  source?: string;
  assigned?: string;
  dealerId?: string;
  dealerIds?: string[];
  recentWindow?: "24h";
  queue?: "slow" | "recover" | "stuck" | "hot";
  leadId?: string;
}): Promise<{ leads: LeadsRow[]; mode: "live" | "sample" }> {
  if (isDemoMoneyViewMode()) {
    const state = loadDemoState();
    let rows = [...state.leads];

    if (filters?.dealerId || filters?.dealerIds?.length) {
      rows = rows.filter((lead) => shouldIncludeDealer(lead.dealerId, filters?.dealerId, filters?.dealerIds));
    }

    if (filters?.leadId) {
      rows = rows.filter((lead) => lead.id === filters.leadId);
    }

    if (filters?.status && filters.status !== "all") {
      rows = rows.filter((lead) => lead.status.toLowerCase() === filters.status);
    }

    if (filters?.source && filters.source !== "all") {
      rows = rows.filter((lead) => lead.source.toLowerCase() === filters.source);
    }

    if (filters?.assigned === "unassigned") {
      rows = rows.filter((lead) => lead.assignedTo === "Unassigned");
    }

    if (filters?.recentWindow === "24h") {
      const cutoff = Date.now() - 24 * 60 * 60 * 1000;
      rows = rows.filter((lead) => new Date(lead.firstContactAt).getTime() >= cutoff);
    }

    if (filters?.queue === "slow" || filters?.queue === "recover") {
      rows = rows.filter((lead) => lead.status === "Contacted");
    }

    if (filters?.queue === "stuck" || filters?.queue === "hot") {
      rows = rows.filter((lead) => lead.status === "Contacted");
    }

    return { leads: rows, mode: "sample" };
  }

  try {
    const supabase = getSupabaseClient();

    let query = supabase
      .from("leads")
      .select("id,dealer_id,name,phone,source,status,vehicle_interest,assigned_user_id,first_contact_at,last_activity_at")
      .order("last_activity_at", { ascending: false })
      .limit(300);

    if (filters?.dealerId) {
      query = query.eq("dealer_id", filters.dealerId);
    } else if (filters?.dealerIds?.length) {
      query = query.in("dealer_id", filters.dealerIds);
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
      return { leads: [], mode: "live" };
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
        dealerId: lead.dealer_id,
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
    return { leads: [], mode: "live" };
  }
}

export async function getUpcomingBookings(options?: {
  dealerId?: string;
  dealerIds?: string[];
  window?: "week";
  leadId?: string;
}): Promise<{ bookings: BookingRow[]; mode: "live" | "sample" }> {
  if (isDemoMoneyViewMode()) {
    const state = loadDemoState();
    let rows = [...state.bookings];

    if (options?.dealerId || options?.dealerIds?.length) {
      rows = rows.filter((booking) => shouldIncludeDealer(booking.dealerId, options?.dealerId, options?.dealerIds));
    }

    if (options?.leadId) {
      rows = rows.filter((booking) => booking.leadId === options.leadId);
    }
    if (options?.window === "week") {
      const weekMs = Date.now() + 7 * 24 * 60 * 60 * 1000;
      rows = rows.filter((booking) => new Date(booking.preferredDateTime).getTime() <= weekMs);
    }
    return { bookings: rows, mode: "sample" };
  }

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
    } else if (options?.dealerIds?.length) {
      bookingQuery = bookingQuery.in("dealer_id", options.dealerIds);
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
      return { bookings: [], mode: "live" };
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
    return { bookings: [], mode: "live" };
  }
}

export async function getRecoverNowQueue(options?: {
  dealerId?: string;
  dealerIds?: string[];
}): Promise<{ rows: RecoverNowRow[]; mode: "live" | "sample" }> {
  if (isDemoMoneyViewMode()) {
    const rows = getSampleRecoverNow({ dealerId: options?.dealerId }).filter((row) => {
      const demoRecord = DEMO_SEED_RECORDS.find((record) => record.leadId === row.leadId);
      return shouldIncludeDealer(demoRecord?.dealerId || "", options?.dealerId, options?.dealerIds);
    });
    return { rows, mode: "sample" };
  }

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
    } else if (options?.dealerIds?.length) {
      leadsQuery = leadsQuery.in("dealer_id", options.dealerIds);
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
      return { rows: [], mode: "live" };
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
    return { rows: [], mode: "live" };
  }
}

export async function getInsightsSnapshot() {
  if (isDemoMoneyViewMode()) {
    const dashboard = getSampleDashboard();
    return {
      averageResponseTime: dashboard.responseTimeAvg,
      leadsVsBookings: `${dashboard.newLeads24h} leads / ${dashboard.bookingsCreated} bookings`,
      afterHoursMissedLeads: dashboard.missedLeadsAlert,
      generatedAt: format(new Date(), "PPP p"),
      mode: "sample" as const
    };
  }

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
    const dashboard = getSampleDashboard();
    return {
      averageResponseTime: dashboard.responseTimeAvg,
      leadsVsBookings: `${dashboard.newLeads24h} leads / ${dashboard.bookingsCreated} bookings`,
      afterHoursMissedLeads: dashboard.missedLeadsAlert,
      generatedAt: format(new Date(), "PPP p"),
      mode: "sample" as const
    };
  }
}

export type NetworkStoreMetric = {
  dealerId: string;
  storeName: string;
  groupName: string;
  region: string;
  brand: string;
  managerName: string;
  activeReps: number;
  activeLeads: number;
  avgResponseSeconds: number;
  slaCompliance: number;
  breaches: number;
  revenueAtRisk: number;
  bookingsCurrentMonth: number;
  bookingsPrevMonth: number;
  bookingsMoMDeltaPct: number;
  overrideCount: number;
  complianceState: "Healthy" | "Watch" | "Critical";
};

export type NetworkTrendPoint = {
  period: string;
  slaCompliance: number;
  revenueAtRisk: number;
};

export type NetworkHeatmapCell = {
  region: string;
  bucket: string;
  breaches: number;
};

export type LeaderboardEntry = {
  rank: number;
  name: string;
  value: string;
  context: string;
  metric: number;
  dealerId?: string;
};

export type LeakageRegionRow = {
  region: string;
  stores: number;
  revenueAtRisk: number;
  breaches: number;
};

export type NetworkCommandSnapshot = {
  summary: {
    stores: number;
    reps: number;
    activeLeads: number;
    networkSlaCompliance: number;
    revenueAtRisk: number;
  };
  stores: NetworkStoreMetric[];
  trends: NetworkTrendPoint[];
  heatmap: NetworkHeatmapCell[];
  leaderboards: {
    stores: LeaderboardEntry[];
    managers: LeaderboardEntry[];
    reps: LeaderboardEntry[];
  };
  leakageByRegion: LeakageRegionRow[];
  underperformingStores: NetworkStoreMetric[];
  mode: "live" | "sample";
};

export type GovernancePolicyRow = {
  dealerId: string;
  storeName: string;
  groupName: string;
  region: string;
  inheritedPolicy: string;
  overrideFields: number;
  complianceState: "Healthy" | "Watch" | "Critical";
  complianceFlag: string;
  lastAuditAt: string;
};

export type GovernanceFlag = {
  severity: "Critical" | "Warning";
  storeName: string;
  managerName: string;
  flag: string;
  nextAction: string;
};

export type GovernanceSnapshot = {
  policies: GovernancePolicyRow[];
  flags: GovernanceFlag[];
  overrideLeaders: LeaderboardEntry[];
  leakageByRegion: LeakageRegionRow[];
  auditSummary: {
    totalEvents30d: number;
    overrideEvents30d: number;
    breachEvents30d: number;
    lastGeneratedAt: string;
  };
  mode: "live" | "sample";
};

const NETWORK_SAMPLE_REGIONS = [
  "Gauteng North",
  "Gauteng South",
  "Western Cape",
  "KwaZulu-Natal",
  "Eastern Cape",
  "North West"
] as const;

const NETWORK_SAMPLE_GROUPS = [
  "Apex Mobility Group",
  "Velocity Auto Group",
  "Summit Dealer Holdings",
  "Frontline Motor Network"
] as const;

const NETWORK_SAMPLE_STORES = [
  "JAECOO Ruimsig",
  "OMODA on Ontdekkers (38 Ontdekkers Rd, Princess, Roodepoort, 1742)",
  "Chery Pretoria East",
  "Chery Durban North",
  "Chery Cape Town City",
  "Chery Gqeberha",
  "Haval Fourways",
  "Haval Randburg",
  "Haval Menlyn",
  "Haval Umhlanga",
  "Haval Century City",
  "Haval East London",
  "Omoda Bryanston",
  "Omoda Centurion",
  "Omoda Silver Lakes",
  "Omoda Ballito",
  "Omoda Bellville",
  "Omoda Kimberley",
  "Jaecoo Rosebank",
  "Jaecoo Midstream",
  "Jaecoo Polokwane",
  "Jaecoo Durban Central",
  "Jaecoo Paarl",
  "Jaecoo Rustenburg",
  "BYD Sandton",
  "BYD Pretoria Central",
  "BYD Mbombela",
  "BYD Durban South",
  "BYD Stellenbosch",
  "BYD Bloemfontein",
  "GWM Rivonia",
  "GWM Krugersdorp",
  "GWM Potchefstroom",
  "GWM George"
] as const;

function seededBetween(seed: number, min: number, max: number) {
  const value = Math.abs(Math.sin(seed * 12.9898) * 43758.5453) % 1;
  return min + value * (max - min);
}

function getMonthKey(dateIso: string) {
  const date = new Date(dateIso);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function getMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split("-").map((value) => Number(value));
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleString("en-ZA", {
    month: "short"
  });
}

function buildLastMonthKeys(months: number) {
  const now = new Date();
  const keys: string[] = [];

  for (let i = months - 1; i >= 0; i -= 1) {
    const dt = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    keys.push(`${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}`);
  }

  return keys;
}

function mapCityToRegion(city: string | null | undefined) {
  const normalized = (city || "").toLowerCase();
  if (
    normalized.includes("johannesburg") ||
    normalized.includes("sandton") ||
    normalized.includes("midrand") ||
    normalized.includes("pretoria") ||
    normalized.includes("centurion") ||
    normalized.includes("randburg")
  ) {
    return "Gauteng North";
  }
  if (normalized.includes("durban") || normalized.includes("umhlanga") || normalized.includes("ballito")) {
    return "KwaZulu-Natal";
  }
  if (normalized.includes("cape") || normalized.includes("stellenbosch") || normalized.includes("paarl") || normalized.includes("bellville")) {
    return "Western Cape";
  }
  if (normalized.includes("gqeberha") || normalized.includes("east london")) {
    return "Eastern Cape";
  }
  if (normalized.includes("rustenburg") || normalized.includes("potchefstroom")) {
    return "North West";
  }
  return "Gauteng South";
}

function inferGroupFromRegion(region: string) {
  if (region.includes("Gauteng")) return "Apex Mobility Group";
  if (region.includes("Western")) return "Velocity Auto Group";
  if (region.includes("KwaZulu")) return "Summit Dealer Holdings";
  return "Frontline Motor Network";
}

function hourBucketFromIso(dateIso: string) {
  const hour = new Date(dateIso).getHours();
  if (hour >= 6 && hour < 9) return "06-09";
  if (hour >= 9 && hour < 12) return "09-12";
  if (hour >= 12 && hour < 15) return "12-15";
  if (hour >= 15 && hour < 18) return "15-18";
  if (hour >= 18 && hour < 21) return "18-21";
  return "21-06";
}

function computeComplianceState(slaCompliance: number, breaches: number) {
  if (slaCompliance < 85 || breaches >= 32) return "Critical";
  if (slaCompliance < 91 || breaches >= 18) return "Watch";
  return "Healthy";
}

function buildSampleNetworkStores(): NetworkStoreMetric[] {
  return NETWORK_SAMPLE_STORES.map((storeName, index) => {
    const seed = index + 1;
    const region = NETWORK_SAMPLE_REGIONS[index % NETWORK_SAMPLE_REGIONS.length];
    const groupName = NETWORK_SAMPLE_GROUPS[index % NETWORK_SAMPLE_GROUPS.length];
    const brand = storeName.split(" ")[0];
    const activeReps = Math.round(seededBetween(seed, 9, 16));
    const activeLeads = Math.round(seededBetween(seed + 4, 90, 340));
    const avgResponseSeconds = Math.round(seededBetween(seed + 8, 48, 312));
    const breaches = Math.round(seededBetween(seed + 12, 6, 42));
    const slaCompliance = Math.round(seededBetween(seed + 16, 78, 97));
    const revenueAtRisk = Math.round(seededBetween(seed + 20, 220000, 1950000));
    const bookingsCurrentMonth = Math.round(seededBetween(seed + 24, 34, 160));
    const bookingsPrevMonth = Math.max(1, Math.round(bookingsCurrentMonth - seededBetween(seed + 28, -25, 30)));
    const bookingsMoMDeltaPct = Math.round(((bookingsCurrentMonth - bookingsPrevMonth) / bookingsPrevMonth) * 100);
    const overrideCount = Math.round(seededBetween(seed + 32, 0, 11));
    const managerName = `Manager ${String(index + 1).padStart(2, "0")}`;
    const dealerId = `demo-store-${String(index + 1).padStart(2, "0")}`;

    return {
      dealerId,
      storeName,
      groupName,
      region,
      brand,
      managerName,
      activeReps,
      activeLeads,
      avgResponseSeconds,
      slaCompliance,
      breaches,
      revenueAtRisk,
      bookingsCurrentMonth,
      bookingsPrevMonth,
      bookingsMoMDeltaPct,
      overrideCount,
      complianceState: computeComplianceState(slaCompliance, breaches)
    };
  });
}

function buildNetworkSnapshotFromStores(stores: NetworkStoreMetric[], mode: "live" | "sample"): NetworkCommandSnapshot {
  const totalStores = stores.length;
  const totalReps = stores.reduce((sum, row) => sum + row.activeReps, 0);
  const totalActiveLeads = stores.reduce((sum, row) => sum + row.activeLeads, 0);
  const totalRevenueAtRisk = stores.reduce((sum, row) => sum + row.revenueAtRisk, 0);
  const avgSlaCompliance = totalStores > 0 ? Math.round(stores.reduce((sum, row) => sum + row.slaCompliance, 0) / totalStores) : 0;

  const monthKeys = buildLastMonthKeys(6);
  const trends = monthKeys.map((monthKey, index) => {
    const baselineCompliance = avgSlaCompliance || 88;
    const baselineRisk = totalRevenueAtRisk || 20000000;
    const compliance = Math.max(72, Math.min(99, Math.round(baselineCompliance - 2 + index * 0.9 + seededBetween(index + 1, -1.2, 1.4))));
    const revenue = Math.round(baselineRisk * (0.88 + index * 0.03 + seededBetween(index + 2, -0.02, 0.04)));

    return {
      period: getMonthLabel(monthKey),
      slaCompliance: compliance,
      revenueAtRisk: revenue
    };
  });

  const heatBuckets = ["06-09", "09-12", "12-15", "15-18", "18-21", "21-06"];
  const regionMap = new Map<string, Map<string, number>>();

  for (const store of stores) {
    if (!regionMap.has(store.region)) {
      regionMap.set(store.region, new Map(heatBuckets.map((bucket) => [bucket, 0])));
    }
    const bucketMap = regionMap.get(store.region)!;
    for (const bucket of heatBuckets) {
      const bucketSeed = store.breaches + bucket.charCodeAt(0) + store.storeName.length;
      const multiplier = bucket === "09-12" || bucket === "15-18" ? 1.2 : bucket === "21-06" ? 0.5 : 0.9;
      const contribution = Math.max(0, Math.round((store.breaches / stores.length) * multiplier + seededBetween(bucketSeed, 0, 2.5)));
      bucketMap.set(bucket, (bucketMap.get(bucket) || 0) + contribution);
    }
  }

  const heatmap: NetworkHeatmapCell[] = [];
  for (const [region, bucketMap] of regionMap.entries()) {
    for (const bucket of heatBuckets) {
      heatmap.push({
        region,
        bucket,
        breaches: bucketMap.get(bucket) || 0
      });
    }
  }

  const storesLeaderboard = [...stores]
    .sort((a, b) => b.slaCompliance - a.slaCompliance)
    .slice(0, 10)
    .map((store, index) => ({
      rank: index + 1,
      name: store.storeName,
      value: `${store.slaCompliance}% SLA`,
      context: `${store.activeLeads} active leads`,
      metric: store.slaCompliance,
      dealerId: store.dealerId
    }));

  const managerLeaderboard = [...stores]
    .sort((a, b) => b.overrideCount - a.overrideCount)
    .slice(0, 10)
    .map((store, index) => ({
      rank: index + 1,
      name: store.managerName,
      value: `${store.overrideCount} overrides`,
      context: store.storeName,
      metric: store.overrideCount,
      dealerId: store.dealerId
    }));

  const repLeaderboard = [...stores]
    .sort((a, b) => b.bookingsCurrentMonth - a.bookingsCurrentMonth)
    .slice(0, 10)
    .map((store, index) => ({
      rank: index + 1,
      name: `${store.storeName} Rep Team`,
      value: `${store.bookingsCurrentMonth} executed`,
      context: `${store.activeReps} reps`,
      metric: store.bookingsCurrentMonth,
      dealerId: store.dealerId
    }));

  const leakageByRegion = Array.from(
    stores.reduce((map, store) => {
      const current = map.get(store.region) || { region: store.region, stores: 0, revenueAtRisk: 0, breaches: 0 };
      current.stores += 1;
      current.revenueAtRisk += store.revenueAtRisk;
      current.breaches += store.breaches;
      map.set(store.region, current);
      return map;
    }, new Map<string, LeakageRegionRow>()).values()
  ).sort((a, b) => b.revenueAtRisk - a.revenueAtRisk);

  const underperformingStores = [...stores]
    .filter((store) => store.complianceState !== "Healthy")
    .sort((a, b) => b.revenueAtRisk - a.revenueAtRisk)
    .slice(0, 12);

  return {
    summary: {
      stores: totalStores,
      reps: totalReps,
      activeLeads: totalActiveLeads,
      networkSlaCompliance: avgSlaCompliance,
      revenueAtRisk: totalRevenueAtRisk
    },
    stores,
    trends,
    heatmap,
    leaderboards: {
      stores: storesLeaderboard,
      managers: managerLeaderboard,
      reps: repLeaderboard
    },
    leakageByRegion,
    underperformingStores,
    mode
  };
}

export async function getNetworkCommandSnapshot(options?: {
  region?: string;
  dealerId?: string;
}): Promise<NetworkCommandSnapshot> {
  const regionFilter = options?.region && options.region !== "all" ? options.region : undefined;
  const dealerFilter = options?.dealerId && options.dealerId !== "all" ? options.dealerId : undefined;

  if (isDemoMoneyViewMode()) {
    let sampleStores = buildSampleNetworkStores();
    if (dealerFilter) {
      sampleStores = sampleStores.filter((store) => store.dealerId === dealerFilter);
    }
    if (regionFilter) {
      sampleStores = sampleStores.filter((store) => store.region === regionFilter);
    }
    return buildNetworkSnapshotFromStores(sampleStores, "sample");
  }

  try {
    const supabase = getSupabaseClient();
    const now = Date.now();
    const since180 = new Date(now - 180 * 24 * 60 * 60 * 1000).toISOString();
    const since30 = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString();
    const prev30 = new Date(now - 60 * 24 * 60 * 60 * 1000).toISOString();

    let dealersQuery = supabase.from("dealers").select("id,name,city,brands").order("name", { ascending: true }).limit(300);
    if (dealerFilter) {
      dealersQuery = dealersQuery.eq("id", dealerFilter);
    }
    const dealersRes = await dealersQuery;
    if (dealersRes.error) throw dealersRes.error;

    const dealers = (dealersRes.data || []) as Array<{
      id: string;
      name: string | null;
      city: string | null;
      brands: string[] | null;
    }>;

    if (!dealers.length) {
      return buildNetworkSnapshotFromStores(buildSampleNetworkStores(), "sample");
    }

    let stores: NetworkStoreMetric[] = dealers.map((dealer) => {
      const region = mapCityToRegion(dealer.city);
      return {
        dealerId: dealer.id,
        storeName: dealer.name || "Unnamed Store",
        groupName: inferGroupFromRegion(region),
        region,
        brand: dealer.brands?.[0] || "Mixed",
        managerName: "Store Manager",
        activeReps: 0,
        activeLeads: 0,
        avgResponseSeconds: 0,
        slaCompliance: 100,
        breaches: 0,
        revenueAtRisk: 0,
        bookingsCurrentMonth: 0,
        bookingsPrevMonth: 0,
        bookingsMoMDeltaPct: 0,
        overrideCount: 0,
        complianceState: "Healthy"
      };
    });

    if (regionFilter) {
      stores = stores.filter((store) => store.region === regionFilter);
    }

    if (!stores.length) {
      return buildNetworkSnapshotFromStores([], "live");
    }

    const dealerIds = stores.map((store) => store.dealerId);

    const [leadsRes, responsesRes, bookingsRes, usersRes] = await Promise.all([
      supabase
        .from("leads")
        .select("id,dealer_id,status,assigned_user_id,first_contact_at")
        .in("dealer_id", dealerIds)
        .gte("first_contact_at", since180)
        .limit(50000),
      supabase
        .from("response_metrics")
        .select("dealer_id,lead_id,response_seconds,first_inbound_at")
        .in("dealer_id", dealerIds)
        .gte("first_inbound_at", since180)
        .limit(50000),
      supabase
        .from("bookings")
        .select("id,dealer_id,lead_id,status,created_at")
        .in("dealer_id", dealerIds)
        .gte("created_at", prev30)
        .limit(50000),
      supabase
        .from("users")
        .select("id,dealer_id,role,name,is_active")
        .in("dealer_id", dealerIds)
        .eq("is_active", true)
        .limit(5000)
    ]);

    if (leadsRes.error) throw leadsRes.error;
    if (responsesRes.error) throw responsesRes.error;
    if (bookingsRes.error) throw bookingsRes.error;
    if (usersRes.error) throw usersRes.error;

    const leads = (leadsRes.data || []) as Array<{
      id: string;
      dealer_id: string;
      status: string | null;
      assigned_user_id: string | null;
      first_contact_at: string;
    }>;
    const responses = (responsesRes.data || []) as Array<{
      dealer_id: string | null;
      lead_id: string;
      response_seconds: number | null;
      first_inbound_at: string | null;
    }>;
    const bookings = (bookingsRes.data || []) as Array<{
      id: string;
      dealer_id: string;
      lead_id: string | null;
      status: string | null;
      created_at: string;
    }>;
    const users = (usersRes.data || []) as Array<{
      id: string;
      dealer_id: string | null;
      role: string | null;
      name: string | null;
      is_active: boolean | null;
    }>;

    let overrideRows: Array<{ dealer_id: string; fired_at: string | null }> = [];
    try {
      const overridesRes = await supabase
        .from("sla_enforcement_actions")
        .select("dealer_id,fired_at,action")
        .in("dealer_id", dealerIds)
        .gte("fired_at", since30)
        .ilike("action", "%override%")
        .limit(20000);
      if (!overridesRes.error) {
        overrideRows = (overridesRes.data || []) as Array<{ dealer_id: string; fired_at: string | null }>;
      }
    } catch {
      overrideRows = [];
    }

    const leadsByDealer = new Map<string, typeof leads>();
    const responsesByDealer = new Map<string, typeof responses>();
    const bookingsByDealer = new Map<string, typeof bookings>();
    const usersByDealer = new Map<string, typeof users>();
    const overrideCountByDealer = new Map<string, number>();
    const leadById = new Map(leads.map((lead) => [lead.id, lead]));

    for (const lead of leads) {
      const list = leadsByDealer.get(lead.dealer_id) || [];
      list.push(lead);
      leadsByDealer.set(lead.dealer_id, list);
    }
    for (const response of responses) {
      const dealerId = response.dealer_id || leadById.get(response.lead_id)?.dealer_id;
      if (!dealerId) continue;
      const list = responsesByDealer.get(dealerId) || [];
      list.push(response);
      responsesByDealer.set(dealerId, list);
    }
    for (const booking of bookings) {
      const list = bookingsByDealer.get(booking.dealer_id) || [];
      list.push(booking);
      bookingsByDealer.set(booking.dealer_id, list);
    }
    for (const user of users) {
      if (!user.dealer_id) continue;
      const list = usersByDealer.get(user.dealer_id) || [];
      list.push(user);
      usersByDealer.set(user.dealer_id, list);
    }
    for (const row of overrideRows) {
      overrideCountByDealer.set(row.dealer_id, (overrideCountByDealer.get(row.dealer_id) || 0) + 1);
    }

    const currentMonthKey = getMonthKey(new Date().toISOString());
    const prevMonthDate = new Date();
    prevMonthDate.setUTCMonth(prevMonthDate.getUTCMonth() - 1);
    const prevMonthKey = getMonthKey(prevMonthDate.toISOString());

    stores = stores.map((store) => {
      const dealerLeads = leadsByDealer.get(store.dealerId) || [];
      const dealerResponses = responsesByDealer.get(store.dealerId) || [];
      const dealerBookings = bookingsByDealer.get(store.dealerId) || [];
      const dealerUsers = usersByDealer.get(store.dealerId) || [];

      const activeLeads = dealerLeads.filter((lead) => {
        const status = (lead.status || "").toLowerCase();
        return status !== "sold" && status !== "lost";
      }).length;

      const repIds = new Set(
        dealerLeads
          .map((lead) => lead.assigned_user_id)
          .filter((value): value is string => Boolean(value))
      );
      const activeReps = Math.max(
        repIds.size,
        dealerUsers.filter((user) => (user.role || "").toLowerCase() === "dealer_sales").length
      );

      const responseSeconds = dealerResponses
        .map((response) => response.response_seconds)
        .filter((value): value is number => typeof value === "number");
      const timelyResponses = responseSeconds.filter((seconds) => seconds <= 300).length;
      const avgResponseSeconds =
        responseSeconds.length > 0
          ? Math.round(responseSeconds.reduce((sum, seconds) => sum + seconds, 0) / responseSeconds.length)
          : 0;

      const missingResponseCount = dealerLeads.filter((lead) => !dealerResponses.some((row) => row.lead_id === lead.id)).length;
      const slowResponseCount = responseSeconds.filter((seconds) => seconds > 300).length;
      const breaches = slowResponseCount + missingResponseCount;

      const denominator = Math.max(1, dealerLeads.length);
      const slaCompliance = Math.max(
        62,
        Math.min(100, Math.round(((timelyResponses + Math.max(0, dealerLeads.length - missingResponseCount - slowResponseCount)) / denominator) * 100))
      );

      const hotNotBooked = dealerLeads.filter((lead) => (lead.status || "").toLowerCase() === "contacted").length;
      const revenueAtRisk = Math.max(0, breaches * 18500 + hotNotBooked * 9500);

      const bookingsCurrentMonth = dealerBookings.filter((booking) => getMonthKey(booking.created_at) === currentMonthKey).length;
      const bookingsPrevMonth = dealerBookings.filter((booking) => getMonthKey(booking.created_at) === prevMonthKey).length;
      const safePrev = Math.max(1, bookingsPrevMonth);
      const bookingsMoMDeltaPct = Math.round(((bookingsCurrentMonth - safePrev) / safePrev) * 100);

      const managerName =
        dealerUsers.find((user) => (user.role || "").toLowerCase() === "dealer_admin")?.name ||
        store.managerName;

      const derivedOverrideCount = Math.round(breaches / 12);
      const overrideCount = overrideCountByDealer.get(store.dealerId) ?? derivedOverrideCount;

      return {
        ...store,
        managerName,
        activeReps: Math.max(0, activeReps),
        activeLeads,
        avgResponseSeconds,
        slaCompliance,
        breaches,
        revenueAtRisk,
        bookingsCurrentMonth,
        bookingsPrevMonth,
        bookingsMoMDeltaPct,
        overrideCount,
        complianceState: computeComplianceState(slaCompliance, breaches)
      };
    });

    const snapshot = buildNetworkSnapshotFromStores(stores, "live");

    const monthKeys = buildLastMonthKeys(6);
    const responseByLead = new Map(
      responses
        .map((response) => [response.lead_id, response.response_seconds])
        .filter((entry): entry is [string, number] => typeof entry[1] === "number")
    );

    const trends = monthKeys.map((key) => {
      const monthlyLeads = leads.filter((lead) => getMonthKey(lead.first_contact_at) === key);
      const monthlyTimed = monthlyLeads.filter((lead) => {
        const seconds = responseByLead.get(lead.id);
        return typeof seconds === "number" && seconds <= 300;
      }).length;
      const monthlyBreaches = Math.max(0, monthlyLeads.length - monthlyTimed);
      const monthlySla = monthlyLeads.length > 0 ? Math.round((monthlyTimed / monthlyLeads.length) * 100) : snapshot.summary.networkSlaCompliance;
      return {
        period: getMonthLabel(key),
        slaCompliance: Math.max(62, Math.min(100, monthlySla)),
        revenueAtRisk: monthlyBreaches * 18500
      };
    });

    const heatmapMap = new Map<string, number>();
    for (const lead of leads.filter((lead) => new Date(lead.first_contact_at).toISOString() >= since30)) {
      const dealer = stores.find((store) => store.dealerId === lead.dealer_id);
      if (!dealer) continue;
      const seconds = responseByLead.get(lead.id);
      if (typeof seconds === "number" && seconds <= 300) continue;
      const bucket = hourBucketFromIso(lead.first_contact_at);
      const key = `${dealer.region}|${bucket}`;
      heatmapMap.set(key, (heatmapMap.get(key) || 0) + 1);
    }

    const heatBuckets = ["06-09", "09-12", "12-15", "15-18", "18-21", "21-06"];
    const regions = Array.from(new Set(stores.map((store) => store.region)));
    const heatmap: NetworkHeatmapCell[] = [];
    for (const region of regions) {
      for (const bucket of heatBuckets) {
        heatmap.push({
          region,
          bucket,
          breaches: heatmapMap.get(`${region}|${bucket}`) || 0
        });
      }
    }

    return {
      ...snapshot,
      trends,
      heatmap
    };
  } catch {
    return buildNetworkSnapshotFromStores(buildSampleNetworkStores(), "sample");
  }
}

export async function getGovernanceSnapshot(options?: {
  region?: string;
  dealerId?: string;
}): Promise<GovernanceSnapshot> {
  const network = await getNetworkCommandSnapshot(options);

  const policies: GovernancePolicyRow[] = network.stores.map((store) => ({
    dealerId: store.dealerId,
    storeName: store.storeName,
    groupName: store.groupName,
    region: store.region,
    inheritedPolicy: "Group Default SLA v1",
    overrideFields: store.overrideCount > 0 ? Math.min(4, store.overrideCount) : 0,
    complianceState: store.complianceState,
    complianceFlag:
      store.complianceState === "Critical"
        ? "SLA breach concentration"
        : store.complianceState === "Watch"
          ? "Escalation volume elevated"
          : "Compliant",
    lastAuditAt: format(new Date(Date.now() - seededBetween(store.activeLeads, 1, 6) * 24 * 60 * 60 * 1000), "PPP")
  }));

  const flags: GovernanceFlag[] = network.underperformingStores.slice(0, 16).map((store) => ({
    severity: store.complianceState === "Critical" ? "Critical" : "Warning",
    storeName: store.storeName,
    managerName: store.managerName,
    flag:
      store.complianceState === "Critical"
        ? "High breach rate against policy target"
        : "Escalation and override pressure rising",
    nextAction:
      store.complianceState === "Critical"
        ? "Enforce recovery workflow and manager review within 24h"
        : "Run coaching loop and tighten assignment capacity this week"
  }));

  const overrideLeaders = network.leaderboards.managers;
  const breachEvents = network.stores.reduce((sum, store) => sum + store.breaches, 0);
  const overrideEvents = network.stores.reduce((sum, store) => sum + store.overrideCount, 0);
  const totalEvents = breachEvents + overrideEvents + network.stores.length * 6;

  return {
    policies,
    flags,
    overrideLeaders,
    leakageByRegion: network.leakageByRegion,
    auditSummary: {
      totalEvents30d: totalEvents,
      overrideEvents30d: overrideEvents,
      breachEvents30d: breachEvents,
      lastGeneratedAt: format(new Date(), "PPP p")
    },
    mode: network.mode
  };
}

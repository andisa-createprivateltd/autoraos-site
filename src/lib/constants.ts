export const PLATFORM_NAME = "AUTORA";

export const BRANDS = ["All", "Chery", "Haval", "Omoda", "Jaecoo", "BYD", "GWM"] as const;

export const CHINESE_BRANDS = BRANDS.filter((brand) => brand !== "All");

export const PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
  "Western Cape"
] as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/platform", label: "Platform" },
  { href: "/integrations", label: "Integrations" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/enterprise", label: "Enterprise" },
  { href: "/security", label: "Security" },
  { href: "/contact", label: "Contact" }
] as const;

export const PRICING_TIERS = [
  {
    name: "Store Discipline",
    price: "Starting from R38,000 per store / month",
    description: "Revenue enforcement for single-store operations that need accountable response handling and booking discipline.",
    bestFor: "Single-store dealerships formalizing response control.",
    highlighted: false,
    badge: null,
    usersIncluded: "Core store team",
    locationsIncluded: "1 location",
    whatsappNumbers: "1 number",
    slaLevel: "Store-level SLA enforcement",
    reporting: "Store risk and execution reporting",
    support: "Implementation guidance + business-hours support",
    features: [
      "Shared inbox with SLA countdowns",
      "Recover Now queue and ownership tracking",
      "Booking confirmations, reminders, and no-show control",
      "Role-based accountability by user and timestamp",
      "Store-level reporting and audit visibility"
    ]
  },
  {
    name: "Group Governance",
    price: "Starting from R110,000 / month",
    description: "Multi-store governance for dealer groups that need consistent enforcement across locations.",
    bestFor: "Dealer groups standardizing discipline across 2-10 stores.",
    highlighted: true,
    badge: "Best fit for groups",
    usersIncluded: "Multi-store management teams",
    locationsIncluded: "2-10 locations",
    whatsappNumbers: "Multi-number governance",
    slaLevel: "Cross-store routing and escalation",
    reporting: "Store, manager, and group reporting",
    support: "Priority rollout support",
    features: [
      "Shared policy enforcement across stores",
      "Manager escalation ladders and override traceability",
      "Cross-store recover queues and accountability views",
      "Executive reporting across locations",
      "Operational reviews for rollout and adoption"
    ]
  },
  {
    name: "Enterprise Infrastructure",
    price: "Custom deployment - typically R250,000+ / month",
    description: "Enterprise-grade governance, auditability, and executive reporting for complex multi-store operations.",
    bestFor: "Large dealer groups, PE-backed operators, and regional networks.",
    highlighted: false,
    badge: null,
    usersIncluded: "Custom by governance scope",
    locationsIncluded: "10+ locations",
    whatsappNumbers: "Governed centrally",
    slaLevel: "Enterprise policy architecture",
    reporting: "Executive, compliance, and board packs",
    support: "Named success lead + rollout governance",
    features: [
      "Enterprise policy architecture and change control",
      "Multi-store reporting with audit-grade traceability",
      "Escalation governance by role and store",
      "Forecast support tied to response discipline",
      "Implementation and review cadence for leadership"
    ]
  },
  {
    name: "OEM Network Deployment",
    price: "Custom pricing",
    description: "Network-level rollout for OEM programs or large governance deployments.",
    bestFor: "OEM programs, national groups, and custom network deployments.",
    highlighted: false,
    badge: "Custom deployment",
    usersIncluded: "Defined per deployment",
    locationsIncluded: "Custom network scope",
    whatsappNumbers: "Program-specific",
    slaLevel: "OEM-specific governance rules",
    reporting: "OEM and executive reporting packs",
    support: "Dedicated enterprise support",
    features: [
      "OEM-specific governance packs",
      "Regional or network policy enforcement",
      "Custom connector delivery and onboarding",
      "Program-level reporting design",
      "Deployment architecture by network structure"
    ]
  }
] as const;

export const ADD_ONS = [
  {
    label: "Revenue Activation Onboarding",
    price: "Scoped implementation fee",
    description: "Workflow mapping, SLA policy setup, user onboarding, and launch control before the system goes live."
  },
  {
    label: "Custom SLA Configuration",
    price: "Quoted by policy scope",
    description: "Additional SLA models, escalation ladders, and governance controls for complex store groups."
  },
  {
    label: "Custom Integration Delivery",
    price: "Quoted by connector scope",
    description: "Connector delivery for DMS, CRM, OEM feeds, or bespoke routing requirements. Tier structures stay fixed."
  },
  {
    label: "OEM Reporting Pack",
    price: "Quoted by reporting scope",
    description: "Additional governance outputs for OEM stakeholders without changing the operating tier structure."
  }
] as const;

export const HOW_IT_WORKS = [
  {
    title: "Dashboard: Revenue Risk Command",
    description: "See enquiry exposure, SLA discipline, and booking pressure in one operating view."
  },
  {
    title: "Inbox: WhatsApp-first control",
    description: "Route inbound conversations by urgency, assignment, and elapsed SLA time."
  },
  {
    title: "Bookings: Execution discipline",
    description: "Confirm, reschedule, and recover bookings with clear ownership and reminders."
  },
  {
    title: "Governance: Audit and visibility",
    description: "Track compliance, exceptions, and store-level accountability from one policy layer."
  }
] as const;

export const SOCIAL_PROOF_PLACEHOLDERS = [
  "WhatsApp-first lead handling with clear response ownership",
  "Operational SLA discipline across sales and BDC teams",
  "Executive visibility into enquiry leakage and booking execution"
] as const;

export const AUTORA_WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "27703521316";
export const CREATEPRIVATE_WHATSAPP = AUTORA_WHATSAPP;

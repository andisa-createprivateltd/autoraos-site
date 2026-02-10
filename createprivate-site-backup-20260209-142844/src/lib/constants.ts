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
  { href: "/dealer-os", label: "Dealer OS" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/dealerships-near-me", label: "Dealerships Near Me" },
  { href: "/founder-narrative", label: "Narrative" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
] as const;

export const PRICING_TIERS = [
  {
    name: "Starter",
    price: "R8,500 / month",
    description: "For single-location dealerships starting to digitise lead handling.",
    bestFor: "Small dealerships",
    highlighted: false,
    badge: null,
    features: [
      "WhatsApp AI assistant",
      "Unified inbox",
      "Lead capture",
      "Basic booking",
      "Email support"
    ]
  },
  {
    name: "Growth",
    price: "R15,000 / month",
    description: "For dealerships focused on increasing test drives and sales.",
    bestFor: "High-volume dealerships",
    features: [
      "Everything in Starter",
      "Advanced AI follow-ups",
      "Test-drive booking engine",
      "Performance insights",
      "WhatsApp priority routing"
    ],
    highlighted: true,
    badge: "Most Popular"
  },
  {
    name: "Scale",
    price: "R45,000 / month",
    description: "For dealer groups and multi-location operations.",
    bestFor: "Dealer groups",
    highlighted: false,
    badge: null,
    features: [
      "Everything in Growth",
      "Multi-location support",
      "Advanced lead routing",
      "Dedicated success manager",
      "OEM-ready reporting"
    ]
  }
] as const;

export const ADD_ONS = [
  {
    label: "Paid Demand Generation",
    price: "Custom pricing",
    description: "Mandatory for most. Optional after onboarding."
  }
] as const;

export const HOW_IT_WORKS = [
  {
    title: "Capture every dealership lead",
    description: "Dealer OS centralizes inbound WhatsApp, web, and ad leads into one inbox."
  },
  {
    title: "Respond in seconds with AI",
    description: "AI handles first response, qualification, and routing while humans take over where needed."
  },
  {
    title: "Convert to test drives and sales",
    description: "Booking workflows and operational insights focus teams on conversion, not busywork."
  }
] as const;

export const SOCIAL_PROOF_PLACEHOLDERS = [
  "Response speed under 60 seconds across inbound channels",
  "Fewer missed after-hours leads through WhatsApp AI coverage",
  "Improved lead-to-booking consistency per dealership branch"
] as const;

export const CREATEPRIVATE_WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "27820000000";

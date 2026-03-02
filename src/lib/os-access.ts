export type DealerRole =
  | "platform_owner"
  | "platform_support"
  | "dealer_admin"
  | "dealer_sales"
  | "dealer_marketing";

export const ROLE_SCREEN_ACCESS: Record<DealerRole, string[]> = {
  platform_owner: [
    "dashboard",
    "conversations",
    "leads",
    "bookings",
    "insights",
    "reports",
    "governance",
    "audit-logs",
    "assistant",
    "settings",
    "billing",
    "logs",
    "api-keys"
  ],
  platform_support: [
    "dashboard",
    "conversations",
    "leads",
    "bookings",
    "insights",
    "reports",
    "governance",
    "audit-logs",
    "assistant",
    "settings"
  ],
  dealer_admin: [
    "dashboard",
    "conversations",
    "leads",
    "bookings",
    "insights",
    "reports",
    "governance",
    "audit-logs",
    "assistant",
    "settings"
  ],
  dealer_sales: ["dashboard", "conversations", "leads", "bookings", "reports"],
  dealer_marketing: ["dashboard", "insights", "reports"]
};

export function canAccessScreen(role: DealerRole, screen: string) {
  return ROLE_SCREEN_ACCESS[role].includes(screen);
}

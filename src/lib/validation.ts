import { z } from "zod";
import { BRANDS, PROVINCES } from "@/lib/constants";

const brandValues = BRANDS.filter((brand) => brand !== "All") as [
  (typeof BRANDS)[number],
  ...(typeof BRANDS)[number][]
];

export const bookingSchema = z.object({
  dealershipName: z.string().min(2, "Dealership name is required"),
  brand: z.enum(brandValues, { errorMap: () => ({ message: "Select a supported brand" }) }),
  contactPerson: z.string().min(2, "Contact person is required"),
  phone: z.string().min(8, "Phone number is required"),
  email: z.string().email("Enter a valid email address"),
  province: z.enum(PROVINCES),
  city: z.string().min(2, "City is required"),
  preferredDateTime: z.string().datetime({ offset: true }),
  notes: z.string().max(500).optional(),
  source: z.string().max(50).optional(),
  honeypot: z.string().max(0).optional().default("")
});

export const contactSchema = z.object({
  dealershipName: z.string().optional(),
  contactPerson: z.string().min(2, "Name is required"),
  phone: z.string().min(8, "Phone number is required"),
  email: z.string().email("Enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  honeypot: z.string().max(0).optional().default("")
});

const dealerRoleValues = ["dealer_admin", "dealer_sales", "dealer_marketing"] as const;

export const sendMessageSchema = z.object({
  conversation_id: z.string().uuid("Invalid conversation ID"),
  lead_id: z.string().uuid("Invalid lead ID"),
  content: z.string().min(1, "Message content is required").max(2_000, "Message content is too long")
});

export const handoffSchema = z.object({
  conversation_id: z.string().uuid("Invalid conversation ID"),
  lead_id: z.string().uuid("Invalid lead ID"),
  reason: z.string().min(3, "Reason is required").max(500, "Reason is too long")
});

export const inviteUserSchema = z.object({
  email: z.string().email("Valid email is required"),
  name: z.string().min(2, "Name is required").max(120, "Name is too long"),
  role: z.enum(dealerRoleValues)
});

export const deviceTokenSchema = z.object({
  device_token: z.string().min(32, "Invalid device token").max(512, "Invalid device token"),
  platform: z.literal("ios")
});

const leadStatusValues = [
  "new",
  "contacted",
  "booked",
  "visited",
  "sold",
  "lost"
] as const;

const bookingActionValues = [
  "confirm",
  "reschedule",
  "complete",
  "no_show",
  "send_reminder"
] as const;

export const osLeadUpdateSchema = z.object({
  lead_id: z.string().uuid("Invalid lead ID"),
  status: z.enum(leadStatusValues).optional(),
  assigned_user_id: z.string().uuid("Invalid user ID").nullable().optional()
});

export const osSendMessageSchema = z.object({
  conversation_id: z.string().uuid("Invalid conversation ID"),
  lead_id: z.string().uuid("Invalid lead ID"),
  content: z.string().min(1, "Message content is required").max(2_000, "Message content is too long")
});

export const osHandoffSchema = z.object({
  conversation_id: z.string().uuid("Invalid conversation ID"),
  lead_id: z.string().uuid("Invalid lead ID"),
  enabled: z.boolean(),
  reason: z.string().max(300).optional()
});

export const osBookingActionSchema = z.object({
  booking_id: z.string().uuid("Invalid booking ID"),
  action: z.enum(bookingActionValues)
});

export type BookingInput = z.infer<typeof bookingSchema>;
export type ContactInput = z.infer<typeof contactSchema>;

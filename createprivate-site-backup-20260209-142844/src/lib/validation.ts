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

export type BookingInput = z.infer<typeof bookingSchema>;
export type ContactInput = z.infer<typeof contactSchema>;

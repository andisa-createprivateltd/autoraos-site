import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { getSupabaseClient } from "@/lib/supabase";
import { sendContactNotification } from "@/lib/email";
import {
  contactLeadStatus,
  captureLeadThread,
  ensureDealerAccount,
  mapLeadSource
} from "@/lib/beta-capture";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  const limit = checkRateLimit(`contact:${ip}:${userAgent.slice(0, 50)}`);

  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((limit.retryAfterMs ?? 0) / 1000)) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid payload." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message || "Invalid contact data." },
      { status: 400 }
    );
  }

  const input = parsed.data;
  if (input.honeypot) {
    return NextResponse.json({ message: "Spam detection triggered." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseClient();
    const dealerId = await ensureDealerAccount(supabase, {
      dealershipName: input.dealershipName || "AUTORA Inbound",
      city: "Johannesburg",
      plan: "starter"
    });

    await captureLeadThread(supabase, {
      dealerId,
      source: mapLeadSource("website"),
      name: input.contactPerson,
      phone: input.phone,
      status: contactLeadStatus(),
      leadMessage: input.message,
      responseMessage: "Thanks for your enquiry. A specialist will contact you shortly.",
      aiEventType: "lead_capture"
    });

    const { error } = await supabase.from("contacts").insert({
      dealership_name: input.dealershipName || null,
      contact_person: input.contactPerson,
      phone: input.phone,
      email: input.email,
      message: input.message
    });

    if (error) throw error;

    await sendContactNotification({
      contactPerson: input.contactPerson,
      email: input.email,
      phone: input.phone,
      dealershipName: input.dealershipName,
      message: input.message
    });

    return NextResponse.json({ success: true, message: "Contact request submitted." });
  } catch (error) {
    console.error("Contact submission failed", error);
    return NextResponse.json(
      { message: "Contact submission failed. Please try again later." },
      { status: 500 }
    );
  }
}

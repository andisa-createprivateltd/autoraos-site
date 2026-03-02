import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { getSupabaseClient } from "@/lib/supabase";
import { hasSupabase } from "@/lib/env";
import { sendContactNotification } from "@/lib/email";
import { contactLeadStatus, captureLeadThread, ensureDealerAccount, mapLeadSource } from "@/lib/beta-capture";

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

  let mode: "live" | "fallback" = "fallback";

  if (hasSupabase()) {
    try {
      const supabase = getSupabaseClient();
      const dealerId = await ensureDealerAccount(supabase, {
        dealershipName: input.dealershipName,
        city: "Johannesburg",
        plan: input.groupSize === "20+" || input.groupSize === "6-20" ? "scale" : input.groupSize === "2-5" ? "growth" : "starter"
      });

      const leadMessage = [
        `Group size: ${input.groupSize}`,
        `Role: ${input.role}`,
        `Email: ${input.email}`,
        `Consent: ${input.consent ? "Yes" : "No"}`,
        "",
        input.message
      ].join("\n");

      await captureLeadThread(supabase, {
        dealerId,
        source: mapLeadSource("website"),
        name: input.role,
        phone: input.phone,
        status: contactLeadStatus(),
        leadMessage,
        responseMessage: "Thanks for your enquiry. An AUTORA OS specialist will contact you shortly.",
        aiEventType: "lead_capture",
        aiEventMeta: {
          group_size: input.groupSize,
          role: input.role,
          consent: input.consent,
          email: input.email
        }
      });

      const { error } = await supabase.from("contacts").insert({
        dealership_name: input.dealershipName,
        contact_person: input.role,
        phone: input.phone,
        email: input.email,
        message: leadMessage
      });

      if (error) throw error;
      mode = "live";
    } catch (error) {
      console.error("Contact persistence failed, using fallback mode", error);
    }
  }

  try {
    await sendContactNotification({
      email: input.email,
      phone: input.phone,
      dealershipName: input.dealershipName,
      role: input.role,
      groupSize: input.groupSize,
      message: input.message
    });
  } catch (error) {
    console.error("Contact notification failed", error);
  }

  return NextResponse.json({
    success: true,
    message: "Contact request submitted.",
    mode
  });
}

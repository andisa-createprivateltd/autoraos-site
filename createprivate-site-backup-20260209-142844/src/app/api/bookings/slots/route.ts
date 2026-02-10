import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { generateSlots, loadAvailabilityWindows } from "@/lib/scheduling";

export async function GET() {
  try {
    const windows = await loadAvailabilityWindows();
    const slots = generateSlots({ windows, days: 21, minLeadMinutes: 30 });

    let booked = new Set<string>();

    try {
      const supabase = getSupabaseClient();
      const toDate = slots.at(-1);
      if (toDate) {
        const { data } = await supabase
          .from("bookings")
          .select("scheduled_for,status")
          .gte("scheduled_for", new Date().toISOString())
          .lte("scheduled_for", toDate)
          .in("status", ["booked", "completed"]);
        booked = new Set((data || []).map((row) => row.scheduled_for));
      }
    } catch {
      booked = new Set<string>();
    }

    const available = slots
      .filter((slot) => !booked.has(slot))
      .slice(0, 150)
      .map((iso) => ({
        iso,
        label: new Date(iso).toLocaleString("en-ZA", {
          dateStyle: "full",
          timeStyle: "short"
        })
      }));

    return NextResponse.json({
      slots: available
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load slots.";
    return NextResponse.json({ message }, { status: 500 });
  }
}

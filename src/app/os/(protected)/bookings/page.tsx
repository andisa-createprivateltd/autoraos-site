import { BookingActions } from "@/components/os/booking-actions";
import { requireDealerSession } from "@/lib/dealer-session";
import { getUpcomingBookings } from "@/lib/os-data";

type BookingsPageSearchParams = {
  dealer?: string;
  window?: string;
  lead?: string;
};

export default async function OsBookingsPage({
  searchParams
}: {
  searchParams: BookingsPageSearchParams;
}) {
  const session = requireDealerSession();
  const dealerId = searchParams.dealer;
  const windowFilter = searchParams.window === "week" ? "week" : undefined;
  const leadId = searchParams.lead;

  const { bookings, mode } = await getUpcomingBookings({
    dealerId,
    window: windowFilter,
    leadId
  });

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.14em] text-tide">Bookings</p>
        <h1 className="mt-1 text-3xl font-semibold text-coal">Test drives, appointments, and call-backs</h1>
        <p className="mt-2 text-sm text-steel">Status model: Booked / Completed / No-show.</p>
        {mode === "sample" && session.role === "platform_owner" ? (
          <p className="mt-2 inline-flex rounded-full border border-amber-300 bg-amber-50 px-2 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-amber-800">
            Demo Mode
          </p>
        ) : null}
      </header>

      <section className="rounded-3xl border border-steel/12 bg-white p-6 shadow-sm">
        <div className="overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-steel/15 text-steel">
                <th className="px-3 py-2">Dealership</th>
                <th className="px-3 py-2">Brand</th>
                <th className="px-3 py-2">Contact</th>
                <th className="px-3 py-2">City</th>
                <th className="px-3 py-2">Date/Time</th>
                <th className="px-3 py-2">Lead source</th>
                <th className="px-3 py-2">Assigned salesperson</th>
                <th className="px-3 py-2">Notes</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-steel/10">
                  <td className="px-3 py-2 font-medium text-coal">{booking.dealershipName}</td>
                  <td className="px-3 py-2 text-steel">{booking.brand}</td>
                  <td className="px-3 py-2 text-steel">{booking.contactPerson}</td>
                  <td className="px-3 py-2 text-steel">{booking.city}</td>
                  <td className="px-3 py-2 text-steel">{new Date(booking.preferredDateTime).toLocaleString("en-ZA")}</td>
                  <td className="px-3 py-2 text-steel">{booking.source}</td>
                  <td className="px-3 py-2 text-steel">{booking.assignedTo}</td>
                  <td className="px-3 py-2 text-steel">{booking.notes}</td>
                  <td className="px-3 py-2">
                    <span className="rounded-full border border-steel/20 px-2 py-1 text-xs font-semibold text-coal">
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <BookingActions bookingId={booking.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

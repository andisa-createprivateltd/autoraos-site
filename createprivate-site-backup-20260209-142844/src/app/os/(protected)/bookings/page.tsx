import { requireDealerSession } from "@/lib/dealer-session";
import { getUpcomingBookings } from "@/lib/os-data";

export default async function OsBookingsPage() {
  requireDealerSession();

  const { bookings, mode } = await getUpcomingBookings();

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.14em] text-tide">Bookings</p>
        <h1 className="mt-1 text-3xl font-semibold text-coal">Test drives, appointments, and call-backs</h1>
        <p className="mt-2 text-sm text-steel">Status model: Booked / Completed / No-show.</p>
        {mode === "sample" ? <p className="mt-1 text-xs text-steel">Sample data mode.</p> : null}
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
                <th className="px-3 py-2">Status</th>
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
                  <td className="px-3 py-2">
                    <span className="rounded-full border border-steel/20 px-2 py-1 text-xs font-semibold text-coal">
                      {booking.status}
                    </span>
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

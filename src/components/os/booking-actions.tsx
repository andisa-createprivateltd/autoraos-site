"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type BookingAction = "confirm" | "reschedule" | "complete" | "no_show" | "send_reminder";

export function BookingActions({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function runAction(action: BookingAction) {
    setError("");
    startTransition(async () => {
      try {
        const response = await fetch("/api/os/bookings/action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            booking_id: bookingId,
            action
          })
        });

        const data = (await response.json()) as { message?: string };
        if (!response.ok) {
          throw new Error(data.message || "Action failed.");
        }

        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Action failed.");
      }
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => runAction("confirm")}
          className="rounded-full border border-steel/25 px-2 py-1 text-xs font-semibold text-coal hover:bg-mist/60 disabled:opacity-50"
          disabled={pending}
        >
          Confirm
        </button>
        <button
          type="button"
          onClick={() => runAction("reschedule")}
          className="rounded-full border border-steel/25 px-2 py-1 text-xs font-semibold text-coal hover:bg-mist/60 disabled:opacity-50"
          disabled={pending}
        >
          Reschedule
        </button>
        <button
          type="button"
          onClick={() => runAction("complete")}
          className="rounded-full border border-steel/25 px-2 py-1 text-xs font-semibold text-coal hover:bg-mist/60 disabled:opacity-50"
          disabled={pending}
        >
          Mark Completed
        </button>
        <button
          type="button"
          onClick={() => runAction("no_show")}
          className="rounded-full border border-steel/25 px-2 py-1 text-xs font-semibold text-coal hover:bg-mist/60 disabled:opacity-50"
          disabled={pending}
        >
          No-show
        </button>
        <button
          type="button"
          onClick={() => runAction("send_reminder")}
          className="rounded-full border border-tide/30 bg-tide/5 px-2 py-1 text-xs font-semibold text-tide hover:bg-tide/10 disabled:opacity-50"
          disabled={pending}
        >
          Send Reminder
        </button>
      </div>
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { AUTORA_WHATSAPP, BRANDS, PROVINCES } from "@/lib/constants";
import { formatDateTime, waLink } from "@/lib/utils";

type PrefillData = {
  dealershipName?: string;
  brand?: string;
  city?: string;
  province?: string;
};

type Slot = {
  iso: string;
  label: string;
};

type BookingResponse = {
  success: boolean;
  bookingId: string;
  message: string;
  booking: {
    dealershipName: string;
    preferredDateTime: string;
    brand: string;
    contactPerson: string;
  };
  whatsappConfirmationUrl: string;
};

export function BookingForm({ prefill }: { prefill?: PrefillData }) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [slotsError, setSlotsError] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<BookingResponse | null>(null);

  const [form, setForm] = useState({
    dealershipName: prefill?.dealershipName || "",
    brand: prefill?.brand && BRANDS.includes(prefill.brand as (typeof BRANDS)[number]) ? prefill.brand : "Chery",
    contactPerson: "",
    phone: "",
    email: "",
    province:
      prefill?.province && PROVINCES.includes(prefill.province as (typeof PROVINCES)[number])
        ? prefill.province
        : "Gauteng",
    city: prefill?.city || "",
    preferredDateTime: "",
    notes: "",
    honeypot: ""
  });

  useEffect(() => {
    let active = true;

    async function loadSlots() {
      setLoadingSlots(true);
      try {
        const response = await fetch("/api/bookings/slots", { cache: "no-store" });
        const data = (await response.json()) as { slots?: Slot[]; message?: string };

        if (!response.ok) {
          throw new Error(data.message || "Could not load available slots.");
        }

        if (active) {
          const incomingSlots = data.slots || [];
          setSlots(incomingSlots);
          setForm((prev) => ({
            ...prev,
            preferredDateTime: prev.preferredDateTime || incomingSlots[0]?.iso || ""
          }));
        }
      } catch (err) {
        if (active) {
          setSlotsError(true);
          setError(err instanceof Error ? err.message : "Could not load available slots.");
        }
      } finally {
        if (active) setLoadingSlots(false);
      }
    }

    loadSlots();
    return () => {
      active = false;
    };
  }, []);

  const summaryText = useMemo(() => {
    if (!form.dealershipName) return "Book your 15-minute session";
    return `Book a session for ${form.dealershipName}`;
  }, [form.dealershipName]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          source: prefill?.dealershipName ? "dealership_near_me" : "website"
        })
      });

      const data = (await response.json()) as BookingResponse & { message?: string };

      if (!response.ok) {
        throw new Error(data.message || "Booking failed. Please try again.");
      }

      setSuccess(data);
      setForm((prev) => ({
        ...prev,
        contactPerson: "",
        phone: "",
        email: "",
        notes: "",
        honeypot: ""
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-3xl border border-green-700/20 bg-green-50 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-green-700">Booking confirmed</p>
        <h3 className="mt-2 text-balance text-xl font-semibold text-coal">Your session is confirmed.</h3>
        <p className="mt-3 text-pretty text-sm text-steel">
          {success.booking.dealershipName} ({success.booking.brand}) on {formatDateTime(success.booking.preferredDateTime)}.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={success.whatsappConfirmationUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-black"
          >
            Send confirmation on WhatsApp
          </a>
          <a href="/pricing" className="inline-flex rounded-full border border-steel/25 px-5 py-3 text-sm font-semibold text-coal">
            View pricing options
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-steel/15 bg-white p-6 shadow-soft">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-tide">Audit Session</p>
        <h2 className="mt-2 text-balance text-2xl font-semibold text-coal">{summaryText}</h2>
        <p className="mt-2 text-pretty text-sm text-steel">Choose an available 15-minute slot and share your dealership details.</p>
      </div>

      <input
        type="text"
        value={form.honeypot}
        onChange={(event) => setForm((prev) => ({ ...prev, honeypot: event.target.value }))}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Dealership name" required>
          <input
            required
            value={form.dealershipName}
            onChange={(event) => setForm((prev) => ({ ...prev, dealershipName: event.target.value }))}
            className="input"
            placeholder="e.g. Chery Midrand"
          />
        </Field>

        <Field label="Contact person" required>
          <input
            required
            value={form.contactPerson}
            onChange={(event) => setForm((prev) => ({ ...prev, contactPerson: event.target.value }))}
            className="input"
            placeholder="Full name"
          />
        </Field>

        <Field label="Phone" required>
          <input
            required
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            className="input"
            placeholder="+27 ..."
          />
        </Field>

        <Field label="Email" required>
          <input
            type="email"
            required
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            className="input"
            placeholder="dealer@company.com"
          />
        </Field>

        <Field label="Brand" required>
          <select
            value={form.brand}
            onChange={(event) => setForm((prev) => ({ ...prev, brand: event.target.value }))}
            className="input"
            required
          >
            {BRANDS.filter((brand) => brand !== "All").map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Preferred date/time" required>
          {loadingSlots ? (
            <div className="input flex items-center text-sm text-steel">Loading available slots…</div>
          ) : slots.length > 0 ? (
            <select
              required
              value={form.preferredDateTime}
              onChange={(event) => setForm((prev) => ({ ...prev, preferredDateTime: event.target.value }))}
              className="input"
            >
              {slots.map((slot) => (
                <option key={slot.iso} value={slot.iso}>
                  {slot.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="datetime-local"
              required
              className="input"
              onChange={(event) => {
                const local = event.target.value;
                const iso = local ? new Date(local).toISOString() : "";
                setForm((prev) => ({ ...prev, preferredDateTime: iso }));
              }}
            />
          )}
        </Field>
      </div>

      {slotsError ? (
        <div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
          <p>Could not load available slots.</p>
          <a
            href={waLink(AUTORA_WHATSAPP, "Hi AUTORA, I'd like to book a 15-minute dealer audit.")}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex rounded-full bg-[#25D366] px-4 py-2 text-xs font-semibold text-black"
          >
            Tap to WhatsApp us now
          </a>
        </div>
      ) : null}

      <Field label="Notes (optional)">
        <textarea
          value={form.notes}
          onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
          className="input min-h-28"
          placeholder="Anything we should review before the call?"
        />
      </Field>

      {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-full bg-ember px-5 py-3 text-sm font-semibold text-white transition hover:bg-ember/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Booking..." : "Confirm Session"}
      </button>

      <p className="text-center text-xs text-steel">
        No obligation. Operational review only.
      </p>

      <p className="text-xs text-steel">
        Optional WhatsApp confirmation available after submission. For direct chat now, use {" "}
        <a
          href={waLink(AUTORA_WHATSAPP, "Hi AUTORA, I need help with lead generation.")}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-tide underline underline-offset-2"
        >
          click-to-chat
        </a>
        .
      </p>
    </form>
  );
}

function Field({
  label,
  required,
  children
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1 text-sm font-medium text-coal">
      <span>
        {label}
        {required ? " *" : ""}
      </span>
      {children}
    </label>
  );
}

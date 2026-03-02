"use client";

import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { trackMarketingEvent } from "@/lib/analytics";

type ContactState = {
  dealershipName: string;
  groupSize: "1" | "2-5" | "6-20" | "20+";
  role: string;
  phone: string;
  email: string;
  message: string;
  consent: boolean;
  honeypot: string;
};

const initialState: ContactState = {
  dealershipName: "",
  groupSize: "1",
  role: "",
  phone: "",
  email: "",
  message: "",
  consent: false,
  honeypot: ""
};

export function ContactForm() {
  const [form, setForm] = useState<ContactState>(initialState);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess(false);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(data.message || "Could not submit contact request.");
      }

      trackMarketingEvent("contact_form_submit", {
        location: "contact_page",
        group_size: form.groupSize
      });
      setSuccess(true);
      setForm(initialState);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit contact request.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-black/10 bg-white p-6 shadow-[0_16px_34px_rgba(8,13,18,0.06)]">
      <input
        type="text"
        value={form.honeypot}
        onChange={(event) => setForm((prev) => ({ ...prev, honeypot: event.target.value }))}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
      />

      <Field label="Dealership or group name" required>
        <input
          required
          value={form.dealershipName}
          onChange={(event) => setForm((prev) => ({ ...prev, dealershipName: event.target.value }))}
          className="input"
          placeholder="Dealer group or dealership name"
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Group size" required>
          <select
            value={form.groupSize}
            onChange={(event) => setForm((prev) => ({ ...prev, groupSize: event.target.value as ContactState["groupSize"] }))}
            className="input"
            required
          >
            <option value="1">1 location</option>
            <option value="2-5">2-5 locations</option>
            <option value="6-20">6-20 locations</option>
            <option value="20+">20+ locations</option>
          </select>
        </Field>

        <Field label="Role" required>
          <input
            required
            value={form.role}
            onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
            className="input"
            placeholder="Dealer principal, sales manager, COO"
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Phone" required>
          <input
            required
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            className="input"
            placeholder="+27 70 352 1316"
            inputMode="tel"
          />
        </Field>

        <Field label="Email" required>
          <input
            type="email"
            required
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            className="input"
            placeholder="name@dealership.co.za"
          />
        </Field>
      </div>

      <Field label="What needs fixing?" required>
        <textarea
          required
          value={form.message}
          onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
          className="input min-h-36"
          placeholder="Describe your current lead flow, WhatsApp handling, response pressure, or rollout requirement."
        />
      </Field>

      <label className="flex items-start gap-3 rounded-2xl border border-black/10 bg-mist/45 p-4 text-sm text-steel">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(event) => setForm((prev) => ({ ...prev, consent: event.target.checked }))}
          className="mt-0.5 h-4 w-4 rounded border-black/20"
          required
        />
        <span>
          I consent to AUTORA OS processing this request in line with POPIA and contacting me about this enquiry.
        </span>
      </label>

      {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      {success ? (
        <div className="rounded-xl border border-black/10 bg-mist/55 p-4 text-sm text-coal">
          Request received. We will confirm receipt by email and route your enquiry to the right implementation path.
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-full bg-coal px-5 py-3 text-sm font-semibold text-white hover:bg-black disabled:opacity-70"
      >
        {isSubmitting ? "Submitting..." : "Submit Request"}
      </button>
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
    <label className="block space-y-1.5 text-sm font-medium text-coal">
      <span>
        {label}
        {required ? " *" : ""}
      </span>
      {children}
    </label>
  );
}

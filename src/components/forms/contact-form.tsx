"use client";

import { useState } from "react";
import type { FormEvent, ReactNode } from "react";

type ContactState = {
  dealershipName: string;
  contactPerson: string;
  phone: string;
  email: string;
  message: string;
  honeypot: string;
};

export function ContactForm() {
  const [form, setForm] = useState<ContactState>({
    dealershipName: "",
    contactPerson: "",
    phone: "",
    email: "",
    message: "",
    honeypot: ""
  });
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

      setSuccess(true);
      setForm((prev) => ({ ...prev, contactPerson: "", phone: "", email: "", message: "", honeypot: "" }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit contact request.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-steel/15 bg-white p-6 shadow-soft">
      <input
        type="text"
        value={form.honeypot}
        onChange={(event) => setForm((prev) => ({ ...prev, honeypot: event.target.value }))}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
      />

      <Field label="Dealership name (optional)">
        <input
          value={form.dealershipName}
          onChange={(event) => setForm((prev) => ({ ...prev, dealershipName: event.target.value }))}
          className="input"
          placeholder="Your dealership"
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
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
      </div>

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

      <Field label="How can we help?" required>
        <textarea
          required
          value={form.message}
          onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
          className="input min-h-32"
          placeholder="Tell us your monthly lead target, models, and current ad channels."
        />
      </Field>

      {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      {success ? <p className="rounded-xl bg-green-50 p-3 text-pretty text-sm text-green-700">Thanks — we&apos;ll reply within 24 hours.</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-full bg-ember px-5 py-3 text-sm font-semibold text-white hover:bg-ember/90 disabled:opacity-70"
      >
        {isSubmitting ? "Sending..." : "Send Enquiry"}
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
    <label className="block space-y-1 text-sm font-medium text-coal">
      <span>
        {label}
        {required ? " *" : ""}
      </span>
      {children}
    </label>
  );
}

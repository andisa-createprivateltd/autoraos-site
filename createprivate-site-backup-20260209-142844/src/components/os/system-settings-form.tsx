"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

const STORAGE_KEY = "dealer-os-system-settings";

type SystemSettings = {
  whatsappNumber: string;
  timezone: string;
  billingPlan: string;
  bookingAvailability: string;
};

const defaultState: SystemSettings = {
  whatsappNumber: "+27 82 000 0000",
  timezone: "Africa/Johannesburg",
  billingPlan: "Growth",
  bookingAvailability: "Mon-Fri 08:00-17:00"
};

export function SystemSettingsForm() {
  const [form, setForm] = useState<SystemSettings>(defaultState);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as SystemSettings;
      setForm({ ...defaultState, ...parsed });
    } catch {
      // ignore malformed local storage values
    }
  }, []);

  function save() {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div className="space-y-4 rounded-3xl border border-steel/12 bg-white p-6 shadow-sm">
      <Field label="WhatsApp Number">
        <input
          className="input"
          value={form.whatsappNumber}
          onChange={(event) => setForm((prev) => ({ ...prev, whatsappNumber: event.target.value }))}
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Timezone">
          <input
            className="input"
            value={form.timezone}
            onChange={(event) => setForm((prev) => ({ ...prev, timezone: event.target.value }))}
          />
        </Field>

        <Field label="Billing Plan">
          <select
            className="input"
            value={form.billingPlan}
            onChange={(event) => setForm((prev) => ({ ...prev, billingPlan: event.target.value }))}
          >
            <option value="Starter">Starter</option>
            <option value="Growth">Growth</option>
            <option value="Scale">Scale</option>
          </select>
        </Field>
      </div>

      <Field label="Booking Availability">
        <input
          className="input"
          value={form.bookingAvailability}
          onChange={(event) => setForm((prev) => ({ ...prev, bookingAvailability: event.target.value }))}
        />
      </Field>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          className="rounded-full bg-coal px-4 py-2 text-sm font-semibold text-white hover:bg-coal/90"
        >
          Save Settings
        </button>
        {saved ? <span className="text-xs font-semibold text-green-700">Saved</span> : null}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1 text-sm font-medium text-coal">
      <span>{label}</span>
      {children}
    </label>
  );
}

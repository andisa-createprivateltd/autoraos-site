"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

const STORAGE_KEY = "dealer-os-assistant-settings";

type AssistantSettings = {
  businessHours: string;
  faqs: string;
  bookingRules: string;
  escalationLogic: string;
};

const defaultState: AssistantSettings = {
  businessHours: "Mon-Fri 08:00-17:00",
  faqs: "Models: Chery Tiggo 4 Pro, Tiggo 7 Pro, Tiggo 8 Pro. Finance options available.",
  bookingRules: "Offer 15-minute slots only. Confirm with dealership and brand context.",
  escalationLogic: "Escalate to human when buyer requests pricing negotiation or urgent call-back."
};

export function AssistantSettingsForm() {
  const [form, setForm] = useState<AssistantSettings>(defaultState);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as AssistantSettings;
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
      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <p className="text-sm text-steel">
            Dealers can edit content controls below. Enforcement architecture, routing, and audit policies remain
            controlled by the platform.
          </p>

          <Field label="Business hours">
            <input
              className="input"
              value={form.businessHours}
              onChange={(event) => setForm((prev) => ({ ...prev, businessHours: event.target.value }))}
            />
          </Field>

          <Field label="FAQs">
            <textarea
              className="input min-h-24"
              value={form.faqs}
              onChange={(event) => setForm((prev) => ({ ...prev, faqs: event.target.value }))}
            />
          </Field>

          <Field label="Booking rules">
            <textarea
              className="input min-h-20"
              value={form.bookingRules}
              onChange={(event) => setForm((prev) => ({ ...prev, bookingRules: event.target.value }))}
            />
          </Field>

          <Field label="Escalation logic">
            <textarea
              className="input min-h-20"
              value={form.escalationLogic}
              onChange={(event) => setForm((prev) => ({ ...prev, escalationLogic: event.target.value }))}
            />
          </Field>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={save}
              className="rounded-full bg-coal px-4 py-2 text-sm font-semibold text-white hover:bg-coal/90"
            >
              Save Content
            </button>
            {saved ? <span className="text-xs font-semibold text-green-700">Saved</span> : null}
          </div>
        </div>

        <div className="space-y-3 rounded-3xl border border-steel/12 bg-mist/35 p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-coal">Enforcement controls</p>
            <span className="rounded-full border border-steel/20 bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-coal">
              System controlled
            </span>
          </div>

          <LockedField label="First response SLA">
            <div className="input bg-mist/60 text-steel">Target set by policy engine and canonical SLA tables.</div>
          </LockedField>

          <LockedField label="Escalation ladder">
            <div className="input bg-mist/60 text-steel">Stage routing, manager escalation, and breach actions are immutable here.</div>
          </LockedField>

          <LockedField label="Audit enforcement">
            <div className="input bg-mist/60 text-steel">Overrides, support actions, and breach closures are written to append-only audit logs.</div>
          </LockedField>

          <LockedField label="PII governance">
            <div className="input bg-mist/60 text-steel">Marketing-role redaction and tenant isolation are controlled by RLS and server policy.</div>
          </LockedField>
        </div>
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

function LockedField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-coal">{label}</p>
      {children}
    </div>
  );
}

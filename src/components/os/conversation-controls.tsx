"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type AssignableUser = {
  id: string;
  name: string;
  role: string;
};

const QUICK_REPLIES = [
  { label: "Finance", text: "We can assist with finance options. Share your preferred monthly budget and we will prepare a quote." },
  { label: "Trade-in", text: "We can include your trade-in. Send your current vehicle model, year, and mileage for a quick estimate." },
  { label: "Location", text: "Our dealership is ready to assist. We can share the location pin and operating hours if needed." },
  { label: "Book Test Drive", text: "We can secure your test-drive slot. Please share your preferred day and time." }
] as const;

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Hot" },
  { value: "booked", label: "Booked" },
  { value: "visited", label: "Visited" },
  { value: "sold", label: "Sold" },
  { value: "lost", label: "Lost" }
] as const;

type ConversationControlsProps = {
  conversationId: string;
  leadId: string;
  currentStatus: "New" | "Contacted" | "Booked" | "Visited" | "Sold" | "Lost";
  assignedUserId: string | null;
  assignableUsers: AssignableUser[];
  aiEnabled: boolean;
  lastResponseTime: string;
};

function normalizeStatus(status: ConversationControlsProps["currentStatus"]) {
  return status.toLowerCase();
}

export function ConversationControls({
  conversationId,
  leadId,
  currentStatus,
  assignedUserId,
  assignableUsers,
  aiEnabled,
  lastResponseTime
}: ConversationControlsProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const [localAiEnabled, setLocalAiEnabled] = useState(aiEnabled);

  function updateLead(payload: { status?: string; assigned_user_id?: string | null }) {
    setError("");
    startTransition(async () => {
      try {
        const response = await fetch("/api/os/leads/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lead_id: leadId,
            ...payload
          })
        });

        const data = (await response.json()) as { message?: string };
        if (!response.ok) throw new Error(data.message || "Update failed.");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Update failed.");
      }
    });
  }

  function sendQuickReply(content: string) {
    setError("");
    startTransition(async () => {
      try {
        const response = await fetch("/api/os/messages/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversation_id: conversationId,
            lead_id: leadId,
            content
          })
        });

        const data = (await response.json()) as { message?: string };
        if (!response.ok) throw new Error(data.message || "Send failed.");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Send failed.");
      }
    });
  }

  function toggleAi() {
    const nextValue = !localAiEnabled;
    setError("");
    setLocalAiEnabled(nextValue);

    startTransition(async () => {
      try {
        const response = await fetch("/api/os/conversations/handoff", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversation_id: conversationId,
            lead_id: leadId,
            enabled: nextValue,
            reason: nextValue ? "AI re-enabled from inbox" : "Manual handoff from inbox"
          })
        });

        const data = (await response.json()) as { message?: string };
        if (!response.ok) throw new Error(data.message || "AI toggle failed.");
        router.refresh();
      } catch (err) {
        setLocalAiEnabled(!nextValue);
        setError(err instanceof Error ? err.message : "AI toggle failed.");
      }
    });
  }

  return (
    <div className="mt-4 space-y-3 rounded-2xl border border-steel/12 bg-mist/30 p-3">
      <div className="grid gap-2 md:grid-cols-2">
        <label className="text-xs font-semibold uppercase tracking-[0.12em] text-steel">
          Lead Status
          <select
            className="input mt-1"
            defaultValue={normalizeStatus(currentStatus)}
            onChange={(event) => updateLead({ status: event.target.value })}
            disabled={pending}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs font-semibold uppercase tracking-[0.12em] text-steel">
          Assign Salesperson
          <select
            className="input mt-1"
            defaultValue={assignedUserId || "unassigned"}
            onChange={(event) =>
              updateLead({
                assigned_user_id: event.target.value === "unassigned" ? null : event.target.value
              })
            }
            disabled={pending}
          >
            <option value="unassigned">Unassigned</option>
            {assignableUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-steel">Quick Replies</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {QUICK_REPLIES.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => sendQuickReply(item.text)}
              className="rounded-full border border-steel/25 px-2 py-1 text-xs font-semibold text-coal hover:bg-white disabled:opacity-50"
              disabled={pending}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={toggleAi}
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${
            localAiEnabled ? "border-tide/30 bg-tide/10 text-tide" : "border-steel/25 bg-white text-coal"
          }`}
          disabled={pending}
        >
          AI {localAiEnabled ? "On" : "Off"}
        </button>
        <p className="text-xs text-steel">Last response time: {lastResponseTime}</p>
      </div>

      {error ? <p className="text-xs text-red-700">{error}</p> : null}
    </div>
  );
}

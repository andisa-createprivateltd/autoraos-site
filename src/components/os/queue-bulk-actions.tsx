"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type QueueBulkActionsProps = {
  leads: Array<{ id: string; name: string; dealershipName: string }>;
  assignableUsers: Array<{ id: string; name: string }>;
};

export function QueueBulkActions({ leads, assignableUsers }: QueueBulkActionsProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [action, setAction] = useState<"assign_selected" | "mark_contacted" | "send_template_reminder">("assign_selected");
  const [assignedUserId, setAssignedUserId] = useState<string>(assignableUsers[0]?.id || "");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const selectedLeads = useMemo(() => leads.filter((lead) => selectedIds.includes(lead.id)), [leads, selectedIds]);

  function toggleLead(id: string) {
    setSelectedIds((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]));
  }

  function submit() {
    setError("");
    startTransition(async () => {
      try {
        const response = await fetch("/api/os/queue/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lead_ids: selectedIds,
            action,
            assigned_user_id: action === "assign_selected" ? assignedUserId || null : undefined
          })
        });

        const payload = (await response.json()) as { message?: string };
        if (!response.ok) throw new Error(payload.message || "Bulk action failed.");

        setSelectedIds([]);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Bulk action failed.");
      }
    });
  }

  if (!leads.length) return null;

  return (
    <div className="rounded-3xl border border-steel/12 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-steel">Bulk actions</p>
          <p className="text-sm text-coal">Operate on selected leads in the current page scope.</p>
        </div>
        <p className="text-xs text-steel">{selectedIds.length} selected</p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {leads.map((lead) => (
          <button
            key={lead.id}
            type="button"
            onClick={() => toggleLead(lead.id)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
              selectedIds.includes(lead.id)
                ? "border-coal bg-coal text-white"
                : "border-steel/20 text-coal hover:bg-mist/50"
            }`}
          >
            {lead.name} · {lead.dealershipName}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <select className="input" value={action} onChange={(event) => setAction(event.target.value as typeof action)}>
          <option value="assign_selected">Assign selected</option>
          <option value="mark_contacted">Mark contacted</option>
          <option value="send_template_reminder">Send template reminder</option>
        </select>

        <select
          className="input"
          value={assignedUserId}
          onChange={(event) => setAssignedUserId(event.target.value)}
          disabled={action !== "assign_selected"}
        >
          {assignableUsers.length ? (
            assignableUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))
          ) : (
            <option value="">No assignable users</option>
          )}
        </select>

        <button
          type="button"
          onClick={submit}
          disabled={pending || !selectedLeads.length || (action === "assign_selected" && !assignedUserId)}
          className="rounded-full bg-coal px-4 py-2 text-sm font-semibold text-white hover:bg-coal/90 disabled:opacity-50"
        >
          Apply
        </button>
      </div>

      {error ? <p className="mt-2 text-xs text-red-700">{error}</p> : null}
    </div>
  );
}

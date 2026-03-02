import { ConversationControls } from "@/components/os/conversation-controls";
import { getCanonicalAssignableUsers, getCanonicalInboxThreads } from "@/lib/autora-dashboard";
import { requireDealerSession, sanitizeDealerIdForSession } from "@/lib/dealer-session";

type ConversationsSearchParams = {
  dealer?: string | string[];
  lead?: string | string[];
};

function getSingleSearchParam(value?: string | string[]) {
  if (!value) return undefined;
  if (Array.isArray(value)) return value[0];
  return value;
}

function normalizeDealerId(value?: string | string[]) {
  const normalized = getSingleSearchParam(value)?.trim();
  if (!normalized || normalized.toLowerCase() === "all") return undefined;
  return normalized;
}

export default async function OsConversationsPage({
  searchParams
}: {
  searchParams: Promise<ConversationsSearchParams>;
}) {
  const session = await requireDealerSession();
  const params = await searchParams;
  const dealerId = sanitizeDealerIdForSession(session, normalizeDealerId(params.dealer));
  const leadId = getSingleSearchParam(params.lead)?.trim() || undefined;

  const [{ threads }, assignableUsers] = await Promise.all([
    getCanonicalInboxThreads(session, { dealerId, leadId }),
    getCanonicalAssignableUsers(session, dealerId)
  ]);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.14em] text-tide">Inbox</p>
        <h1 className="mt-1 text-3xl font-semibold text-coal">Urgency Inbox Control</h1>
        <p className="mt-2 text-sm text-steel">
          Prioritize by revenue risk, enforce response discipline, and maintain assignment accountability.
        </p>
      </header>

      {threads.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {threads.map((thread) => (
            <article key={thread.id} className="rounded-3xl border border-steel/12 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-coal px-3 py-1 text-xs font-semibold text-white">{thread.tag}</span>
                <span className="rounded-full border border-steel/20 px-3 py-1 text-xs font-semibold text-coal">{thread.source}</span>
                <span className="rounded-full border border-steel/20 px-3 py-1 text-xs font-semibold text-coal">{thread.channel}</span>
              </div>

              <h2 className="mt-3 text-lg font-semibold text-coal">{thread.leadName}</h2>
              <p className="mt-1 text-xs text-steel">Last activity: {new Date(thread.lastActivity).toLocaleString("en-ZA")}</p>

              <div className="mt-4 space-y-2">
                {thread.messages.map((message, index) => (
                  <div
                    key={`${thread.id}-msg-${index}`}
                    className={`rounded-2xl px-3 py-2 text-sm ${
                      message.speaker === "AI"
                        ? "bg-mist text-coal"
                        : message.speaker === "Lead"
                          ? "bg-white border border-steel/20 text-coal"
                          : "bg-tide/10 text-coal"
                    }`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-steel">{message.speaker}</p>
                    <p className="mt-1">{message.text}</p>
                  </div>
                ))}
              </div>

              <ConversationControls
                conversationId={thread.id}
                leadId={thread.leadId}
                currentStatus={thread.status}
                assignedUserId={thread.assignedUserId}
                assignableUsers={assignableUsers}
                aiEnabled={thread.aiEnabled}
                lastResponseTime={thread.lastResponseTime}
              />
            </article>
          ))}
        </div>
      ) : (
        <section className="rounded-3xl border border-steel/12 bg-white p-6 text-sm text-steel shadow-sm">
          No inbox threads found for the selected filters.
        </section>
      )}
    </div>
  );
}

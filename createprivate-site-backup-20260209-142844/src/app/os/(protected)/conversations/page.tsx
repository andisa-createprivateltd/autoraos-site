import { requireDealerSession } from "@/lib/dealer-session";
import { getConversationThreads } from "@/lib/os-data";

export default async function OsConversationsPage() {
  requireDealerSession();

  const { threads, mode } = await getConversationThreads();

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.14em] text-tide">Conversations</p>
        <h1 className="mt-1 text-3xl font-semibold text-coal">WhatsApp-style lead inbox</h1>
        {mode === "sample" ? (
          <p className="mt-2 text-xs text-steel">Showing sample threads until live data is available.</p>
        ) : null}
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        {threads.map((thread) => (
          <article key={thread.id} className="rounded-3xl border border-steel/12 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-coal px-3 py-1 text-xs font-semibold text-white">{thread.tag}</span>
              <span className="rounded-full border border-steel/20 px-3 py-1 text-xs font-semibold text-coal">
                {thread.source}
              </span>
              <span className="rounded-full border border-steel/20 px-3 py-1 text-xs font-semibold text-coal">
                {thread.channel}
              </span>
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
          </article>
        ))}
      </div>
    </div>
  );
}

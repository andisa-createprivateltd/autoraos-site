import { PanelCard, PublicSection } from "@/components/design/public-primitives";
import { LiveSystemPanel, OperationalSurfaceCard } from "@/components/marketing/operational-surfaces";
import { ButtonLink } from "@/components/ui/button-link";

const problemPoints = [
  "leads are not responded to fast enough",
  "follow-ups are inconsistent",
  "bookings are not confirmed",
  "accountability is unclear"
] as const;

const controlLayers = [
  {
    number: "01",
    title: "Intake",
    detail: "All leads are captured across WhatsApp, web, OEM feeds, and ads before the store can lose them in handoff."
  },
  {
    number: "02",
    title: "Enforcement",
    detail: "Every lead is assigned, timed, and escalated if it is not handled inside the required response window."
  },
  {
    number: "03",
    title: "Execution",
    detail: "Bookings are created, confirmed, and tracked to completion so the pipeline does not decay after contact."
  },
  {
    number: "04",
    title: "Visibility",
    detail: "Management sees where execution fails, where revenue is exposed, and where intervention is required in real time."
  }
] as const;

const controlItems = [
  "response time",
  "SLA compliance",
  "lead ownership",
  "booking execution",
  "escalation",
  "revenue exposure"
] as const;

const outcomeCards = [
  {
    value: "< 60s",
    label: "Median first response",
    note: "Measured across active deployments"
  },
  {
    value: "41%",
    label: "SLA breach reduction",
    note: "Measured after enforced escalation"
  },
  {
    value: "68%",
    label: "After-hours recovery",
    note: "Measured across governed inbound channels"
  },
  {
    value: "+18%",
    label: "Booking improvement",
    note: "Modeled from governed confirmation and follow-up control"
  }
] as const;

export async function HomeAudiV2() {
  return (
    <div>
      <PublicSection
        tone="dark"
        grid
        className="-mt-[82px] pt-[82px]"
        containerClassName="py-[clamp(84px,10vw,136px)]"
        testId="home-hero"
      >
        <div className="grid gap-12 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-end">
          <div className="max-w-[760px]" data-reveal>
            <p className="autora-eyebrow autora-eyebrow-light">Revenue control infrastructure · dealership networks</p>
            <h1 className="autora-display-heading mt-6 max-w-[760px] text-white">
              Revenue Control Infrastructure for Dealership Networks
            </h1>
            <div className="autora-copy autora-copy-light mt-8 max-w-[640px] border-t border-white/14 pt-6 text-[18px] leading-[1.75]">
              <p>
                AUTORA OS enforces how dealerships respond to, follow up on, and convert inbound demand into booked
                customers.
              </p>
              <p className="mt-5">
                It sits above CRM, DMS, and messaging systems — ensuring execution is not optional.
              </p>
            </div>
            <div className="mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <ButtonLink href="/request-audit" eventName="cta_request_audit_click" eventParams={{ location: "home_hero" }}>
                Request Revenue Audit
              </ButtonLink>
              <ButtonLink href="/platform" variant="ghost" className="sm:w-auto">
                View Platform
              </ButtonLink>
            </div>
          </div>

          <div data-reveal>
            <LiveSystemPanel
              eyebrow="Live system panel"
              title="Operational status"
              metrics={[
                { label: "Revenue at Risk", value: "R 412k", status: "Action Required", tone: "warning" },
                { label: "SLA Breach Risk", value: "18 stores", status: "Breach Risk", tone: "risk" },
                { label: "Urgent Leads Pending", value: "27 leads", status: "Action Required", tone: "warning" },
                { label: "Execution Required", value: "14 bookings", status: "Non-Compliant", tone: "risk" }
              ]}
              footer="Governance remains visible while opportunities are still recoverable. Leadership does not wait for a month-end report to see the break." 
            />
          </div>
        </div>
      </PublicSection>

      <PublicSection tone="light" className="py-[104px]" testId="home-problem">
        <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div data-reveal>
            <p className="autora-eyebrow autora-eyebrow-dark">The problem</p>
            <h2 className="autora-section-heading mt-6 max-w-[620px] text-black">
              Dealerships do not lose revenue due to lack of demand.
              <br />
              They lose revenue because execution breaks.
            </h2>
          </div>
          <div data-reveal>
            <div className="grid gap-px border border-[#E8E6E1] bg-[#E8E6E1]">
              {problemPoints.map((point) => (
                <div key={point} className="bg-white px-6 py-5 font-sans-ap text-[15px] font-light leading-[1.85] text-[#3A3835]">
                  {point}
                </div>
              ))}
            </div>
            <p className="mt-8 font-sans-ap text-[16px] font-light leading-[1.85] text-[#3A3835]">
              Existing systems record activity.
            </p>
            <p className="mt-2 font-serif text-[30px] leading-[1.18] text-black">They do not enforce it.</p>
          </div>
        </div>
      </PublicSection>

      <PublicSection tone="dark" className="py-[104px]" testId="home-what-autora-does">
        <div className="mb-12 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div data-reveal>
            <p className="autora-eyebrow autora-eyebrow-light">What AUTORA does</p>
            <h2 className="autora-section-heading mt-6 max-w-[620px] text-white">
              AUTORA OS enforces execution across four layers.
            </h2>
          </div>
          <p className="autora-copy autora-copy-muted-light max-w-[640px] text-[15px] leading-[1.9]" data-reveal>
            The architecture is built to govern the path from inbound demand to attended booking. It does not sit beside
            operations. It controls the sequence inside them.
          </p>
        </div>
        <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-2 xl:grid-cols-4" data-reveal data-reveal-stagger>
          {controlLayers.map((layer) => (
            <PanelCard key={layer.number} tone="dark" className="border-0 rounded-none p-8">
              <p className="font-mono-ap text-[9px] uppercase tracking-[0.18em] text-white/28">Layer {layer.number}</p>
              <h3 className="mt-4 font-serif text-[30px] font-normal leading-[1.05] text-white">{layer.title}</h3>
              <p className="mt-4 font-sans-ap text-[14px] font-light leading-[1.85] text-white/54">{layer.detail}</p>
            </PanelCard>
          ))}
        </div>
      </PublicSection>

      <PublicSection tone="light" className="py-[104px]" testId="home-live-platform">
        <div className="mb-12 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div data-reveal>
            <p className="autora-eyebrow autora-eyebrow-dark">Live platform</p>
            <h2 className="autora-section-heading mt-6 max-w-[680px] text-black">Live operational environment</h2>
          </div>
          <p className="autora-copy autora-copy-muted-dark max-w-[640px] text-[15px] leading-[1.9]" data-reveal>
            These surfaces are where the work is controlled: urgency queue, response pressure, booking execution. The
            system shows where action is required before the opportunity decays.
          </p>
        </div>
        <div className="grid gap-6 xl:grid-cols-3" data-reveal data-reveal-stagger>
          <OperationalSurfaceCard
            eyebrow="Urgency queue"
            title="Timed queue control"
            rows={[
              { label: "Lead", value: "BYD test-drive request", tone: "default" },
              { label: "Timer", value: "Breached · 00m 42s", tone: "risk" },
              { label: "Escalation", value: "Manager route armed", tone: "muted" },
              { label: "Required", value: "Reply + booking action", tone: "safe" }
            ]}
            footer="Urgency is measured from message receipt, not from when someone remembers to check the inbox."
          />
          <OperationalSurfaceCard
            eyebrow="Inbox"
            title="Response pressure visible"
            rows={[
              { label: "Channel", value: "WhatsApp + web", tone: "default" },
              { label: "Owner", value: "Assigned · sales desk", tone: "default" },
              { label: "State", value: "Action required", tone: "risk" },
              { label: "Next", value: "Confirm intent and slot", tone: "muted" }
            ]}
            footer="The inbox is governed around ownership, not just message storage."
          />
          <OperationalSurfaceCard
            eyebrow="Booking execution"
            title="Completion stays governed"
            rows={[
              { label: "Booking", value: "Slot held · awaiting confirmation", tone: "default" },
              { label: "Reminder", value: "Queued for follow-up", tone: "muted" },
              { label: "Risk", value: "No-show pressure detected", tone: "risk" },
              { label: "Required", value: "Confirm attendance", tone: "safe" }
            ]}
            footer="Execution remains visible after the lead is answered, so revenue does not leak between contact and arrival."
          />
        </div>
      </PublicSection>

      <PublicSection tone="dark" className="py-[104px]" testId="home-operational-control">
        <div className="grid gap-12 lg:grid-cols-[0.84fr_1.16fr] lg:items-start">
          <div data-reveal>
            <p className="autora-eyebrow autora-eyebrow-light">Operational control</p>
            <h2 className="autora-section-heading mt-6 max-w-[620px] text-white">
              This is not reporting.
              <br />
              This is enforcement.
            </h2>
          </div>
          <div>
            <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-2" data-reveal data-reveal-stagger>
              {controlItems.map((item) => (
                <div key={item} className="bg-black px-6 py-5 font-sans-ap text-[15px] font-light leading-[1.8] text-white/64">
                  {item}
                </div>
              ))}
            </div>
            <p className="mt-8 autora-copy autora-copy-muted-light max-w-[720px] text-[15px] leading-[1.9]" data-reveal>
              AUTORA controls the parts of the dealership operation where margin is usually lost: ownership, timing,
              escalation, booking follow-through, and the point where leadership has to intervene.
            </p>
          </div>
        </div>
      </PublicSection>

      <PublicSection tone="light" className="py-[104px]" testId="home-outcomes">
        <div className="mb-12 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div data-reveal>
            <p className="autora-eyebrow autora-eyebrow-dark">Outcomes</p>
            <h2 className="autora-section-heading mt-6 max-w-[620px] text-black">Execution control changes revenue outcomes.</h2>
          </div>
          <p className="autora-copy autora-copy-muted-dark max-w-[640px] text-[15px] leading-[1.9]" data-reveal>
            Where measured deployment data exists, it is labeled as measured. Where the result depends on rollout scope,
            it is labeled as modeled. Either way, the commercial effect is tied to governed execution.
          </p>
        </div>
        <div className="grid gap-px border border-[#E8E6E1] bg-[#E8E6E1] md:grid-cols-2 xl:grid-cols-4" data-reveal data-reveal-stagger>
          {outcomeCards.map((item) => (
            <PanelCard key={item.label} className="border-0 rounded-none p-8">
              <p className="font-serif text-[clamp(2.7rem,4vw,4.8rem)] font-normal leading-none text-black">{item.value}</p>
              <p className="mt-6 font-mono-ap text-[10px] uppercase tracking-[0.18em] text-[#9E9B95]">{item.label}</p>
              <p className="mt-3 font-sans-ap text-[14px] font-light leading-[1.8] text-[#3A3835]">{item.note}</p>
            </PanelCard>
          ))}
        </div>
      </PublicSection>

      <PublicSection tone="dark" className="py-[120px] text-center" testId="home-cta">
        <div className="mx-auto max-w-[760px]" data-reveal>
          <p className="autora-eyebrow autora-eyebrow-light justify-center">Revenue control infrastructure</p>
          <h2 className="autora-section-heading mt-6 text-white">
            If AUTORA disappeared,
            <br />
            <em>operations would break.</em>
          </h2>
          <p className="autora-copy autora-copy-muted-light mx-auto mt-6 max-w-[620px] text-[15px] leading-[1.9]">
            That is the point. The system exists to make response discipline, booking execution, escalation, and revenue
            control non-optional across the network.
          </p>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <ButtonLink href="/request-audit" eventName="cta_request_audit_click" eventParams={{ location: "home_close" }}>
              Request Revenue Audit
            </ButtonLink>
            <ButtonLink href="/enterprise" variant="ghost" className="sm:w-auto">
              Enterprise deployment
            </ButtonLink>
          </div>
        </div>
      </PublicSection>
    </div>
  );
}

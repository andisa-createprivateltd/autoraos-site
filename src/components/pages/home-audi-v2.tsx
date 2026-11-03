import { PublicSection } from "@/components/design/public-primitives";
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
        containerClassName="py-[clamp(92px,12vw,168px)]"
        testId="home-hero"
      >
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] lg:items-end lg:gap-20">
          <div className="max-w-[820px]" data-reveal>
            <p className="autora-eyebrow autora-eyebrow-light">Revenue control infrastructure · dealership networks</p>
            <h1 className="autora-display-heading mt-8 max-w-[820px] text-white">
              Revenue control
              <br />
              infrastructure for
              <br />
              <em>dealership networks.</em>
            </h1>
            <div className="autora-copy autora-copy-light mt-10 max-w-[650px] border-t border-white/20 pt-6 text-[17px] leading-[1.8]">
              <p>
                AUTORA OS enforces how dealerships respond to, follow up on, and convert inbound demand into booked
                customers.
              </p>
              <p className="mt-5 text-white/58">
                It sits above CRM, DMS, and messaging systems — ensuring execution is not optional.
              </p>
            </div>
            <div className="mt-11 flex flex-col items-stretch gap-5 sm:flex-row sm:flex-wrap sm:items-center">
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
              eyebrow="Control register / 01"
              title="Operational state"
              metrics={[
                { label: "Revenue at Risk", value: "R 412k", status: "Action Required", tone: "warning" },
                { label: "SLA Breach Risk", value: "18 stores", status: "Breach Risk", tone: "risk" },
                { label: "Urgent Leads Pending", value: "27 leads", status: "Action Required", tone: "warning" },
                { label: "Execution Required", value: "14 bookings", status: "Non-Compliant", tone: "risk" }
              ]}
              footer="A control register for the decisions that cannot wait for a month-end report."
            />
          </div>
        </div>
        <div className="mt-20 grid border-y border-white/15 text-white/48 sm:grid-cols-4" data-reveal>
          {[
            ["01", "inbound demand"],
            ["02", "response discipline"],
            ["03", "booking execution"],
            ["04", "network governance"]
          ].map(([number, label]) => (
            <div key={number} className="flex items-center gap-4 border-b border-white/10 py-4 last:border-0 sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-r-0">
              <span className="font-mono-ap text-[10px] text-[#d13a44]">{number}</span>
              <span className="font-mono-ap text-[9px] uppercase tracking-[0.18em]">{label}</span>
            </div>
          ))}
        </div>
      </PublicSection>

      <PublicSection tone="light" className="py-[clamp(96px,11vw,152px)]" testId="home-problem">
        <div className="grid gap-16 lg:grid-cols-[0.82fr_1.18fr] lg:gap-24">
          <div data-reveal>
            <p className="autora-eyebrow autora-eyebrow-dark">The problem / 01</p>
            <h2 className="autora-section-heading mt-8 max-w-[650px] text-black">
              Dealerships do not lose revenue due to lack of demand.
              <br />
              <em>They lose it when execution breaks.</em>
            </h2>
          </div>
          <div data-reveal>
            <div className="autora-index-list border-t border-[#c9c6c0]">
              {problemPoints.map((point, index) => (
                <div key={point} className="grid grid-cols-[44px_1fr] gap-5 border-b border-[#dcd9d3] py-5">
                  <span className="font-mono-ap text-[10px] tracking-[0.18em] text-[#b8202a]">0{index + 1}</span>
                  <span className="font-sans-ap text-[15px] font-light leading-[1.8] text-[#3a3835]">{point}</span>
                </div>
              ))}
            </div>
            <div className="mt-12 border-t border-[#c9c6c0] pt-6">
              <p className="font-sans-ap text-[16px] font-light leading-[1.8] text-[#3a3835]">Existing systems record activity.</p>
              <p className="mt-2 font-serif text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] text-black">They do not enforce it.</p>
            </div>
          </div>
        </div>
      </PublicSection>

      <PublicSection tone="dark" className="py-[clamp(96px,11vw,152px)]" testId="home-what-autora-does">
        <div className="grid gap-16 lg:grid-cols-[0.82fr_1.18fr] lg:gap-24">
          <div data-reveal>
            <p className="autora-eyebrow autora-eyebrow-light">What AUTORA does / 02</p>
            <h2 className="autora-section-heading mt-8 max-w-[650px] text-white">
              AUTORA OS enforces execution across four layers.
            </h2>
          </div>
          <div data-reveal>
            <p className="autora-copy autora-copy-muted-light max-w-[650px] text-[15px] leading-[1.9]">
              The architecture governs the path from inbound demand to attended booking. It does not sit beside
              operations. It controls the sequence inside them.
            </p>
            <div className="autora-layer-list mt-12 border-t border-white/20">
              {controlLayers.map((layer) => (
                <div key={layer.number} className="grid gap-5 border-b border-white/10 py-7 sm:grid-cols-[56px_180px_1fr] sm:items-start sm:gap-8">
                  <span className="font-mono-ap text-[10px] tracking-[0.18em] text-[#d13a44]">{layer.number}</span>
                  <h3 className="font-serif text-[30px] font-normal leading-none text-white">{layer.title}</h3>
                  <p className="max-w-[520px] font-sans-ap text-[14px] font-light leading-[1.8] text-white/54">{layer.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PublicSection>

      <PublicSection tone="light" className="py-[clamp(96px,11vw,152px)]" testId="home-live-platform">
        <div className="grid gap-16 lg:grid-cols-[0.82fr_1.18fr] lg:gap-24">
          <div data-reveal>
            <p className="autora-eyebrow autora-eyebrow-dark">Live operational environment / 03</p>
            <h2 className="autora-section-heading mt-8 max-w-[650px] text-black">Where the work is controlled.</h2>
          </div>
          <div data-reveal>
            <p className="autora-copy autora-copy-muted-dark max-w-[650px] text-[15px] leading-[1.9]">
              These are the operating surfaces for urgency, response pressure, and booking completion. No showcase
              layer. No demo state. The system shows where action is required before the opportunity decays.
            </p>
            <div className="mt-12 border-t border-[#c9c6c0]">
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
          </div>
        </div>
      </PublicSection>

      <PublicSection tone="dark" className="py-[clamp(96px,11vw,152px)]" testId="home-operational-control">
        <div className="grid gap-16 lg:grid-cols-[0.82fr_1.18fr] lg:gap-24">
          <div data-reveal>
            <p className="autora-eyebrow autora-eyebrow-light">Operational control / 04</p>
            <h2 className="autora-section-heading mt-8 max-w-[650px] text-white">
              This is not reporting.
              <br />
              <em>This is enforcement.</em>
            </h2>
          </div>
          <div data-reveal>
            <div className="autora-control-register border-t border-white/20">
              {controlItems.map((item, index) => (
                <div key={item} className="flex items-center justify-between gap-6 border-b border-white/10 py-5">
                  <span className="font-mono-ap text-[10px] tracking-[0.18em] text-[#d13a44]">0{index + 1}</span>
                  <span className="flex-1 font-sans-ap text-[15px] font-light text-white/70">{item}</span>
                  <span className="font-mono-ap text-[9px] uppercase tracking-[0.16em] text-white/28">governed</span>
                </div>
              ))}
            </div>
            <p className="mt-10 autora-copy autora-copy-muted-light max-w-[720px] text-[15px] leading-[1.9]">
              AUTORA controls the parts of the dealership operation where margin is usually lost: ownership, timing,
              escalation, booking follow-through, and the point where leadership has to intervene.
            </p>
          </div>
        </div>
      </PublicSection>

      <PublicSection tone="light" className="py-[clamp(96px,11vw,152px)]" testId="home-outcomes">
        <div className="grid gap-16 lg:grid-cols-[0.82fr_1.18fr] lg:gap-24">
          <div data-reveal>
            <p className="autora-eyebrow autora-eyebrow-dark">Outcomes / 05</p>
            <h2 className="autora-section-heading mt-8 max-w-[650px] text-black">Execution control changes revenue outcomes.</h2>
          </div>
          <div data-reveal>
            <p className="autora-copy autora-copy-muted-dark max-w-[650px] text-[15px] leading-[1.9]">
              Where measured deployment data exists, it is labeled as measured. Where the result depends on rollout
              scope, it is labeled as modeled. The commercial effect remains tied to governed execution.
            </p>
            <div className="autora-outcome-list mt-12 border-t border-[#c9c6c0]">
              {outcomeCards.map((item, index) => (
                <div key={item.label} className="grid gap-5 border-b border-[#dcd9d3] py-7 sm:grid-cols-[56px_160px_1fr] sm:items-center sm:gap-8">
                  <span className="font-mono-ap text-[10px] tracking-[0.18em] text-[#b8202a]">0{index + 1}</span>
                  <p className="font-serif text-[clamp(2.6rem,4vw,4.6rem)] leading-none text-black">{item.value}</p>
                  <div>
                    <p className="font-mono-ap text-[10px] uppercase tracking-[0.18em] text-[#77736d]">{item.label}</p>
                    <p className="mt-2 font-sans-ap text-[14px] font-light leading-[1.8] text-[#3a3835]">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PublicSection>

      <PublicSection tone="dark" className="py-[clamp(112px,14vw,190px)]" testId="home-cta">
        <div className="grid gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-24" data-reveal>
          <p className="autora-eyebrow autora-eyebrow-light">Revenue control infrastructure / close</p>
          <div>
            <h2 className="autora-section-heading max-w-[820px] text-white">
              If AUTORA disappeared,
              <br />
              <em>operations would break.</em>
            </h2>
            <p className="autora-copy autora-copy-muted-light mt-8 max-w-[650px] text-[15px] leading-[1.9]">
              That is the point. The system exists to make response discipline, booking execution, escalation, and
              revenue control non-optional across the network.
            </p>
            <div className="mt-11 flex flex-col items-stretch gap-5 sm:flex-row sm:flex-wrap sm:items-center">
              <ButtonLink href="/request-audit" eventName="cta_request_audit_click" eventParams={{ location: "home_close" }}>
                Request Revenue Audit
              </ButtonLink>
              <ButtonLink href="/enterprise" variant="ghost" className="sm:w-auto">
                Enterprise deployment
              </ButtonLink>
            </div>
          </div>
        </div>
      </PublicSection>
    </div>
  );
}

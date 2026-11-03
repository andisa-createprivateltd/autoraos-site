import Link from "next/link";
import { LiveSystemPanel, OperationalSurfaceCard } from "@/components/marketing/operational-surfaces";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { ButtonLink } from "@/components/ui/button-link";

const controlLayers = [
  {
    index: "01",
    title: "Intake",
    detail: "Every enquiry is captured across WhatsApp, web, OEM feeds, and paid demand before it disappears in handoff.",
    href: "/platform#inbox",
    image: "https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=1400&q=82"
  },
  {
    index: "02",
    title: "Enforcement",
    detail: "Every lead is assigned, timed, and escalated when the required response window is missed.",
    href: "/platform#dashboard",
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1400&q=82"
  },
  {
    index: "03",
    title: "Execution",
    detail: "Bookings are created, confirmed, and followed through to arrival instead of being left as activity in a CRM.",
    href: "/platform#leads-bookings",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=82"
  },
  {
    index: "04",
    title: "Visibility",
    detail: "Leadership sees where response discipline breaks, where revenue is exposed, and where intervention is required.",
    href: "/platform#insights",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=82"
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

const outcomes = [
  ["< 60s", "Median first response", "Measured across active deployments"],
  ["41%", "SLA breach reduction", "Measured after enforced escalation"],
  ["68%", "After-hours recovery", "Measured across governed inbound channels"],
  ["+18%", "Booking improvement", "Modeled from governed confirmation and follow-up control"]
] as const;

const operatingNotes = [
  ["Control note 01", "Response is a governed event", "A lead is not safely handled because it was seen. Ownership, timing, and the next action have to be explicit.", "/how-it-works"],
  ["Control note 02", "A booking is not complete until confirmed", "Execution continues after contact. Confirmation, reminders, and attendance are part of the revenue path.", "/platform#leads-bookings"],
  ["Control note 03", "Every override needs a trace", "Network leadership can only improve the operating model when exceptions remain visible and attributable.", "/security"]
] as const;

export async function HomeAudiV2() {
  return (
    <div className="volvo-home">
      <section className="volvo-hero" data-testid="home-hero">
        <div className="volvo-container volvo-hero__grid">
          <div className="volvo-hero__copy">
            <p className="volvo-overline volvo-overline--light">Revenue control infrastructure / dealership networks</p>
            <h1>Revenue control infrastructure for dealership networks.</h1>
            <p className="volvo-hero__intro">
              AUTORA OS enforces how dealerships respond to, follow up on, and convert inbound demand into booked customers.
            </p>
            <p className="volvo-hero__detail">
              It sits above CRM, DMS, and messaging systems, making execution visible, attributable, and non-optional.
            </p>
            <div className="volvo-hero__actions">
              <ButtonLink href="/request-audit" eventName="cta_request_audit_click" eventParams={{ location: "home_hero" }}>
                Request revenue audit
              </ButtonLink>
              <ButtonLink href="/platform" variant="ghost" className="volvo-link-button">
                View operations
              </ButtonLink>
            </div>
            <div className="volvo-hero__meta">
              <span>Inbound demand</span>
              <span>Response discipline</span>
              <span>Booking execution</span>
              <span>Network governance</span>
            </div>
          </div>

          <div className="volvo-hero__visual">
            <img
              src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1800&q=86"
              alt="Operations team reviewing a live control room"
              width="1800"
              height="1200"
            />
            <div className="volvo-hero__visual-caption">
              <span>Live operational environment</span>
              <span>Network state / representative readout</span>
            </div>
            <div className="volvo-hero__system">
              <LiveSystemPanel
                eyebrow="Operational readout"
                title="Operational status"
                metrics={[
                  { label: "Revenue at Risk", value: "R 412k", status: "Action Required", tone: "warning" },
                  { label: "SLA Breach Risk", value: "18 stores", status: "Breach Risk", tone: "risk" },
                  { label: "Urgent Leads Pending", value: "27 leads", status: "Action Required", tone: "warning" },
                  { label: "Execution Required", value: "14 bookings", status: "Non-Compliant", tone: "risk" }
                ]}
                footer="Representative control state. Connect deployment data for live network values."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="volvo-section volvo-section--paper" data-testid="home-problem">
        <div className="volvo-container volvo-split">
          <div>
            <p className="volvo-overline">01 / The operating problem</p>
            <h2>Control is what turns demand into revenue.</h2>
          </div>
          <div>
            <p className="volvo-lead">
              Dealerships do not lose revenue because demand is absent. They lose it when response, follow-up, booking,
              and accountability break between systems and people.
            </p>
            <div className="volvo-rule-list">
              <div><span>01</span><strong>Lead response is late</strong></div>
              <div><span>02</span><strong>Follow-up is inconsistent</strong></div>
              <div><span>03</span><strong>Bookings are not confirmed</strong></div>
              <div><span>04</span><strong>Ownership is unclear</strong></div>
            </div>
            <p className="volvo-statement">Existing systems record activity. They do not enforce it.</p>
          </div>
        </div>
      </section>

      <section className="volvo-section volvo-section--white" data-testid="home-what-autora-does">
        <div className="volvo-container">
          <div className="volvo-section-heading">
            <div>
              <p className="volvo-overline">02 / The control model</p>
              <h2>One operating layer from enquiry to attended booking.</h2>
            </div>
            <p className="volvo-copy">
              AUTORA governs the path across four layers. Each layer exists to make a failure visible before it becomes
              a lost customer or an unexplainable revenue variance.
            </p>
          </div>
          <ScrollReveal className="volvo-teaser-grid">
            {controlLayers.map((layer) => (
              <Link key={layer.index} href={layer.href} className="volvo-teaser">
                <img src={layer.image} alt={`${layer.title} control layer`} width="1400" height="900" loading="lazy" />
                <div className="volvo-teaser__shade" />
                <div className="volvo-teaser__content">
                  <span>{layer.index}</span>
                  <h3>{layer.title}</h3>
                  <p>{layer.detail}</p>
                  <span className="volvo-arrow-link">Read the control layer</span>
                </div>
              </Link>
            ))}
          </ScrollReveal>
        </div>
      </section>

      <section className="volvo-section volvo-section--blue" data-testid="home-live-platform">
        <div className="volvo-container">
          <div className="volvo-section-heading volvo-section-heading--light">
            <div>
              <p className="volvo-overline volvo-overline--light">03 / Live operational environment</p>
              <h2>Where the work is controlled.</h2>
            </div>
            <p className="volvo-copy">
              These are the surfaces used to govern urgency, response pressure, and booking completion. No showcase
              layer. No demo state.
            </p>
          </div>
          <ScrollReveal className="volvo-surface-grid">
            <OperationalSurfaceCard
              eyebrow="Urgency queue"
              title="Timed queue control"
              rows={[
                { label: "Lead", value: "BYD test-drive request", tone: "default" },
                { label: "Timer", value: "Breached / 00m 42s", tone: "risk" },
                { label: "Escalation", value: "Manager route armed", tone: "muted" },
                { label: "Required", value: "Reply + booking action", tone: "safe" }
              ]}
              footer="Urgency is measured from message receipt."
            />
            <OperationalSurfaceCard
              eyebrow="Inbox"
              title="Response pressure visible"
              rows={[
                { label: "Channel", value: "WhatsApp + web", tone: "default" },
                { label: "Owner", value: "Assigned / sales desk", tone: "default" },
                { label: "State", value: "Action required", tone: "risk" },
                { label: "Next", value: "Confirm intent and slot", tone: "muted" }
              ]}
              footer="The inbox is governed around ownership, not message storage."
            />
            <OperationalSurfaceCard
              eyebrow="Booking execution"
              title="Completion stays governed"
              rows={[
                { label: "Booking", value: "Slot held / awaiting confirmation", tone: "default" },
                { label: "Reminder", value: "Queued for follow-up", tone: "muted" },
                { label: "Risk", value: "No-show pressure detected", tone: "risk" },
                { label: "Required", value: "Confirm attendance", tone: "safe" }
              ]}
              footer="Execution continues after the lead is answered."
            />
          </ScrollReveal>
        </div>
      </section>

      <section className="volvo-section volvo-section--paper" data-testid="home-operational-control">
        <div className="volvo-container volvo-split">
          <div>
            <p className="volvo-overline">04 / Operational control</p>
            <h2>This is not reporting. This is enforcement.</h2>
          </div>
          <div>
            <p className="volvo-lead">
              AUTORA controls the parts of the dealership operation where margin is usually lost: ownership, timing,
              escalation, booking follow-through, and the point where leadership has to intervene.
            </p>
            <div className="volvo-control-list">
              {controlItems.map((item, index) => (
                <div key={item}><span>0{index + 1}</span><strong>{item}</strong><em>governed</em></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="volvo-section volvo-section--white" data-testid="home-outcomes">
        <div className="volvo-container">
          <div className="volvo-section-heading">
            <div>
              <p className="volvo-overline">05 / Outcomes</p>
              <h2>Measured control changes revenue outcomes.</h2>
            </div>
            <p className="volvo-copy">
              Measured deployment data is labeled as measured. Where the result depends on rollout scope, it is labeled
              as modeled. The commercial effect remains tied to governed execution.
            </p>
          </div>
          <ScrollReveal className="volvo-outcome-grid">
            {outcomes.map(([value, label, note]) => (
              <article key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
                <p>{note}</p>
              </article>
            ))}
          </ScrollReveal>
        </div>
      </section>

      <section className="volvo-section volvo-section--white volvo-news" data-testid="home-notes">
        <div className="volvo-container">
          <div className="volvo-section-heading">
            <div>
              <p className="volvo-overline">Operating notes</p>
              <h2>What the control layer makes visible.</h2>
            </div>
            <ButtonLink href="/how-it-works" variant="secondary" className="volvo-link-button volvo-link-button--dark">
              See how it works
            </ButtonLink>
          </div>
          <ScrollReveal className="volvo-news__list">
            {operatingNotes.map(([index, title, detail, href]) => (
              <article key={index}>
                <span>{index}</span>
                <h3>{title}</h3>
                <p>{detail}</p>
                <Link href={href} className="volvo-arrow-link volvo-arrow-link--dark">Read note</Link>
              </article>
            ))}
          </ScrollReveal>
        </div>
      </section>

      <section className="volvo-image-band">
        <img
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2200&q=86"
          alt="Vehicles moving through a connected transport network"
          width="2200"
          height="1100"
          loading="lazy"
        />
        <div className="volvo-image-band__overlay" />
        <div className="volvo-container volvo-image-band__content">
          <p className="volvo-overline volvo-overline--light">AUTORA OS / network command</p>
          <h2>Your brand. Your network. One governance layer.</h2>
          <p>Critical operating infrastructure for dealership groups that cannot leave execution to chance.</p>
        </div>
      </section>

      <section className="volvo-section volvo-section--navy volvo-final-cta" data-testid="home-cta">
        <div className="volvo-container volvo-final-cta__inner">
          <div>
            <p className="volvo-overline volvo-overline--light">Request a revenue audit</p>
            <h2>See where execution is breaking.</h2>
          </div>
          <div>
            <p>Start with the stores, channels, and booking paths where revenue is currently exposed.</p>
            <ButtonLink href="/request-audit" eventName="cta_request_audit_click" eventParams={{ location: "home_close" }}>
              Request revenue audit
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}

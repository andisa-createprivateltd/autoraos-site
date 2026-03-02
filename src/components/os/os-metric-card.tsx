import Link from "next/link";
import { AnimatedNumber } from "@/components/os/animated-number";

type OsMetricCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  alert?: boolean;
  href?: string;
};

function MetricCardBody({ label, value, hint, alert }: Omit<OsMetricCardProps, "href">) {
  return (
    <article
      className={`rounded-2xl border p-5 transition ${
        alert ? "border-ember/35 bg-[#fff7f3]" : "border-steel/12 bg-white"
      }`}
    >
      <p className="text-xs uppercase tracking-[0.14em] text-steel">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-coal">
        <AnimatedNumber value={value} />
      </p>
      {hint ? <p className="mt-2 text-xs text-steel">{hint}</p> : null}
    </article>
  );
}

export function OsMetricCard({ href, ...props }: OsMetricCardProps) {
  if (!href) {
    return <MetricCardBody {...props} />;
  }

  return (
    <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60">
      <MetricCardBody {...props} />
    </Link>
  );
}

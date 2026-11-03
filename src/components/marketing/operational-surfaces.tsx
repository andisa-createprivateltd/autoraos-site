import { cn } from "@/lib/utils";

type StatusTone = "risk" | "warning" | "neutral";

type MetricItem = {
  label: string;
  value: string;
  status: string;
  tone?: StatusTone;
};

type SurfaceRow = {
  label: string;
  value: string;
  tone?: "default" | "muted" | "risk" | "safe";
};

const statusClasses: Record<StatusTone, string> = {
  risk: "text-[#d13a44]",
  warning: "text-[#d6a75c]",
  neutral: "text-white/52"
};

const rowToneClasses = {
  default: "text-[#3a3835]",
  muted: "text-[#77736d]",
  risk: "text-[#b8202a]",
  safe: "text-[#3d775d]"
} as const;

export function LiveSystemPanel({
  title,
  eyebrow,
  metrics,
  footer
}: {
  title: string;
  eyebrow: string;
  metrics: readonly MetricItem[];
  footer?: string;
}) {
  return (
    <article className="autora-system-register">
      <div className="autora-system-register__head">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono-ap text-[9px] uppercase tracking-[0.22em] text-white/42">{eyebrow}</p>
          <span className="flex items-center gap-2 font-mono-ap text-[8px] uppercase tracking-[0.16em] text-white/38">
            <span className="h-1.5 w-1.5 bg-[#62c49e]" />
            live state
          </span>
        </div>
        <h3 className="mt-8 font-serif text-[clamp(2rem,4vw,3.25rem)] font-normal leading-none text-white">{title}</h3>
      </div>

      <div className="autora-system-register__rows">
        {metrics.map((metric, index) => (
          <div key={metric.label} className="autora-system-register__row">
            <span className="font-mono-ap text-[9px] tracking-[0.18em] text-[#d13a44]">0{index + 1}</span>
            <div className="min-w-0 flex-1">
              <p className="font-mono-ap text-[9px] uppercase tracking-[0.16em] text-white/42">{metric.label}</p>
              <p className="mt-2 font-serif text-[clamp(1.7rem,3vw,2.5rem)] leading-none text-white">{metric.value}</p>
            </div>
            <span className={cn("max-w-[110px] text-right font-mono-ap text-[8px] uppercase tracking-[0.14em]", statusClasses[metric.tone || "neutral"])}>
              {metric.status}
            </span>
          </div>
        ))}
      </div>

      {footer ? <p className="autora-system-register__foot">{footer}</p> : null}
    </article>
  );
}

export function OperationalSurfaceCard({
  eyebrow,
  title,
  rows,
  footer,
  className
}: {
  eyebrow: string;
  title: string;
  rows: readonly SurfaceRow[];
  footer?: string;
  className?: string;
}) {
  return (
    <article className={cn("autora-surface-register", className)}>
      <div className="grid gap-4 sm:grid-cols-[180px_1fr] sm:items-start sm:gap-8">
        <p className="font-mono-ap text-[9px] uppercase tracking-[0.2em] text-[#77736d]">{eyebrow}</p>
        <h3 className="font-serif text-[clamp(1.9rem,3vw,2.65rem)] font-normal leading-none text-black">{title}</h3>
      </div>
      <div className="autora-surface-register__rows">
        {rows.map((row) => (
          <div key={`${title}-${row.label}`} className="flex items-start justify-between gap-6 py-3">
            <span className="font-mono-ap text-[9px] uppercase tracking-[0.18em] text-[#9e9b95]">{row.label}</span>
            <span className={cn("text-right font-sans-ap text-[13px] font-light leading-[1.6]", rowToneClasses[row.tone || "default"])}>
              {row.value}
            </span>
          </div>
        ))}
      </div>
      {footer ? <p className="mt-5 max-w-[650px] font-sans-ap text-[13px] font-light leading-[1.75] text-[#77736d]">{footer}</p> : null}
    </article>
  );
}

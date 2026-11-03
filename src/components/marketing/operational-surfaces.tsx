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

const toneClasses: Record<StatusTone, string> = {
  risk: "border-[#8d2730] bg-[#2a1116] text-[#f6c3c7]",
  warning: "border-[#67582b] bg-[#221c0c] text-[#f2ddb1]",
  neutral: "border-white/12 bg-white/[0.06] text-white/72"
};

const rowToneClasses = {
  default: "text-white/88",
  muted: "text-white/72",
  risk: "text-[#f4a9af]",
  safe: "text-[#b0ecd0]"
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
    <article className="relative overflow-hidden border border-white/10 bg-[#07090d] p-5 shadow-[0_34px_90px_rgba(0,0,0,0.45)] lg:p-6">
      <div className="relative border border-white/10 bg-black/70 px-5 py-4">
        <p className="font-mono-ap text-[9px] uppercase tracking-[0.22em] text-white/62">{eyebrow}</p>
        <h3 className="mt-3 font-serif text-[30px] font-normal leading-[1.02] text-white">{title}</h3>
      </div>

      <div className="relative mt-4 grid gap-3 md:grid-cols-2">
        {metrics.map((metric) => (
          <div key={metric.label} className="border border-white/10 bg-black/70 px-4 py-4">
            <div className="flex items-start justify-between gap-3">
            <p className="font-mono-ap text-[9px] uppercase tracking-[0.18em] text-white/62">{metric.label}</p>
              <span className={cn("px-2 py-1 font-mono-ap text-[8px] uppercase tracking-[0.16em]", toneClasses[metric.tone || "neutral"])}>
                {metric.status}
              </span>
            </div>
            <p className="mt-4 font-serif text-[30px] font-normal leading-none text-white">{metric.value}</p>
          </div>
        ))}
      </div>

      {footer ? (
        <div className="relative mt-4 border border-white/10 bg-black/70 px-4 py-4 font-sans-ap text-[12px] font-light leading-[1.8] text-white/72">
          {footer}
        </div>
      ) : null}
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
    <article className={cn("border border-white/10 bg-black p-6", className)}>
      <p className="font-mono-ap text-[9px] uppercase tracking-[0.2em] text-white/62">{eyebrow}</p>
      <h3 className="mt-3 font-serif text-[28px] font-normal leading-[1.04] text-white">{title}</h3>
      <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
        {rows.map((row) => (
          <div key={`${title}-${row.label}`} className="flex items-start justify-between gap-4 py-3">
            <span className="font-mono-ap text-[9px] uppercase tracking-[0.18em] text-white/62">{row.label}</span>
            <span className={cn("text-right font-sans-ap text-[13px] font-light leading-[1.6]", rowToneClasses[row.tone || "default"])}>
              {row.value}
            </span>
          </div>
        ))}
      </div>
      {footer ? <p className="mt-4 font-sans-ap text-[13px] font-light leading-[1.75] text-white/72">{footer}</p> : null}
    </article>
  );
}

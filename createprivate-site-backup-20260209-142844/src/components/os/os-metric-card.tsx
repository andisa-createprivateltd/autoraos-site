type OsMetricCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  alert?: boolean;
};

export function OsMetricCard({ label, value, hint, alert }: OsMetricCardProps) {
  return (
    <article
      className={`rounded-2xl border p-5 ${
        alert ? "border-ember/35 bg-[#fff7f3]" : "border-steel/12 bg-white"
      }`}
    >
      <p className="text-xs uppercase tracking-[0.14em] text-steel">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-coal">{value}</p>
      {hint ? <p className="mt-2 text-xs text-steel">{hint}</p> : null}
    </article>
  );
}

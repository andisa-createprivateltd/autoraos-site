"use client";

import { useState } from "react";

type ForecastMethodologyModalProps = {
  baselineCloseRatePct: number;
  currentSlaCompliancePct: number;
  simulatedSlaCompliancePct: number;
  degradationFactorPct: number;
  averageOpportunityValueFormatted: string;
  formula30d: string;
  formula60d: string;
  formula90d: string;
};

export function ForecastMethodologyModal({
  baselineCloseRatePct,
  currentSlaCompliancePct,
  simulatedSlaCompliancePct,
  degradationFactorPct,
  averageOpportunityValueFormatted,
  formula30d,
  formula60d,
  formula90d
}: ForecastMethodologyModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-steel/20 px-3 py-1.5 text-xs font-semibold text-coal transition hover:border-coal/30"
      >
        View Methodology
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-coal/45 px-4 py-8">
          <div className="w-full max-w-2xl rounded-3xl border border-steel/12 bg-white p-6 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-tide">Forecast Methodology</p>
                <h2 className="mt-1 text-2xl font-semibold text-coal">Revenue impact assumptions</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-steel/20 px-3 py-1 text-xs font-semibold text-coal"
              >
                Close
              </button>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <Metric label="Baseline close rate" value={`${baselineCloseRatePct}%`} />
              <Metric label="Current SLA compliance" value={`${currentSlaCompliancePct}%`} />
              <Metric label="Simulated SLA compliance" value={`${simulatedSlaCompliancePct}%`} />
              <Metric label="Degradation factor" value={`${degradationFactorPct}%`} />
              <Metric label="Avg opportunity value" value={averageOpportunityValueFormatted} />
            </div>

            <div className="mt-5 grid gap-3 text-sm text-steel">
              <Formula title="30-day revenue at risk" formula={formula30d} />
              <Formula title="60-day conversion impact" formula={formula60d} />
              <Formula title="90-day recovery potential" formula={formula90d} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-steel/12 bg-mist/35 p-4">
      <p className="text-xs uppercase tracking-[0.12em] text-steel">{label}</p>
      <p className="mt-2 text-lg font-semibold text-coal">{value}</p>
    </div>
  );
}

function Formula({ title, formula }: { title: string; formula: string }) {
  return (
    <div className="rounded-2xl border border-steel/12 bg-white p-4">
      <p className="text-xs uppercase tracking-[0.12em] text-tide">{title}</p>
      <p className="mt-2 text-sm text-coal">{formula}</p>
    </div>
  );
}

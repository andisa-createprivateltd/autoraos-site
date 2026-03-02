"use client";

import { useEffect, useRef, useState } from "react";

type KpiTooltipProps = {
  label: string;
  definition: string;
  formula: string;
  timeframe: string;
  lastUpdated: string;
};

export function KpiTooltip({ label, definition, formula, timeframe, lastUpdated }: KpiTooltipProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClick);
    }

    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={containerRef} className="relative inline-flex items-center">
      <button
        type="button"
        aria-label={`Metric definition for ${label}`}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-steel/20 text-[11px] font-semibold text-steel transition hover:border-coal/20 hover:text-coal"
      >
        i
      </button>

      {open ? (
        <div className="absolute right-0 top-7 z-20 w-72 rounded-2xl border border-steel/15 bg-white p-4 text-left shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-tide">{label}</p>
          <p className="mt-2 text-sm text-coal">{definition}</p>
          <dl className="mt-3 space-y-2 text-xs text-steel">
            <div>
              <dt className="font-semibold text-coal">Formula</dt>
              <dd>{formula}</dd>
            </div>
            <div>
              <dt className="font-semibold text-coal">Time window</dt>
              <dd>{timeframe}</dd>
            </div>
            <div>
              <dt className="font-semibold text-coal">Last updated</dt>
              <dd>{new Date(lastUpdated).toLocaleString("en-ZA")}</dd>
            </div>
          </dl>
        </div>
      ) : null}
    </div>
  );
}

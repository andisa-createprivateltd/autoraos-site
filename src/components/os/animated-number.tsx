"use client";

import { useEffect, useMemo, useState } from "react";

type AnimatedNumberProps = {
  value: number | string;
  durationMs?: number;
};

type ParsedNumericValue = {
  target: number;
  suffix: string;
  decimals: number;
};

function parseNumericValue(value: number | string): ParsedNumericValue | null {
  if (typeof value === "number") {
    return {
      target: value,
      suffix: "",
      decimals: Number.isInteger(value) ? 0 : 1
    };
  }

  const trimmed = value.trim();
  const percentMatch = trimmed.match(/^(-?\d+(?:\.\d+)?)%$/);
  if (percentMatch) {
    return {
      target: Number(percentMatch[1]),
      suffix: "%",
      decimals: percentMatch[1].includes(".") ? 1 : 0
    };
  }

  return null;
}

function formatAnimatedValue(current: number, parsed: ParsedNumericValue) {
  const value = parsed.decimals > 0 ? current.toFixed(parsed.decimals) : String(Math.round(current));
  return `${value}${parsed.suffix}`;
}

export function AnimatedNumber({ value, durationMs = 900 }: AnimatedNumberProps) {
  const parsed = useMemo(() => parseNumericValue(value), [value]);
  const [display, setDisplay] = useState(() => (parsed ? formatAnimatedValue(0, parsed) : String(value)));

  useEffect(() => {
    if (!parsed) {
      setDisplay(String(value));
      return;
    }

    const prefersReducedMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setDisplay(formatAnimatedValue(parsed.target, parsed));
      return;
    }

    let frameId = 0;
    let startTime = 0;

    const tick = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = parsed.target * eased;
      setDisplay(formatAnimatedValue(current, parsed));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [durationMs, parsed, value]);

  return <span>{display}</span>;
}


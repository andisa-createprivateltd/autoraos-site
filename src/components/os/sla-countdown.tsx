"use client";

import { useEffect, useMemo, useState } from "react";

type SlaCountdownProps = {
  dueAt?: string | null;
  breachedAt?: string | null;
  className?: string;
};

function formatSeconds(totalSeconds: number) {
  const seconds = Math.max(0, Math.round(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) return `${hours}h ${String(minutes).padStart(2, "0")}m`;
  return `${String(minutes).padStart(2, "0")}m ${String(remainingSeconds).padStart(2, "0")}s`;
}

export function SlaCountdown({ dueAt, breachedAt, className }: SlaCountdownProps) {
  const dueTime = useMemo(() => (dueAt ? new Date(dueAt).getTime() : null), [dueAt]);
  const breachTime = useMemo(() => (breachedAt ? new Date(breachedAt).getTime() : null), [breachedAt]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  if (!dueTime && !breachTime) {
    return <span className={className}>No timer</span>;
  }

  if (breachTime) {
    return (
      <span className={className}>
        Breached {formatSeconds((now - breachTime) / 1000)} ago
      </span>
    );
  }

  const remainingSeconds = (dueTime! - now) / 1000;
  if (remainingSeconds <= 0) {
    return <span className={className}>Due now</span>;
  }

  return <span className={className}>Due in {formatSeconds(remainingSeconds)}</span>;
}

"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type DealerOption = {
  id: string;
  label: string;
};

export function DealerContextSwitch({
  options,
  selectedDealerId,
  label = "Store",
  allowAllOption = true
}: {
  options: DealerOption[];
  selectedDealerId?: string;
  label?: string;
  allowAllOption?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const normalizedOptions = useMemo(() => {
    const unique = new Map<string, string>();
    for (const option of options) {
      if (!unique.has(option.id)) {
        unique.set(option.id, option.label);
      }
    }
    return Array.from(unique.entries()).map(([id, optionLabel]) => ({ id, label: optionLabel }));
  }, [options]);

  if (!normalizedOptions.length) return null;

  const fallbackDealer = normalizedOptions[0]?.id;
  const shouldAllowAll = allowAllOption && normalizedOptions.length > 1;
  const requestedDealer = selectedDealerId || searchParams.get("dealer") || (shouldAllowAll ? "all" : fallbackDealer);
  const hasRequestedDealer =
    (shouldAllowAll && requestedDealer === "all") || normalizedOptions.some((option) => option.id === requestedDealer);
  const activeDealer = hasRequestedDealer ? requestedDealer : shouldAllowAll ? "all" : fallbackDealer;

  return (
    <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-steel">
      <span>{label}:</span>
      <select
        className="input w-full min-w-0 truncate text-xs normal-case tracking-normal"
        value={activeDealer}
        onChange={(event) => {
          const params = new URLSearchParams(searchParams.toString());
          const value = event.target.value;
          if (value === "all" && shouldAllowAll) {
            params.delete("dealer");
          } else {
            params.set("dealer", value);
          }
          const query = params.toString();
          router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
        }}
      >
        {shouldAllowAll ? <option value="all">All stores</option> : null}
        {normalizedOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

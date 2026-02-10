"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type DealerOption = {
  id: string;
  label: string;
};

export function DealerContextSwitch({
  options,
  selectedDealerId
}: {
  options: DealerOption[];
  selectedDealerId?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!options.length) return null;

  const activeDealer = selectedDealerId || searchParams.get("dealer") || "all";

  return (
    <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-steel">
      Dealer:
      <select
        className="input w-auto min-w-56 text-xs normal-case tracking-normal"
        value={activeDealer}
        onChange={(event) => {
          const params = new URLSearchParams(searchParams.toString());
          const value = event.target.value;
          if (value === "all") {
            params.delete("dealer");
          } else {
            params.set("dealer", value);
          }
          const query = params.toString();
          router.push(query ? `${pathname}?${query}` : pathname);
        }}
      >
        <option value="all">All dealerships</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

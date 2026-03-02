"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackMarketingEvent, type AnalyticsParams } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  eventName?: string;
  eventParams?: AnalyticsParams;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
  eventName,
  eventParams
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      onClick={() => {
        trackMarketingEvent(eventName || "cta_click", {
          href,
          variant,
          ...eventParams
        });
      }}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold tracking-[0.01em] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coal/45 hover:-translate-y-0.5 active:translate-y-0",
        variant === "primary" && "bg-coal text-white hover:bg-black",
        variant === "secondary" && "border border-coal/20 bg-white text-coal hover:border-coal/50",
        variant === "ghost" && "border border-coal/20 bg-white/80 text-coal hover:bg-coal hover:text-white",
        className
      )}
    >
      {children}
    </Link>
  );
}

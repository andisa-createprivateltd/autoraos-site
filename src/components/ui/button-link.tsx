"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackMarketingEvent, type AnalyticsParams } from "@/lib/analytics";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "light";
  className?: string;
  eventName?: string;
  eventParams?: AnalyticsParams;
  target?: string;
  rel?: string;
};

function buttonClass(variant: ButtonLinkProps["variant"]) {
  if (variant === "secondary") return "autora-button autora-button--secondary";
  if (variant === "ghost") return "autora-button autora-button--ghost-light";
  if (variant === "light") return "autora-button autora-button--light";
  return "autora-button autora-button--accent";
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
  eventName,
  eventParams,
  target,
  rel
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      onClick={() => {
        trackMarketingEvent(eventName || "cta_click", {
          href,
          variant,
          ...eventParams
        });
      }}
      className={[buttonClass(variant), "w-full sm:w-auto", className].filter(Boolean).join(" ")}
    >
      {children}
    </Link>
  );
}

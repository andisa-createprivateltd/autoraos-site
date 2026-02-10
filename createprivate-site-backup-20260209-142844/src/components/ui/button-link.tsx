import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

export function ButtonLink({ href, children, variant = "primary", className }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70",
        variant === "primary" && "bg-ember text-white hover:bg-ember/90",
        variant === "secondary" && "bg-coal text-white hover:bg-coal/90",
        variant === "ghost" && "border border-steel/30 text-coal hover:bg-mist",
        className
      )}
    >
      {children}
    </Link>
  );
}

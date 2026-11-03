import { cn } from "@/lib/utils";

type AutoraLogoProps = {
  variant?: "dark" | "light";
  className?: string;
};

export function AutoraLogo({ variant = "dark", className }: AutoraLogoProps) {
  return (
    <span
      aria-label="AUTORA OS"
      className={cn(
        "inline-flex items-center whitespace-nowrap font-sans-ap text-[0.98rem] font-medium uppercase leading-none tracking-[0.34em]",
        variant === "light" ? "text-white" : "text-[#111]",
        className
      )}
    >
      AUTORA&nbsp;OS
    </span>
  );
}

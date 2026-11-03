import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "light" | "dark" | "muted";

type PublicSectionProps = {
  children: ReactNode;
  tone?: Tone;
  grid?: boolean;
  className?: string;
  containerClassName?: string;
  testId?: string;
};

type PanelCardProps = {
  children: ReactNode;
  tone?: Exclude<Tone, "muted">;
  rounded?: boolean;
  className?: string;
  testId?: string;
};

export function PublicSection({
  children,
  tone = "light",
  grid = false,
  className,
  containerClassName,
  testId
}: PublicSectionProps) {
  return (
    <section
      data-testid={testId}
      className={cn(
        tone === "dark" ? "autora-section-dark" : tone === "muted" ? "bg-[#f5f5f5] text-[#111]" : "autora-section-light",
        grid && "autora-section-grid",
        className
      )}
    >
      <div className={cn("autora-container relative z-10", containerClassName)}>{children}</div>
    </section>
  );
}

export function PanelCard({ children, className, tone = "light", rounded = false, testId }: PanelCardProps) {
  return (
    <article
      data-testid={testId}
      className={cn(
        tone === "dark" ? "autora-panel-dark" : "autora-panel",
        rounded && "autora-panel-rounded",
        className
      )}
    >
      {children}
    </article>
  );
}

type SerifHeadlineBlockProps = {
  eyebrow: string;
  title: ReactNode;
  detail: string;
  tone?: Exclude<Tone, "muted">;
  size?: "section" | "hero";
  actions?: ReactNode;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
};

export function SerifHeadlineBlock({
  eyebrow,
  title,
  detail,
  tone = "light",
  size = "hero",
  actions,
  className,
  titleClassName,
  contentClassName
}: SerifHeadlineBlockProps) {
  const muted = tone === "dark" ? "text-white/55" : "text-[#77736d]";
  return (
    <div className={cn("flex flex-col", className)}>
      <p className={cn("font-mono-ap text-[10px] uppercase tracking-[0.22em]", muted)}>{eyebrow}</p>
      <h2
        className={cn(
          "mt-6 font-serif font-light leading-[1.03]",
          size === "section" ? "text-[clamp(36px,5vw,76px)]" : "text-[clamp(44px,7vw,104px)]",
          tone === "dark" ? "text-white" : "text-black",
          titleClassName
        )}
      >
        {title}
      </h2>
      <p className={cn("mt-6 font-sans-ap text-[14px] font-light leading-[1.9]", muted, contentClassName)}>{detail}</p>
      {actions ? <div className="mt-8">{actions}</div> : null}
    </div>
  );
}

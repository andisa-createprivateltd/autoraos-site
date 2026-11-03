import type { ReactNode } from "react";

type EditorialHeroProps = {
  eyebrow: string;
  title: ReactNode;
  intro: string;
  detail?: string;
  actions?: ReactNode;
  aside?: ReactNode;
  testId?: string;
};

export function EditorialHero({ eyebrow, title, intro, detail, actions, aside, testId }: EditorialHeroProps) {
  return (
    <section data-testid={testId} className="volvo-page-hero">
      <div className="volvo-container volvo-page-hero__grid">
        <div>
          <p className="volvo-overline">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="volvo-page-hero__intro">{intro}</p>
          {detail ? <p className="volvo-page-hero__detail">{detail}</p> : null}
          {actions ? <div className="volvo-page-hero__actions">{actions}</div> : null}
        </div>
        {aside ? <div className="volvo-page-hero__aside">{aside}</div> : null}
      </div>
    </section>
  );
}

import type { ReactNode } from "react";

type PainelPageHeaderProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function PainelPageHeader({
  title,
  description,
  action,
}: PainelPageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h2 className="text-2xl font-extrabold uppercase tracking-[-0.025em] text-ink sm:text-[1.75rem]">
          {title}
        </h2>
        <p className="mt-1.5 max-w-[70ch] text-sm leading-relaxed text-ink-soft">
          {description}
        </p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

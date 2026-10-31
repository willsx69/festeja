import type { ReactNode } from "react";

export function ClientePageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-[-0.035em] text-ink sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">{description}</p>
      </div>
      {action}
    </header>
  );
}

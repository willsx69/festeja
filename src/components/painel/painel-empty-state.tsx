import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PainelEmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

export function PainelEmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: PainelEmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-[1.35rem] border border-dashed border-line-strong bg-surface-muted/55 px-5 py-9 text-center",
        className,
      )}
    >
      <span className="mx-auto grid size-11 place-items-center rounded-2xl bg-surface text-brand shadow-card">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <p className="mt-4 text-base font-bold text-ink">{title}</p>
      <p className="mx-auto mt-1.5 max-w-[52ch] text-sm leading-relaxed text-ink-soft">
        {description}
      </p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

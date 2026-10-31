import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  eyebrowStyle?: "text" | "pill";
  title: string;
  description?: string;
  action?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  eyebrowStyle = "text",
  title,
  description,
  action,
  align = "left",
  className,
}: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        centered && "items-center text-center sm:flex-col sm:items-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", centered && "mx-auto")}>
        {eyebrow ? (
          eyebrowStyle === "pill" ? (
            <span className="inline-flex items-center rounded-full border border-brand/10 bg-brand-soft px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-brand">
              {eyebrow}
            </span>
          ) : (
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand">
              {eyebrow}
            </p>
          )
        ) : null}
        <h2 className="mt-3 text-3xl font-extrabold uppercase leading-[1.05] tracking-[-0.035em] text-ink sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-4 text-base leading-7 text-ink-soft sm:text-lg">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

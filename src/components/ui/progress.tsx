import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type ProgressProps = Omit<ComponentPropsWithoutRef<"div">, "value"> & {
  value: number;
  indicatorClassName?: string;
};

export function Progress({
  value,
  className,
  indicatorClassName,
  ...props
}: ProgressProps) {
  const normalized = Math.min(100, Math.max(0, value));

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(normalized)}
      data-slot="progress"
      className={cn("h-2.5 w-full overflow-hidden rounded-full bg-brand-soft", className)}
      {...props}
    >
      <div
        data-slot="progress-indicator"
        className={cn("h-full rounded-full bg-brand transition-[width]", indicatorClassName)}
        style={{ width: `${normalized}%` }}
      />
    </div>
  );
}

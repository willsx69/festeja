import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn("animate-pulse rounded-xl bg-surface-muted", className)}
      {...props}
    />
  );
}

import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, type, ...props }: ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full min-w-0 rounded-xl border border-line-strong bg-surface px-3.5 text-sm text-ink shadow-[0_1px_0_rgb(23_22_37_/_0.03)] outline-none transition-[border-color,box-shadow] placeholder:text-ink-faint focus-visible:border-brand focus-visible:ring-4 focus-visible:ring-brand-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

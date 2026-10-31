import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex w-fit items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors",
  {
    variants: {
      tone: {
        neutral: "border-line bg-surface-muted text-ink-soft",
        brand: "border-brand bg-brand text-white",
        pink: "border-pink/30 bg-pink-soft text-pink-strong",
        yellow: "border-yellow/50 bg-yellow-soft text-ink",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

type BadgeProps = ComponentPropsWithoutRef<"span"> &
  VariantProps<typeof badgeVariants>;

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ tone }), className)}
      {...props}
    />
  );
}

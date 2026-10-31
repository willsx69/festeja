import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-[color,background-color,border-color,box-shadow,translate,scale] duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-ring/70 active:duration-75 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-brand text-white shadow-[0_8px_22px_-10px_rgb(109_61_245_/_0.8)] hover:-translate-y-0.5 hover:bg-brand-strong hover:shadow-[0_12px_28px_-10px_rgb(109_61_245_/_0.85)] active:translate-y-0 active:scale-[0.985] active:bg-brand-strong active:shadow-[0_4px_12px_-8px_rgb(109_61_245_/_0.7)]",
        secondary:
          "border border-line-strong bg-surface text-ink shadow-[0_1px_0_rgb(23_22_37_/_0.04)] hover:border-brand/35 hover:bg-brand-soft hover:shadow-[0_8px_18px_-16px_rgb(23_22_37_/_0.35)] active:scale-[0.985] active:bg-brand-soft active:shadow-none",
        ghost:
          "text-ink-soft hover:bg-brand-soft hover:text-brand active:scale-[0.985] active:bg-brand-soft",
        accent:
          "bg-yellow text-ink shadow-[0_8px_22px_-12px_rgb(255_202_73_/_0.9)] hover:-translate-y-0.5 hover:bg-[#ffd564] hover:shadow-[0_12px_26px_-12px_rgb(255_202_73_/_0.95)] active:translate-y-0 active:scale-[0.985] active:shadow-[0_4px_12px_-10px_rgb(255_202_73_/_0.8)]",
      },
      size: {
        sm: "h-9 px-3.5 text-sm",
        md: "h-11 px-4.5 text-sm",
        lg: "h-12 px-5 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = ComponentPropsWithoutRef<"button"> &
  VariantProps<typeof buttonVariants> & {
  asChild?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  asChild = false,
  className,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button";
  return (
    <Component
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> &
  VariantProps<typeof buttonVariants>;

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

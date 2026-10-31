import type { ComponentProps, ReactNode } from "react";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export function Form({ className, ...props }: ComponentProps<"form">) {
  return <form data-slot="form" className={cn(className)} {...props} />;
}

export function FormDescription({
  className,
  ...props
}: ComponentProps<"p">) {
  return (
    <p
      data-slot="form-description"
      className={cn("text-xs leading-relaxed text-ink-faint", className)}
      {...props}
    />
  );
}

export function FormMessage({
  children,
  className,
  ...props
}: Omit<ComponentProps<"p">, "children"> & { children?: ReactNode }) {
  if (!children) return null;
  return (
    <p
      data-slot="form-message"
      role="alert"
      className={cn(
        "mt-1.5 flex items-center gap-1.5 text-xs font-medium text-danger",
        className,
      )}
      {...props}
    >
      <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
      {children}
    </p>
  );
}

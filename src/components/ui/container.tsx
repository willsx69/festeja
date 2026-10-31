import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

const sizes = {
  sm: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-7xl",
} as const;

type ContainerProps = ComponentPropsWithoutRef<"div"> & {
  size?: keyof typeof sizes;
};

export function Container({ size = "default", className, ...props }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", sizes[size], className)}
      {...props}
    />
  );
}

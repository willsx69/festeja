import Image from "next/image";
import { cn } from "@/lib/utils";

type Tone = "ink" | "white";
type Size = "sm" | "md" | "lg";

const sizes: Record<Size, { mark: string; wordmark: string; gap: string }> = {
  sm: { mark: "size-7", wordmark: "text-base", gap: "gap-2" },
  md: { mark: "size-9", wordmark: "text-xl", gap: "gap-2.5" },
  lg: { mark: "size-12", wordmark: "text-3xl", gap: "gap-3" },
};

type LogoProps = {
  tone?: Tone;
  size?: Size;
  withWordmark?: boolean;
  className?: string;
};

export function Logo({
  tone = "ink",
  size = "md",
  withWordmark = true,
  className,
}: LogoProps) {
  const scale = sizes[size];

  if (!withWordmark) {
    return (
      <span role="img" aria-label="Festeja" className={cn("inline-flex", className)}>
        <Image
          src="/images/categorias/logo.png"
          alt=""
          aria-hidden="true"
          width={48}
          height={48}
          className={cn("shrink-0 rounded-xl object-contain", scale.mark)}
        />
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center", scale.gap, className)}>
      <Image
        src="/images/categorias/logo.png"
        alt=""
        aria-hidden="true"
        width={48}
        height={48}
        className={cn("shrink-0 rounded-xl object-contain", scale.mark)}
      />
      <span
        className={cn(
          "font-extrabold tracking-[-0.055em]",
          scale.wordmark,
          tone === "ink" ? "text-ink" : "text-white",
        )}
      >
        Festeja
      </span>
    </span>
  );
}

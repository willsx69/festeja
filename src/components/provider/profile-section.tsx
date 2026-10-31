import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ProfileSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function ProfileSection({
  title,
  description,
  children,
  className,
}: ProfileSectionProps) {
  return (
    <section className={cn(className)}>
      <h2 className="text-balance text-[1.6rem] font-extrabold leading-tight tracking-[-0.035em] text-ink sm:text-[1.8rem]">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 max-w-[64ch] text-sm leading-relaxed text-ink-soft">
          {description}
        </p>
      ) : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

import Image from "next/image";
import { CategoryIcon } from "@/components/category/category-icon";
import { cn } from "@/lib/utils";
import type { CategoryId, Tone } from "@/types";

const backgrounds: Record<Tone, string> = {
  brand: "bg-brand-soft",
  pink: "bg-pink-soft",
  yellow: "bg-yellow-soft",
};

const watermarks: Record<Tone, string> = {
  brand: "text-brand/25",
  pink: "text-pink/40",
  yellow: "text-yellow/70",
};

const defaultSizes = "(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw";

type ProviderMediaProps = {
  categoryId: CategoryId;
  tone: Tone;
  image?: string;
  alt?: string;
  sizes?: string;
  className?: string;
  imageClassName?: string;
  iconClassName?: string;
};

export function ProviderMedia({
  categoryId,
  tone,
  image,
  alt,
  sizes = defaultSizes,
  className,
  imageClassName,
  iconClassName,
}: ProviderMediaProps) {
  if (image) {
    return (
      <div className={cn("relative overflow-hidden bg-surface-muted", className)}>
        <Image
          src={image}
          alt={alt ?? ""}
          fill
          sizes={sizes}
          className={cn("object-cover", imageClassName)}
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn("relative overflow-hidden", backgrounds[tone], className)}
    >
      <CategoryIcon
        categoryId={categoryId}
        className={cn(
          "absolute -bottom-5 -right-3 size-32",
          watermarks[tone],
          iconClassName,
        )}
      />
      <span className="absolute left-5 top-5 size-2.5 rounded-full bg-pink" />
      <span className="absolute left-11 top-12 size-1.5 rounded-full bg-yellow" />
      <span className="absolute right-20 top-7 size-2 rounded-full bg-brand/30" />
    </div>
  );
}

import { ProviderMedia } from "@/components/provider/provider-media";
import { cn } from "@/lib/utils";
import type { CategoryId, Tone } from "@/types";

type ProviderCoverProps = {
  categoryId: CategoryId;
  tone: Tone;
  image?: string;
  alt?: string;
  sizes?: string;
  className?: string;
  imageClassName?: string;
};

export function ProviderCover({
  categoryId,
  tone,
  image,
  alt,
  sizes,
  className,
  imageClassName,
}: ProviderCoverProps) {
  return (
    <ProviderMedia
      categoryId={categoryId}
      tone={tone}
      image={image}
      alt={alt}
      sizes={sizes}
      className={cn("h-36", className)}
      imageClassName={imageClassName}
    />
  );
}

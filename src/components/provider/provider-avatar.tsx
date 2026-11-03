"use client";

import { useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { initialsFrom } from "@/lib/format";
import { cn } from "@/lib/utils";

const sizes = {
  md: "size-14 text-sm",
  lg: "size-16 text-base",
  xl: "size-20 text-xl sm:size-24 sm:text-2xl",
} as const;

const imageSizes = {
  md: "56px",
  lg: "64px",
  xl: "(min-width: 640px) 96px, 72px",
} as const;

type ProviderAvatarProps = {
  name: string;
  image?: string | null;
  imageAlt?: string;
  title?: string;
  size?: keyof typeof sizes;
  className?: string;
  fallbackClassName?: string;
};

export function ProviderAvatar({
  name,
  image,
  imageAlt,
  title,
  size = "md",
  className,
  fallbackClassName,
}: ProviderAvatarProps) {
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const showImage = Boolean(image) && failedImage !== image;

  return (
    <Avatar
      title={title}
      className={cn(
        "bg-surface-muted shadow-[0_8px_20px_-12px_rgb(23_22_37_/_0.45)]",
        sizes[size],
        className,
      )}
    >
      <AvatarFallback
        aria-hidden="true"
        className={cn("bg-brand-soft font-semibold text-brand-strong", fallbackClassName)}
      >
        {initialsFrom(name)}
      </AvatarFallback>
      {showImage && image ? (
        <Image
          src={image}
          alt={imageAlt ?? `Imagem de perfil de ${name}`}
          fill
          sizes={imageSizes[size]}
          className="object-cover"
          onError={() => setFailedImage(image)}
        />
      ) : null}
    </Avatar>
  );
}

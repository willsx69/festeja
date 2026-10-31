"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toggleFavoriteAction } from "@/actions/profile";
import { buildLoginHref } from "@/lib/auth-redirect";
import { cn } from "@/lib/utils";

type FavoriteButtonProps = {
  providerUsername: string;
  initial: boolean;
  loggedIn: boolean;
  iconOnly?: boolean;
  className?: string;
};

export function FavoriteButton({
  providerUsername,
  initial,
  loggedIn,
  iconOnly = false,
  className,
}: FavoriteButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [favorited, setFavorited] = useState(initial);
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!loggedIn) {
      router.push(buildLoginHref(pathname));
      return;
    }
    startTransition(async () => {
      const next = await toggleFavoriteAction(providerUsername);
      if (next !== null) setFavorited(next);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-pressed={favorited}
      aria-label={favorited ? "Remover dos favoritos" : "Salvar nos favoritos"}
      title={favorited ? "Remover dos favoritos" : "Salvar nos favoritos"}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-colors disabled:opacity-60",
        iconOnly ? "w-11 px-0" : "px-4",
        favorited
          ? "border-pink bg-pink-soft text-pink-strong"
          : "border-line-strong bg-surface text-ink hover:border-pink hover:text-pink-strong",
        className,
      )}
    >
      <Heart className={cn("size-4", favorited && "fill-pink-strong")} aria-hidden="true" />
      {iconOnly ? null : favorited ? "Salvo nos favoritos" : "Salvar nos favoritos"}
    </button>
  );
}

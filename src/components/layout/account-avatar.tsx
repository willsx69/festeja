"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initialsFrom } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { SessionUser } from "@/types";

type AccountAvatarProps = {
  user: Pick<SessionUser, "name" | "avatar">;
  className?: string;
};

export function AccountAvatar({ user, className }: AccountAvatarProps) {
  return (
    <Avatar
      className={cn(
        "size-10 border border-line-strong bg-brand-soft ring-2 ring-surface",
        className,
      )}
    >
      {user.avatar ? (
        <AvatarImage
          src={user.avatar}
          alt={`Foto de perfil de ${user.name}`}
          loading="eager"
          decoding="async"
        />
      ) : null}
      <AvatarFallback className="bg-brand-soft text-xs font-extrabold text-brand">
        {initialsFrom(user.name)}
      </AvatarFallback>
    </Avatar>
  );
}

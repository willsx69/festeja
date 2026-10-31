import { CalendarCheck, MessageCircle, Pencil } from "lucide-react";
import { FavoriteButton } from "@/components/provider/favorite-button";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProviderActionsProps = {
  username: string;
  favorited: boolean;
  loggedIn: boolean;
  size?: "md" | "lg";
  className?: string;
  iconOnlyFavorite?: boolean;
  owner?: boolean;
  ownerHref?: string;
  ownerLabel?: string;
  layout?: "row" | "column";
  minimal?: boolean;
};

export function ProviderActions({
  username,
  favorited,
  loggedIn,
  size = "md",
  className,
  iconOnlyFavorite = false,
  owner = false,
  ownerHref = "/painel/perfil",
  ownerLabel = "Editar perfil",
  layout = "row",
  minimal = false,
}: ProviderActionsProps) {
  const stacked = layout === "column";

  if (owner) {
    return (
      <div className={cn("flex flex-wrap gap-3", className)}>
        <ButtonLink href={ownerHref} variant="primary" size={size} className="w-full sm:w-auto">
          <Pencil className="size-4" aria-hidden="true" />
          {ownerLabel}
        </ButtonLink>
      </div>
    );
  }

  if (minimal) {
    return (
      <div className={cn("flex items-center", className)}>
        <FavoriteButton
          providerUsername={username}
          initial={favorited}
          loggedIn={loggedIn}
          iconOnly={iconOnlyFavorite}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex gap-2",
        stacked ? "flex-col" : "flex-wrap sm:gap-3",
        className,
      )}
    >
      <ButtonLink
        href={`/prestador/${username}?aba=orcamento`}
        variant="primary"
        size={size}
        className={cn(stacked ? "w-full" : "w-full sm:w-auto")}
      >
        <CalendarCheck className="size-4" aria-hidden="true" />
        Solicitar orçamento
      </ButtonLink>

      {loggedIn ? (
        <ButtonLink
          href={`/mensagens?com=${username}`}
          variant="secondary"
          size={size}
          className={cn(stacked ? "w-full" : "flex-1 sm:flex-none")}
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          Conversar
        </ButtonLink>
      ) : null}

      <FavoriteButton
        providerUsername={username}
        initial={favorited}
        loggedIn={loggedIn}
        iconOnly={iconOnlyFavorite}
        className={cn(
          stacked ? "w-full" : iconOnlyFavorite ? "shrink-0" : "flex-1 sm:flex-none",
          size === "lg" && !iconOnlyFavorite && "h-12 px-5 text-base",
        )}
      />
    </div>
  );
}

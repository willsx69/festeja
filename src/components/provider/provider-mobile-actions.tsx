import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { FavoriteButton } from "@/components/provider/favorite-button";
import type { ProfileTabId } from "@/components/provider/profile-tabs";
import { ButtonLink } from "@/components/ui/button";
import { formatBRL, hasPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Provider } from "@/types";

type ProviderMobileActionsProps = {
  provider: Provider;
  favorited: boolean;
  loggedIn: boolean;
  isOwner?: boolean;
  showClientActions?: boolean;
  activeTab: ProfileTabId;
  className?: string;
};

export function ProviderMobileActions({
  provider,
  favorited,
  loggedIn,
  isOwner = false,
  showClientActions = true,
  activeTab,
  className,
}: ProviderMobileActionsProps) {
  if (isOwner || !showClientActions || activeTab === "orcamento") return null;

  return (
    <div
      role="region"
      aria-label="Ações de contratação"
      className={cn("sticky bottom-3 z-30 mx-auto mt-10 w-full max-w-md lg:hidden", className)}
    >
      <div className="flex items-center gap-2 rounded-2xl border border-line bg-surface/95 p-2 shadow-pop backdrop-blur-md">
        <div className="hidden min-w-0 pl-2 min-[390px]:block">
          {hasPrice(provider.price) ? (
            <>
              <p className="text-[0.65rem] font-medium leading-none text-ink-faint">
                A partir de
              </p>
              <p className="mt-0.5 truncate text-sm font-extrabold tabular-nums leading-tight text-ink">
                {formatBRL(provider.price)}
              </p>
            </>
          ) : (
            <p className="text-xs font-semibold leading-tight text-ink">Sob consulta</p>
          )}
        </div>

        <FavoriteButton
          providerUsername={provider.id}
          initial={favorited}
          loggedIn={loggedIn}
          iconOnly
          className="shrink-0"
        />

        {loggedIn ? (
          <Link
            href={`/mensagens?com=${provider.id}`}
            aria-label="Conversar com o prestador"
            title="Conversar"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line-strong bg-surface text-ink transition-colors hover:border-brand/35 hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-ring/70"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
          </Link>
        ) : null}

        <ButtonLink
          href={`/prestador/${provider.id}?aba=orcamento#conteudo-perfil`}
          variant="primary"
          className="min-w-0 flex-1"
        >
          Solicitar orçamento
        </ButtonLink>
      </div>
    </div>
  );
}

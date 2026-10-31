import {
  CalendarClock,
  Clock,
  MapPin,
  Pencil,
  ShieldCheck,
  Star,
} from "lucide-react";
import Link from "next/link";
import { ProviderActions } from "@/components/provider/provider-actions";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCategory } from "@/data/categories";
import { formatBRL, formatCount, formatRating, hasPrice } from "@/lib/format";
import { hasAvailabilityDetail } from "@/lib/profile-display";
import { cn } from "@/lib/utils";
import type { Provider, ProviderProfile } from "@/types";

type ProviderContractCardProps = {
  provider: Provider;
  profile: ProviderProfile;
  favorited: boolean;
  loggedIn: boolean;
  isOwner?: boolean;
  showClientActions?: boolean;
  ownerHref?: string;
  ownerLabel?: string;
  className?: string;
};

export function ProviderContractCard({
  provider,
  profile,
  favorited,
  loggedIn,
  isOwner = false,
  showClientActions = true,
  ownerHref = "/painel/perfil",
  ownerLabel = "Editar perfil",
  className,
}: ProviderContractCardProps) {
  const category = getCategory(provider.category);
  const hasReviews = provider.reviews > 0;
  const responseTime = hasAvailabilityDetail(profile.availability.responseTime)
    ? profile.availability.responseTime
    : null;
  const minimumNotice = hasAvailabilityDetail(profile.availability.minimumNotice)
    ? profile.availability.minimumNotice
    : null;

  return (
    <Card
      padded={false}
      className={cn(
        "relative rounded-[1.6rem] border-line/90 bg-surface shadow-card",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="h-1.5 w-full bg-[linear-gradient(90deg,var(--color-brand),var(--color-pink)_55%,var(--color-yellow))]"
      />

      <div className="p-5 pt-4">
        {isOwner ? (
          <div>
            <p className="text-xs font-medium text-ink-faint">Seu perfil público</p>
            <p className="mt-1 text-xl font-extrabold tracking-[-0.03em] text-ink">
              Como os clientes veem
            </p>
            <p className="mt-2 max-w-[34ch] text-sm leading-relaxed text-ink-soft">
              Edite textos, preços, fotos e serviços no painel. As ações de contratação
              ficam ocultas na sua própria página.
            </p>

            <div className="mt-5">
              <ButtonLink href={ownerHref} variant="primary" className="w-full">
                <Pencil className="size-4" aria-hidden="true" />
                {ownerLabel}
              </ButtonLink>
            </div>

            <p className="mt-4 border-t border-line pt-4 text-xs leading-relaxed text-ink-faint">
              Categoria: <span className="font-medium text-ink-soft">{category.name}</span>
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-ink-faint">Contratação</p>
                <p className="mt-0.5 text-sm font-semibold text-ink">{category.name}</p>
              </div>
              {provider.verified ? (
                <span className="rounded-full border border-brand/15 bg-brand-soft px-2 py-1 text-[0.65rem] font-semibold text-brand">
                  Perfil verificado
                </span>
              ) : null}
            </div>

            <div className="mt-4">
              {hasPrice(provider.price) ? (
                <>
                  <p className="text-xs text-ink-faint">A partir de</p>
                  <p className="mt-0.5 text-[2rem] font-extrabold tracking-[-0.05em] tabular-nums leading-none text-ink">
                    {formatBRL(provider.price)}
                    {provider.priceUnit ? (
                      <span className="ml-1.5 text-sm font-medium tracking-normal text-ink-faint">
                        {provider.priceUnit}
                      </span>
                    ) : null}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-2xl font-extrabold tracking-[-0.035em] text-ink">
                    Preço sob consulta
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-faint">
                    O valor é combinado conforme o evento.
                  </p>
                </>
              )}
            </div>

            <div className="mt-3">
              {hasReviews ? (
                <p className="flex items-center gap-1.5 text-sm">
                  <Star className="size-4 fill-yellow text-yellow" aria-hidden="true" />
                  <span className="font-bold tabular-nums text-ink">
                    {formatRating(provider.rating)}
                  </span>
                  <span className="text-ink-faint">
                    {formatCount(provider.reviews)}{" "}
                    {provider.reviews === 1 ? "avaliação" : "avaliações"}
                  </span>
                </p>
              ) : (
                <p className="text-sm font-medium text-ink-faint">Ainda sem avaliações</p>
              )}
            </div>

            <dl className="mt-5 space-y-3 border-t border-line pt-4 text-sm">
              <div className="flex items-start justify-between gap-4">
                <dt className="flex items-center gap-2 text-ink-faint">
                  <MapPin className="size-4 shrink-0" aria-hidden="true" />
                  Atende em
                </dt>
                <dd className="max-w-[12rem] text-right font-medium leading-snug text-ink">
                  {provider.neighborhood
                    ? `${provider.neighborhood}, ${provider.city}`
                    : `${provider.city} — ${provider.state}`}
                </dd>
              </div>

              {responseTime ? (
                <div className="flex items-start justify-between gap-4">
                  <dt className="flex items-center gap-2 text-ink-faint">
                    <Clock className="size-4 shrink-0" aria-hidden="true" />
                    Responde em
                  </dt>
                  <dd className="max-w-[12rem] text-right font-medium leading-snug text-ink">
                    {responseTime}
                  </dd>
                </div>
              ) : null}

              {minimumNotice ? (
                <div className="flex items-start justify-between gap-4">
                  <dt className="flex items-center gap-2 text-ink-faint">
                    <CalendarClock className="size-4 shrink-0" aria-hidden="true" />
                    Agendamento
                  </dt>
                  <dd className="max-w-[12rem] text-right font-medium leading-snug text-ink">
                    {minimumNotice}
                  </dd>
                </div>
              ) : null}
            </dl>

            <p className="mt-4 text-xs leading-relaxed text-ink-faint">
              Confirme a data e as condições diretamente com o prestador.
            </p>
          </>
        )}
      </div>

      {!isOwner && showClientActions ? (
        <>
          <div aria-hidden="true" className="relative h-3">
            <span className="absolute left-4 right-4 top-1/2 border-t border-dashed border-line-strong" />
            <span className="absolute -left-2 top-1/2 size-4 -translate-y-1/2 rounded-full border border-line bg-canvas" />
            <span className="absolute -right-2 top-1/2 size-4 -translate-y-1/2 rounded-full border border-line bg-canvas" />
          </div>

          <div className="p-5 pt-2">
            <ProviderActions
              username={provider.id}
              favorited={favorited}
              loggedIn={loggedIn}
              layout="column"
              className="hidden lg:flex"
            />

            <p className="mt-4 flex items-start gap-2 border-t border-line pt-4 text-xs leading-relaxed text-ink-faint">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
              O orçamento e o pagamento são combinados direto com o prestador. A Festeja
              não intermedeia valores.
            </p>

            <Link
              href={`/prestador/${provider.id}?aba=avaliacoes#conteudo-perfil`}
              className="mt-3 inline-flex text-xs font-medium text-brand underline-offset-4 hover:underline"
            >
              {hasReviews ? "Ler avaliações de clientes" : "Entenda como as avaliações funcionam"}
            </Link>
          </div>
        </>
      ) : null}
    </Card>
  );
}

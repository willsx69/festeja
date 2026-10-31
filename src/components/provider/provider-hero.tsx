import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, CalendarDays, Eye, MapPin, Star } from "lucide-react";
import { CategoryIcon } from "@/components/category/category-icon";
import { ProviderActions } from "@/components/provider/provider-actions";
import { ProviderAvatar } from "@/components/provider/provider-avatar";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { getCategory } from "@/data/categories";
import { formatBRL, formatCount, formatRating, hasPrice } from "@/lib/format";
import { formatAvailabilitySummary } from "@/lib/profile-display";
import { cn } from "@/lib/utils";
import type { CategoryId, Provider, ProviderAvailability, Tone } from "@/types";

type ProviderHeroProps = {
  provider: Provider;
  favorited: boolean;
  loggedIn: boolean;
  cover?: string | null;
  avatar?: string | null;
  isOwner?: boolean;
  showClientActions?: boolean;
  availability?: ProviderAvailability;
};

const categoryDotTones: Record<Tone, string> = {
  brand: "bg-brand",
  pink: "bg-pink",
  yellow: "bg-yellow",
};

function CoverFallback({ categoryId }: { categoryId: CategoryId }) {
  return (
    <div className="relative size-full overflow-hidden bg-[linear-gradient(118deg,#f0e8ff_0%,#fbf9ff_48%,#fff0f6_100%)]">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-55 [background-image:radial-gradient(circle,rgba(109,61,245,0.18)_1px,transparent_1px)] [background-size:22px_22px]"
      />
      <span
        aria-hidden="true"
        className="absolute -bottom-36 -left-28 size-[28rem] rounded-full border-[42px] border-white/55"
      />
      <span
        aria-hidden="true"
        className="absolute right-[19%] top-9 size-32 rounded-full border border-brand/15"
      />
      <span
        aria-hidden="true"
        className="absolute right-[13%] top-20 size-16 rounded-full border border-pink/35"
      />
      <span
        aria-hidden="true"
        className="absolute left-[43%] top-[38%] size-3 rounded-full bg-pink/60"
      />
      <span
        aria-hidden="true"
        className="absolute bottom-9 right-[39%] size-2 rounded-full bg-brand/40"
      />
      <CategoryIcon
        categoryId={categoryId}
        className="absolute -bottom-10 right-3 size-48 text-brand/15 sm:right-10 sm:size-64"
      />
    </div>
  );
}

export function ProviderHero({
  provider,
  favorited,
  loggedIn,
  cover,
  avatar,
  isOwner = false,
  showClientActions = true,
  availability,
}: ProviderHeroProps) {
  const category = getCategory(provider.category);
  const location = provider.neighborhood
    ? `${provider.neighborhood}, ${provider.city} — ${provider.state}`
    : `${provider.city} — ${provider.state}`;
  const hasReviews = provider.reviews > 0;
  const activeDays = formatAvailabilitySummary(availability?.days ?? []);

  return (
    <section className="bg-canvas">
      <Container className="py-5 sm:py-7">
        <nav aria-label="Trilha de navegação">
          <ol className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-faint">
            <li>
              <Link href="/" className="transition-colors hover:text-brand">
                Início
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/buscar" className="transition-colors hover:text-brand">
                Buscar
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href={`/buscar?categoria=${category.id}`}
                className="transition-colors hover:text-brand"
              >
                {category.name}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="max-w-[14rem] truncate text-ink-soft sm:max-w-none">
              {provider.name}
            </li>
          </ol>
        </nav>

        <div className="relative mt-4">
          <div className="relative h-44 overflow-hidden rounded-[2rem] border border-line bg-brand-soft shadow-card sm:h-60 sm:rounded-[2.5rem] lg:h-72">
            {cover ? (
              <>
                <Image
                  src={cover}
                  alt={`Capa de ${provider.name}`}
                  fill
                  sizes="(max-width: 1152px) 100vw, 1152px"
                  className="object-cover"
                  priority
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent"
                />
              </>
            ) : (
              <CoverFallback categoryId={category.id} />
            )}

            <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-3 sm:inset-x-5 sm:top-5">
              <Badge
                tone="neutral"
                className="border-white/80 bg-white/92 text-ink shadow-sm backdrop-blur-sm"
              >
                <span
                  className={cn("size-1.5 rounded-full", categoryDotTones[category.tone])}
                  aria-hidden="true"
                />
                {category.name}
              </Badge>

              {isOwner ? (
                <Badge
                  tone="neutral"
                  className="border-white/30 bg-ink/80 text-white shadow-sm backdrop-blur-sm"
                >
                  <Eye className="size-3.5 text-yellow" aria-hidden="true" />
                  Visão do proprietário
                </Badge>
              ) : provider.featured ? (
                <Badge
                  tone="yellow"
                  className="border-white/60 bg-white/92 text-ink shadow-sm backdrop-blur-sm"
                >
                  <Star className="size-3 fill-yellow text-yellow" aria-hidden="true" />
                  Em destaque
                </Badge>
              ) : null}
            </div>
          </div>

          <article className="relative z-10 -mt-14 px-2 sm:-mt-20 sm:px-0">
            <div className="rounded-[1.75rem] border border-line bg-surface/95 p-4 shadow-pop backdrop-blur-md sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
                <div className="-mt-12 shrink-0 sm:-mt-16">
                  <ProviderAvatar
                    name={provider.name}
                    image={avatar ?? provider.avatar ?? null}
                    imageAlt={
                      provider.portraitIllustrative
                        ? `Retrato ilustrativo de ${provider.name}`
                        : undefined
                    }
                    title={provider.portraitIllustrative ? "Retrato ilustrativo" : undefined}
                    size="xl"
                    className="size-[72px] text-lg ring-[5px] ring-surface sm:size-24 sm:text-2xl"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                    <h1 className="text-balance text-[clamp(1.85rem,5vw,3.1rem)] font-extrabold leading-[1.02] tracking-[-0.045em] text-ink">
                      {provider.name}
                    </h1>
                    {provider.verified ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-brand/15 bg-brand-soft px-2 py-1 text-[0.7rem] font-semibold text-brand">
                        <BadgeCheck className="size-3.5" aria-hidden="true" />
                        Verificado
                        <span className="sr-only"> pela equipe Festeja</span>
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-2 flex min-w-0 items-center gap-1.5 text-sm text-ink-soft">
                    <MapPin className="size-4 shrink-0 text-ink-faint" aria-hidden="true" />
                    <span className="truncate">{location}</span>
                  </p>

                  {provider.portraitIllustrative ? (
                    <p className="mt-1 text-xs text-ink-faint">
                      Retrato ilustrativo do perfil demonstrativo.
                    </p>
                  ) : null}
                </div>

                {!isOwner && showClientActions ? (
                  <ProviderActions
                    username={provider.id}
                    favorited={favorited}
                    loggedIn={loggedIn}
                    iconOnlyFavorite
                    minimal
                    className="hidden shrink-0 lg:flex"
                  />
                ) : null}
              </div>

              <dl className="mt-4 grid gap-2.5 border-t border-line pt-3.5 sm:mt-5 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-line sm:pt-4">
                <div className="flex items-baseline justify-between gap-4 sm:block sm:pr-5">
                  <dt className="shrink-0 text-xs font-medium text-ink-faint">Avaliação</dt>
                  <dd className="flex min-h-5 flex-wrap items-center justify-end gap-1.5 text-right sm:mt-1 sm:justify-start sm:text-left">
                    {hasReviews ? (
                      <>
                        <Star className="size-4 fill-yellow text-yellow" aria-hidden="true" />
                        <span className="text-sm font-bold tabular-nums text-ink">
                          {formatRating(provider.rating)}
                        </span>
                        <span className="text-sm text-ink-faint">
                          {formatCount(provider.reviews)}{" "}
                          {provider.reviews === 1 ? "avaliação" : "avaliações"}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm font-medium text-ink-soft">
                        Ainda sem avaliações
                      </span>
                    )}
                  </dd>
                </div>

                <div className="flex items-baseline justify-between gap-4 sm:block sm:px-5">
                  <dt className="shrink-0 text-xs font-medium text-ink-faint">Investimento</dt>
                  <dd className="flex min-h-5 flex-wrap items-baseline justify-end gap-x-1.5 text-right sm:mt-1 sm:justify-start sm:text-left">
                    {hasPrice(provider.price) ? (
                      <>
                        <span className="text-xs text-ink-soft">A partir de</span>
                        <span className="text-base font-extrabold tracking-[-0.02em] tabular-nums text-ink">
                          {formatBRL(provider.price)}
                        </span>
                        {provider.priceUnit ? (
                          <span className="text-xs text-ink-faint">{provider.priceUnit}</span>
                        ) : null}
                      </>
                    ) : (
                      <span className="text-sm font-bold text-ink">Preço sob consulta</span>
                    )}
                  </dd>
                </div>

                <div className="flex items-baseline justify-between gap-4 sm:block sm:pl-5">
                  <dt className="shrink-0 text-xs font-medium text-ink-faint">Atendimento</dt>
                  <dd className="flex min-h-5 items-center justify-end gap-1.5 text-right text-sm font-medium text-ink sm:mt-1 sm:justify-start sm:text-left">
                    <CalendarDays className="size-4 shrink-0 text-brand" aria-hidden="true" />
                    {activeDays}
                  </dd>
                </div>
              </dl>
            </div>
          </article>
        </div>
      </Container>
    </section>
  );
}

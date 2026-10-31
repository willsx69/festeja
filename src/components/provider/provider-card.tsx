import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  MapPin,
  Star,
} from "lucide-react";
import { ProviderAvatar } from "@/components/provider/provider-avatar";
import { ProviderCover } from "@/components/provider/provider-cover";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { categoryImageAlt, getCategory } from "@/data/categories";
import { formatBRL, formatCount, formatRating } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Provider, Tone } from "@/types";

const categoryDotTones: Record<Tone, string> = {
  brand: "bg-brand",
  pink: "bg-pink",
  yellow: "bg-yellow",
};

export function ProviderCard({
  provider,
  className,
}: {
  provider: Provider;
  className?: string;
}) {
  const category = getCategory(provider.category);
  const location = provider.neighborhood
    ? `${provider.neighborhood}, ${provider.city}`
    : `${provider.city}, ${provider.state}`;
  const hasReviews = provider.reviews > 0;

  return (
    <Card
      padded={false}
      role="article"
      aria-labelledby={`provider-${provider.id}-title`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[18px] border-line/90 bg-surface transition-[translate,border-color,box-shadow] duration-200 hover:-translate-y-[3px] hover:border-brand/30 hover:shadow-[0_20px_44px_-30px_rgb(84_40_214_/_0.42)] focus-within:border-brand/30 focus-within:shadow-[0_20px_44px_-30px_rgb(84_40_214_/_0.42)] motion-reduce:translate-y-0 motion-reduce:transition-none",
        className,
      )}
    >
      <div className="relative">
        <ProviderCover
          categoryId={category.id}
          tone={category.tone}
          image={provider.image}
          alt={categoryImageAlt[category.id]}
          className="aspect-[16/9] h-auto"
          imageClassName="transition-[scale] duration-200 ease-out group-hover:scale-[1.02] group-focus-within:scale-[1.02] motion-reduce:scale-100 motion-reduce:transition-none"
        />
        <Badge
          tone="neutral"
          className="absolute right-3 top-3 max-w-[calc(100%-1.5rem)] border-white/70 bg-white/90 text-ink shadow-sm backdrop-blur-sm"
        >
          <span
            className={cn("size-1.5 rounded-full", categoryDotTones[category.tone])}
            aria-hidden="true"
          />
          {category.name}
        </Badge>
        <ProviderAvatar
          name={provider.name}
          image={provider.avatar}
          imageAlt={
            provider.portraitIllustrative
              ? `Retrato ilustrativo de ${provider.name}`
              : undefined
          }
          title={provider.portraitIllustrative ? "Retrato ilustrativo" : undefined}
          size="md"
          className="absolute -bottom-7 left-4 ring-[3px] ring-white sm:left-5"
        />
      </div>

      <CardContent className="flex flex-1 flex-col px-4 pb-4 pt-10 sm:px-5 sm:pb-5">
        <div className="flex items-start gap-1.5">
          <h3
            id={`provider-${provider.id}-title`}
            className="line-clamp-2 min-w-0 text-base font-extrabold leading-snug tracking-[-0.015em] text-ink"
          >
            {provider.name}
          </h3>
          {provider.verified ? (
            <span className="mt-0.5 inline-flex shrink-0" title="Perfil verificado">
              <BadgeCheck
                className="size-4 text-brand"
                role="img"
                aria-label="Perfil verificado"
              />
            </span>
          ) : null}
        </div>

        <p className="mt-1.5 flex min-w-0 items-center gap-1.5 text-sm text-ink-soft">
          <MapPin className="size-3.5 shrink-0 text-ink-faint" aria-hidden="true" />
          <span className="truncate">{location}</span>
        </p>

        <div className="mt-3 flex min-h-6 items-center gap-2">
          {hasReviews ? (
            <>
              <span className="inline-flex items-center gap-1 rounded-md bg-yellow-soft px-2 py-1 text-xs font-bold tabular-nums text-ink">
                <Star className="size-3.5 fill-yellow text-yellow" aria-hidden="true" />
                {formatRating(provider.rating)}
              </span>
              <span className="text-xs font-medium text-ink-faint">
                {formatCount(provider.reviews)}{" "}
                {provider.reviews === 1 ? "avaliação" : "avaliações"}
              </span>
            </>
          ) : (
            <span className="text-xs font-medium text-ink-faint">Ainda sem avaliações</span>
          )}
        </div>

        <ul className="mt-3 flex min-h-7 flex-wrap gap-1.5">
          <li className="sr-only">Especialidades:</li>
          {provider.tags.slice(0, 3).map((tag) => (
            <li
              key={tag}
              className="rounded-md bg-surface-muted px-2 py-1 text-[0.7rem] font-medium text-ink-soft"
            >
              {tag}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-4">
          <Separator className="mb-3.5" />

          <div className="flex items-end justify-between gap-3">
            <p className="min-w-0">
              {provider.price > 0 ? (
                <>
                  <span className="block text-[0.7rem] font-medium text-ink-faint">
                    A partir de
                  </span>
                  <span className="mt-0.5 block text-lg font-extrabold tracking-[-0.02em] tabular-nums text-ink">
                    {formatBRL(provider.price)}
                    {provider.priceUnit ? (
                      <span className="ml-1 text-xs font-medium tracking-normal text-ink-faint">
                        {provider.priceUnit}
                      </span>
                    ) : null}
                  </span>
                </>
              ) : (
                <span className="text-sm font-semibold text-ink">Preço sob consulta</span>
              )}
            </p>

            <Link
              href={`/prestador/${provider.id}`}
              className="inline-flex shrink-0 items-center gap-1 rounded-md pb-0.5 text-sm font-semibold text-brand transition-colors hover:text-brand-strong focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-ring/60"
            >
              Ver perfil
              <ArrowRight
                className="size-4 transition-[translate] duration-200 group-hover:translate-x-0.5 group-focus-within:translate-x-0.5 motion-reduce:translate-x-0 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </Link>
          </div>

          <ButtonLink
            href={`/prestador/${provider.id}?aba=orcamento`}
            variant="secondary"
            size="md"
            className="mt-3 w-full border-brand/25 text-brand hover:border-brand hover:bg-brand hover:text-white"
          >
            <CalendarCheck className="size-4" aria-hidden="true" />
            Solicitar orçamento
          </ButtonLink>
        </div>
      </CardContent>
    </Card>
  );
}

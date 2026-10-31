import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Link2, MapPin, Pencil } from "lucide-react";
import { CategoryIcon } from "@/components/category/category-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { getCategory } from "@/data/categories";
import { initialsFrom } from "@/lib/format";
import type { ProviderProfileDetails } from "@/lib/db";

export function PainelHeader({ details }: { details: ProviderProfileDetails }) {
  const category = getCategory(details.category);
  const location = details.neighborhood
    ? `${details.neighborhood}, ${details.city} — ${details.state}`
    : `${details.city} — ${details.state}`;

  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border border-line bg-surface shadow-card">
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-brand" />
      <CategoryIcon
        categoryId={category.id}
        className="pointer-events-none absolute -bottom-10 right-3 size-44 text-brand/[0.055] sm:right-8 sm:size-56"
      />

      <div className="relative p-5 pl-7 sm:p-7 sm:pl-9">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-4 sm:gap-5">
            <Avatar className="size-16 border-4 border-surface shadow-pop ring-1 ring-line sm:size-20">
              {details.avatar ? (
                <AvatarImage src={details.avatar} alt={`Foto de ${details.name}`} />
              ) : null}
              <AvatarFallback className="bg-brand-soft text-lg font-extrabold text-brand sm:text-xl">
                {initialsFrom(details.name)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="neutral" className="bg-brand-soft text-brand">
                  {category.name}
                </Badge>
                {details.verified ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand">
                    <BadgeCheck className="size-3.5" aria-hidden="true" />
                    Perfil verificado
                  </span>
                ) : null}
              </div>
              <h1 className="mt-2 truncate text-2xl font-extrabold tracking-[-0.04em] text-ink sm:text-3xl">
                {details.name}
              </h1>
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink-soft">
                <MapPin className="size-4 shrink-0 text-brand" aria-hidden="true" />
                <span className="truncate">{location}</span>
              </p>
              <Link
                href={`/prestador/${details.username}`}
                className="mt-1.5 inline-flex max-w-full items-center gap-1.5 text-xs font-medium text-ink-faint transition-colors hover:text-brand"
              >
                <Link2 className="size-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">festeja.com.br/prestador/{details.username}</span>
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:pl-[6.25rem] lg:pl-0">
            <ButtonLink href="/painel/perfil" variant="primary">
              <Pencil className="size-4" aria-hidden="true" />
              Editar perfil
            </ButtonLink>
            <ButtonLink href={`/prestador/${details.username}`} variant="secondary">
              Ver perfil público
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { EmptyState } from "@/components/search/empty-state";
import { SearchBar } from "@/components/search/search-bar";
import { SearchFiltersPanel } from "@/components/search/search-filters";
import { ProviderCard } from "@/components/provider/provider-card";
import { Container } from "@/components/ui/container";
import { getCategory } from "@/data/categories";
import { formatCount } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  buildSearchHref,
  countActiveFilters,
  defaultFilters,
  priceRanges,
  ratingOptions,
  sortOptions,
  type SearchFilters,
} from "@/lib/search";
import type { CategoryId, Provider } from "@/types";

type Chip = {
  key: string;
  label: string;
  onRemove: () => void;
};

type SearchPageProps = {
  providers: Provider[];
  total: number;
  page: number;
  pageCount: number;
  filters: SearchFilters;
  counts: Record<CategoryId, number>;
  neighborhoods: string[];
};

function visiblePages(page: number, pageCount: number): (number | "ellipsis")[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const pages: (number | "ellipsis")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(pageCount - 1, page + 1);

  if (start > 2) pages.push("ellipsis");
  for (let value = start; value <= end; value++) pages.push(value);
  if (end < pageCount - 1) pages.push("ellipsis");
  pages.push(pageCount);

  return pages;
}

export function SearchPage({
  providers,
  total,
  page,
  pageCount,
  filters,
  counts,
  neighborhoods,
}: SearchPageProps) {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [isPending, startTransition] = useTransition();
  const activeCount = countActiveFilters(filters);

  function apply(next: SearchFilters, nextPage = 1) {
    const href = buildSearchHref(next, nextPage);
    if (href === buildSearchHref(filters, page)) return;
    startTransition(() => router.push(href, { scroll: false }));
  }

  function update(patch: Partial<SearchFilters>) {
    apply({ ...filters, ...patch });
  }

  function clearFilters() {
    apply({ ...defaultFilters, sort: filters.sort });
  }

  const chips: Chip[] = [];

  if (filters.query) {
    chips.push({
      key: "query",
      label: `Busca: “${filters.query}”`,
      onRemove: () => update({ query: "" }),
    });
  }

  if (filters.location) {
    chips.push({
      key: "location",
      label: filters.location,
      onRemove: () => update({ location: "" }),
    });
  }

  for (const categoryId of filters.categories) {
    chips.push({
      key: `category-${categoryId}`,
      label: getCategory(categoryId).name,
      onRemove: () =>
        update({ categories: filters.categories.filter((id) => id !== categoryId) }),
    });
  }

  if (filters.priceRange !== "any") {
    const range = priceRanges.find((item) => item.id === filters.priceRange);
    chips.push({
      key: "price",
      label: range?.label ?? "",
      onRemove: () => update({ priceRange: "any" }),
    });
  }

  if (filters.rating !== "any") {
    const rating = ratingOptions.find((item) => item.id === filters.rating);
    chips.push({
      key: "rating",
      label: rating?.label ?? "",
      onRemove: () => update({ rating: "any" }),
    });
  }

  const pages = visiblePages(page, pageCount);

  return (
    <>
      <section className="border-b border-line bg-canvas">
        <Container className="py-8 sm:py-10">
          <h1 className="text-2xl font-semibold uppercase tracking-[0.04em] text-ink sm:text-3xl">
            {filters.query ? (
              <>
                Resultados para <span className="text-brand">“{filters.query}”</span>
              </>
            ) : (
              "Encontre prestadores"
            )}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-base">
            Compare portfólios, avaliações e preços de quem faz a festa acontecer.
          </p>

          <SearchBar
            key={`${filters.query}|${filters.location}`}
            className="mt-6"
            defaultQ={filters.query}
            defaultLocal={filters.location}
            onSubmit={(values) => update({ query: values.q, location: values.local })}
          />
        </Container>
      </section>

      <section className="bg-surface py-8 sm:py-10">
        <Container>
          <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-8">
            <div className="lg:contents">
              <button
                type="button"
                aria-expanded={showFilters}
                aria-controls="filtros-busca"
                onClick={() => setShowFilters((value) => !value)}
                className="flex w-full items-center justify-between gap-2 rounded-2xl border border-line-strong bg-surface px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-brand/50 lg:hidden"
              >
                <span className="flex items-center gap-2">
                  <SlidersHorizontal className="size-4 text-ink-faint" aria-hidden="true" />
                  Filtros{activeCount > 0 ? ` (${activeCount})` : ""}
                </span>
                {showFilters ? (
                  <X className="size-4" aria-hidden="true" />
                ) : (
                  <ChevronDown className="size-4" aria-hidden="true" />
                )}
              </button>

              <div
                id="filtros-busca"
                className={cn(showFilters ? "mt-4 block" : "hidden", "lg:mt-0 lg:block")}
              >
                <SearchFiltersPanel
                  filters={filters}
                  counts={counts}
                  neighborhoods={neighborhoods}
                  activeCount={activeCount}
                  onChange={update}
                  onClear={clearFilters}
                />
              </div>
            </div>

            <div className="mt-6 lg:mt-0">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p role="status" aria-live="polite" className="text-sm text-ink-soft">
                  <span className="font-semibold text-ink">{formatCount(total)}</span>{" "}
                  {total === 1 ? "prestador" : "prestadores"}
                  {total === 1 ? " encontrado" : " encontrados"}
                </p>

                <label className="flex items-center gap-2 text-sm text-ink-soft">
                  Ordenar por
                  <select
                    value={filters.sort}
                    onChange={(event) =>
                      update({ sort: event.target.value as SearchFilters["sort"] })
                    }
                    className="h-10 rounded-xl border border-line-strong bg-surface px-3 text-sm text-ink transition-colors hover:border-brand/50 focus:outline-none"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {chips.length > 0 ? (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {chips.map((chip) => (
                    <li key={chip.key}>
                      <button
                        type="button"
                        onClick={chip.onRemove}
                        className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1.5 text-sm font-medium text-brand transition-colors hover:bg-brand hover:text-white"
                      >
                        {chip.label}
                        <X className="size-3.5" aria-hidden="true" />
                        <span className="sr-only">Remover filtro</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div
                id="resultados"
                aria-busy={isPending}
                className={cn("transition-opacity", isPending && "opacity-60")}
              >
                {providers.length > 0 ? (
                  <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {providers.map((provider) => (
                      <ProviderCard key={provider.id} provider={provider} />
                    ))}
                  </div>
                ) : (
                  <div className="mt-6">
                    <EmptyState hasFilters={activeCount > 0} onClear={clearFilters} />
                  </div>
                )}
              </div>

              {pageCount > 1 ? (
                <nav
                  aria-label="Paginação"
                  className="mt-8 flex flex-wrap items-center justify-center gap-2"
                >
                  {page > 1 ? (
                    <Link
                      href={buildSearchHref(filters, page - 1)}
                      prefetch={false}
                      aria-label="Página anterior"
                      className="inline-flex size-9 items-center justify-center rounded-xl border border-line-strong text-ink-soft transition-colors hover:border-brand/50 hover:text-brand"
                    >
                      <ChevronLeft className="size-4" aria-hidden="true" />
                    </Link>
                  ) : (
                    <span
                      aria-disabled="true"
                      className="inline-flex size-9 items-center justify-center rounded-xl border border-line text-ink-faint/50"
                    >
                      <ChevronLeft className="size-4" aria-hidden="true" />
                    </span>
                  )}

                  {pages.map((item, index) =>
                    item === "ellipsis" ? (
                      <span key={`ellipsis-${index}`} className="px-1 text-sm text-ink-faint">
                        …
                      </span>
                    ) : item === page ? (
                      <span
                        key={item}
                        aria-current="page"
                        className="inline-flex size-9 items-center justify-center rounded-xl bg-brand text-sm font-bold text-white"
                      >
                        {item}
                      </span>
                    ) : (
                      <Link
                        key={item}
                        href={buildSearchHref(filters, item)}
                        prefetch={false}
                        aria-label={`Página ${item}`}
                        className="inline-flex size-9 items-center justify-center rounded-xl border border-line-strong text-sm font-medium text-ink-soft transition-colors hover:border-brand/50 hover:text-brand"
                      >
                        {item}
                      </Link>
                    ),
                  )}

                  {page < pageCount ? (
                    <Link
                      href={buildSearchHref(filters, page + 1)}
                      prefetch={false}
                      aria-label="Próxima página"
                      className="inline-flex size-9 items-center justify-center rounded-xl border border-line-strong text-ink-soft transition-colors hover:border-brand/50 hover:text-brand"
                    >
                      <ChevronRight className="size-4" aria-hidden="true" />
                    </Link>
                  ) : (
                    <span
                      aria-disabled="true"
                      className="inline-flex size-9 items-center justify-center rounded-xl border border-line text-ink-faint/50"
                    >
                      <ChevronRight className="size-4" aria-hidden="true" />
                    </span>
                  )}
                </nav>
              ) : null}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

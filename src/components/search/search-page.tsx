"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
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
  countByCategory,
  defaultFilters,
  listNeighborhoods,
  parseSearchFilters,
  priceRanges,
  ratingOptions,
  searchProviders,
  sortOptions,
  type SearchFilters,
} from "@/lib/search";
import type { Provider } from "@/types";

type Chip = {
  key: string;
  label: string;
  onRemove: () => void;
};

type SearchPageProps = {
  providers: Provider[];
};

export function SearchPage({ providers }: SearchPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const filters = useMemo(() => parseSearchFilters(searchParams), [searchParams]);
  const counts = useMemo(() => countByCategory(providers), [providers]);
  const neighborhoods = useMemo(() => listNeighborhoods(providers), [providers]);
  const results = useMemo(() => searchProviders(providers, filters), [providers, filters]);
  const activeCount = countActiveFilters(filters);

  function apply(next: SearchFilters) {
    router.replace(buildSearchHref(next), { scroll: false });
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
                  <span className="font-semibold text-ink">
                    {formatCount(results.length)}
                  </span>{" "}
                  {results.length === 1 ? "prestador" : "prestadores"}
                  {results.length === 1 ? " encontrado" : " encontrados"}
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

              {results.length > 0 ? (
                <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {results.map((provider) => (
                    <ProviderCard key={provider.id} provider={provider} />
                  ))}
                </div>
              ) : (
                <div className="mt-6">
                  <EmptyState hasFilters={activeCount > 0} onClear={clearFilters} />
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

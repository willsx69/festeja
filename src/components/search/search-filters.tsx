"use client";

import { categories } from "@/data/categories";
import {
  priceRanges,
  ratingOptions,
  type SearchFilters,
} from "@/lib/search";
import { formatCount } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CategoryId } from "@/types";

type SearchFiltersProps = {
  filters: SearchFilters;
  counts: Record<CategoryId, number>;
  neighborhoods: string[];
  activeCount: number;
  onChange: (patch: Partial<SearchFilters>) => void;
  onClear: () => void;
  className?: string;
};

export function SearchFiltersPanel({
  filters,
  counts,
  neighborhoods,
  activeCount,
  onChange,
  onClear,
  className,
}: SearchFiltersProps) {
  const selectedLocation = filters.location;
  const isKnownLocation = neighborhoods.includes(selectedLocation);

  function toggleCategory(categoryId: CategoryId) {
    const selected = filters.categories.includes(categoryId);
    onChange({
      categories: selected
        ? filters.categories.filter((id) => id !== categoryId)
        : [...filters.categories, categoryId],
    });
  }

  return (
    <aside
      aria-label="Filtros de busca"
      className={cn(
        "flex flex-col gap-6 rounded-2xl border border-line bg-surface p-5 shadow-card",
        "lg:sticky lg:top-24 lg:max-h-[calc(100dvh-8rem)] lg:self-start lg:overflow-y-auto",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-ink">Filtros</h2>
        <button
          type="button"
          onClick={onClear}
          disabled={activeCount === 0}
          className="text-sm font-medium text-brand transition-colors hover:text-brand-strong disabled:cursor-not-allowed disabled:text-ink-faint"
        >
          Limpar{activeCount > 0 ? ` (${activeCount})` : ""}
        </button>
      </div>

      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
          Categorias
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((category) => {
            const active = filters.categories.includes(category.id);
            const count = counts[category.id] ?? 0;
            return (
              <button
                key={category.id}
                type="button"
                aria-pressed={active}
                onClick={() => toggleCategory(category.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "border-brand bg-brand text-white"
                    : "border-line-strong bg-surface text-ink-soft hover:border-brand/50 hover:text-ink",
                )}
              >
                {category.name}
                <span
                  className={cn(
                    "text-xs tabular-nums",
                    active ? "text-white/90" : "text-ink-faint",
                  )}
                >
                  {formatCount(count)}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
          Localização
        </legend>
        <select
          value={filters.location}
          onChange={(event) => onChange({ location: event.target.value })}
          className="mt-3 h-11 w-full rounded-xl border border-line-strong bg-surface px-3 text-sm text-ink transition-colors hover:border-brand/50 focus:outline-none"
        >
          <option value="">Todos os bairros de Manaus</option>
          {selectedLocation && !isKnownLocation ? (
            <option value={selectedLocation}>{selectedLocation}</option>
          ) : null}
          {neighborhoods.map((neighborhood) => (
            <option key={neighborhood} value={neighborhood}>
              {neighborhood}
            </option>
          ))}
        </select>
      </fieldset>

      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
          Faixa de preço
        </legend>
        <select
          value={filters.priceRange}
          onChange={(event) =>
            onChange({ priceRange: event.target.value as SearchFilters["priceRange"] })
          }
          className="mt-3 h-11 w-full rounded-xl border border-line-strong bg-surface px-3 text-sm text-ink transition-colors hover:border-brand/50 focus:outline-none"
        >
          {priceRanges.map((range) => (
            <option key={range.id} value={range.id}>
              {range.label}
            </option>
          ))}
        </select>
      </fieldset>

      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
          Avaliação
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {ratingOptions.map((option) => {
            const active = filters.rating === option.id;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ rating: option.id })}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "border-brand bg-brand text-white"
                    : "border-line-strong bg-surface text-ink-soft hover:border-brand/50 hover:text-ink",
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </fieldset>
    </aside>
  );
}

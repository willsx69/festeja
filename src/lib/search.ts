import { categories, getCategory } from "@/data/categories";
import type { CategoryId, Provider } from "@/types";

export const priceRanges = [
  { id: "any", label: "Qualquer valor", min: 0, max: Number.POSITIVE_INFINITY },
  { id: "0-500", label: "Até R$ 500", min: 0, max: 500 },
  { id: "500-1000", label: "R$ 500 a R$ 1.000", min: 500, max: 1000 },
  { id: "1000-2000", label: "R$ 1.000 a R$ 2.000", min: 1000, max: 2000 },
  { id: "2000+", label: "Acima de R$ 2.000", min: 2000, max: Number.POSITIVE_INFINITY },
] as const;

export type PriceRangeId = (typeof priceRanges)[number]["id"];

export const ratingOptions = [
  { id: "any", label: "Qualquer", min: 0 },
  { id: "4", label: "4,0 ou mais", min: 4 },
  { id: "4.5", label: "4,5 ou mais", min: 4.5 },
  { id: "4.8", label: "4,8 ou mais", min: 4.8 },
] as const;

export type RatingId = (typeof ratingOptions)[number]["id"];

export const sortOptions = [
  { id: "relevance", label: "Relevância" },
  { id: "rating", label: "Melhor avaliação" },
  { id: "reviews", label: "Mais avaliações" },
  { id: "price-asc", label: "Menor preço" },
  { id: "price-desc", label: "Maior preço" },
] as const;

export type SortId = (typeof sortOptions)[number]["id"];

export const SEARCH_PAGE_SIZE = 9;

export type SearchFilters = {
  query: string;
  location: string;
  categories: CategoryId[];
  priceRange: PriceRangeId;
  rating: RatingId;
  sort: SortId;
};

export const defaultFilters: SearchFilters = {
  query: "",
  location: "",
  categories: [],
  priceRange: "any",
  rating: "any",
  sort: "relevance",
};

export function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function matchesQuery(provider: Provider, query: string): boolean {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;

  const haystack = normalize(
    [
      provider.name,
      getCategory(provider.category).name,
      provider.city,
      provider.state,
      provider.neighborhood,
      ...provider.tags,
    ].join(" "),
  );

  return terms.every((term) => haystack.includes(term));
}

function matchesLocation(provider: Provider, location: string): boolean {
  const terms = normalize(location)
    .split(/[\s,/-]+/)
    .filter(Boolean);
  if (terms.length === 0) return true;
  const words = normalize(`${provider.city} ${provider.state} ${provider.neighborhood}`)
    .split(/[\s-]+/)
    .filter(Boolean);
  return terms.every((term) => words.some((word) => word.startsWith(term)));
}

function sortProviders(providers: Provider[], sort: SortId): Provider[] {
  const list = [...providers];

  switch (sort) {
    case "rating":
      return list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    case "reviews":
      return list.sort((a, b) => b.reviews - a.reviews);
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    default:
      return list;
  }
}

export function searchProviders(
  providers: Provider[],
  filters: SearchFilters,
): Provider[] {
  const range = priceRanges.find((item) => item.id === filters.priceRange) ?? priceRanges[0];
  const minimumRating =
    ratingOptions.find((item) => item.id === filters.rating)?.min ?? 0;

  const results = providers.filter(
    (provider) =>
      matchesQuery(provider, filters.query) &&
      matchesLocation(provider, filters.location) &&
      (filters.categories.length === 0 ||
        filters.categories.includes(provider.category)) &&
      provider.price >= range.min &&
      provider.price <= range.max &&
      provider.rating >= minimumRating,
  );

  return sortProviders(results, filters.sort);
}

export function countByCategory(providers: Provider[]): Record<CategoryId, number> {
  const counts = {} as Record<CategoryId, number>;

  for (const provider of providers) {
    counts[provider.category] = (counts[provider.category] ?? 0) + 1;
  }

  return counts;
}

export function listCities(providers: Provider[]): string[] {
  return [...new Set(providers.map((provider) => provider.city))].sort((a, b) =>
    a.localeCompare(b, "pt-BR"),
  );
}

export function listNeighborhoods(providers: Provider[]): string[] {
  return [
    ...new Set(
      providers
        .filter((provider) => provider.neighborhood)
        .map((provider) => provider.neighborhood),
    ),
  ].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export function countActiveFilters(filters: SearchFilters): number {
  return (
    filters.categories.length +
    (filters.location ? 1 : 0) +
    (filters.priceRange !== "any" ? 1 : 0) +
    (filters.rating !== "any" ? 1 : 0) +
    (filters.query ? 1 : 0)
  );
}

function isCategoryId(value: string): value is CategoryId {
  return categories.some((category) => category.id === value);
}

export function parseSearchFilters(params: URLSearchParams): SearchFilters {
  const categoriesParam = (params.get("categoria") ?? "")
    .split(",")
    .filter(isCategoryId);

  const priceParam = params.get("preco");
  const ratingParam = params.get("avaliacao");
  const sortParam = params.get("ordem");

  return {
    query: params.get("q") ?? "",
    location: params.get("local") ?? "",
    categories: [...new Set(categoriesParam)],
    priceRange: priceRanges.some((range) => range.id === priceParam)
      ? (priceParam as PriceRangeId)
      : "any",
    rating: ratingOptions.some((option) => option.id === ratingParam)
      ? (ratingParam as RatingId)
      : "any",
    sort: sortOptions.some((option) => option.id === sortParam)
      ? (sortParam as SortId)
      : "relevance",
  };
}

export function parseSearchFiltersFromRecord(
  record: Record<string, string | string[] | undefined>,
): SearchFilters {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(record)) {
    const first = Array.isArray(value) ? value[0] : value;
    if (first !== undefined) params.set(key, first);
  }

  return parseSearchFilters(params);
}

export function normalizeSearchPage(
  value: string | string[] | undefined,
  pageCount: number,
): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(raw ?? "1", 10);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.min(parsed, pageCount);
}

export function buildSearchHref(filters: SearchFilters, page = 1): string {
  const params = new URLSearchParams();

  if (filters.query) params.set("q", filters.query);
  if (filters.location) params.set("local", filters.location);
  if (filters.categories.length > 0) params.set("categoria", filters.categories.join(","));
  if (filters.priceRange !== "any") params.set("preco", filters.priceRange);
  if (filters.rating !== "any") params.set("avaliacao", filters.rating);
  if (filters.sort !== "relevance") params.set("ordem", filters.sort);
  if (page > 1) params.set("pagina", String(page));

  const query = params.toString();
  return query ? `/buscar?${query}` : "/buscar";
}

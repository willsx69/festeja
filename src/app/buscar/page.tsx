import { Suspense } from "react";
import { io } from "next/cache";
import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { SearchPage } from "@/components/search/search-page";
import { SearchSkeleton } from "@/components/search/search-skeleton";
import { getAllProviders } from "@/data/providers";
import {
  countByCategory,
  listNeighborhoods,
  normalizeSearchPage,
  parseSearchFiltersFromRecord,
  searchProviders,
  SEARCH_PAGE_SIZE,
} from "@/lib/search";

export const metadata: Metadata = {
  title: "Buscar prestadores",
  description:
    "Encontre confeiteiros, decoradores, buffets, DJs, fotógrafos e animadores em Manaus por bairro, preço e avaliação.",
};

async function SearchResults({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await io();
  const [providers, params] = await Promise.all([getAllProviders(), searchParams]);
  const filters = parseSearchFiltersFromRecord(params);
  const results = searchProviders(providers, filters);
  const pageCount = Math.max(1, Math.ceil(results.length / SEARCH_PAGE_SIZE));
  const page = normalizeSearchPage(params.pagina, pageCount);
  const start = (page - 1) * SEARCH_PAGE_SIZE;

  return (
    <SearchPage
      providers={results.slice(start, start + SEARCH_PAGE_SIZE)}
      total={results.length}
      page={page}
      pageCount={pageCount}
      filters={filters}
      counts={countByCategory(providers)}
      neighborhoods={listNeighborhoods(providers)}
    />
  );
}

export default function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <div id="top" className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<SearchSkeleton />}>
          <SearchResults searchParams={searchParams} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

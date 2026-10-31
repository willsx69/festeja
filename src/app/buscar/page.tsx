import { Suspense } from "react";
import { io } from "next/cache";
import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { SearchPage } from "@/components/search/search-page";
import { SearchSkeleton } from "@/components/search/search-skeleton";
import { getAllProviders } from "@/data/providers";
import type { Provider } from "@/types";

export const metadata: Metadata = {
  title: "Buscar prestadores",
  description:
    "Encontre confeiteiros, decoradores, buffets, DJs, fotógrafos e animadores em Manaus por bairro, preço e avaliação.",
};

async function SearchResults() {
  await io();
  const providers: Provider[] = await getAllProviders();
  return <SearchPage providers={providers} />;
}

export default function BuscarPage() {
  return (
    <div id="top" className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<SearchSkeleton />}>
          <SearchResults />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

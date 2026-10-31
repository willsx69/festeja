import { Suspense } from "react";
import { io } from "next/cache";
import { ProviderCard } from "@/components/provider/provider-card";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { getFeaturedProviders } from "@/data/providers";

function FeaturedGridSkeleton() {
  return (
    <div className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[18px] border border-line bg-surface"
        >
          <div className="aspect-[16/9] animate-pulse bg-surface-muted" />
          <div className="space-y-3 p-5">
            <div className="h-5 w-2/3 animate-pulse rounded-md bg-surface-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded-md bg-surface-muted" />
            <div className="h-7 w-24 animate-pulse rounded-md bg-surface-muted" />
            <div className="h-11 animate-pulse rounded-xl bg-surface-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

async function FeaturedProvidersGrid() {
  await io();
  const featured = await getFeaturedProviders();

  return (
    <div className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
      {featured.map((provider) => (
        <ProviderCard key={provider.id} provider={provider} />
      ))}
    </div>
  );
}

export function FeaturedProviders() {
  return (
    <section id="destaques" className="border-b border-line bg-canvas py-16 sm:py-24">
      <Container>
        <SectionHeader
          eyebrow="Destaques"
          eyebrowStyle="pill"
          title="Destaques da nossa rede"
          description="Conheça profissionais de Manaus, compare trabalhos e peça um orçamento sem sair da plataforma."
          action={
            <ButtonLink href="/buscar" variant="secondary" size="md">
              Ver todos
            </ButtonLink>
          }
        />

        <Suspense fallback={<FeaturedGridSkeleton />}>
          <FeaturedProvidersGrid />
        </Suspense>
      </Container>
    </section>
  );
}

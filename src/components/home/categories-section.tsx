import { Suspense } from "react";
import { io } from "next/cache";
import { ArrowRight } from "lucide-react";
import { CategoryCard } from "@/components/category/category-card";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { categories } from "@/data/categories";
import { getAllProviders } from "@/data/providers";
import { countByCategory } from "@/lib/search";

function CategoriesGridSkeleton() {
  return (
    <div className="mt-10 grid grid-cols-1 gap-x-5 gap-y-6 min-[480px]:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: categories.length }).map((_, index) => (
        <div
          key={index}
          className="aspect-[1.18] animate-pulse rounded-[1.25rem] border border-line bg-surface-muted"
        />
      ))}
    </div>
  );
}

async function CategoriesGrid() {
  await io();
  const counts = countByCategory(await getAllProviders());

  return (
    <ul className="mt-10 grid grid-cols-1 gap-x-5 gap-y-6 min-[480px]:grid-cols-2 lg:grid-cols-4">
      {categories.map((category) => (
        <li key={category.id}>
          <CategoryCard category={category} count={counts[category.id] ?? 0} />
        </li>
      ))}
    </ul>
  );
}

export function CategoriesSection() {
  return (
    <section id="categorias" className="border-b border-line bg-surface py-16 sm:py-20">
      <Container>
        <SectionHeader
          eyebrow="Categorias"
          title="Tudo o que sua festa precisa"
          description="Escolha uma categoria e descubra profissionais de Manaus com portfólio, avaliações e serviços para o seu evento."
          action={
            <a
              href="#destaques"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand transition-colors hover:text-brand-strong"
            >
              Ver destaques
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          }
        />

        <Suspense fallback={<CategoriesGridSkeleton />}>
          <CategoriesGrid />
        </Suspense>
      </Container>
    </section>
  );
}

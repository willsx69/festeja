import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { CategoryIcon } from "@/components/category/category-icon";
import { Card, CardContent } from "@/components/ui/card";
import { categoryImageAlt, categoryImages } from "@/data/categories";
import { formatCount } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Category, Tone } from "@/types";

const iconTones: Record<Tone, string> = {
  brand: "border-brand/15 bg-brand-soft text-brand",
  pink: "border-pink/20 bg-pink-soft text-pink-strong",
  yellow: "border-yellow/40 bg-yellow-soft text-ink",
};

const fallbackTones: Record<Tone, string> = {
  brand: "bg-brand-soft text-brand/20",
  pink: "bg-pink-soft text-pink/25",
  yellow: "bg-yellow-soft text-yellow/45",
};

export function CategoryCard({ category, count }: { category: Category; count: number }) {
  const image = categoryImages[category.id];
  const countLabel =
    count === 0
      ? "Nenhum profissional"
      : `${formatCount(count)} ${count === 1 ? "profissional" : "profissionais"}`;

  return (
    <Link
      href={`/buscar?categoria=${category.id}`}
      aria-label={`Ver profissionais de ${category.name}`}
      className="group block h-full cursor-pointer rounded-[1.25rem] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
    >
      <Card
        padded={false}
        className="h-full overflow-hidden rounded-[1.25rem] transition-[translate,border-color,box-shadow] duration-[220ms] group-hover:-translate-y-[3px] group-hover:border-brand/35 group-hover:shadow-[0_18px_42px_-28px_rgb(84_40_214_/_0.45)] group-focus-visible:border-brand/35 motion-reduce:translate-y-0 motion-reduce:transition-none"
      >
        <div className="relative aspect-video overflow-hidden bg-surface-muted">
          {image ? (
            <Image
              src={image}
              alt={categoryImageAlt[category.id] ?? `Serviço de ${category.name}`}
              fill
              sizes="(max-width: 479px) 100vw, (max-width: 1023px) 50vw, 25vw"
              className="object-cover transition-[scale] duration-[220ms] group-hover:scale-[1.03] motion-reduce:scale-100 motion-reduce:transition-none"
            />
          ) : (
            <div
              aria-hidden="true"
              data-category-fallback={category.id}
              className={cn("relative size-full overflow-hidden", fallbackTones[category.tone])}
            >
              <span className="absolute -right-8 -top-10 size-32 rounded-full border-[18px] border-current opacity-35" />
              <span className="absolute bottom-5 left-6 size-3 rounded-full bg-yellow" />
              <span className="absolute left-12 top-6 size-2 rounded-full bg-pink" />
              <CategoryIcon categoryId={category.id} className="absolute -bottom-5 right-3 size-32" />
            </div>
          )}
          <span className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-ink/20 to-transparent" aria-hidden="true" />
        </div>

        <CardContent className="relative flex min-h-28 items-end p-4 pt-8 sm:p-5 sm:pt-8">
          <span
            aria-hidden="true"
            className={cn(
              "absolute -top-6 left-4 inline-flex size-12 items-center justify-center rounded-2xl border shadow-[0_8px_18px_-12px_rgb(23_22_37_/_0.35)] sm:left-5",
              iconTones[category.tone],
            )}
          >
            <CategoryIcon categoryId={category.id} className="size-5" />
          </span>

          <span className="flex w-full min-w-0 items-end justify-between gap-3">
            <span className="min-w-0">
              <span className="block text-base font-extrabold uppercase leading-tight tracking-[-0.02em] text-ink transition-colors duration-[220ms] group-hover:text-brand">
                {category.name}
              </span>
              <span className="mt-1.5 block text-sm font-medium text-ink-faint">
                {countLabel}
              </span>
            </span>
            <ArrowUpRight
              className="mb-1 size-5 shrink-0 text-ink-faint transition-[color,translate] duration-[220ms] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}

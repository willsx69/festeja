import { Suspense, type ReactNode } from "react";
import { io } from "next/cache";
import { CalendarCheck, MessageCircle, Search, Star } from "lucide-react";
import { Container } from "@/components/ui/container";
import { categories } from "@/data/categories";
import { getAllProviders } from "@/data/providers";
import { formatCount, formatRating } from "@/lib/format";
import { listNeighborhoods } from "@/lib/search";

const perks = [
  {
    icon: Search,
    title: "Compare antes de escolher",
    description: "Preços, portfólios e avaliações lado a lado.",
  },
  {
    icon: MessageCircle,
    title: "Converse direto com quem atende",
    description: "Tire dúvidas antes de fechar o serviço.",
  },
  {
    icon: CalendarCheck,
    title: "Acompanhe seus pedidos",
    description: "Tudo organizado em um lugar só.",
  },
  {
    icon: Star,
    title: "Avalie depois da festa",
    description: "Conte como foi e ajude quem vem depois.",
  },
];

async function AuthStats() {
  await io();
  const providers = await getAllProviders();
  const average =
    providers.reduce((total, provider) => total + provider.rating, 0) / providers.length;

  const stats = [
    { value: formatCount(providers.length), label: "prestadores" },
    { value: formatCount(categories.length), label: "categorias" },
    { value: formatCount(listNeighborhoods(providers).length), label: "bairros" },
    { value: formatRating(average), label: "nota média" },
  ];

  return (
    <dl className="mt-9 grid grid-cols-2 gap-4 border-t border-line pt-6 sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label}>
          <dt className="sr-only">{stat.label}</dt>
          <dd className="text-2xl font-semibold tabular-nums text-ink">
            {stat.value}
          </dd>
          <p className="mt-0.5 text-xs text-ink-faint">{stat.label}</p>
        </div>
      ))}
    </dl>
  );
}

function AuthStatsSkeleton() {
  return (
    <dl className="mt-9 grid grid-cols-2 gap-4 border-t border-line pt-6 sm:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index}>
          <div className="h-8 w-16 animate-pulse rounded-lg bg-surface-muted" />
          <div className="mt-1.5 h-3 w-14 animate-pulse rounded bg-surface-muted" />
        </div>
      ))}
    </dl>
  );
}

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthShell({ title, description, children }: AuthShellProps) {
  return (
    <section className="bg-canvas">
      <Container className="py-10 sm:py-14">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
              Sua conta na Festeja
            </p>
            <h1 className="mt-3 text-3xl font-semibold uppercase tracking-[0.04em] text-ink sm:text-4xl">
              {title}
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-soft">
              {description}
            </p>

            <ul className="mt-8 grid gap-5 sm:grid-cols-2">
              {perks.map((perk) => {
                const Icon = perk.icon;
                return (
                  <li key={perk.title} className="flex gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink">{perk.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                        {perk.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <Suspense fallback={<AuthStatsSkeleton />}>
              <AuthStats />
            </Suspense>
          </div>

          <div className="rounded-3xl border border-line bg-surface p-5 shadow-card sm:p-7">
            {children}
          </div>
        </div>
      </Container>
    </section>
  );
}

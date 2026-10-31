import { Eye, Pencil } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { formatCount, formatRating } from "@/lib/format";

type OwnerMetricsProps = {
  views: number;
  favorites: number;
  reviews: number;
  rating: number;
  contractsConcluded: number;
  positivePercent: number;
  ownerHref: string;
  ownerLabel: string;
};

export function OwnerMetrics({
  views,
  favorites,
  reviews,
  rating,
  contractsConcluded,
  positivePercent,
  ownerHref,
  ownerLabel,
}: OwnerMetricsProps) {
  const items = [
    { label: "Visitas ao perfil", value: formatCount(views) },
    { label: "Favoritos", value: formatCount(favorites) },
    { label: "Nota média", value: reviews > 0 ? formatRating(rating) : "—" },
    { label: "Contratos concluídos", value: formatCount(contractsConcluded) },
    {
      label: "Avaliações positivas",
      value: reviews > 0 ? `${positivePercent}%` : "—",
    },
  ];

  return (
    <section aria-label="Métricas do perfil" className="bg-ink text-white">
      <Container className="py-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-yellow text-ink">
              <Eye className="size-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold">Visão do proprietário</p>
              <p className="mt-0.5 text-xs text-white/55">
                Estas métricas não aparecem para os clientes.
              </p>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-3 lg:grid-cols-5">
            {items.map((item) => (
              <div key={item.label}>
                <dt className="min-h-7 text-[0.68rem] font-medium leading-tight text-white/55">
                  {item.label}
                </dt>
                <dd className="mt-0.5 text-lg font-extrabold tabular-nums leading-tight">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>

          <ButtonLink href={ownerHref} variant="accent" size="sm" className="w-fit">
            <Pencil className="size-4" aria-hidden="true" />
            {ownerLabel}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

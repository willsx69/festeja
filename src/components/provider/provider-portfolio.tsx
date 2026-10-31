"use client";

import { useState } from "react";
import { Images } from "lucide-react";
import { ProfileSection } from "@/components/provider/profile-section";
import { PortfolioGrid, PortfolioLightbox } from "@/components/provider/portfolio-lightbox";
import { ButtonLink } from "@/components/ui/button";
import type { CategoryId, PortfolioItem } from "@/types";

type ProviderPortfolioProps = {
  items: PortfolioItem[];
  categoryId: CategoryId;
  isOwner?: boolean;
  className?: string;
};

export function ProviderPortfolio({
  items,
  categoryId,
  isOwner = false,
  className,
}: ProviderPortfolioProps) {
  const [index, setIndex] = useState<number | null>(null);

  if (items.length === 0) {
    return (
      <ProfileSection
        title="Portfólio"
        description="Trabalhos recentes realizados para outros eventos."
        className={className}
      >
        <div className="rounded-[1.35rem] border border-dashed border-line-strong bg-surface-muted/60 px-5 py-10 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-surface text-brand shadow-card">
            <Images className="size-5" aria-hidden="true" />
          </span>
          <p className="mt-4 text-base font-semibold text-ink">Ainda sem trabalhos publicados</p>
          <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-ink-soft">
            {isOwner
              ? "Adicione fotos de eventos no painel para mostrar seu estilo a quem visita o perfil."
              : "Quando o prestador publicar fotos, elas aparecem aqui. Você também pode pedir referências no orçamento."}
          </p>
          {isOwner ? (
            <ButtonLink href="/painel/portfolio" variant="secondary" className="mt-5">
              Adicionar trabalhos
            </ButtonLink>
          ) : null}
        </div>
      </ProfileSection>
    );
  }

  return (
    <ProfileSection
      title="Portfólio"
      description="Trabalhos recentes realizados para outros eventos."
      className={className}
    >
      <PortfolioGrid items={items} categoryId={categoryId} onOpen={setIndex} />
      <PortfolioLightbox
        items={items}
        categoryId={categoryId}
        index={index}
        onClose={() => setIndex(null)}
        onNavigate={setIndex}
      />
    </ProfileSection>
  );
}

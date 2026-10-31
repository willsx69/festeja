import { ProfileSection } from "@/components/provider/profile-section";
import { Card } from "@/components/ui/card";
import { formatBRL, hasPrice } from "@/lib/format";
import type { ProviderService } from "@/types";

type ProviderServicesProps = {
  services: ProviderService[];
  className?: string;
};

export function ProviderServices({ services, className }: ProviderServicesProps) {
  return (
    <ProfileSection
      title="Serviços"
      description="Valores de referência. O valor final depende do escopo combinado com o prestador."
      className={className}
    >
      {services.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line-strong bg-surface-muted/60 px-5 py-10 text-center">
          <p className="text-base font-semibold text-ink">Nenhum serviço publicado</p>
          <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-ink-soft">
            Peça um orçamento para saber o que pode ser combinado com este prestador.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {services.map((service) => (
            <li key={service.id}>
              <Card
                padded={false}
                className="group flex h-full flex-col rounded-[1.35rem] p-5 transition-colors hover:border-brand/30 hover:bg-brand-soft/15"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-[1.05rem] font-bold leading-snug tracking-[-0.015em] text-ink">
                    {service.name}
                  </h3>
                  <div className="shrink-0 rounded-xl bg-brand-soft px-3 py-2 text-right">
                    {hasPrice(service.price) ? (
                      <>
                        <span className="block text-[0.65rem] font-medium leading-none text-brand/70">
                          A partir de
                        </span>
                        <span className="mt-1 block text-base font-extrabold leading-none tracking-[-0.02em] tabular-nums text-ink">
                          {formatBRL(service.price)}
                        </span>
                        {service.priceUnit ? (
                          <span className="mt-1 block text-[0.65rem] leading-none text-ink-faint">
                            {service.priceUnit}
                          </span>
                        ) : null}
                      </>
                    ) : (
                      <span className="text-sm font-semibold text-brand">Sob consulta</span>
                    )}
                  </div>
                </div>

                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
                  {service.description}
                </p>

                <p className="mt-4 border-t border-dashed border-line pt-3 text-xs text-ink-faint">
                  Combine detalhes, data e valores no orçamento.
                </p>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </ProfileSection>
  );
}

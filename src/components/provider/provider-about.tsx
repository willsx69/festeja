import { CalendarDays, MapPin } from "lucide-react";
import { ProfileSection } from "@/components/provider/profile-section";
import { getCategory } from "@/data/categories";
import { formatAvailabilitySummary } from "@/lib/profile-display";
import type { Provider, ProviderAvailability } from "@/types";

type ProviderAboutProps = {
  provider: Provider;
  about: string;
  availability?: ProviderAvailability;
  className?: string;
};

export function ProviderAbout({
  provider,
  about,
  availability,
  className,
}: ProviderAboutProps) {
  const location = provider.neighborhood
    ? `${provider.neighborhood}, ${provider.city} — ${provider.state}`
    : `${provider.city} — ${provider.state}`;
  const activeDays = formatAvailabilitySummary(availability?.days ?? []);
  const category = getCategory(provider.category);

  return (
    <ProfileSection
      title="Sobre o trabalho"
      description="Apresentação, área de atendimento e especialidades."
      className={className}
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-10">
        <div className="min-w-0">
          {about.trim() ? (
            <p className="max-w-[68ch] text-[1.0625rem] leading-8 text-ink-soft">{about}</p>
          ) : (
            <div className="max-w-[62ch] rounded-2xl border border-dashed border-line-strong bg-surface-muted/60 px-5 py-6">
              <p className="text-sm font-semibold text-ink">
                Este prestador ainda não escreveu uma apresentação.
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-faint">
                Você pode conhecer o trabalho pelo portfólio ou perguntar direto no
                orçamento.
              </p>
            </div>
          )}

          {provider.tags.length > 0 ? (
            <div className="mt-7">
              <h3 className="text-sm font-semibold text-ink">Especialidades</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {provider.tags.map((tag) => (
                  <li key={tag}>
                    <span className="inline-flex rounded-full border border-brand/15 bg-brand-soft px-3 py-1.5 text-sm font-medium text-brand-strong">
                      {tag}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <dl className="h-fit space-y-4 border-t border-line pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
          <div>
            <dt className="flex items-center gap-2 text-xs font-medium text-ink-faint">
              <MapPin className="size-3.5 text-brand" aria-hidden="true" />
              Área de atendimento
            </dt>
            <dd className="mt-1 text-sm font-semibold leading-relaxed text-ink">{location}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-2 text-xs font-medium text-ink-faint">
              <CalendarDays className="size-3.5 text-brand" aria-hidden="true" />
              Agenda
            </dt>
            <dd className="mt-1 text-sm font-semibold leading-relaxed text-ink">
              {activeDays}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-ink-faint">Categoria</dt>
            <dd className="mt-1 text-sm font-semibold text-ink">{category.name}</dd>
          </div>
        </dl>
      </div>
    </ProfileSection>
  );
}

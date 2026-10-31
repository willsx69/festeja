import { CalendarClock, CalendarDays, Clock, Info } from "lucide-react";
import { ProfileSection } from "@/components/provider/profile-section";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  hasAvailabilityDetail,
  weekDayLabels,
  weekDayLongLabels,
  weekDayOrder,
} from "@/lib/profile-display";
import { cn } from "@/lib/utils";
import type { ProviderAvailability } from "@/types";

type ProviderAvailabilityProps = {
  availability: ProviderAvailability;
  className?: string;
};

export function ProviderAvailability({ availability, className }: ProviderAvailabilityProps) {
  const activeCount = availability.days.length;
  const responseTime = hasAvailabilityDetail(availability.responseTime)
    ? availability.responseTime
    : null;
  const minimumNotice = hasAvailabilityDetail(availability.minimumNotice)
    ? availability.minimumNotice
    : null;
  const hasSchedule = Boolean(responseTime || minimumNotice);

  return (
    <ProfileSection
      title="Disponibilidade"
      description="Dias em que o prestador costuma atender novos eventos."
      className={className}
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
        <Card padded={false} className="overflow-hidden rounded-[1.5rem]">
          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-ink">Dias de atendimento</p>
              <Badge tone={activeCount > 0 ? "brand" : "neutral"}>
                {activeCount > 0 ? `${activeCount} de 7 dias` : "A combinar"}
              </Badge>
            </div>

            <ul className="mt-4 grid grid-cols-7 gap-1.5" aria-label="Dias de atendimento">
              {weekDayOrder.map((day) => {
                const active = availability.days.includes(day);

                return (
                  <li key={day}>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex min-h-16 flex-col items-center justify-center gap-2 rounded-xl border text-[0.7rem] font-semibold",
                        active
                          ? "border-brand bg-brand text-white"
                          : "border-line bg-surface-muted/70 text-ink-faint",
                      )}
                    >
                      {weekDayLabels[day]}
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          active ? "bg-yellow" : "bg-line-strong",
                        )}
                      />
                    </span>
                    <span className="sr-only">
                      {weekDayLongLabels[day]},{" "}
                      {active ? "atendimento disponível" : "sem atendimento informado"}
                    </span>
                  </li>
                );
              })}
            </ul>

            <p className="mt-3 text-xs leading-relaxed text-ink-faint">
              {activeCount > 0
                ? "A agenda pode variar em datas de alta temporada."
                : "Nenhum dia fixo foi informado. Combine as datas direto com o prestador."}
            </p>
          </div>
        </Card>

        <Card padded={false} className="overflow-hidden rounded-[1.5rem]">
          <div className="p-5 sm:p-6">
            <p className="text-sm font-semibold text-ink">Como funciona o agendamento</p>

            {hasSchedule ? (
              <dl className="mt-4 space-y-4">
                {responseTime ? (
                  <div className="flex items-start gap-2.5">
                    <Clock className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                    <div>
                      <dt className="text-xs font-medium text-ink-faint">Tempo de resposta</dt>
                      <dd className="mt-0.5 text-sm font-medium text-ink">{responseTime}</dd>
                    </div>
                  </div>
                ) : null}
                {minimumNotice ? (
                  <div className="flex items-start gap-2.5">
                    <CalendarClock
                      className="mt-0.5 size-4 shrink-0 text-brand"
                      aria-hidden="true"
                    />
                    <div>
                      <dt className="text-xs font-medium text-ink-faint">Antecedência</dt>
                      <dd className="mt-0.5 text-sm font-medium text-ink">{minimumNotice}</dd>
                    </div>
                  </div>
                ) : null}
              </dl>
            ) : (
              <p className="mt-3 flex items-start gap-2.5 text-sm leading-relaxed text-ink-soft">
                <CalendarDays className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                Datas e horários são combinados no orçamento com o prestador.
              </p>
            )}

            {availability.note ? (
              <>
                <Separator className="my-5" />
                <div className="flex items-start gap-2.5 rounded-xl bg-surface-muted p-3.5">
                  <Info className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                  <p className="text-sm leading-relaxed text-ink-soft">{availability.note}</p>
                </div>
              </>
            ) : null}

            <p className="mt-5 text-xs leading-relaxed text-ink-faint">
              Confirme a data e as condições diretamente com o prestador antes de fechar o
              evento.
            </p>
          </div>
        </Card>
      </div>
    </ProfileSection>
  );
}

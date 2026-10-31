import type { WeekDay } from "@/types";

export const weekDayOrder: WeekDay[] = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"];

export const weekDayLabels: Record<WeekDay, string> = {
  seg: "Seg",
  ter: "Ter",
  qua: "Qua",
  qui: "Qui",
  sex: "Sex",
  sab: "Sáb",
  dom: "Dom",
};

export const weekDayLongLabels: Record<WeekDay, string> = {
  seg: "Segunda",
  ter: "Terça",
  qua: "Quarta",
  qui: "Quinta",
  sex: "Sexta",
  sab: "Sábado",
  dom: "Domingo",
};

const genericAvailability = new Set([
  "a combinar",
  "a definir",
  "a informar",
  "nao informado",
  "não informado",
  "sob consulta",
]);

export function hasAvailabilityDetail(value?: string | null): value is string {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 && !genericAvailability.has(normalized);
}

export function sortWeekDays(days: WeekDay[]): WeekDay[] {
  return weekDayOrder.filter((day) => days.includes(day));
}

export function formatAvailabilitySummary(days: WeekDay[]): string {
  const ordered = sortWeekDays(days);

  if (ordered.length === 0) return "A combinar com o prestador";
  if (ordered.length === 7) return "Todos os dias da semana";

  const weekdays = ordered.filter((day) => day !== "sab" && day !== "dom");
  if (
    weekdays.length === 5 &&
    ["seg", "ter", "qua", "qui", "sex"].every((day) =>
      ordered.includes(day as WeekDay),
    )
  ) {
    return "Segunda a sexta";
  }

  if (ordered.length === 1) return `${weekDayLongLabels[ordered[0]]}`;

  return ordered.map((day) => weekDayLabels[day]).join(", ");
}

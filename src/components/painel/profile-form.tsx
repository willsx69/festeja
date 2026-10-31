"use client";

import { useActionState } from "react";
import { CircleAlert } from "lucide-react";
import { updateProfileAction, type ProfileFormState } from "@/actions/profile";
import { ManausNeighborhoodField } from "@/components/location/manaus-neighborhood-field";
import { ImageUploadField } from "@/components/painel/image-upload-field";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { categories } from "@/data/categories";
import { SERVICE_CITY, SERVICE_STATE } from "@/data/locations";
import { cn } from "@/lib/utils";
import type { ProviderProfileDetails } from "@/lib/db";
import type { WeekDay } from "@/types";

const days: { id: WeekDay; label: string }[] = [
  { id: "seg", label: "Segunda" },
  { id: "ter", label: "Terça" },
  { id: "qua", label: "Quarta" },
  { id: "qui", label: "Quinta" },
  { id: "sex", label: "Sexta" },
  { id: "sab", label: "Sábado" },
  { id: "dom", label: "Domingo" },
];

const inputClass =
  "mt-1.5 h-11 w-full rounded-xl border bg-surface px-3.5 text-sm text-ink transition-colors focus:border-brand";
const errorBorder = "border-danger";
const okBorder = "border-line-strong hover:border-brand/50";

export function ProfileForm({ details }: { details: ProviderProfileDetails }) {
  const [state, formAction, pending] = useActionState<ProfileFormState, FormData>(
    updateProfileAction,
    {},
  );
  const errors = state.errors ?? {};

  return (
    <Card className="shadow-none">
      <form action={formAction} className="space-y-5" noValidate>
        {state.message ? (
          <p className="rounded-xl border border-brand/30 bg-brand-soft px-3.5 py-2.5 text-sm font-medium text-brand">
            {state.message}
          </p>
        ) : null}

        {errors.geral ? <Alert message={errors.geral} /> : null}

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-ink">
            Sobre o seu trabalho
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={5}
            defaultValue={details.bio}
            placeholder="Conte sua história, diferenciais e o tipo de evento que você atende…"
            className={cn(
              "mt-1.5 w-full rounded-xl border px-3.5 py-2.5 text-sm text-ink transition-colors focus:border-brand",
              errors.bio ? errorBorder : okBorder,
            )}
          />
          {errors.bio ? <Alert message={errors.bio} /> : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-[0.8fr_1.2fr_10rem]">
          <div>
            <span className="block text-sm font-medium text-ink">
              Área de atendimento
            </span>
            <div className="mt-1.5 flex h-11 items-center rounded-xl border border-line-strong bg-surface px-3.5 text-sm font-medium text-ink">
              {SERVICE_CITY} - {SERVICE_STATE}
            </div>
          </div>
          <ManausNeighborhoodField
            id="bairro"
            defaultValue={details.neighborhood}
            placeholder="Ex.: Adrianópolis"
            autoComplete="address-level3"
            error={errors.bairro}
          />
          <div>
            <label htmlFor="categoria" className="block text-sm font-medium text-ink">
              Categoria
            </label>
            <select
              id="categoria"
              name="categoria"
              defaultValue={details.category}
              className={cn(inputClass, errors.categoria ? errorBorder : okBorder)}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoria ? <Alert message={errors.categoria} /> : null}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_1fr]">
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-ink">
              Palavras-chave
            </label>
            <input
              id="tags"
              name="tags"
              defaultValue={details.tags.join(", ")}
              placeholder="Bolo de aniversário, Doces finos, Sem glúten"
              className={cn(inputClass, errors.tags ? errorBorder : okBorder)}
            />
            <p className="mt-1 text-xs text-ink-faint">Separe por vírgula, máximo 5.</p>
            {errors.tags ? <Alert message={errors.tags} /> : null}
          </div>
          <div className="grid gap-3 min-[420px]:grid-cols-2">
            <div>
              <label htmlFor="preco" className="block text-sm font-medium text-ink">
                A partir de (R$)
              </label>
              <input
                id="preco"
                name="preco"
                type="number"
                min={0}
                defaultValue={details.priceFrom}
                className={cn(inputClass, errors.preco ? errorBorder : okBorder)}
              />
              {errors.preco ? <Alert message={errors.preco} /> : null}
            </div>
            <div>
              <label htmlFor="unidade" className="block text-sm font-medium text-ink">
                Unidade
              </label>
              <input
                id="unidade"
                name="unidade"
                defaultValue={details.priceUnit ?? ""}
                placeholder="/ pessoa"
                className={cn(inputClass, okBorder)}
              />
            </div>
          </div>
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-ink">Dias de atendimento</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {days.map((day) => (
              <label
                key={day.id}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors",
                  details.availabilityDays.includes(day.id)
                    ? "border-brand bg-brand-soft text-brand"
                    : "border-line-strong bg-surface text-ink-soft hover:border-brand/50",
                )}
              >
                <input
                  type="checkbox"
                  name="dias"
                  value={day.id}
                  defaultChecked={details.availabilityDays.includes(day.id)}
                  className="size-4 accent-brand"
                />
                {day.label}
              </label>
            ))}
          </div>
          {errors.dias ? <Alert message={errors.dias} /> : null}
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="tempo-resposta" className="block text-sm font-medium text-ink">
              Tempo de resposta
            </label>
            <input
              id="tempo-resposta"
              name="tempo-resposta"
              defaultValue={details.responseTime}
              placeholder="cerca de 1 hora"
              className={cn(
                inputClass,
                errors["tempo-resposta"] ? errorBorder : okBorder,
              )}
            />
            {errors["tempo-resposta"] ? <Alert message={errors["tempo-resposta"]} /> : null}
          </div>
          <div>
            <label htmlFor="antecedencia" className="block text-sm font-medium text-ink">
              Antecedência mínima
            </label>
            <input
              id="antecedencia"
              name="antecedencia"
              defaultValue={details.minimumNotice}
              placeholder="7 dias de antecedência"
              className={cn(inputClass, errors.antecedencia ? errorBorder : okBorder)}
            />
            {errors.antecedencia ? <Alert message={errors.antecedencia} /> : null}
          </div>
        </div>

        <div>
          <label htmlFor="nota-disponibilidade" className="block text-sm font-medium text-ink">
            Observação de disponibilidade
          </label>
          <input
            id="nota-disponibilidade"
            name="nota-disponibilidade"
            defaultValue={details.availabilityNote}
            placeholder="Ex.: atendo também dias úteis mediante consulta."
            className={cn(inputClass, okBorder)}
          />
        </div>

        <ImageUploadField
          name="capa"
          label="Imagem de capa do perfil"
          hint="JPEG, PNG, WebP ou GIF, até 4MB. Para trocar a imagem de capa, envie uma nova."
        />

        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Salvando..." : "Salvar alterações"}
        </Button>
      </form>
    </Card>
  );
}

function Alert({ message }: { message: string }) {
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-danger">
      <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

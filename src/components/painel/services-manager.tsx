"use client";

import { useActionState, useId } from "react";
import { CircleAlert, PackageOpen, Plus, Trash2 } from "lucide-react";
import {
  createServiceAction,
  deleteServiceAction,
  updateServiceAction,
  type ServiceFormState,
} from "@/actions/services";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PainelEmptyState } from "@/components/painel/painel-empty-state";
import { formatBRL } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ProviderService } from "@/types";

const inputClass =
  "mt-1.5 h-11 w-full rounded-xl border bg-surface px-3.5 text-sm text-ink transition-colors focus:border-brand";

type ServicesManagerProps = {
  services: ProviderService[];
};

export function ServicesManager({ services }: ServicesManagerProps) {
  return (
    <div className="space-y-6">
      <Card className="border-brand/15 shadow-none">
        <h3 className="text-base font-extrabold uppercase tracking-[-0.01em] text-ink">Adicionar serviço</h3>
        <ServiceFields
          action={createServiceAction}
          submitLabel="Adicionar"
          withId={false}
        />
      </Card>

      {services.length > 0 ? (
        <ul className="space-y-4">
          {services.map((service) => (
          <li key={service.id}>
            <Card className="shadow-none">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-ink">{service.name}</p>
                  <p className="mt-1 text-sm text-ink-soft">{service.description}</p>
                  <p className="mt-2 text-sm font-semibold text-ink">
                    {formatBRL(service.price)}
                    {service.priceUnit ? (
                      <span className="font-normal text-ink-faint"> {service.priceUnit}</span>
                    ) : null}
                  </p>
                </div>
                <form action={deleteServiceAction}>
                  <input type="hidden" name="id" value={service.id} />
                  <button
                    type="submit"
                    aria-label={`Excluir ${service.name}`}
                    className="inline-flex size-9 items-center justify-center rounded-xl border border-line text-ink-faint transition-colors hover:border-danger hover:text-danger"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </form>
              </div>

              <details className="mt-4 border-t border-line pt-4">
                <summary className="cursor-pointer text-sm font-medium text-brand">
                  Editar serviço
                </summary>
                <ServiceFields
                  action={updateServiceAction}
                  submitLabel="Salvar"
                  withId
                  service={service}
                />
              </details>
            </Card>
          </li>
          ))}
        </ul>
      ) : (
        <PainelEmptyState
          icon={PackageOpen}
          title="Sua lista de serviços está vazia"
          description="Cadastre acima o primeiro serviço para exibi-lo no seu perfil público."
        />
      )}
    </div>
  );
}

function ServiceFields({
  action,
  submitLabel,
  withId,
  service,
}: {
  action: typeof createServiceAction | typeof updateServiceAction;
  submitLabel: string;
  withId: boolean;
  service?: ProviderService;
}) {
  const [state, formAction, pending] = useActionState<ServiceFormState, FormData>(
    action as typeof createServiceAction,
    {},
  );
  const errors = state.errors ?? {};
  const id = useId();

  return (
    <form action={formAction} className="mt-4 space-y-4" noValidate>
      {state.message ? (
        <p role="status" className="rounded-xl border border-brand/30 bg-brand-soft px-3.5 py-2.5 text-sm font-medium text-brand">
          {state.message}
        </p>
      ) : null}

      {withId ? <input type="hidden" name="id" value={service?.id ?? ""} /> : null}

      <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
        <div>
          <label htmlFor={`${id}-nome`} className="block text-sm font-medium text-ink">Nome</label>
          <input
            id={`${id}-nome`}
            name="nome"
            defaultValue={service?.name ?? ""}
            placeholder="Ex.: Bolo de aniversário"
            className={cn(inputClass, errors.nome ? "border-danger" : "border-line-strong")}
          />
          {errors.nome ? <FieldError message={errors.nome} /> : null}
        </div>
        <div>
          <label htmlFor={`${id}-preco`} className="block text-sm font-medium text-ink">Preço (R$)</label>
          <input
            id={`${id}-preco`}
            name="preco"
            type="number"
            min={1}
            defaultValue={service?.price ?? ""}
            className={cn(inputClass, errors.preco ? "border-danger" : "border-line-strong")}
          />
          {errors.preco ? <FieldError message={errors.preco} /> : null}
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-descricao`} className="block text-sm font-medium text-ink">Descrição</label>
        <textarea
          id={`${id}-descricao`}
          name="descricao"
          rows={3}
          defaultValue={service?.description ?? ""}
          placeholder="O que está incluso neste serviço?"
          className={cn(
            "mt-1.5 w-full rounded-xl border px-3.5 py-2.5 text-sm text-ink transition-colors focus:border-brand",
            errors.descricao ? "border-danger" : "border-line-strong",
          )}
        />
        {errors.descricao ? <FieldError message={errors.descricao} /> : null}
      </div>

      <div>
        <label htmlFor={`${id}-unidade`} className="block text-sm font-medium text-ink">Unidade (opcional)</label>
        <input
          id={`${id}-unidade`}
          name="unidade"
          defaultValue={service?.priceUnit ?? ""}
          placeholder="/ pessoa"
          className={cn(inputClass, "border-line-strong")}
        />
      </div>

      <Button type="submit" disabled={pending}>
        <Plus className="size-4" aria-hidden="true" />
        {pending ? "Salvando..." : submitLabel}
      </Button>
    </form>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-danger">
      <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

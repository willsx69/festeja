"use client";

import { useActionState } from "react";
import { CircleAlert } from "lucide-react";
import { createReviewAction, type ReviewFormState } from "@/actions/reviews";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatShortDate } from "@/lib/format";
import type { Contract } from "@/types";

type ReviewFormProps = {
  contracts: Contract[];
};

export function ReviewForm({ contracts }: ReviewFormProps) {
  const [state, formAction, pending] = useActionState<ReviewFormState, FormData>(
    createReviewAction,
    {},
  );

  if (contracts.length === 0) return null;

  const errors = state.errors ?? {};

  return (
    <Card>
      <h3 className="text-base font-semibold text-ink">Avalie este prestador</h3>
      <p className="mt-1 text-sm text-ink-soft">
        Você tem contratos concluídos com este prestador. Cada contrato pode receber uma
        avaliação.
      </p>

      <form action={formAction} className="mt-4 space-y-4" noValidate>
        {state.message ? (
          <p className="rounded-xl border border-brand/30 bg-brand-soft px-3.5 py-2.5 text-sm font-medium text-brand">
            {state.message}
          </p>
        ) : null}

        {errors.geral ? <FieldError message={errors.geral} /> : null}

        <div>
          <label htmlFor="contrato" className="block text-sm font-medium text-ink">
            Contrato
          </label>
          <select
            id="contrato"
            name="contrato"
            required
            className="mt-1.5 h-11 w-full rounded-xl border border-line-strong bg-surface px-3.5 text-sm text-ink transition-colors hover:border-brand/50 focus:border-brand"
          >
            <option value="">Selecione…</option>
            {contracts.map((contract) => (
              <option key={contract.id} value={contract.id}>
                {contract.serviceName} · {formatShortDate(contract.eventDate)}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="nota" className="block text-sm font-medium text-ink">
              Nota
            </label>
            <select
              id="nota"
              name="nota"
              required
              defaultValue="5"
              className="mt-1.5 h-11 w-full rounded-xl border border-line-strong bg-surface px-3.5 text-sm text-ink transition-colors hover:border-brand/50 focus:border-brand"
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} {value === 1 ? "estrela" : "estrelas"}
                </option>
              ))}
            </select>
            {errors.nota ? <FieldError message={errors.nota} /> : null}
          </div>

          <div>
            <label htmlFor="evento" className="block text-sm font-medium text-ink">
              Tipo de evento
            </label>
            <input
              id="evento"
              name="evento"
              placeholder="Ex.: Casamento"
              className="mt-1.5 h-11 w-full rounded-xl border border-line-strong bg-surface px-3.5 text-sm text-ink transition-colors hover:border-brand/50 focus:border-brand"
            />
            {errors.evento ? <FieldError message={errors.evento} /> : null}
          </div>
        </div>

        <div>
          <label htmlFor="comentario" className="block text-sm font-medium text-ink">
            Comentário
          </label>
          <textarea
            id="comentario"
            name="comentario"
            rows={4}
            placeholder="Conte como foi a experiência do começo ao fim…"
            className="mt-1.5 w-full rounded-xl border border-line-strong bg-surface px-3.5 py-2.5 text-sm text-ink transition-colors hover:border-brand/50 focus:border-brand"
          />
          {errors.comentario ? <FieldError message={errors.comentario} /> : null}
        </div>

        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Publicando..." : "Publicar avaliação"}
        </Button>
      </form>
    </Card>
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

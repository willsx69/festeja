"use client";

import { useActionState } from "react";
import { CircleAlert } from "lucide-react";
import { createQuoteAction, type QuoteFormState } from "@/actions/quotes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { buildLoginHref, buildSignupHref } from "@/lib/auth-redirect";
import type { ProviderService } from "@/types";

type QuoteFormProps = {
  providerUsername: string;
  services: ProviderService[];
  loggedIn: boolean;
};

export function QuoteForm({ providerUsername, services, loggedIn }: QuoteFormProps) {
  const [state, formAction, pending] = useActionState<QuoteFormState, FormData>(
    createQuoteAction,
    {},
  );

  if (!loggedIn) {
    const returnTo = `/prestador/${providerUsername}?aba=orcamento`;
    return (
      <Card>
        <p className="text-sm leading-relaxed text-ink-soft">
          Entre com uma conta de cliente para solicitar um orçamento e acompanhar a
          resposta por aqui.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={buildLoginHref(returnTo)}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-brand px-5 text-sm font-medium text-white transition-colors hover:bg-brand-strong"
          >
            Entrar
          </a>
          <a
            href={buildSignupHref(returnTo)}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-line-strong bg-surface px-5 text-sm font-medium text-ink transition-colors hover:bg-surface-muted"
          >
            Criar conta
          </a>
        </div>
      </Card>
    );
  }

  const errors = state.errors ?? {};

  return (
    <Card>
      <form action={formAction} className="space-y-4" noValidate>
        <input type="hidden" name="prestador" value={providerUsername} />

        {state.message ? (
          <p className="rounded-xl border border-brand/30 bg-brand-soft px-3.5 py-2.5 text-sm font-medium text-brand">
            {state.message}
          </p>
        ) : null}

        {Object.keys(errors).length > 0 ? (
          <p
            role="alert"
            className="rounded-xl border border-danger/30 bg-danger-soft px-3.5 py-2.5 text-sm font-medium text-danger"
          >
            Confira os campos destacados e tente de novo.
          </p>
        ) : null}

        <div>
          <label htmlFor="servico" className="block text-sm font-medium text-ink">
            Serviço de interesse
          </label>
          <select
            id="servico"
            name="servico"
            defaultValue=""
            className="mt-1.5 h-11 w-full rounded-xl border border-line-strong bg-surface px-3.5 text-sm text-ink transition-colors hover:border-brand/50 focus:border-brand"
          >
            <option value="">Ainda não sei / conversar depois</option>
            {services.map((service) => (
              <option key={service.id} value={service.name}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="data-evento" className="block text-sm font-medium text-ink">
              Data do evento
            </label>
            <input
              id="data-evento"
              name="data-evento"
              type="date"
              required
              className="mt-1.5 h-11 w-full rounded-xl border border-line-strong bg-surface px-3.5 text-sm text-ink transition-colors hover:border-brand/50 focus:border-brand"
            />
            {errors["data-evento"] ? (
              <FieldError message={errors["data-evento"]} />
            ) : null}
          </div>

          <div>
            <label htmlFor="convidados" className="block text-sm font-medium text-ink">
              Número de convidados
            </label>
            <input
              id="convidados"
              name="convidados"
              type="number"
              min={1}
              placeholder="Ex.: 80"
              className="mt-1.5 h-11 w-full rounded-xl border border-line-strong bg-surface px-3.5 text-sm text-ink transition-colors hover:border-brand/50 focus:border-brand"
            />
            {errors.convidados ? <FieldError message={errors.convidados} /> : null}
          </div>
        </div>

        <div>
          <label htmlFor="mensagem" className="block text-sm font-medium text-ink">
            Conte sobre o evento
          </label>
          <textarea
            id="mensagem"
            name="mensagem"
            rows={4}
            placeholder="Tipo de festa, horário, local e qualquer detalhe importante…"
            className="mt-1.5 w-full rounded-xl border border-line-strong bg-surface px-3.5 py-2.5 text-sm text-ink transition-colors hover:border-brand/50 focus:border-brand"
          />
          {errors.mensagem ? <FieldError message={errors.mensagem} /> : null}
        </div>

        {errors.geral ? <FieldError message={errors.geral} /> : null}

        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Enviando..." : "Enviar solicitação"}
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

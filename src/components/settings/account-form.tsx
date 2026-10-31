"use client";

import { useActionState } from "react";
import { CircleAlert } from "lucide-react";
import { updateAccountAction, type AccountFormState } from "@/actions/account";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const inputClass =
  "mt-1.5 h-11 w-full rounded-xl border bg-surface px-3.5 text-sm text-ink transition-colors focus:border-brand";

type AccountFormProps = {
  initialName: string;
  initialEmail: string;
  initialPhone: string;
};

export function AccountForm({ initialName, initialEmail, initialPhone }: AccountFormProps) {
  const [state, formAction, pending] = useActionState<AccountFormState, FormData>(
    updateAccountAction,
    {},
  );
  const errors = state.errors ?? {};

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {state.message ? (
        <p className="rounded-xl border border-brand/30 bg-brand-soft px-3.5 py-2.5 text-sm font-medium text-brand">
          {state.message}
        </p>
      ) : null}

      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-ink">
          Nome completo
        </label>
        <input
          id="nome"
          name="nome"
          defaultValue={initialName}
          autoComplete="name"
          className={cn(inputClass, errors.nome ? "border-danger" : "border-line-strong")}
        />
        {errors.nome ? <Alert message={errors.nome} /> : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={initialEmail}
            autoComplete="email"
            className={cn(inputClass, errors.email ? "border-danger" : "border-line-strong")}
          />
          {errors.email ? <Alert message={errors.email} /> : null}
        </div>
        <div>
          <label htmlFor="telefone" className="block text-sm font-medium text-ink">
            Telefone (opcional)
          </label>
          <input
            id="telefone"
            name="telefone"
            type="tel"
            defaultValue={initialPhone}
            autoComplete="tel"
            placeholder="(11) 99999-9999"
            className={cn(inputClass, "border-line-strong")}
          />
        </div>
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Salvando..." : "Salvar alterações"}
      </Button>
    </form>
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

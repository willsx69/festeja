"use client";

import { useActionState } from "react";
import { CircleAlert } from "lucide-react";
import { changePasswordAction, type AccountFormState } from "@/actions/account";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const inputClass =
  "mt-1.5 h-11 w-full rounded-xl border bg-surface px-3.5 text-sm text-ink transition-colors focus:border-brand";

export function PasswordForm() {
  const [state, formAction, pending] = useActionState<AccountFormState, FormData>(
    changePasswordAction,
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
        <label htmlFor="senha-atual" className="block text-sm font-medium text-ink">
          Senha atual
        </label>
        <input
          id="senha-atual"
          name="senha-atual"
          type="password"
          autoComplete="current-password"
          className={cn(
            inputClass,
            errors["senha-atual"] ? "border-danger" : "border-line-strong",
          )}
        />
        {errors["senha-atual"] ? <Alert message={errors["senha-atual"]} /> : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="senha-nova" className="block text-sm font-medium text-ink">
            Nova senha
          </label>
          <input
            id="senha-nova"
            name="senha-nova"
            type="password"
            autoComplete="new-password"
            className={cn(
              inputClass,
              errors["senha-nova"] ? "border-danger" : "border-line-strong",
            )}
          />
          {errors["senha-nova"] ? <Alert message={errors["senha-nova"]} /> : null}
        </div>
        <div>
          <label htmlFor="senha-confirmar" className="block text-sm font-medium text-ink">
            Confirmar nova senha
          </label>
          <input
            id="senha-confirmar"
            name="senha-confirmar"
            type="password"
            autoComplete="new-password"
            className={cn(
              inputClass,
              errors["senha-confirmar"] ? "border-danger" : "border-line-strong",
            )}
          />
          {errors["senha-confirmar"] ? <Alert message={errors["senha-confirmar"]} /> : null}
        </div>
      </div>

      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? "Alterando..." : "Alterar senha"}
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

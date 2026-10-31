"use client";

import { useActionState } from "react";
import Link from "next/link";
import { CircleAlert } from "lucide-react";
import { resetPasswordAction, type ResetFormState } from "@/actions/password-reset";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ResetFormProps = {
  token: string;
};

export function ResetForm({ token }: ResetFormProps) {
  const [state, formAction, pending] = useActionState<ResetFormState, FormData>(
    resetPasswordAction,
    {},
  );
  const errors = state.errors ?? {};

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-sm text-ink-soft">
          Link de recuperação inválido ou ausente.
        </p>
        <Link
          href="/esqueci-senha"
          className="mt-3 inline-flex text-sm font-medium text-brand transition-colors hover:text-brand-strong"
        >
          Solicitar novo link
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <input type="hidden" name="token" value={token} />

      {errors.token ? (
        <p
          role="alert"
          className="rounded-xl border border-danger/30 bg-danger-soft px-3.5 py-2.5 text-sm font-medium text-danger"
        >
          {errors.token}
        </p>
      ) : null}

      <div>
        <label htmlFor="senha" className="block text-sm font-medium text-ink">
          Nova senha
        </label>
        <input
          id="senha"
          name="senha"
          type="password"
          autoComplete="new-password"
          placeholder="Mínimo de 8 caracteres"
          className={cn(
            "mt-1.5 h-11 w-full rounded-xl border bg-surface px-3.5 text-sm text-ink transition-colors focus:border-brand",
            errors.senha ? "border-danger" : "border-line-strong",
          )}
        />
        {errors.senha ? (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-danger">
            <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
            {errors.senha}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="confirmar" className="block text-sm font-medium text-ink">
          Confirmar nova senha
        </label>
        <input
          id="confirmar"
          name="confirmar"
          type="password"
          autoComplete="new-password"
          placeholder="Repita a nova senha"
          className={cn(
            "mt-1.5 h-11 w-full rounded-xl border bg-surface px-3.5 text-sm text-ink transition-colors focus:border-brand",
            errors.confirmar ? "border-danger" : "border-line-strong",
          )}
        />
        {errors.confirmar ? (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-danger">
            <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
            {errors.confirmar}
          </p>
        ) : null}
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Redefinindo..." : "Redefinir senha"}
      </Button>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { CircleAlert } from "lucide-react";
import {
  requestPasswordResetAction,
  type RecoveryFormState,
} from "@/actions/password-reset";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function RecoveryForm() {
  const [state, formAction, pending] = useActionState<RecoveryFormState, FormData>(
    requestPasswordResetAction,
    {},
  );
  const errors = state.errors ?? {};

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {state.message ? (
        <div className="rounded-xl border border-brand/30 bg-brand-soft px-3.5 py-2.5 text-sm font-medium text-brand">
          {state.message}
        </div>
      ) : null}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-ink">
          E-mail da conta
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="voce@email.com"
          className={cn(
            "mt-1.5 h-11 w-full rounded-xl border bg-surface px-3.5 text-sm text-ink transition-colors focus:border-brand",
            errors.email ? "border-danger" : "border-line-strong",
          )}
        />
        {errors.email ? (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-danger">
            <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
            {errors.email}
          </p>
        ) : null}
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Enviando..." : "Enviar instruções"}
      </Button>
    </form>
  );
}

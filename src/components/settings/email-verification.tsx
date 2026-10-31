"use client";

import { useActionState } from "react";
import { CheckCircle2, CircleAlert, MailWarning } from "lucide-react";
import {
  resendVerificationEmailAction,
  type VerificationState,
} from "@/actions/account";
import { Button } from "@/components/ui/button";

type EmailVerificationProps = {
  email: string;
  verified: boolean;
};

export function EmailVerification({ email, verified }: EmailVerificationProps) {
  const [state, formAction, pending] = useActionState<VerificationState, FormData>(
    resendVerificationEmailAction,
    {},
  );

  if (verified) {
    return (
      <div className="flex items-start gap-2 text-sm text-ink-soft">
        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
        <p>
          <span className="font-medium text-ink">{email}</span> está verificado.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-yellow/50 bg-yellow-soft/60 p-3.5">
      <div className="flex items-start gap-2">
        <MailWarning className="mt-0.5 size-4 shrink-0 text-ink" aria-hidden="true" />
        <div>
          <p className="text-sm font-medium text-ink">Confirme seu e-mail</p>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">
            Verifique a caixa de entrada de <span className="font-medium">{email}</span>.
            A confirmação protege sua conta e valida o endereço informado.
          </p>
        </div>
      </div>

      {state.message ? (
        <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-brand">
          <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
          {state.message}
        </p>
      ) : null}

      {state.errors?.geral ? (
        <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-danger">
          <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
          {state.errors.geral}
        </p>
      ) : null}

      <form action={formAction} className="mt-3">
        <Button type="submit" variant="secondary" size="sm" disabled={pending}>
          {pending ? "Enviando..." : "Reenviar confirmação"}
        </Button>
      </form>
    </div>
  );
}

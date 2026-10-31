"use client";

import Link from "next/link";
import { useActionState } from "react";
import { CheckCircle2, CircleAlert } from "lucide-react";
import {
  verifyEmailAction,
  type VerifyEmailState,
} from "@/actions/email-verification";
import { Button } from "@/components/ui/button";

type VerifyEmailFormProps = {
  token: string;
};

export function VerifyEmailForm({ token }: VerifyEmailFormProps) {
  const [state, formAction, pending] = useActionState<VerifyEmailState, FormData>(
    verifyEmailAction,
    {},
  );

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-sm text-ink-soft">Link de confirmação inválido ou ausente.</p>
        <Link
          href="/configuracoes"
          className="mt-3 inline-flex text-sm font-medium text-brand transition-colors hover:text-brand-strong"
        >
          Ir para configurações
        </Link>
      </div>
    );
  }

  if (state.success) {
    return (
      <div className="text-center">
        <CheckCircle2 className="mx-auto size-10 text-brand" aria-hidden="true" />
        <p className="mt-3 text-sm font-medium text-ink">{state.message}</p>
        <Link
          href="/configuracoes"
          className="mt-3 inline-flex text-sm font-medium text-brand transition-colors hover:text-brand-strong"
        >
          Voltar para configurações
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <p className="text-sm leading-relaxed text-ink-soft">
        Clique no botão abaixo para confirmar que este e-mail pertence a você.
      </p>

      {state.error ? (
        <p
          role="alert"
          className="flex items-center gap-1.5 rounded-xl border border-danger/30 bg-danger-soft px-3.5 py-2.5 text-sm font-medium text-danger"
        >
          <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
          {state.error}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Confirmando..." : "Confirmar e-mail"}
      </Button>
    </form>
  );
}

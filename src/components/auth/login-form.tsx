"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useActionState } from "react";
import { ArrowRight } from "lucide-react";
import { loginAction, type AuthFormState } from "@/actions/auth";
import { AuthField } from "@/components/auth/auth-field";
import { Button } from "@/components/ui/button";
import { validateLogin, type LoginValues } from "@/lib/validate";

export function LoginForm({ returnTo }: { returnTo?: string }) {
  const [values, setValues] = useState<LoginValues>({ email: "", password: "" });
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(
    loginAction,
    {},
  );

  const errors = { ...clientErrors, ...(state.errors ?? {}) };
  const hasErrors = Boolean(errors.email || errors.password);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const found = validateLogin(values);
    setClientErrors(found);
    if (Object.keys(found).length > 0) {
      event.preventDefault();
    }
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} noValidate className="space-y-4">
      {returnTo ? <input type="hidden" name="retorno" value={returnTo} /> : null}
      <div>
        <h2 className="text-xl font-semibold text-ink">Entrar</h2>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">
          Acesse sua conta para conversar com prestadores e acompanhar pedidos.
        </p>
      </div>

      {hasErrors ? (
        <p
          role="alert"
          className="rounded-xl border border-danger/30 bg-danger-soft px-3.5 py-2.5 text-sm font-medium text-danger"
        >
          Confira os campos destacados e tente de novo.
        </p>
      ) : null}

      <AuthField
        id="email"
        label="E-mail"
        type="email"
        placeholder="voce@email.com"
        autoComplete="email"
        value={values.email}
        error={errors.email}
        onChange={(email) => setValues((current) => ({ ...current, email }))}
      />

      <AuthField
        id="senha"
        label="Senha"
        type="password"
        placeholder="Sua senha"
        autoComplete="current-password"
        value={values.password}
        error={errors.password}
        onChange={(password) => setValues((current) => ({ ...current, password }))}
      />

      <div className="flex justify-end">
        <Link
          href="/esqueci-senha"
          className="text-sm font-medium text-brand transition-colors hover:text-brand-strong"
        >
          Esqueci minha senha
        </Link>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Entrando..." : "Entrar"}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Button>

      <p className="text-center text-sm text-ink-soft">
        Ainda não tem conta?{" "}
        <Link
          href={returnTo ? `/cadastro?retorno=${encodeURIComponent(returnTo)}` : "/cadastro"}
          className="font-medium text-brand transition-colors hover:text-brand-strong"
        >
          Cadastre-se
        </Link>
      </p>

      <p className="text-center text-sm">
        <Link href="/" className="text-ink-faint transition-colors hover:text-ink">
          Continuar sem entrar
        </Link>
      </p>
    </form>
  );
}

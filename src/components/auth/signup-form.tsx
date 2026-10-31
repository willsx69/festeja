"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { ArrowRight, CircleAlert, CircleCheck } from "lucide-react";
import { signupAction, type AuthFormState } from "@/actions/auth";
import { AuthField } from "@/components/auth/auth-field";
import { ManausNeighborhoodField } from "@/components/location/manaus-neighborhood-field";
import { Button } from "@/components/ui/button";
import { Form, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { categories } from "@/data/categories";
import { SERVICE_CITY, SERVICE_STATE } from "@/data/locations";
import {
  isProfileSlug,
  normalizeProfileSlug,
  PROFILE_SLUG_MAX_LENGTH,
  PROFILE_SLUG_MIN_LENGTH,
} from "@/lib/slug";
import { cn } from "@/lib/utils";
import {
  BUSINESS_ADDRESS_MAX_LENGTH,
  validateBusinessAddress,
  validateSignup,
  type SignupValues,
} from "@/lib/validate";

type AccountType = "cliente" | "prestador";

const accountOptions: { id: AccountType; label: string; hint: string }[] = [
  {
    id: "cliente",
    label: "Quero contratar",
    hint: "Encontrar prestadores para meu evento",
  },
  {
    id: "prestador",
    label: "Quero prestar serviços",
    hint: "Criar perfil e receber pedidos",
  },
];

export function SignupForm({ returnTo }: { returnTo?: string }) {
  const searchParams = useSearchParams();
  const initialAccount: AccountType =
    searchParams.get("tipo") === "prestador" ? "prestador" : "cliente";

  const [values, setValues] = useState<SignupValues>({
    name: "",
    email: "",
    password: "",
    confirm: "",
    accept: false,
  });
  const [username, setUsername] = useState("");
  const [usernameEdited, setUsernameEdited] = useState(false);
  const [businessAddress, setBusinessAddress] = useState("");
  const [category, setCategory] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [account, setAccount] = useState<AccountType>(initialAccount);
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(
    signupAction,
    {},
  );

  const errors = { ...clientErrors, ...(state.errors ?? {}) };
  const hasErrors = Object.keys(errors).length > 0;
  const normalizedUsername = normalizeProfileSlug(username);
  const usernameFormatValid = isProfileSlug(normalizedUsername);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const found: Record<string, string> = { ...validateSignup(values) };
    if (account === "prestador") {
      if (!normalizedUsername) {
        found.username = "Escolha o link do seu perfil.";
      } else if (!usernameFormatValid) {
        found.username = `O link precisa ter entre ${PROFILE_SLUG_MIN_LENGTH} e ${PROFILE_SLUG_MAX_LENGTH} caracteres.`;
      }
      const addressError = validateBusinessAddress(businessAddress);
      if (addressError) found.businessAddress = addressError;
    }
    setClientErrors(found);
    if (Object.keys(found).length > 0) {
      event.preventDefault();
    }
  }

  return (
    <Form action={formAction} onSubmit={handleSubmit} noValidate className="space-y-4">
      {returnTo ? <input type="hidden" name="retorno" value={returnTo} /> : null}
      <div>
        <h2 className="text-xl font-semibold text-ink">Criar conta</h2>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">
          É grátis e leva menos de um minuto.
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
        id="nome"
        label="Nome completo"
        placeholder="Como devemos te chamar"
        autoComplete="name"
        value={values.name}
        error={errors.name}
        onChange={(name) => {
          setValues((current) => ({ ...current, name }));
          if (!usernameEdited) setUsername(normalizeProfileSlug(name));
        }}
      />

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

      <div className="grid gap-4 sm:grid-cols-2">
        <AuthField
          id="senha"
          label="Senha"
          type="password"
          placeholder="Mínimo de 8 caracteres"
          autoComplete="new-password"
          value={values.password}
          error={errors.password}
          onChange={(password) => setValues((current) => ({ ...current, password }))}
        />

        <AuthField
          id="confirmar-senha"
          label="Confirmar senha"
          type="password"
          placeholder="Repita a senha"
          autoComplete="new-password"
          value={values.confirm}
          error={errors.confirm}
          onChange={(confirm) => setValues((current) => ({ ...current, confirm }))}
        />
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-ink">Tipo de conta</legend>
        <div className="mt-2 grid gap-2.5">
          {accountOptions.map((option) => {
            const selected = account === option.id;
            return (
              <label
                key={option.id}
                className={cn(
                  "flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 transition-colors",
                  selected
                    ? "border-brand bg-brand-soft"
                    : "border-line-strong bg-surface hover:border-brand/50",
                )}
              >
                <input
                  type="radio"
                  name="tipo-conta"
                  value={option.id}
                  checked={selected}
                  onChange={() => {
                    setAccount(option.id);
                    if (option.id === "prestador" && !usernameEdited) {
                      setUsername(normalizeProfileSlug(values.name));
                    }
                  }}
                  className="mt-0.5 size-4 accent-brand"
                />
                <span>
                  <span className="block text-sm font-medium text-ink">
                    {option.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-ink-faint">
                    {option.hint}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {account === "prestador" ? (
        <div className="space-y-4 rounded-xl border border-line bg-surface-muted p-3.5">
          <div>
            <Label htmlFor="username">Link do seu perfil</Label>
            <FormDescription id="username-descricao" className="mt-1">
              Escolha um endereço personalizado para compartilhar seu perfil no Festeja.
            </FormDescription>
            <Input
              id="username"
              placeholder="ana-beatriz-confeitaria"
              autoComplete="off"
              value={username}
              onChange={(event) => {
                setUsernameEdited(true);
                setUsername(event.target.value);
              }}
              onBlur={() => setUsername(normalizedUsername)}
              aria-invalid={errors.username ? true : undefined}
              aria-describedby={
                errors.username
                  ? "username-descricao username-previa username-erro"
                  : "username-descricao username-previa"
              }
              className={cn(
                "mt-2 font-medium",
                errors.username && "border-danger focus-visible:border-danger",
              )}
            />
            <input type="hidden" name="username" value={normalizedUsername} />
            <div
              id="username-previa"
              className="mt-2 rounded-lg border border-line bg-surface px-3 py-2 text-xs text-ink-faint"
              aria-live="polite"
            >
              festeja.com.br/prestador/
              <span className="font-semibold text-brand">
                {normalizedUsername || "ana-beatriz-confeitaria"}
              </span>
            </div>
            <FormMessage id="username-erro">{errors.username}</FormMessage>
            {!errors.username && usernameFormatValid ? (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-brand">
                <CircleCheck className="size-3.5 shrink-0" aria-hidden="true" />
                Formato válido. A disponibilidade será confirmada ao criar a conta.
              </p>
            ) : null}
          </div>

          <div>
            <Label htmlFor="endereco-comercial">Endereço comercial (opcional)</Label>
            <FormDescription id="endereco-comercial-descricao" className="mt-1">
              Informe apenas se for útil para sua operação. O endereço completo não será
              exibido automaticamente no perfil público.
            </FormDescription>
            <Input
              id="endereco-comercial"
              name="endereco-comercial"
              placeholder="Rua Linhares, 10"
              autoComplete="street-address"
              maxLength={BUSINESS_ADDRESS_MAX_LENGTH}
              value={businessAddress}
              onChange={(event) => setBusinessAddress(event.target.value)}
              aria-invalid={errors.businessAddress ? true : undefined}
              aria-describedby={
                errors.businessAddress
                  ? "endereco-comercial-descricao endereco-comercial-erro"
                  : "endereco-comercial-descricao"
              }
              className={cn(
                "mt-2",
                errors.businessAddress && "border-danger focus-visible:border-danger",
              )}
            />
            <FormMessage id="endereco-comercial-erro">
              {errors.businessAddress}
            </FormMessage>
          </div>

          <div>
            <label htmlFor="categoria" className="block text-sm font-medium text-ink">
              Categoria do trabalho
            </label>
            <select
              id="categoria"
              name="categoria"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className={cn(
                "mt-1.5 h-11 w-full rounded-xl border bg-surface px-3.5 text-sm text-ink transition-colors focus:border-brand",
                errors.category ? "border-danger" : "border-line-strong hover:border-brand/50",
              )}
            >
              <option value="">Selecione…</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            {errors.category ? (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-danger">
                <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
                {errors.category}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-[0.8fr_1.2fr]">
            <div>
              <span className="block text-sm font-medium text-ink">
                Área de atendimento
              </span>
              <div className="mt-1.5 flex h-11 items-center rounded-xl border border-line-strong bg-surface px-3.5 text-sm font-medium text-ink">
                {SERVICE_CITY} - {SERVICE_STATE}
              </div>
            </div>
            <ManausNeighborhoodField
              id="bairro"
              placeholder="Ex.: Adrianópolis"
              autoComplete="address-level3"
              value={neighborhood}
              error={errors.bairro}
              onChange={(event) => setNeighborhood(event.target.value)}
            />
          </div>
        </div>
      ) : null}

      <div>
        <label className="flex items-start gap-2.5 text-sm text-ink-soft">
          <input
            type="checkbox"
            name="aceite"
            checked={values.accept}
            onChange={(event) =>
              setValues((current) => ({ ...current, accept: event.target.checked }))
            }
            className="mt-0.5 size-4 shrink-0 rounded accent-brand"
          />
          <span>
            Li e aceito os{" "}
            <Link
              href="/termos"
              target="_blank"
              className="font-medium text-brand hover:text-brand-strong"
            >
              Termos de uso
            </Link>{" "}
            e a{" "}
            <Link
              href="/privacidade"
              target="_blank"
              className="font-medium text-brand hover:text-brand-strong"
            >
              Política de privacidade
            </Link>
            .
          </span>
        </label>

        {errors.accept ? (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-danger">
            <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
            {errors.accept}
          </p>
        ) : null}
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Criando conta..." : "Criar minha conta"}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Button>

      <p className="text-center text-sm text-ink-soft">
        Já tem conta?{" "}
        <Link
          href={returnTo ? `/entrar?retorno=${encodeURIComponent(returnTo)}` : "/entrar"}
          className="font-medium text-brand transition-colors hover:text-brand-strong"
        >
          Entrar
        </Link>
      </p>

      <p className="text-center text-sm">
        <Link href="/" className="text-ink-faint transition-colors hover:text-ink">
          Continuar sem entrar
        </Link>
      </p>
    </Form>
  );
}

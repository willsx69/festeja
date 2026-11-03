import { Suspense } from "react";
import { io } from "next/cache";
import { Check, Sparkles } from "lucide-react";
import { ProviderCard } from "@/components/provider/provider-card";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getFeaturedProviders } from "@/data/providers";

const benefits = [
  "Perfil profissional com portfólio",
  "Contato direto com clientes de Manaus",
  "Sem mensalidade para começar",
  "Avaliações para construir reputação",
];

async function RealProviderPreview() {
  await io();
  const provider = (await getFeaturedProviders())[0];
  return provider ? <ProviderCard provider={provider} className="rotate-1" /> : null;
}

export function ProviderCta() {
  return (
    <section id="para-prestadores" className="relative overflow-hidden bg-brand py-16 text-white sm:py-24">
      <div className="absolute -left-24 -top-24 size-72 rounded-full border-[44px] border-white/5" aria-hidden="true" />
      <div className="absolute -bottom-28 right-0 size-80 rounded-full bg-pink/20 blur-3xl" aria-hidden="true" />

      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20">
          <div>
            <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-yellow">
              <Sparkles className="size-4" aria-hidden="true" />
              Para prestadores
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-extrabold uppercase leading-[1.02] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
              Seu talento merece aparecer na próxima festa.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/80 sm:text-lg">
              Monte um perfil profissional, apresente seu trabalho e receba pedidos de orçamento de pessoas organizando eventos em Manaus.
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2.5 text-sm font-medium text-white/90">
                  <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-yellow">
                    <Check className="size-3 text-ink" aria-hidden="true" />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/cadastro?tipo=prestador" variant="accent" size="lg">
                Criar perfil grátis
              </ButtonLink>
              <ButtonLink href="#como-funciona" variant="secondary" size="lg" className="border-white/30 bg-transparent text-white hover:border-white/60 hover:bg-white/10">
                Ver como funciona
              </ButtonLink>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md">
            <Suspense fallback={<div className="h-[30rem] animate-pulse rounded-[1.5rem] bg-white/10" />}>
              <RealProviderPreview />
            </Suspense>
            <p className="mt-4 text-center text-xs font-medium text-white/60">Prévia de um perfil em destaque na plataforma</p>
          </div>
        </div>
      </Container>
    </section>
  );
}

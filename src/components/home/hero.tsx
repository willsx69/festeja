import { Suspense } from "react";
import Image from "next/image";
import { io } from "next/cache";
import { Check, MapPin, PartyPopper, Sparkles } from "lucide-react";
import { HeroIntro } from "@/components/home/hero-intro";
import { SearchBar } from "@/components/search/search-bar";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { getAllProviders } from "@/data/providers";
import { formatCount } from "@/lib/format";

async function ProviderCount() {
  await io();
  return <>{formatCount((await getAllProviders()).length)} profissionais</>;
}

export function Hero() {
  return (
    <section id="top" data-landing-hero className="hero-grid relative overflow-hidden bg-brand-soft">
      <HeroIntro />
      <div className="absolute -left-28 top-32 size-64 rounded-full bg-pink/10 blur-3xl" aria-hidden="true" />
      <div className="absolute -right-24 top-0 size-80 rounded-full bg-yellow/25 blur-3xl" aria-hidden="true" />

      <Container size="wide" className="relative grid min-h-[calc(100svh-4rem)] items-center gap-12 py-14 lg:grid-cols-[1.08fr_0.92fr] lg:py-20">
        <div className="relative z-10 max-w-3xl">
          <Badge tone="brand" className="hero-rise hero-rise-1 mb-6 gap-2 px-3 py-1.5 uppercase tracking-[0.12em]">
            <MapPin className="size-3.5" aria-hidden="true" />
            Manaus, Amazonas
          </Badge>

          <h1 className="display-title hero-rise hero-rise-2 text-balance text-[2.7rem] uppercase text-ink sm:text-[clamp(3rem,8vw,6.65rem)]">
            Sua próxima <span className="relative block w-fit text-brand sm:inline-block">festa<span className="hero-underline absolute -bottom-1 left-1 h-2 w-[92%] -rotate-1 rounded-full bg-yellow" aria-hidden="true" /></span> começa aqui.
          </h1>

          <p className="hero-rise hero-rise-3 mt-7 max-w-2xl text-balance text-base leading-8 text-ink-soft sm:text-lg">
            Encontre confeiteiros, decoradores, DJs, fotógrafos e outros profissionais para tirar seu evento do papel em Manaus.
          </p>

          <div className="hero-rise hero-rise-4 mt-8 rounded-[1.5rem] border border-white/80 bg-white/92 p-2 shadow-pop backdrop-blur sm:p-3">
            <SearchBar className="border-0 shadow-none" />
          </div>

          <div className="hero-rise hero-rise-5 mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-ink-soft">
            <span className="flex items-center gap-2"><Check className="size-4 text-brand" aria-hidden="true" /> <Suspense fallback="Profissionais de Manaus"><ProviderCount /></Suspense></span>
            <span className="flex items-center gap-2"><Check className="size-4 text-brand" aria-hidden="true" /> Orçamento direto</span>
            <span className="flex items-center gap-2"><Check className="size-4 text-brand" aria-hidden="true" /> Perfis com avaliações</span>
          </div>
        </div>

        <div className="relative mx-auto hidden h-[37rem] w-full max-w-[34rem] lg:block" aria-label="Momentos de festas e eventos">
          <div className="hero-photo hero-photo-a absolute left-6 top-8 h-[25rem] w-[19rem] -rotate-3 overflow-hidden rounded-[2rem] border-[10px] border-white bg-white shadow-pop">
            <Image src="/images/categorias/05-decoracao.png" alt="Decoração de festa em tons vibrantes" fill loading="lazy" sizes="304px" className="object-cover" />
          </div>
          <div className="hero-photo hero-photo-b absolute bottom-10 right-0 h-[20rem] w-[17rem] rotate-4 overflow-hidden rounded-[2rem] border-[10px] border-white bg-white shadow-pop">
            <Image src="/images/categorias/04-fotografia.png" alt="Fotografia profissional de evento" fill loading="lazy" sizes="272px" className="object-cover" />
          </div>

          <div className="hero-sticker hero-sticker-a absolute right-2 top-2 rotate-3 rounded-2xl bg-yellow px-5 py-4 text-ink shadow-pop">
            <Sparkles className="mb-2 size-5" aria-hidden="true" />
            <p className="text-xs font-extrabold uppercase tracking-[0.13em]">Seu evento</p>
            <p className="mt-0.5 font-extrabold">do seu jeito</p>
          </div>

          <div className="hero-sticker hero-sticker-b absolute bottom-5 left-0 -rotate-2 rounded-2xl bg-brand px-5 py-4 text-white shadow-pop">
            <PartyPopper className="mb-2 size-5 text-yellow" aria-hidden="true" />
            <p className="text-xs font-bold uppercase tracking-[0.13em] text-white/70">Tudo em um lugar</p>
            <p className="mt-0.5 font-extrabold">8 categorias</p>
          </div>

          <span className="hero-dot hero-dot-a absolute left-2 top-[29rem] size-5 rounded-full bg-pink" aria-hidden="true" />
          <span className="hero-dot hero-dot-b absolute right-32 top-0 size-3 rounded-full bg-brand" aria-hidden="true" />
        </div>
      </Container>
    </section>
  );
}

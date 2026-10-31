import { MessageCircle, Search, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";

const steps = [
  {
    icon: Search,
    title: "Busque pelo serviço",
    description:
      "Digite o que precisa ou escolha uma categoria e filtre pelo bairro em Manaus.",
  },
  {
    icon: MessageCircle,
    title: "Compare e converse",
    description:
      "Veja portfólios, avaliações e preços. Tire dúvidas direto com o prestador.",
  },
  {
    icon: ShieldCheck,
    title: "Contrate com tranquilidade",
    description:
      "Confirme data e valores antes de fechar e avalie ao final para ajudar quem vem depois.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
       className="relative overflow-hidden border-b border-line bg-brand-soft py-16 sm:py-24"
    >
      <Container>
        <SectionHeader
          align="center"
          eyebrow="Como funciona"
          title="Do planejamento à festa em 3 passos"
          description="Sem burocracia: você encontra, conversa e contrata na mesma plataforma."
        />

         <ol className="relative mt-12 grid gap-4 sm:grid-cols-3 sm:gap-6 before:absolute before:left-[16.66%] before:right-[16.66%] before:top-7 before:hidden before:border-t before:border-dashed before:border-brand/25 sm:before:block">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <li
                key={step.title}
                 className="relative z-10 flex flex-col items-center gap-3 rounded-[1.5rem] border border-white bg-surface p-6 text-center shadow-card sm:border-transparent sm:bg-transparent sm:shadow-none"
              >
                 <div className="relative mb-2 flex size-14 items-center justify-center rounded-full bg-brand text-white shadow-[0_0_0_8px_#f5f1ff]">
                   <span className="absolute -right-1 -top-1 inline-flex size-6 items-center justify-center rounded-full bg-yellow text-[0.65rem] font-extrabold text-ink tabular-nums">
                     {index + 1}
                   </span>
                   <Icon className="size-5" aria-hidden="true" />
                 </div>
                 <h3 className="text-base font-extrabold uppercase tracking-[-0.015em] text-ink">{step.title}</h3>
                 <p className="max-w-xs text-sm leading-6 text-ink-soft">
                  {step.description}
                </p>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}

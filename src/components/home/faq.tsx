import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";

const questions = [
  {
    question: "O Festeja cobra para buscar profissionais?",
    answer: "Não. Você pode pesquisar categorias, comparar perfis e consultar os trabalhos disponíveis gratuitamente.",
  },
  {
    question: "Como solicito um orçamento?",
    answer: "Abra o perfil do profissional, escolha a opção de orçamento e informe os detalhes do evento. O pedido fica registrado para vocês acompanharem pela plataforma.",
  },
  {
    question: "Os profissionais atendem fora de Manaus?",
    answer: "Neste momento, o Festeja concentra sua operação em Manaus, Amazonas. Consulte o bairro e a disponibilidade diretamente no perfil escolhido.",
  },
  {
    question: "Posso conversar antes de contratar?",
    answer: "Sim. Depois de entrar na sua conta, você pode conversar com o prestador pela área de mensagens para alinhar escopo, data e valores.",
  },
  {
    question: "Como cadastro meu trabalho?",
    answer: "Crie uma conta de prestador, complete seus dados profissionais e publique seu portfólio. Seu perfil passa a ser encontrado nas buscas da plataforma.",
  },
];

export function Faq() {
  return (
    <section id="duvidas" className="border-b border-line bg-surface py-16 sm:py-24">
      <Container size="sm">
        <SectionHeader align="center" eyebrow="Dúvidas frequentes" title="Antes da festa começar" description="Respostas rápidas para organizar seu evento com mais clareza." />
        <Accordion type="single" collapsible className="mt-10 rounded-[1.5rem] border border-line bg-canvas px-5 sm:px-7">
          {questions.map((item, index) => (
            <AccordionItem key={item.question} value={`item-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  );
}

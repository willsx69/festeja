import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Termos de uso",
  description: "Termos de uso da plataforma Festeja.",
};

export default function TermosPage() {
  return (
    <div id="top" className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1 bg-canvas">
        <Container size="sm" className="py-12 sm:py-16">
          <article className="space-y-8 text-sm leading-relaxed text-ink-soft">
            <header>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                Festeja
              </p>
              <h1 className="mt-2 text-3xl font-semibold uppercase tracking-[0.04em] text-ink">
                Termos de uso
              </h1>
              <p className="mt-3">Última atualização: 30 de outubro de 2026.</p>
            </header>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-ink">1. A plataforma</h2>
              <p>
                A Festeja conecta clientes que organizam festas e eventos a prestadores
                de serviços independentes. A plataforma não presta os serviços
                anunciados, não participa da execução dos eventos e não processa
                pagamentos entre as partes.
              </p>
              <p>
                A contratação, os valores, o escopo e a execução do serviço são
                combinados diretamente entre cliente e prestador.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-ink">2. Cadastro e conta</h2>
              <p>
                Para usar os recursos de conta, você deve ter pelo menos 18 anos e
                fornecer informações verdadeiras, completas e atualizadas. Você é
                responsável pela confidencialidade da senha e pelas atividades
                realizadas na sua conta.
              </p>
              <p>
                Podemos solicitar a confirmação do e-mail e suspender contas que
                apresentem informações falsas, uso indevido ou risco à segurança da
                plataforma e de outros usuários.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-ink">3. Prestadores</h2>
              <p>
                O prestador é responsável pelo conteúdo do seu perfil, portfólio,
                preços, disponibilidade e pela qualidade dos serviços contratados. As
                informações publicadas devem ser verdadeiras e não podem induzir a erro.
              </p>
              <p>
                A verificação de perfil exibida na plataforma não é garantia de
                qualidade, idoneidade ou resultado do serviço. Antes de contratar,
                confirme detalhes, referências e condições diretamente com o prestador.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-ink">4. Condutas proibidas</h2>
              <p>
                É proibido publicar conteúdo ilegal, ofensivo, discriminatório ou
                enganoso; assediar outros usuários; tentar acessar contas ou dados sem
                autorização; usar a plataforma para spam, fraude ou atividades que
                violem a lei.
              </p>
              <p>
                Conteúdos e avaliações podem ser moderados, ocultados ou removidos
                quando houver indício de violação destes termos ou de denúncia
                procedente.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-ink">5. Avaliações e conteúdo</h2>
              <p>
                Ao publicar avaliações, fotos, textos ou outros conteúdos, você declara
                ter direito de fazê-lo e concede à Festeja autorização não exclusiva
                para exibir esse conteúdo na plataforma. Avaliações devem refletir
                experiências reais.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-ink">6. Limitação de responsabilidade</h2>
              <p>
                A Festeja emprega esforços para manter a plataforma disponível e segura,
                mas não garante funcionamento ininterrupto, ausência de erros ou
                adequação a uma finalidade específica. Na medida permitida pela lei, a
                Festeja não responde por danos decorrentes de negociações, pagamentos ou
                serviços realizados diretamente entre clientes e prestadores.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-ink">7. Encerramento</h2>
              <p>
                Você pode excluir sua conta a qualquer momento em Configurações. A
                exclusão remove os dados associados à conta, observadas as obrigações
                legais de retenção e os registros necessários para segurança e
                prevenção de fraude.
              </p>
              <p>
                Podemos encerrar ou suspender o acesso em caso de violação destes
                termos, uso fraudulento ou determinação legal.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-ink">8. Disposições gerais</h2>
              <p>
                Estes termos são regidos pelas leis brasileiras. Alterações relevantes
                serão comunicadas na plataforma. O uso contínuo após a atualização
                representa concordância com a nova versão.
              </p>
              <p>
                Dúvidas sobre estes termos podem ser enviadas para{" "}
                <a
                  href="mailto:contato@festeja.com.br"
                  className="font-medium text-brand hover:text-brand-strong"
                >
                  contato@festeja.com.br
                </a>
                .
              </p>
            </section>
          </article>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

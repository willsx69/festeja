import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description: "Como a Festeja coleta, usa e protege seus dados pessoais.",
};

export default function PrivacidadePage() {
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
                Política de privacidade
              </h1>
              <p className="mt-3">Última atualização: 30 de outubro de 2026.</p>
            </header>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-ink">1. Controlador e contato</h2>
              <p>
                A Festeja é responsável pelo tratamento dos dados pessoais descritos
                nesta política. Solicitações relacionadas à privacidade podem ser
                enviadas para{" "}
                <a
                  href="mailto:contato@festeja.com.br"
                  className="font-medium text-brand hover:text-brand-strong"
                >
                  contato@festeja.com.br
                </a>
                .
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-ink">2. Dados coletados</h2>
              <p>
                Coletamos dados informados no cadastro e no uso da plataforma, como
                nome, e-mail, senha protegida por hash, telefone, foto, tipo de conta e
                dados do perfil do prestador. Também registramos mensagens, orçamentos,
                contratos, avaliações, favoritos, visualizações de perfil e preferências
                de busca.
              </p>
              <p>
                Cookies essenciais mantêm a sessão autenticada e identificam visitantes
                para finalidades de segurança. Não utilizamos os dados para venda a
                terceiros.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-ink">3. Finalidades e bases legais</h2>
              <p>
                Tratamos dados para criar e manter contas, exibir perfis, viabilizar
                contato e contratação, enviar confirmações e recuperação de senha,
                prevenir fraude e abuso, moderar conteúdo, cumprir obrigações legais e
                melhorar a segurança da plataforma.
              </p>
              <p>
                As bases legais incluem a execução de contrato e procedimentos
                preliminares, o cumprimento de obrigação legal, o legítimo interesse na
                segurança e prevenção a fraude e, quando aplicável, o consentimento.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-ink">4. Compartilhamento</h2>
              <p>
                Dados podem ser processados por provedores de hospedagem, banco de dados
                e envio de e-mail estritamente para operar a plataforma. Também podem ser
                divulgados quando exigido por lei ou autoridade competente.
              </p>
              <p>
                Informações de perfil público, como nome, bairro em Manaus, portfólio e
                avaliações, ficam visíveis para outros usuários e visitantes.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-ink">5. Retenção</h2>
              <p>
                Mantemos os dados enquanto a conta estiver ativa e pelo período
                necessário às finalidades descritas, ao cumprimento de obrigações legais,
                à resolução de disputas e à prevenção de fraude. Depois disso, os dados
                são excluídos ou anonimizados.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-ink">6. Segurança</h2>
              <p>
                Adotamos medidas técnicas e administrativas para proteger os dados, como
                senhas armazenadas com hash, cookies de sessão HTTP-only, controle de
                acesso e validação de uploads. Nenhum sistema é totalmente imune a
                incidentes; caso ocorra incidente relevante, adotaremos as medidas de
                comunicação previstas na lei.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-ink">7. Seus direitos</h2>
              <p>
                Nos termos da LGPD, você pode solicitar confirmação de tratamento,
                acesso, correção, anonimização, bloqueio, eliminação, portabilidade,
                informação sobre compartilhamentos e revogação de consentimento.
              </p>
              <p>
                Você pode excluir sua conta e os dados associados em{" "}
                <Link
                  href="/configuracoes"
                  className="font-medium text-brand hover:text-brand-strong"
                >
                  Configurações
                </Link>
                . Para outras solicitações, use o e-mail de contato acima.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-ink">8. Alterações</h2>
              <p>
                Podemos atualizar esta política para refletir mudanças na plataforma ou
                na legislação. A data de atualização será revisada e mudanças relevantes
                serão comunicadas na plataforma.
              </p>
            </section>
          </article>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

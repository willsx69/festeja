import type { Metadata } from "next";
import Link from "next/link";
import { CalendarPlus, MessageCircle } from "lucide-react";
import { ClientePageHeader } from "@/components/cliente/cliente-page-header";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { requireUser } from "@/lib/auth";
import { listQuotesForClient } from "@/lib/db";
import { formatShortDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Meus orçamentos",
  description: "Acompanhe os pedidos de orçamento enviados aos profissionais.",
};

const statusMeta = {
  aberto: { label: "Aguardando resposta", tone: "yellow" as const },
  aceito: { label: "Aceito", tone: "brand" as const },
  recusado: { label: "Recusado", tone: "pink" as const },
};

export default async function ClienteOrcamentosPage() {
  const user = await requireUser(["cliente"], "/cliente/orcamentos");
  const quotes = [...(await listQuotesForClient(user.id))].reverse();

  return (
    <Container className="py-8 sm:py-10">
      <ClientePageHeader
        title="Pedidos de orçamento"
        description="Veja o que você solicitou, a resposta de cada profissional e retome a conversa."
        action={<ButtonLink href="/buscar">Novo pedido</ButtonLink>}
      />

      {quotes.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-12 text-center">
          <CalendarPlus className="mx-auto size-9 text-brand" aria-hidden="true" />
          <h2 className="mt-3 text-lg font-bold text-ink">Encontre o primeiro profissional da sua lista</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-soft">Pesquise por serviço e bairro, visite um perfil e envie os detalhes da sua festa.</p>
          <ButtonLink href="/buscar" className="mt-5">Buscar profissionais</ButtonLink>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {quotes.map((quote) => {
            const status = statusMeta[quote.status];
            return (
              <li key={quote.id}>
                <Card className="border-l-4 border-l-brand">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-bold text-ink">{quote.providerName}</h2>
                      <p className="mt-1 text-sm text-ink-faint">{quote.serviceName ?? "Serviço a combinar"} · Evento em {formatShortDate(quote.eventDate)}{quote.guests ? ` · ${quote.guests} convidados` : ""}</p>
                    </div>
                    <Badge tone={status.tone}>{status.label}</Badge>
                  </div>
                  <blockquote className="mt-4 border-l-2 border-line pl-3 text-sm leading-relaxed text-ink-soft">“{quote.message}”</blockquote>
                  <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-4">
                    <Link href={`/prestador/${quote.providerUsername}`} className="text-sm font-semibold text-brand hover:text-brand-strong">Ver perfil</Link>
                    <Link href={`/mensagens?com=${quote.providerUsername}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-strong"><MessageCircle className="size-4" aria-hidden="true" />Enviar mensagem</Link>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </Container>
  );
}

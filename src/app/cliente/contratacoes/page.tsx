import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheck, Clock, Star } from "lucide-react";
import { cancelContractAction } from "@/actions/quotes";
import { ClientePageHeader } from "@/components/cliente/cliente-page-header";
import { ReviewForm } from "@/components/perfil/review-form";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { requireUser } from "@/lib/auth";
import { listContractsForClient, listReviewableContractsForClient } from "@/lib/db";
import { formatBRL, formatShortDate } from "@/lib/format";
import type { ContractStatus } from "@/types";

export const metadata: Metadata = {
  title: "Minhas contratações",
  description: "Acompanhe os serviços contratados para seus eventos.",
};

const statusMeta: Record<ContractStatus, { label: string; tone: "brand" | "pink" }> = {
  pendente: { label: "Confirmado", tone: "brand" },
  concluido: { label: "Concluído", tone: "brand" },
  cancelado: { label: "Cancelado", tone: "pink" },
};

export default async function ClienteContratacoesPage() {
  const user = await requireUser(["cliente"], "/cliente/contratacoes");
  const contractData = await listContractsForClient(user.id);
  const contracts = [...contractData].reverse();
  const reviewable = await listReviewableContractsForClient(user.id, contractData);

  return (
    <Container className="py-8 sm:py-10">
      <ClientePageHeader title="Contratações" description="Consulte datas, valores e profissionais confirmados para a sua festa." action={<ButtonLink href="/buscar" variant="secondary">Buscar outro serviço</ButtonLink>} />

      {reviewable.length > 0 ? (
        <section aria-labelledby="contract-review-title" className="mt-8 rounded-2xl border border-brand/25 bg-brand-soft/45 p-4 sm:p-6">
          <div className="mb-4 flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white"><Star className="size-5" aria-hidden="true" /></span>
            <div><h2 id="contract-review-title" className="font-bold text-ink">Como foi a experiência?</h2><p className="mt-1 text-sm text-ink-soft">Você tem {reviewable.length} {reviewable.length === 1 ? "serviço concluído pronto" : "serviços concluídos prontos"} para avaliar.</p></div>
          </div>
          <ReviewForm contracts={reviewable} />
        </section>
      ) : null}

      {contracts.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-12 text-center">
          <CalendarCheck className="mx-auto size-9 text-brand" aria-hidden="true" />
          <h2 className="mt-3 text-lg font-bold text-ink">Nenhuma contratação registrada</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">Quando um orçamento for aceito, os dados do acordo aparecerão aqui.</p>
          <ButtonLink href="/cliente/orcamentos" className="mt-5">Ver pedidos de orçamento</ButtonLink>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {contracts.map((contract) => {
            const status = statusMeta[contract.status];
            return (
              <li key={contract.id}>
                <Card>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-ink">{contract.serviceName}</h2>
                      <p className="mt-1 text-sm font-medium text-ink-soft">{contract.providerName}</p>
                      <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-faint"><Clock className="size-4" aria-hidden="true" />Evento em {formatShortDate(contract.eventDate)}</p>
                    </div>
                    <div className="text-right"><p className="text-lg font-extrabold tabular-nums text-ink">{formatBRL(contract.amount)}</p><Badge tone={status.tone} className="mt-2">{status.label}</Badge></div>
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-4">
                    {contract.providerUsername ? <Link href={`/prestador/${contract.providerUsername}`} className="text-sm font-semibold text-brand hover:text-brand-strong">Ver profissional</Link> : null}
                    {contract.providerUsername ? <Link href={`/mensagens?com=${contract.providerUsername}`} className="text-sm font-semibold text-brand hover:text-brand-strong">Enviar mensagem</Link> : null}
                    {contract.status === "pendente" ? <form action={cancelContractAction} className="sm:ml-auto"><input type="hidden" name="id" value={contract.id} /><Button type="submit" variant="ghost" size="sm">Cancelar contrato</Button></form> : null}
                    {reviewable.some((item) => item.id === contract.id) ? <Link href="/cliente/avaliacoes" className="text-sm font-semibold text-brand hover:text-brand-strong">Avaliar experiência</Link> : null}
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

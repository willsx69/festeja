import { CheckCircle2, FileCheck2 } from "lucide-react";
import { cancelContractAction, completeContractAction } from "@/actions/quotes";
import { PainelEmptyState } from "@/components/painel/painel-empty-state";
import { PainelPageHeader } from "@/components/painel/painel-page-header";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { getProviderUserId, listContractsForProvider } from "@/lib/db";
import { formatBRL, formatShortDate } from "@/lib/format";
import type { ContractStatus } from "@/types";

const statusMeta: Record<ContractStatus, { label: string; tone: "brand" | "pink" | "yellow" }> = {
  pendente: { label: "Pendente", tone: "yellow" },
  concluido: { label: "Concluído", tone: "brand" },
  cancelado: { label: "Cancelado", tone: "pink" },
};

export default async function PainelContratosPage() {
  const user = await requireUser(["prestador"]);
  const providerUserId = user.username
    ? await getProviderUserId(user.username)
    : undefined;
  const contracts = providerUserId
    ? [...(await listContractsForProvider(providerUserId))].reverse()
    : [];

  return (
    <div className="space-y-6">
      <PainelPageHeader
        title="Contratos"
        description="Acompanhe os eventos confirmados e conclua cada contrato após a realização."
      />

      {contracts.length === 0 ? (
        <PainelEmptyState
          icon={FileCheck2}
          title="Nenhum contrato ainda"
          description="Aceite uma solicitação de orçamento para criar seu primeiro contrato."
          action={<ButtonLink href="/painel/orcamentos">Ver orçamentos</ButtonLink>}
        />
      ) : (
        <ul className="space-y-4">
          {contracts.map((contract) => {
            const status = statusMeta[contract.status];
            return (
              <li key={contract.id}>
                <Card className="shadow-none">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-ink">{contract.serviceName}</p>
                      <p className="mt-0.5 text-sm text-ink-faint">
                        {contract.clientName} · Evento em {formatShortDate(contract.eventDate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-base font-semibold tabular-nums text-ink">
                        {formatBRL(contract.amount)}
                      </p>
                      <Badge tone={status.tone}>{status.label}</Badge>
                    </div>
                  </div>

                  {contract.status === "pendente" ? (
                    <div className="mt-4 flex flex-wrap gap-3 border-t border-line pt-4">
                      <form action={completeContractAction}>
                        <input type="hidden" name="id" value={contract.id} />
                        <Button type="submit" variant="secondary">
                          <CheckCircle2 className="size-4" aria-hidden="true" />
                          Marcar como concluído
                        </Button>
                      </form>
                      <form action={cancelContractAction}>
                        <input type="hidden" name="id" value={contract.id} />
                        <Button type="submit" variant="ghost">
                          Cancelar contrato
                        </Button>
                      </form>
                    </div>
                  ) : null}
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

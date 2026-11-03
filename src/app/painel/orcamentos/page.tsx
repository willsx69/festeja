import { QuotesManager } from "@/components/painel/quotes-manager";
import { PainelPageHeader } from "@/components/painel/painel-page-header";
import { Badge } from "@/components/ui/badge";
import { requireUser } from "@/lib/auth";
import { getProviderProfileDetails, listQuotesForProvider } from "@/lib/db";

export default async function PainelOrcamentosPage() {
  const user = await requireUser(["prestador"]);
  const details = user.username
    ? await getProviderProfileDetails(user.username)
    : undefined;
  const quotes = details ? await listQuotesForProvider(details.userId) : [];
  const openQuotes = quotes.filter((quote) => quote.status === "aberto").length;

  return (
    <div className="space-y-6">
      <PainelPageHeader
        title="Orçamentos"
        description="Responda às solicitações dos clientes. Um orçamento aceito gera o contrato automaticamente."
        action={
          openQuotes > 0 ? (
            <Badge tone="yellow">
              {openQuotes} {openQuotes === 1 ? "aguardando resposta" : "aguardando resposta"}
            </Badge>
          ) : null
        }
      />
      <QuotesManager quotes={quotes} />
    </div>
  );
}

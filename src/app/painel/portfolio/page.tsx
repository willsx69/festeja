import { PortfolioManager } from "@/components/painel/portfolio-manager";
import { PainelPageHeader } from "@/components/painel/painel-page-header";
import { requireUser } from "@/lib/auth";
import { getProviderProfileDetails, listPortfolio } from "@/lib/db";

export default async function PainelPortfolioPage() {
  const user = await requireUser(["prestador"]);
  const details = user.username
    ? await getProviderProfileDetails(user.username)
    : undefined;
  const items = details ? await listPortfolio(details.userId) : [];

  if (!details) {
    return <p className="text-sm text-ink-soft">Perfil de prestador não encontrado.</p>;
  }

  return (
    <div className="space-y-6">
      <PainelPageHeader
        title="Portfólio"
        description="Mostre trabalhos reais com imagens e contexto para gerar mais confiança."
      />
      <PortfolioManager items={items} categoryId={details.category} />
    </div>
  );
}

import { ServicesManager } from "@/components/painel/services-manager";
import { PainelPageHeader } from "@/components/painel/painel-page-header";
import { requireUser } from "@/lib/auth";
import { getProviderUserId, listServices } from "@/lib/db";

export default async function PainelServicosPage() {
  const user = await requireUser(["prestador"]);
  const providerUserId = user.username
    ? await getProviderUserId(user.username)
    : undefined;
  const services = providerUserId ? await listServices(user.username ?? "") : [];

  return (
    <div className="space-y-6">
      <PainelPageHeader
        title="Serviços"
        description="Organize o que você oferece, informe valores e facilite a escolha dos clientes."
      />
      <ServicesManager services={services} />
    </div>
  );
}

import { ServicesManager } from "@/components/painel/services-manager";
import { PainelPageHeader } from "@/components/painel/painel-page-header";
import { requireUser } from "@/lib/auth";
import { getProviderProfileDetails, listServicesForProvider } from "@/lib/db";

export default async function PainelServicosPage() {
  const user = await requireUser(["prestador"]);
  const details = user.username
    ? await getProviderProfileDetails(user.username)
    : undefined;
  const services = details ? await listServicesForProvider(details.userId) : [];

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

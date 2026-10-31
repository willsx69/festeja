import { ProfileForm } from "@/components/painel/profile-form";
import { PainelPageHeader } from "@/components/painel/painel-page-header";
import { requireUser } from "@/lib/auth";
import { getProviderProfileDetails } from "@/lib/db";

export default async function PainelPerfilPage() {
  const user = await requireUser(["prestador"]);
  if (!user.username) {
    return <p className="text-sm text-ink-soft">Perfil de prestador não encontrado.</p>;
  }

  const details = await getProviderProfileDetails(user.username);
  if (!details) {
    return <p className="text-sm text-ink-soft">Perfil de prestador não encontrado.</p>;
  }

  return (
    <div className="space-y-6">
      <PainelPageHeader
        title="Meu perfil"
        description="Atualize sua apresentação, área de atendimento, disponibilidade e imagem profissional."
      />
      <ProfileForm details={details} />
    </div>
  );
}

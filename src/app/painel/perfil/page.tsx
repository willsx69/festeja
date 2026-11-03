import { PainelPageHeader } from "@/components/painel/painel-page-header";
import { ProfileForm } from "@/components/painel/profile-form";
import { ProfilePhotoManager } from "@/components/painel/profile-photo-manager";
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
        description="Atualize suas fotos, apresentação, área de atendimento e disponibilidade."
      />
      <ProfilePhotoManager
        name={details.name}
        username={details.username}
        categoryId={details.category}
        city={details.city}
        state={details.state}
        neighborhood={details.neighborhood}
        initialAvatar={details.avatar}
        initialCover={details.cover}
      />
      <ProfileForm details={details} />
    </div>
  );
}

import { ReplyForm } from "@/components/painel/reply-form";
import { Card } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { getProviderProfile } from "@/lib/db";

export default async function PainelAvaliacoesPage() {
  const user = await requireUser(["prestador"]);
  const profile = user.username ? await getProviderProfile(user.username) : undefined;
  const reviews = profile?.reviews ?? [];

  return (
    <div className="space-y-6">
      <PainelPageHeader
        title="Avaliações"
        description="Acompanhe a experiência dos clientes e responda para fortalecer sua reputação."
      />

      {reviews.length === 0 ? (
        <PainelEmptyState
          icon={MessageSquareHeart}
          title="Você ainda não recebeu avaliações"
          description="Após a conclusão de um contrato, o cliente poderá avaliar sua experiência."
        />
      ) : (
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li key={review.id}>
              <Card className="shadow-none">
                <ReplyForm review={review} />
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
import { MessageSquareHeart } from "lucide-react";
import { PainelEmptyState } from "@/components/painel/painel-empty-state";
import { PainelPageHeader } from "@/components/painel/painel-page-header";

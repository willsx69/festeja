import type { Metadata } from "next";
import Link from "next/link";
import { Star } from "lucide-react";
import { ClientePageHeader } from "@/components/cliente/cliente-page-header";
import { ReviewForm } from "@/components/perfil/review-form";
import { ProviderAvatar } from "@/components/provider/provider-avatar";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Rating } from "@/components/ui/rating";
import { requireUser } from "@/lib/auth";
import { listReviewableContractsForClient, listReviewsByClient } from "@/lib/db";
import { formatShortDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Minhas avaliações",
  description: "Avalie serviços concluídos e consulte suas avaliações.",
};

export default async function ClienteAvaliacoesPage() {
  const user = await requireUser(["cliente"], "/cliente/avaliacoes");
  const [pending, reviews] = await Promise.all([
    listReviewableContractsForClient(user.id),
    listReviewsByClient(user.id),
  ]);

  return (
    <Container className="py-8 sm:py-10">
      <ClientePageHeader title="Avaliações" description="Conte como foi o serviço e ajude outras pessoas a escolherem com segurança." action={<ButtonLink href="/cliente/contratacoes" variant="secondary">Ver contratações</ButtonLink>} />
      {pending.length > 0 ? (
        <section aria-labelledby="pending-reviews-title" className="mt-8">
          <div className="mb-4 flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-yellow text-ink"><Star className="size-5" aria-hidden="true" /></span><div><h2 id="pending-reviews-title" className="font-bold text-ink">Experiências para avaliar</h2><p className="text-sm text-ink-soft">{pending.length} {pending.length === 1 ? "contratação concluída" : "contratações concluídas"}</p></div></div>
          <ReviewForm contracts={pending} />
        </section>
      ) : null}
      <section aria-labelledby="published-reviews-title" className="mt-10">
        <h2 id="published-reviews-title" className="text-xl font-extrabold tracking-[-0.025em] text-ink">Avaliações publicadas</h2>
        {reviews.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-10 text-center"><p className="font-semibold text-ink">Você ainda não publicou avaliações</p><p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">Após a conclusão de um contrato, o formulário para contar sua experiência ficará disponível aqui.</p></div>
        ) : (
          <ul className="mt-5 grid gap-4 md:grid-cols-2">
            {reviews.map((review) => (
              <li key={review.id}>
                <Card className="flex h-full flex-col">
                  <div className="flex items-center gap-3">
                    <ProviderAvatar name={review.providerName} size="md" className="size-11 text-sm" />
                    <div className="min-w-0 flex-1"><Link href={`/prestador/${review.providerUsername}?aba=avaliacoes`} className="block truncate text-sm font-bold text-ink hover:text-brand">{review.providerName}</Link><p className="mt-0.5 truncate text-xs text-ink-faint">{review.event} · {formatShortDate(review.date)}</p></div>
                    <Badge tone={review.rating >= 4 ? "brand" : "neutral"}>{review.rating} {review.rating === 1 ? "estrela" : "estrelas"}</Badge>
                  </div>
                  <Rating value={review.rating} className="mt-4" />
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">“{review.comment}”</p>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Container>
  );
}

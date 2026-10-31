import { Star } from "lucide-react";
import { ProfileSection } from "@/components/provider/profile-section";
import { ProviderAvatar } from "@/components/provider/provider-avatar";
import { ReviewReportButton } from "@/components/provider/review-report-button";
import { Card } from "@/components/ui/card";
import { Rating } from "@/components/ui/rating";
import { formatCount, formatRating } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Provider, ProviderReview } from "@/types";

type ProviderReviewsProps = {
  provider: Provider;
  reviews: ProviderReview[];
  loggedIn: boolean;
  className?: string;
};

export function ProviderReviews({ provider, reviews, loggedIn, className }: ProviderReviewsProps) {
  const hasReviews = provider.reviews > 0;
  const stars = Math.round(provider.rating);
  const distribution = [5, 4, 3, 2, 1].map((score) => ({
    score,
    count: reviews.filter((review) => review.rating === score).length,
  }));
  const maxCount = Math.max(...distribution.map((item) => item.count), 1);

  return (
    <ProfileSection
      title="Avaliações"
      description="Quem já contratou deixou o parecer sobre o serviço."
      className={className}
    >
      {hasReviews ? (
        <div className="rounded-[1.6rem] border border-brand/10 bg-brand-soft/75 p-5 sm:p-6">
          <div className="grid gap-6 sm:grid-cols-[15rem_minmax(0,1fr)] sm:items-center">
            <div className="flex items-center gap-4">
              <p className="text-6xl font-extrabold leading-none tracking-[-0.06em] tabular-nums text-ink">
                {formatRating(provider.rating)}
              </p>
              <div>
                <span className="flex gap-0.5" aria-hidden="true">
                  {[1, 2, 3, 4, 5].map((position) => (
                    <Star
                      key={position}
                      className={cn(
                        "size-4",
                        position <= stars ? "fill-yellow text-yellow" : "text-line-strong",
                      )}
                    />
                  ))}
                </span>
                <p className="mt-1.5 text-sm leading-snug text-ink-soft">
                  {formatCount(provider.reviews)}{" "}
                  {provider.reviews === 1 ? "avaliação publicada" : "avaliações publicadas"}
                </p>
                <span className="sr-only">
                  Nota média {formatRating(provider.rating)} de 5.
                </span>
              </div>
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-1.5" aria-label="Distribuição das notas">
                {distribution.map((item) => (
                  <div key={item.score} className="flex items-center gap-2 text-xs">
                    <span className="w-3 text-right font-medium tabular-nums text-ink-soft">
                      {item.score}
                    </span>
                    <Star className="size-3 shrink-0 fill-yellow text-yellow" aria-hidden="true" />
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/80">
                      <span
                        className="block h-full rounded-full bg-brand"
                        style={{ width: `${(item.count / maxCount) * 100}%` }}
                      />
                    </span>
                    <span className="w-4 text-right tabular-nums text-ink-faint">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <p className="mt-4 border-t border-brand/10 pt-4 text-xs leading-relaxed text-ink-faint">
            A nota reúne apenas avaliações de clientes com contrato concluído.
          </p>
        </div>
      ) : (
        <div className="rounded-[1.35rem] border border-dashed border-line-strong bg-surface-muted/60 p-5 sm:p-7">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-surface text-brand shadow-card">
              <Star className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-base font-semibold text-ink">Ainda sem avaliações</p>
              <p className="mt-1 max-w-[58ch] text-sm leading-relaxed text-ink-soft">
                As avaliações aparecem aqui depois da conclusão de um contrato com este
                prestador.
              </p>
            </div>
          </div>
        </div>
      )}

      {reviews.length > 0 ? (
        <>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {reviews.map((review) => (
              <li key={review.id}>
                <Card className="flex h-full flex-col gap-3 rounded-[1.35rem]">
                  <div className="flex items-center gap-3">
                    <ProviderAvatar name={review.author} size="md" className="size-11 text-sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">{review.author}</p>
                      <p className="truncate text-xs text-ink-faint">{review.event}</p>
                      <p className="text-[0.7rem] text-ink-faint">{review.date}</p>
                    </div>
                    <ReviewReportButton reviewId={review.id} loggedIn={loggedIn} />
                  </div>

                  <Rating value={review.rating} />

                  <p className="text-sm leading-relaxed text-ink-soft">“{review.comment}”</p>

                  {review.reply ? (
                    <div className="mt-auto rounded-xl border-l-2 border-brand bg-brand-soft/70 p-3">
                      <p className="text-xs font-semibold text-brand">Resposta do prestador</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                        {review.reply}
                      </p>
                    </div>
                  ) : null}
                </Card>
              </li>
            ))}
          </ul>

          <p className="mt-4 text-sm text-ink-faint">
            {provider.reviews > reviews.length
              ? `Mostrando ${formatCount(reviews.length)} de ${formatCount(provider.reviews)} avaliações.`
              : provider.reviews === 1
                ? "A avaliação publicada neste perfil está logo acima."
                : `Todas as ${formatCount(provider.reviews)} avaliações estão publicadas acima.`}
          </p>
        </>
      ) : null}
    </ProfileSection>
  );
}

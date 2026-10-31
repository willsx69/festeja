import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { io } from "next/cache";
import { Pencil } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ProfileViewTracker } from "@/components/provider/profile-view-tracker";
import { OwnerMetrics } from "@/components/provider/owner-metrics";
import { parseProfileTab, ProfileTabs, type ProfileTabId } from "@/components/provider/profile-tabs";
import { ProviderAbout } from "@/components/provider/provider-about";
import { ProviderAvailability } from "@/components/provider/provider-availability";
import { ProviderContractCard } from "@/components/provider/provider-contract-card";
import { ProviderHero } from "@/components/provider/provider-hero";
import { ProviderMobileActions } from "@/components/provider/provider-mobile-actions";
import { ProviderPortfolio } from "@/components/provider/provider-portfolio";
import { ProviderReviews } from "@/components/provider/provider-reviews";
import { ProviderServices } from "@/components/provider/provider-services";
import { QuoteForm } from "@/components/perfil/quote-form";
import { ReviewForm } from "@/components/perfil/review-form";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { getCategory } from "@/data/categories";
import { getProvider } from "@/data/providers";
import { getCurrentUser } from "@/lib/auth";
import {
  canReviewContract,
  getProviderProfile,
  getProviderProfileDetails,
  getProviderStats,
  getProviderUserId,
  isFavorite,
  listContractsForClient,
} from "@/lib/db";
import { formatCount, formatRating } from "@/lib/format";
import { hasAvailabilityDetail } from "@/lib/profile-display";
import type { Contract } from "@/types";

export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const provider = await getProvider(username);

  if (!provider) {
    return { title: "Prestador não encontrado" };
  }

  const category = getCategory(provider.category);
  const location = provider.neighborhood
    ? `${provider.neighborhood}, ${provider.city}, ${provider.state}`
    : `${provider.city}, ${provider.state}`;
  const ratingSummary =
    provider.reviews > 0
      ? `Avaliação ${formatRating(provider.rating)} de 5 com ${formatCount(provider.reviews)} ${
          provider.reviews === 1 ? "avaliação" : "avaliações"
        } de clientes na Festeja.`
      : "Ainda sem avaliações de clientes.";

  return {
    title: `${provider.name} — ${category.name} em ${provider.city}`,
    description: `${category.name} em ${location}. ${ratingSummary}`,
  };
}

function ProfileSkeleton() {
  return (
    <div className="bg-canvas">
      <Container className="space-y-6 py-6">
        <div className="h-4 w-36 animate-pulse rounded-md bg-surface-muted" />
        <div className="h-44 animate-pulse rounded-[2rem] bg-surface-muted sm:h-64" />
        <div className="-mt-16 rounded-[1.75rem] border border-line bg-surface p-5 sm:p-6">
          <div className="flex items-end gap-4">
            <div className="-mt-16 size-20 animate-pulse rounded-full bg-surface-muted sm:size-24" />
            <div className="space-y-3 pb-1">
              <div className="h-8 w-64 max-w-full animate-pulse rounded-lg bg-surface-muted" />
              <div className="h-4 w-44 animate-pulse rounded-md bg-surface-muted" />
            </div>
          </div>
          <div className="mt-6 h-16 animate-pulse rounded-xl bg-surface-muted" />
        </div>
        <div className="h-12 animate-pulse rounded-full bg-surface-muted/80" />
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_21rem]">
          <div className="space-y-4">
            <div className="h-8 w-1/2 animate-pulse rounded-lg bg-surface-muted" />
            <div className="h-56 animate-pulse rounded-2xl bg-surface-muted" />
          </div>
          <div className="h-80 animate-pulse rounded-[1.6rem] bg-surface-muted" />
        </div>
      </Container>
    </div>
  );
}

async function ProfileContent({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { username } = await params;
  const sp = await searchParams;
  const tab = parseProfileTab(sp.aba);

  await io();

  const provider = await getProvider(username);
  const profile = await getProviderProfile(username);
  if (!provider || !profile) notFound();

  const details = await getProviderProfileDetails(username);
  const category = getCategory(provider.category);
  const user = await getCurrentUser();
  const loggedIn = Boolean(user);
  const isOwner = Boolean(user && (user.username === username || user.role === "admin"));
  const showClientActions = !user || user.role === "cliente";
  const canEditProfile = Boolean(
    user && user.role === "prestador" && user.username === username,
  );
  const ownerHref = user?.role === "admin" ? "/admin" : "/painel/perfil";
  const ownerLabel = user?.role === "admin" ? "Abrir painel" : "Editar perfil";
  const providerUserId = await getProviderUserId(username);
  const favorited =
    user?.role === "cliente" && providerUserId
      ? await isFavorite(user.id, providerUserId)
      : false;
  const stats =
    isOwner && providerUserId ? await getProviderStats(providerUserId) : null;
  const responseTime = hasAvailabilityDetail(profile.availability.responseTime)
    ? profile.availability.responseTime
    : null;

  const tabCounts: Partial<Record<ProfileTabId, number>> = {
    portfolio: profile.portfolio.length,
    servicos: profile.services.length,
    avaliacoes: provider.reviews,
  };

  const reviewableContracts: Contract[] = [];
  if (user?.role === "cliente") {
    const contracts = await listContractsForClient(user.id);
    for (const contract of contracts) {
      if (
        contract.providerUsername === username &&
        contract.status === "concluido" &&
        (await canReviewContract(contract.id, user.id)).ok
      ) {
        reviewableContracts.push(contract);
      }
    }
  }

  return (
    <>
      <ProfileViewTracker username={username} />
      <ProviderHero
        provider={provider}
        favorited={favorited}
        loggedIn={loggedIn}
        cover={details?.cover ?? null}
        avatar={details?.avatar ?? null}
        isOwner={isOwner}
        showClientActions={showClientActions}
        availability={profile.availability}
      />

      {stats ? (
        <OwnerMetrics
          views={stats.views}
          favorites={stats.favorites}
          reviews={stats.reviews}
          rating={stats.rating}
          contractsConcluded={stats.contractsConcluded}
          positivePercent={stats.positivePercent}
          ownerHref={ownerHref}
          ownerLabel={ownerLabel}
        />
      ) : null}

      <ProfileTabs username={username} active={tab} counts={tabCounts} />

      <section className="bg-canvas pb-16 pt-8 sm:pt-10">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_22rem]">
            <div
              id="conteudo-perfil"
              className="min-w-0 scroll-mt-32 space-y-12 sm:space-y-14"
            >
              {tab === "sobre" ? (
                <>
                  <ProviderAbout
                    provider={provider}
                    about={profile.about}
                    availability={profile.availability}
                  />
                  <ProviderAvailability availability={profile.availability} />
                </>
              ) : null}

              {tab === "portfolio" ? (
                <ProviderPortfolio
                  items={profile.portfolio}
                  categoryId={category.id}
                  isOwner={canEditProfile}
                />
              ) : null}

              {tab === "servicos" ? <ProviderServices services={profile.services} /> : null}

              {tab === "avaliacoes" ? (
                <>
                  <ProviderReviews
                    provider={provider}
                    reviews={profile.reviews}
                    loggedIn={loggedIn}
                  />
                  {user?.role === "cliente" ? (
                    <ReviewForm contracts={reviewableContracts} />
                  ) : null}
                </>
              ) : null}

              {tab === "orcamento" ? (
                <div className="space-y-6">
                  {isOwner ? (
                    <Card className="rounded-[1.5rem] border-brand/15 bg-brand-soft/60 p-6">
                      <p className="text-base font-semibold text-ink">
                        Seu perfil está em modo de visualização
                      </p>
                      <p className="mt-1.5 max-w-[60ch] text-sm leading-relaxed text-ink-soft">
                        Para responder solicitações e acompanhar contratos, acesse sua área
                        de trabalho.
                      </p>
                      <ButtonLink href={ownerHref} variant="primary" className="mt-4">
                        <Pencil className="size-4" aria-hidden="true" />
                        {ownerLabel}
                      </ButtonLink>
                    </Card>
                  ) : !showClientActions ? (
                    <Card className="rounded-[1.5rem] border-line bg-surface p-6">
                      <p className="text-base font-semibold text-ink">
                        Orçamentos são enviados por contas de cliente
                      </p>
                      <p className="mt-1.5 max-w-[60ch] text-sm leading-relaxed text-ink-soft">
                        Sua conta profissional pode consultar este perfil, mas não pode iniciar
                        uma contratação.
                      </p>
                      <ButtonLink href="/painel" variant="secondary" className="mt-4">
                        Voltar ao painel profissional
                      </ButtonLink>
                    </Card>
                  ) : (
                    <>
                      <div className="rounded-[1.5rem] border border-brand/10 bg-brand-soft/70 p-5 sm:p-6">
                        <p className="text-sm font-semibold text-brand">Orçamento</p>
                        <h2 className="mt-1 text-2xl font-extrabold tracking-[-0.035em] text-ink">
                          Conte como é o seu evento
                        </h2>
                        <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-ink-soft">
                          O pedido vai direto para {provider.name}.{" "}
                          {responseTime
                            ? `Tempo de resposta informado: ${responseTime}.`
                            : "A resposta chega pela área de mensagens."}
                        </p>
                      </div>
                      <QuoteForm
                        providerUsername={username}
                        services={profile.services}
                        loggedIn={loggedIn}
                      />
                    </>
                  )}
                </div>
              ) : null}
            </div>

            <aside className="mx-auto w-full max-w-lg lg:sticky lg:top-[7.5rem] lg:mx-0 lg:max-w-none lg:self-start">
              <ProviderContractCard
                provider={provider}
                profile={profile}
                favorited={favorited}
                loggedIn={loggedIn}
                isOwner={isOwner}
                showClientActions={showClientActions}
                ownerHref={ownerHref}
                ownerLabel={ownerLabel}
              />
            </aside>
          </div>

          <ProviderMobileActions
            provider={provider}
            favorited={favorited}
            loggedIn={loggedIn}
            isOwner={isOwner}
            showClientActions={showClientActions}
            activeTab={tab}
          />
        </Container>
      </section>
    </>
  );
}

export default function PrestadorPage({
  params,
  searchParams,
}: PageProps<"/prestador/[username]">) {
  return (
    <div id="top" className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<ProfileSkeleton />}>
          <ProfileContent params={params} searchParams={searchParams} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

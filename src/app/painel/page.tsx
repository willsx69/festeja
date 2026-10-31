import Link from "next/link";
import {
  ArrowUpRight,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  FileCheck2,
  Heart,
  Images,
  Inbox,
  MessageCircle,
  PackageOpen,
  Pencil,
  Star,
  UserRound,
  UsersRound,
} from "lucide-react";
import { PainelEmptyState } from "@/components/painel/painel-empty-state";
import { PainelPageHeader } from "@/components/painel/painel-page-header";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { requireUser } from "@/lib/auth";
import {
  getProviderProfileDetails,
  getProviderStats,
  getProviderUserId,
  listNotifications,
  listPortfolio,
  listQuotesForProvider,
  listServices,
} from "@/lib/db";
import { formatCount, formatRating, formatShortDate } from "@/lib/format";
import { calculateProfileCompletion } from "@/lib/provider-dashboard";
import type { AppNotification, NotificationType, QuoteRequest } from "@/types";

const quoteStatus: Record<
  QuoteRequest["status"],
  { label: string; tone: "brand" | "pink" | "yellow" }
> = {
  aberto: { label: "Aguardando resposta", tone: "yellow" },
  aceito: { label: "Aceito", tone: "brand" },
  recusado: { label: "Recusado", tone: "pink" },
};

const activityMeta: Record<
  NotificationType,
  { icon: typeof Bell; className: string }
> = {
  mensagem: { icon: MessageCircle, className: "bg-brand-soft text-brand" },
  orcamento: { icon: Inbox, className: "bg-yellow-soft text-ink" },
  contrato: { icon: FileCheck2, className: "bg-brand-soft text-brand" },
  avaliacao: { icon: Star, className: "bg-pink-soft text-pink-strong" },
  sistema: { icon: Bell, className: "bg-surface-muted text-ink-soft" },
};

export default async function PainelHomePage() {
  const user = await requireUser(["prestador"]);
  const username = user.username;
  const providerUserId = username ? await getProviderUserId(username) : undefined;
  const details = username ? await getProviderProfileDetails(username) : undefined;

  if (!username || !providerUserId || !details) return null;

  const stats = await getProviderStats(providerUserId);
  const quotes = await listQuotesForProvider(providerUserId);
  const services = await listServices(username);
  const portfolio = await listPortfolio(providerUserId);
  const activity = (await listNotifications(user.id)).slice(0, 5);
  const recentQuotes = [...quotes].reverse().slice(0, 3);
  const openQuotes = quotes.filter((quote) => quote.status === "aberto").length;
  const completion = calculateProfileCompletion({
    details,
    servicesCount: services.length,
    portfolioCount: portfolio.length,
  });
  const nextCompletion = completion.missing[0];

  const metrics = [
    {
      icon: UserRound,
      label: "Visitas ao perfil",
      value: formatCount(stats.views),
      detail: "visualizações únicas",
    },
    {
      icon: Heart,
      label: "Favoritos",
      value: formatCount(stats.favorites),
      detail: "pessoas salvaram seu perfil",
    },
    {
      icon: Star,
      label: "Avaliações",
      value: stats.reviews > 0 ? formatRating(stats.rating) : "Sem avaliações",
      detail:
        stats.reviews > 0
          ? `${formatCount(stats.reviews)} ${stats.reviews === 1 ? "avaliação publicada" : "avaliações publicadas"}`
          : "aguardando a primeira avaliação",
    },
    {
      icon: CheckCircle2,
      label: "Contratos concluídos",
      value: formatCount(stats.contractsConcluded),
      detail: "eventos finalizados",
    },
  ];

  const quickActions = [
    { href: "/painel/perfil", label: "Editar meu perfil", icon: Pencil },
    { href: "/painel/servicos", label: "Gerenciar serviços", icon: PackageOpen },
    { href: "/painel/portfolio", label: "Adicionar fotos", icon: Images },
    { href: "/painel/orcamentos", label: "Ver orçamentos", icon: Inbox },
    { href: "/painel/contratos", label: "Gerenciar contratos", icon: FileCheck2 },
    {
      href: `/prestador/${username}`,
      label: "Ver perfil público",
      icon: ArrowUpRight,
    },
  ];

  return (
    <div className="space-y-8">
      <PainelPageHeader
        title="Visão geral"
        description="Acompanhe o que precisa de resposta e mantenha sua vitrine profissional pronta para novos eventos."
        action={
          openQuotes > 0 ? (
            <ButtonLink href="/painel/orcamentos" variant="accent" size="sm">
              <Inbox className="size-4" aria-hidden="true" />
              {openQuotes} {openQuotes === 1 ? "orçamento aberto" : "orçamentos abertos"}
            </ButtonLink>
          ) : null
        }
      />

      <section aria-label="Métricas do perfil">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            const compactValue = metric.value === "Sem avaliações";
            return (
              <Card
                key={metric.label}
                padded={false}
                className="overflow-hidden shadow-none transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-card"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid size-10 place-items-center rounded-xl bg-brand-soft text-brand">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="size-2 rounded-full bg-yellow" aria-hidden="true" />
                  </div>
                  <p
                    className={
                      compactValue
                        ? "mt-5 text-lg font-extrabold tracking-[-0.025em] text-ink"
                        : "mt-5 text-[2rem] font-extrabold leading-none tracking-[-0.055em] tabular-nums text-ink"
                    }
                  >
                    {metric.value}
                  </p>
                  <p className="mt-2 text-sm font-bold text-ink">{metric.label}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-ink-faint">
                    {metric.detail}
                  </p>
                </CardContent>
                <div className="h-1 w-full bg-brand" aria-hidden="true" />
              </Card>
            );
          })}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
        <section aria-labelledby="recent-quotes-title" className="lg:col-span-7">
          <Card padded={false} className="overflow-hidden shadow-none">
            <CardHeader className="flex-row items-start justify-between gap-4 p-5 sm:p-6">
              <div>
                <CardTitle id="recent-quotes-title" className="text-lg font-extrabold uppercase tracking-[-0.02em]">
                  Orçamentos recentes
                </CardTitle>
                <CardDescription className="mt-1 leading-relaxed">
                  Solicitações recebidas diretamente pelo seu perfil.
                </CardDescription>
              </div>
              <Link
                href="/painel/orcamentos"
                className="shrink-0 text-sm font-semibold text-brand underline-offset-4 hover:underline"
              >
                Ver todos
              </Link>
            </CardHeader>
            <Separator />
            <CardContent>
              {recentQuotes.length > 0 ? (
                <ul className="divide-y divide-line">
                  {recentQuotes.map((quote) => {
                    const status = quoteStatus[quote.status];
                    return (
                      <li key={quote.id} className="p-5 sm:p-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-bold text-ink">{quote.clientName}</p>
                              <Badge tone={status.tone}>{status.label}</Badge>
                            </div>
                            <p className="mt-1 text-sm text-ink-soft">
                              {quote.serviceName ?? "Serviço a combinar"}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-faint">
                              <span className="inline-flex items-center gap-1.5">
                                <CalendarDays className="size-3.5 text-brand" aria-hidden="true" />
                                {formatShortDate(quote.eventDate)}
                              </span>
                              {quote.guests ? (
                                <span className="inline-flex items-center gap-1.5">
                                  <UsersRound className="size-3.5 text-brand" aria-hidden="true" />
                                  {formatCount(quote.guests)} convidados
                                </span>
                              ) : null}
                            </div>
                          </div>
                          <ButtonLink href="/painel/orcamentos" variant="secondary" size="sm">
                            Ver solicitação
                          </ButtonLink>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <PainelEmptyState
                  icon={Inbox}
                  title="Você ainda não recebeu solicitações de orçamento."
                  description="Quando um cliente enviar uma solicitação pelo seu perfil, ela aparecerá aqui."
                  className="m-5 sm:m-6"
                />
              )}
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="profile-progress-title" className="lg:col-span-5">
          <Card padded={false} className="overflow-hidden border-brand/15 shadow-none">
            <div className="h-1.5 bg-brand" aria-hidden="true" />
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 id="profile-progress-title" className="text-lg font-extrabold uppercase tracking-[-0.02em] text-ink">
                    Complete seu perfil
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                    {completion.completed} de {completion.total} itens concluídos.
                  </p>
                </div>
                <span className="text-3xl font-extrabold tracking-[-0.06em] tabular-nums text-brand">
                  {completion.percentage}%
                </span>
              </div>

              <Progress
                value={completion.percentage}
                aria-label={`${completion.percentage}% do perfil concluído`}
                className="mt-5"
              />

              {completion.missing.length > 0 ? (
                <ul className="mt-5 space-y-3">
                  {completion.missing.slice(0, 3).map((item) => (
                    <li key={item.id} className="flex items-start gap-2.5 text-sm text-ink-soft">
                      <span className="mt-1 size-2 shrink-0 rounded-full border-2 border-pink" aria-hidden="true" />
                      {item.label}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-brand">
                  <Check className="size-4" aria-hidden="true" />
                  Seu perfil está completo.
                </p>
              )}

              <ButtonLink
                href={nextCompletion?.href ?? "/painel/perfil"}
                variant="primary"
                className="mt-6 w-full"
              >
                {nextCompletion ? "Completar perfil" : "Revisar perfil"}
              </ButtonLink>
            </CardContent>
          </Card>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
        <section aria-labelledby="quick-access-title" className="lg:col-span-5">
          <Card padded={false} className="overflow-hidden shadow-none">
            <CardHeader className="p-5 sm:p-6">
              <CardTitle id="quick-access-title" className="text-lg font-extrabold uppercase tracking-[-0.02em]">
                Acesso rápido
              </CardTitle>
              <CardDescription className="leading-relaxed">
                Atalhos para as tarefas mais frequentes.
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="grid gap-2 p-3 sm:grid-cols-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex min-h-20 items-center gap-3 rounded-xl border border-transparent px-3.5 py-3 text-sm font-bold text-ink transition-colors hover:border-brand/15 hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-ring/70"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    {action.label}
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="recent-activity-title" className="lg:col-span-7">
          <Card padded={false} className="overflow-hidden shadow-none">
            <CardHeader className="flex-row items-start justify-between gap-4 p-5 sm:p-6">
              <div>
                <CardTitle id="recent-activity-title" className="text-lg font-extrabold uppercase tracking-[-0.02em]">
                  Atividade recente
                </CardTitle>
                <CardDescription className="mt-1 leading-relaxed">
                  Atualizações reais da sua conta profissional.
                </CardDescription>
              </div>
              <Link
                href="/notificacoes"
                className="shrink-0 text-sm font-semibold text-brand underline-offset-4 hover:underline"
              >
                Notificações
              </Link>
            </CardHeader>
            <Separator />
            <CardContent className="p-5 sm:p-6">
              {activity.length > 0 ? (
                <ActivityList items={activity} />
              ) : (
                <PainelEmptyState
                  icon={Bell}
                  title="Nenhuma atividade recente"
                  description="Novos orçamentos, mensagens, contratos e avaliações aparecerão aqui."
                />
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

function ActivityList({ items }: { items: AppNotification[] }) {
  return (
    <ol className="relative space-y-5 before:absolute before:bottom-3 before:left-[1.15rem] before:top-3 before:w-px before:bg-line">
      {items.map((item) => {
        const meta = activityMeta[item.type];
        const Icon = meta.icon;
        const content = (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-bold text-ink">{item.title}</p>
              {!item.read ? <span className="size-2 rounded-full bg-pink" aria-label="Não lida" /> : null}
            </div>
            <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink-soft">
              {item.body}
            </p>
            <p className="mt-1 text-xs text-ink-faint">
              {formatNotificationDate(item.createdAt)}
            </p>
          </>
        );

        return (
          <li key={item.id} className="relative flex gap-3.5">
            <span className={`relative z-10 grid size-9 shrink-0 place-items-center rounded-full ${meta.className}`}>
              <Icon className="size-4" aria-hidden="true" />
            </span>
            {item.href?.startsWith("/") ? (
              <Link
                href={item.href}
                className="min-w-0 flex-1 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-ring/70"
              >
                {content}
              </Link>
            ) : (
              <div className="min-w-0 flex-1">{content}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function formatNotificationDate(value: string): string {
  const date = value.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? formatShortDate(date) : value;
}

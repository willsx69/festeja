import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck,
  Building2,
  Eye,
  EyeOff,
  Flag,
  MessageSquare,
  Star,
  TrendingUp,
  Users,
  UsersRound,
  Star as StarIcon,
} from "lucide-react";
import {
  moderateReviewAction,
  updateReportStatusAction,
} from "@/actions/reviews";
import {
  toggleProviderFeaturedAction,
  toggleProviderVerifiedAction,
} from "@/actions/admin";
import { AdminNotifyForm } from "@/components/admin/admin-notify-form";
import { AdminTabs } from "@/components/admin/admin-tabs";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ProviderAvatar } from "@/components/provider/provider-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Separator } from "@/components/ui/separator";
import { parseAdminTab, type AdminTab } from "@/lib/admin-navigation";
import {
  getAdminStats,
  listAllUsers,
  listCategoriesForAdmin,
  listProvidersForAdmin,
  listReports,
} from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { formatCount, formatShortDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { getCategory } from "@/data/categories";
import { resolveProviderAvatar } from "@/data/providers";
import type { CategoryId } from "@/types";

export const metadata: Metadata = {
  title: "Painel administrativo — Festeja",
  description: "Gestão de usuários, prestadores, categorias e moderação.",
};

export const instant = false;

const roleLabels: Record<string, string> = {
  cliente: "Cliente",
  prestador: "Prestador",
  admin: "Admin",
};

function StatCard({
  icon: Icon,
  label,
  value,
  tone = "brand",
}: {
  icon: typeof Users;
  label: string;
  value: string | number;
  tone?: "brand" | "pink" | "yellow";
}) {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "inline-flex size-11 shrink-0 items-center justify-center rounded-xl",
            tone === "brand" && "bg-brand-soft text-brand",
            tone === "pink" && "bg-pink-soft text-pink-strong",
            tone === "yellow" && "bg-yellow-soft text-ink",
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-2xl font-semibold tabular-nums text-ink">{value}</p>
          <p className="text-sm text-ink-faint">{label}</p>
        </div>
      </div>
    </Card>
  );
}

async function VisaoGeral({ tab }: { tab: AdminTab }) {
  const stats = await getAdminStats();
  const users = await listAllUsers();
  const providers = await listProvidersForAdmin();
  const categories = await listCategoriesForAdmin();

  const recentUsers = users.slice(0, 6);
  const verifiedCount = providers.filter((p) => p.verified).length;
  const featuredCount = providers.filter((p) => p.featured).length;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total de usuários" value={formatCount(stats.totalUsers)} />
        <StatCard icon={UsersRound} label="Clientes" value={formatCount(stats.totalClients)} tone="pink" />
        <StatCard icon={Building2} label="Prestadores" value={formatCount(stats.totalProviders)} tone="yellow" />
        <StatCard icon={TrendingUp} label="Contratos" value={formatCount(stats.totalContracts)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Star} label="Avaliações visíveis" value={formatCount(stats.totalReviews)} />
        <StatCard icon={MessageSquare} label="Orçamentos abertos" value={formatCount(stats.pendingQuotes)} tone="pink" />
        <StatCard icon={Flag} label="Denúncias" value={formatCount(stats.openReports)} tone="yellow" />
        <StatCard icon={MessageSquare} label="Mensagens" value={formatCount(stats.totalMessages)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink">
            Últimos usuários
          </h2>
          <ul className="mt-4 space-y-3">
            {recentUsers.map((user) => (
              <li key={user.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{user.name}</p>
                  <p className="truncate text-xs text-ink-faint">{user.email}</p>
                </div>
                <Badge tone={user.role === "admin" ? "pink" : user.role === "prestador" ? "brand" : "neutral"}>
                  {roleLabels[user.role] ?? user.role}
                </Badge>
              </li>
            ))}
          </ul>
          <Link
            href={tab ? `/admin?aba=usuarios` : "#"}
            className="mt-4 inline-flex text-sm font-medium text-brand hover:text-brand-strong"
          >
            Ver todos os usuários →
          </Link>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink">
            Resumo dos prestadores
          </h2>
          <ul className="mt-4 space-y-3">
            <li className="flex items-center justify-between text-sm">
              <span className="text-ink-soft">Verificados</span>
              <span className="font-semibold text-ink">{verifiedCount}</span>
            </li>
            <li className="flex items-center justify-between text-sm">
              <span className="text-ink-soft">Em destaque</span>
              <span className="font-semibold text-ink">{featuredCount}</span>
            </li>
            <li className="flex items-center justify-between text-sm">
              <span className="text-ink-soft">Categorias ativas</span>
              <span className="font-semibold text-ink">{categories.length}</span>
            </li>
          </ul>
          <Link
            href="/admin?aba=prestadores"
            className="mt-4 inline-flex text-sm font-medium text-brand hover:text-brand-strong"
          >
            Gerenciar prestadores →
          </Link>
        </Card>
      </div>
    </div>
  );
}

async function Usuarios() {
  const users = await listAllUsers();

  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink">
        Todos os usuários ({users.length})
      </h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-surface-muted">
              <th className="px-4 py-3 font-medium text-ink">Nome</th>
              <th className="px-4 py-3 font-medium text-ink">E-mail</th>
              <th className="px-4 py-3 font-medium text-ink">Papel</th>
              <th className="px-4 py-3 font-medium text-ink">Username</th>
              <th className="px-4 py-3 font-medium text-ink">Criado em</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-medium text-ink">{user.name}</td>
                <td className="px-4 py-3 text-ink-soft">{user.email}</td>
                <td className="px-4 py-3">
                  <Badge tone={user.role === "admin" ? "pink" : user.role === "prestador" ? "brand" : "neutral"}>
                    {roleLabels[user.role] ?? user.role}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-ink-faint">{user.username ?? "—"}</td>
                <td className="px-4 py-3 text-ink-faint">{formatShortDate(user.createdAt.slice(0, 10))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

async function Prestadores() {
  const providers = await listProvidersForAdmin();

  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink">
        Prestadores ({providers.length})
      </h2>
      <ul className="mt-4 space-y-4">
        {providers.map((provider) => {
          const category = getCategory(provider.category as CategoryId);
          const portrait = resolveProviderAvatar(provider.username, provider.avatar);
          return (
            <li key={provider.userId}>
              <Card className="overflow-hidden">
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
                  <div className="flex min-w-0 items-start gap-3.5 sm:gap-4">
                    <ProviderAvatar
                      name={provider.name}
                      image={portrait.avatar}
                      imageAlt={
                        portrait.portraitIllustrative
                          ? `Retrato ilustrativo de ${provider.name}`
                          : undefined
                      }
                      title={
                        portrait.portraitIllustrative
                          ? "Retrato ilustrativo do perfil demonstrativo"
                          : undefined
                      }
                      className="size-12 border border-brand/15 sm:size-14"
                      fallbackClassName="bg-brand-soft text-brand-strong"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/prestador/${provider.username}`}
                          className="text-base font-semibold text-ink hover:text-brand"
                        >
                          {provider.name}
                        </Link>
                        {provider.verified ? (
                          <Badge tone="brand" className="py-0.5">
                            <BadgeCheck className="size-3.5" aria-hidden="true" />
                            Verificado
                          </Badge>
                        ) : null}
                        {provider.featured ? (
                          <Badge tone="yellow" className="py-0.5">
                            <StarIcon className="size-3.5" aria-hidden="true" />
                            Destaque
                          </Badge>
                        ) : null}
                        {portrait.portraitIllustrative ? (
                          <Badge tone="neutral" className="py-0.5 font-medium">
                            Imagem ilustrativa
                          </Badge>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm text-ink-soft">
                        {category.name} · {provider.city}, {provider.state}
                      </p>
                      <Link
                        href={`/prestador/${provider.username}`}
                        className="mt-1 block w-fit max-w-full truncate text-xs font-medium text-brand hover:text-brand-strong"
                      >
                        /prestador/{provider.username}
                      </Link>
                      <p className="mt-1 truncate text-xs text-ink-faint">{provider.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:pl-[4.5rem] lg:justify-end lg:pl-0">
                    <form action={toggleProviderVerifiedAction}>
                      <input type="hidden" name="id" value={provider.userId} />
                      <input type="hidden" name="valor" value={provider.verified ? "0" : "1"} />
                      <Button type="submit" variant={provider.verified ? "secondary" : "primary"} size="sm">
                        {provider.verified ? (
                          <>
                            <EyeOff className="size-4" aria-hidden="true" />
                            Remover verificação
                          </>
                        ) : (
                          <>
                            <BadgeCheck className="size-4" aria-hidden="true" />
                            Verificar
                          </>
                        )}
                      </Button>
                    </form>
                    <form action={toggleProviderFeaturedAction}>
                      <input type="hidden" name="id" value={provider.userId} />
                      <input type="hidden" name="valor" value={provider.featured ? "0" : "1"} />
                      <Button type="submit" variant={provider.featured ? "secondary" : "primary"} size="sm">
                        {provider.featured ? "Remover destaque" : "Destacar"}
                      </Button>
                    </form>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <span className="inline-flex items-center gap-1.5 text-sm text-ink-faint">
                    <Eye className="size-4" aria-hidden="true" />
                    {formatCount(provider.views)} visualizações
                  </span>
                  <div className="min-w-0 lg:flex-1 lg:[&>div]:flex lg:[&>div]:justify-end">
                    <AdminNotifyForm username={provider.username} />
                  </div>
                </div>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

async function Categorias() {
  const categories = await listCategoriesForAdmin();
  const sorted = [...categories].sort((a, b) => b.count - a.count);
  const max = sorted[0]?.count ?? 1;

  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink">
        Categorias ({categories.length})
      </h2>
      {categories.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-12 text-center text-sm text-ink-soft">
          Nenhuma categoria com prestadores ainda.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {sorted.map((cat) => {
            const info = getCategory(cat.id as CategoryId);
            const pct = Math.round((cat.count / max) * 100);
            return (
              <li key={cat.id}>
                <Card>
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink">{info.name}</p>
                      <p className="text-xs text-ink-faint">
                        {cat.count} {cat.count === 1 ? "prestador" : "prestadores"}
                      </p>
                    </div>
                    <Link
                      href={`/buscar?categoria=${cat.id}`}
                      className="text-sm font-medium text-brand hover:text-brand-strong"
                    >
                      Ver →
                    </Link>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-surface-muted">
                    <div
                      className="h-2 rounded-full bg-brand"
                      style={{ width: `${pct}%` }}
                      role="progressbar"
                      aria-valuenow={cat.count}
                      aria-valuemin={0}
                      aria-valuemax={max}
                    />
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

const reportStatusMeta = {
  aberta: { label: "Aberta", tone: "yellow" as const },
  em_analise: { label: "Em análise", tone: "brand" as const },
  resolvida: { label: "Resolvida", tone: "neutral" as const },
};

const moderationActionLabels: Record<string, string> = {
  aberta: "Denúncia reaberta",
  em_analise: "Análise iniciada",
  resolvida: "Denúncia resolvida",
  avaliacao_ocultada: "Avaliação ocultada",
  avaliacao_visivel: "Avaliação tornada visível",
};

async function Moderacao() {
  const reports = await listReports();
  const openReports = reports.filter((report) => report.status !== "resolvida").length;

  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink">
        Moderação de avaliações ({openReports} em aberto)
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-ink-soft">
        Ocultar uma avaliação remove o conteúdo do perfil e das notas. Resolver a denúncia
        registra a decisão no histórico, mas não altera a visibilidade automaticamente.
      </p>
      {reports.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-12 text-center text-sm text-ink-soft">
          Nenhuma denúncia no momento.
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          {reports.map((report) => {
            const status = reportStatusMeta[report.status];
            return (
              <li key={report.id}>
                <Card>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-ink-faint">
                        Motivo: <span className="font-medium text-ink">{report.reason}</span>
                      </p>
                      <p className="mt-0.5 text-xs text-ink-faint">
                        Denúncia de {formatShortDate(report.createdAt.slice(0, 10))}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={status.tone}>{status.label}</Badge>
                      {report.review.hidden ? (
                        <Badge tone="pink">Avaliação ocultada</Badge>
                      ) : (
                        <Badge tone="neutral">Avaliação visível</Badge>
                      )}
                      <Link
                        href={`/prestador/${report.review.providerUsername}?aba=avaliacoes`}
                        className="text-sm font-medium text-brand hover:text-brand-strong"
                      >
                        Ver no perfil
                      </Link>
                    </div>
                  </div>
                  <blockquote className="mt-4 rounded-xl bg-surface-muted p-4">
                    <p className="text-sm text-ink-soft">“{report.review.comment}”</p>
                    <footer className="mt-2 text-xs text-ink-faint">
                      {report.review.author} · {report.review.event} · {report.review.providerName}
                    </footer>
                  </blockquote>

                  {report.status === "resolvida" ? (
                    <div className="mt-4 rounded-xl border border-line bg-surface-muted/60 p-4">
                      <p className="text-sm font-medium text-ink">Resolução</p>
                      <p className="mt-1 text-sm text-ink-soft">
                        {report.resolutionNote ?? "Sem observação registrada."}
                      </p>
                      <p className="mt-2 text-xs text-ink-faint">
                        {report.resolvedAt
                          ? formatShortDate(report.resolvedAt.slice(0, 10))
                          : "Data não registrada"}
                        {report.resolvedByName ? ` · ${report.resolvedByName}` : ""}
                      </p>
                      <form action={updateReportStatusAction} className="mt-3">
                        <input type="hidden" name="id" value={report.id} />
                        <Button type="submit" name="acao" value="reabrir" variant="secondary" size="sm">
                          Reabrir denúncia
                        </Button>
                      </form>
                    </div>
                  ) : (
                    <div className="mt-4 space-y-3 border-t border-line pt-4">
                      <form
                        action={moderateReviewAction}
                        className="flex flex-col gap-2 sm:flex-row sm:items-end"
                      >
                        <input type="hidden" name="id" value={report.review.id} />
                        <input type="hidden" name="denuncia" value={report.id} />
                        <label className="flex-1 text-xs font-medium text-ink-soft">
                          Observação da moderação (opcional)
                          <input
                            name="nota"
                            maxLength={300}
                            className="mt-1 h-10 w-full rounded-xl border border-line-strong bg-surface px-3 text-sm text-ink focus:border-brand"
                          />
                        </label>
                        {report.review.hidden ? (
                          <Button type="submit" name="acao" value="mostrar" variant="secondary">
                            <Eye className="size-4" aria-hidden="true" />
                            Tornar visível
                          </Button>
                        ) : (
                          <Button type="submit" name="acao" value="ocultar">
                            <EyeOff className="size-4" aria-hidden="true" />
                            Ocultar avaliação
                          </Button>
                        )}
                      </form>

                      {report.status === "aberta" ? (
                        <form action={updateReportStatusAction}>
                          <input type="hidden" name="id" value={report.id} />
                          <Button type="submit" name="acao" value="em_analise" variant="secondary" size="sm">
                            Iniciar análise
                          </Button>
                        </form>
                      ) : null}

                      <form
                        action={updateReportStatusAction}
                        className="flex flex-col gap-2 sm:flex-row sm:items-end"
                      >
                        <input type="hidden" name="id" value={report.id} />
                        <label className="flex-1 text-xs font-medium text-ink-soft">
                          Resolução da denúncia
                          <input
                            name="nota"
                            required
                            minLength={5}
                            maxLength={300}
                            placeholder="Descreva a decisão tomada"
                            className="mt-1 h-10 w-full rounded-xl border border-line-strong bg-surface px-3 text-sm text-ink focus:border-brand"
                          />
                        </label>
                        <Button type="submit" name="acao" value="resolver">
                          Resolver denúncia
                        </Button>
                      </form>
                    </div>
                  )}

                  {report.history.length > 0 ? (
                    <details className="mt-4 border-t border-line pt-4">
                      <summary className="cursor-pointer text-sm font-medium text-ink-soft">
                        Histórico ({report.history.length})
                      </summary>
                      <ul className="mt-3 space-y-2">
                        {report.history.map((action) => (
                          <li key={action.id} className="text-xs text-ink-faint">
                            <span className="font-medium text-ink-soft">
                              {moderationActionLabels[action.action] ?? action.action}
                            </span>
                            {" · "}
                            {formatShortDate(action.createdAt.slice(0, 10))} · {action.adminName}
                            {action.note ? ` · ${action.note}` : ""}
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : null}
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

async function AdminContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireUser(["admin"]);
  const sp = await searchParams;
  const tab = parseAdminTab(sp.aba);

  return (
    <Container className="py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold uppercase tracking-[0.04em] text-ink sm:text-3xl">
            Painel administrativo
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-ink-soft">
            Gestão de usuários, prestadores, categorias e moderação de conteúdo.
          </p>
        </div>
      </div>

      <AdminTabs active={tab} />

      <div className="mt-8">
        {tab === "visao" ? <VisaoGeral tab={tab} /> : null}
        {tab === "usuarios" ? <Usuarios /> : null}
        {tab === "prestadores" ? <Prestadores /> : null}
        {tab === "categorias" ? <Categorias /> : null}
        {tab === "moderacao" ? <Moderacao /> : null}
      </div>
    </Container>
  );
}

export default function AdminPage({
  searchParams,
}: PageProps<"/admin">) {
  return (
    <div id="top" className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1 bg-canvas">
        <Suspense
          fallback={
            <Container className="py-10">
              <div className="h-9 w-80 animate-pulse rounded-lg bg-surface-muted" />
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-24 animate-pulse rounded-2xl bg-surface-muted" />
                ))}
              </div>
            </Container>
          }
        >
          <AdminContent searchParams={searchParams} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

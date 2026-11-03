import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  Heart,
  MessageCircle,
  Search,
  Star,
} from "lucide-react";
import { NeighborhoodCombobox } from "@/components/search/neighborhood-combobox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { requireUser } from "@/lib/auth";
import {
  listContractsForClient,
  listConversationsForUser,
  listFavorites,
  listQuotesForClient,
  listReviewableContractsForClient,
} from "@/lib/db";
import { formatBRL, formatShortDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Área do cliente",
  description: "Organize os preparativos da sua festa na Festeja.",
};

const quoteLabels = {
  aberto: "Aguardando resposta",
  aceito: "Aceito",
  recusado: "Recusado",
};

const contractLabels = {
  pendente: "Confirmado",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

export default async function ClientePage() {
  const user = await requireUser(["cliente"], "/cliente");
  const [quotesData, contractsData, favorites, conversations] = await Promise.all([
    listQuotesForClient(user.id),
    listContractsForClient(user.id),
    listFavorites(user.id),
    listConversationsForUser(user.id),
  ]);
  const quotes = [...quotesData].reverse();
  const contracts = [...contractsData].reverse();
  const reviewable = await listReviewableContractsForClient(user.id, contractsData);
  const unreadMessages = conversations.reduce((total, item) => total + item.unreadCount, 0);
  const firstName = user.name.trim().split(/\s+/)[0] || user.name;
  const recentQuote = quotes[0];
  const recentContract = contracts[0];

  return (
    <Container className="py-8 sm:py-10">
      <header>
        <h1 className="text-3xl font-extrabold tracking-[-0.045em] text-ink sm:text-4xl">
          Olá, {firstName}. Vamos preparar sua festa?
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-base">
          Encontre profissionais e acompanhe cada combinação em um só lugar.
        </p>
      </header>

      <section
        aria-labelledby="client-search-title"
        className="relative mt-7 overflow-hidden rounded-[1.75rem] bg-brand px-5 py-7 text-white shadow-[0_24px_60px_-32px_rgb(109_61_245_/_0.8)] sm:px-8 sm:py-9"
      >
        <div className="absolute -right-12 -top-16 size-44 rounded-full bg-pink/30" aria-hidden="true" />
        <div className="absolute -bottom-14 right-20 size-28 rounded-full bg-yellow/35" aria-hidden="true" />
        <div className="relative max-w-3xl">
          <h2 id="client-search-title" className="text-2xl font-extrabold tracking-[-0.035em] sm:text-3xl">
            O que você precisa para sua festa?
          </h2>
          <form action="/buscar" method="get" className="mt-5 grid gap-2 rounded-2xl bg-white p-2 sm:grid-cols-[minmax(0,1fr)_minmax(13rem,0.65fr)_auto]">
            <label className="sr-only" htmlFor="client-search-q">Serviço ou profissional</label>
            <div className="flex min-w-0 items-center gap-2 rounded-xl px-3 focus-within:ring-2 focus-within:ring-brand">
              <Search className="size-4 shrink-0 text-brand" aria-hidden="true" />
              <input
                id="client-search-q"
                name="q"
                type="search"
                placeholder="Buffet, decoração, fotografia..."
                className="h-12 min-w-0 flex-1 bg-transparent text-sm font-medium text-ink outline-none placeholder:text-ink-faint"
              />
            </div>
            <div className="border-t border-line sm:border-l sm:border-t-0">
              <NeighborhoodCombobox />
            </div>
            <Button type="submit" variant="accent" size="lg" className="w-full sm:w-auto">
              Encontrar profissionais
            </Button>
          </form>
        </div>
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(17rem,0.65fr)]">
        <section aria-labelledby="journey-title">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 id="journey-title" className="text-xl font-extrabold tracking-[-0.025em] text-ink">Sua preparação</h2>
              <p className="mt-1 text-sm text-ink-soft">Próximos passos com base no que você já organizou.</p>
            </div>
          </div>
          <ol className="mt-5 overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
            <JourneyItem
              number="1"
              title="Escolha quem fará parte da festa"
              detail={favorites.length > 0 ? `${favorites.length} ${favorites.length === 1 ? "profissional salvo" : "profissionais salvos"} para comparar` : "Salve profissionais para comparar com calma"}
              href={favorites.length > 0 ? "/cliente/favoritos" : "/buscar"}
              action={favorites.length > 0 ? "Ver favoritos" : "Começar busca"}
              complete={favorites.length > 0}
            />
            <JourneyItem
              number="2"
              title="Peça e compare orçamentos"
              detail={quotes.length > 0 ? `${quotes.length} ${quotes.length === 1 ? "solicitação enviada" : "solicitações enviadas"}` : "Conte os detalhes do evento aos profissionais"}
              href={quotes.length > 0 ? "/cliente/orcamentos" : "/buscar"}
              action={quotes.length > 0 ? "Acompanhar pedidos" : "Pedir orçamento"}
              complete={quotes.length > 0}
            />
            <JourneyItem
              number="3"
              title="Confirme as contratações"
              detail={contracts.length > 0 ? `${contracts.length} ${contracts.length === 1 ? "contratação registrada" : "contratações registradas"}` : "Seus contratos aparecerão aqui quando forem confirmados"}
              href="/cliente/contratacoes"
              action="Ver contratações"
              complete={contracts.length > 0}
            />
            <JourneyItem
              number="4"
              title="Compartilhe como foi"
              detail={reviewable.length > 0 ? `${reviewable.length} ${reviewable.length === 1 ? "experiência pronta" : "experiências prontas"} para avaliar` : "Após o evento, sua avaliação ajuda outras pessoas"}
              href="/cliente/avaliacoes"
              action={reviewable.length > 0 ? "Avaliar agora" : "Ver avaliações"}
              complete={reviewable.length === 0 && contracts.some((item) => item.status === "concluido")}
            />
          </ol>
        </section>

        <aside aria-labelledby="attention-title">
          <h2 id="attention-title" className="text-xl font-extrabold tracking-[-0.025em] text-ink">Para ver agora</h2>
          <div className="mt-5 space-y-3">
            <AttentionLink icon={MessageCircle} href="/mensagens" title="Mensagens" detail={unreadMessages > 0 ? `${unreadMessages} ${unreadMessages === 1 ? "mensagem não lida" : "mensagens não lidas"}` : conversations.length > 0 ? "Conversas em dia" : "Fale diretamente com profissionais"} accent={unreadMessages > 0} />
            <AttentionLink icon={Star} href="/cliente/avaliacoes" title="Avaliações" detail={reviewable.length > 0 ? `${reviewable.length} aguardando você` : "Nenhuma avaliação pendente"} accent={reviewable.length > 0} />
            <AttentionLink icon={Heart} href="/cliente/favoritos" title="Favoritos" detail={favorites.length > 0 ? `${favorites.length} para comparar` : "Sua lista está vazia"} />
          </div>
        </aside>
      </div>

      <section aria-labelledby="recent-title" className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="recent-title" className="text-xl font-extrabold tracking-[-0.025em] text-ink">Movimentação recente</h2>
            <p className="mt-1 text-sm text-ink-soft">Seus pedidos e acordos mais recentes.</p>
          </div>
          <Link href="/cliente/orcamentos" className="text-sm font-semibold text-brand hover:text-brand-strong">Ver todos os pedidos</Link>
        </div>

        {!recentQuote && !recentContract ? (
          <div className="mt-5 rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-10 text-center">
            <CalendarCheck className="mx-auto size-8 text-brand" aria-hidden="true" />
            <p className="mt-3 font-semibold text-ink">Sua preparação começa com uma busca</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-ink-soft">Quando você pedir um orçamento ou contratar um serviço, os detalhes aparecerão aqui.</p>
          </div>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {recentQuote ? (
              <Card>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-ink-faint">Pedido mais recente</p>
                    <h3 className="mt-1 font-bold text-ink">{recentQuote.providerName}</h3>
                  </div>
                  <Badge tone={recentQuote.status === "aberto" ? "yellow" : recentQuote.status === "aceito" ? "brand" : "pink"}>{quoteLabels[recentQuote.status]}</Badge>
                </div>
                <p className="mt-3 text-sm text-ink-soft">{recentQuote.serviceName ?? "Serviço a combinar"} · Evento em {formatShortDate(recentQuote.eventDate)}</p>
                <Link href="/cliente/orcamentos" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">Abrir pedido <ArrowRight className="size-4" aria-hidden="true" /></Link>
              </Card>
            ) : null}
            {recentContract ? (
              <Card>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-ink-faint">Contratação mais recente</p>
                    <h3 className="mt-1 font-bold text-ink">{recentContract.serviceName}</h3>
                  </div>
                  <Badge tone={recentContract.status === "cancelado" ? "pink" : "brand"}>{contractLabels[recentContract.status]}</Badge>
                </div>
                <p className="mt-3 text-sm text-ink-soft">{recentContract.providerName} · {formatBRL(recentContract.amount)}</p>
                <Link href="/cliente/contratacoes" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">Ver contratação <ArrowRight className="size-4" aria-hidden="true" /></Link>
              </Card>
            ) : null}
          </div>
        )}
      </section>
    </Container>
  );
}

function JourneyItem({ number, title, detail, href, action, complete }: { number: string; title: string; detail: string; href: string; action: string; complete: boolean }) {
  return (
    <li className="flex items-center gap-4 border-b border-line px-4 py-4 last:border-b-0 sm:px-5">
      <span className={`flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${complete ? "bg-brand text-white" : "bg-brand-soft text-brand"}`}>
        {complete ? <Check className="size-4" aria-label="Etapa iniciada" /> : number}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-bold text-ink sm:text-base">{title}</h3>
        <p className="mt-0.5 text-xs leading-relaxed text-ink-soft sm:text-sm">{detail}</p>
      </div>
      <Link href={href} className="shrink-0 text-sm font-semibold text-brand hover:text-brand-strong"><span className="hidden sm:inline">{action}</span><ArrowRight className="size-4 sm:hidden" aria-label={action} /></Link>
    </li>
  );
}

function AttentionLink({ icon: Icon, href, title, detail, accent = false }: { icon: typeof Heart; href: string; title: string; detail: string; accent?: boolean }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 shadow-card transition-colors hover:border-brand/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-ring/70">
      <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${accent ? "bg-pink-soft text-pink-strong" : "bg-brand-soft text-brand"}`}><Icon className="size-5" aria-hidden="true" /></span>
      <span className="min-w-0 flex-1"><span className="block text-sm font-bold text-ink">{title}</span><span className="mt-0.5 block text-xs text-ink-soft">{detail}</span></span>
      <ArrowRight className="size-4 shrink-0 text-ink-faint" aria-hidden="true" />
    </Link>
  );
}

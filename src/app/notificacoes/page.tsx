import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Bell,
  CalendarCheck,
  CalendarClock,
  MessageCircle,
  Star,
  CheckCheck,
} from "lucide-react";
import { markAllNotificationsReadAction } from "@/actions/notifications";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { requireUser } from "@/lib/auth";
import { countUnreadNotifications, listNotifications } from "@/lib/db";
import { cn } from "@/lib/utils";
import type { NotificationType } from "@/types";

export const metadata: Metadata = {
  title: "Notificações",
  description: "Fique por dentro de mensagens, orçamentos e atualizações.",
};

export const instant = false;

const typeMeta: Record<NotificationType, { icon: typeof Bell; label: string }> = {
  mensagem: { icon: MessageCircle, label: "Mensagem" },
  orcamento: { icon: CalendarClock, label: "Orçamento" },
  contrato: { icon: CalendarCheck, label: "Contrato" },
  avaliacao: { icon: Star, label: "Avaliação" },
  sistema: { icon: Bell, label: "Sistema" },
};

function timeAgo(value: string): string {
  const date = new Date(value.includes("T") ? value : `${value.replace(" ", "T")}Z`);
  if (Number.isNaN(date.getTime())) return value;
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `há ${days}d`;
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

async function NotificacoesData() {
  const user = await requireUser();
  const notifications = await listNotifications(user.id);
  const unread = await countUnreadNotifications(user.id);

  return (
    <Container className="py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold uppercase tracking-[0.04em] text-ink sm:text-3xl">
            Notificações
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-ink-soft">
            {unread > 0
              ? `Você tem ${unread} ${unread === 1 ? "notificação não lida" : "notificações não lidas"}.`
              : "Tudo em dia por aqui."}
          </p>
        </div>
        {unread > 0 ? (
          <form action={markAllNotificationsReadAction}>
            <Button type="submit" variant="secondary" size="md">
              <CheckCheck className="size-4" aria-hidden="true" />
              Marcar todas como lidas
            </Button>
          </form>
        ) : null}
      </div>

      <div className="mt-8">
        {notifications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-16 text-center">
            <span className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-surface-muted">
              <Bell className="size-6 text-ink-faint" aria-hidden="true" />
            </span>
            <p className="mt-4 text-sm text-ink-soft">Nenhuma notificação por enquanto.</p>
            <p className="mt-1 text-sm text-ink-faint">
              Você será avisado sobre mensagens, orçamentos e contratações.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {notifications.map((notification) => {
              const meta = typeMeta[notification.type] ?? typeMeta.sistema;
              const Icon = meta.icon;
              const content = (
                <Card
                  className={cn(
                    "transition-colors",
                    !notification.read && "border-brand/30 bg-brand-soft/30",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "inline-flex size-10 shrink-0 items-center justify-center rounded-xl",
                        notification.read
                          ? "bg-surface-muted text-ink-faint"
                          : "bg-brand text-white",
                      )}
                    >
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-ink">{notification.title}</p>
                        <span className="text-xs text-ink-faint">
                          {timeAgo(notification.createdAt)}
                        </span>
                      </div>
                      {notification.body ? (
                        <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                          {notification.body}
                        </p>
                      ) : null}
                      <p className="mt-1.5 text-xs font-medium uppercase tracking-[0.12em] text-ink-faint">
                        {meta.label}
                        {!notification.read ? (
                          <span className="ml-2 inline-flex size-1.5 rounded-full bg-brand align-middle" />
                        ) : null}
                      </p>
                    </div>
                  </div>
                </Card>
              );

              return (
                <li key={notification.id}>
                  {notification.href ? (
                    <Link href={notification.href} className="block transition-opacity hover:opacity-90">
                      {content}
                    </Link>
                  ) : (
                    content
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Container>
  );
}

export default function NotificacoesPage() {
  return (
    <div id="top" className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1 bg-canvas">
        <Suspense
          fallback={
            <Container className="py-10">
              <div className="h-9 w-64 animate-pulse rounded-lg bg-surface-muted" />
              <div className="mt-6 space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-20 animate-pulse rounded-2xl bg-surface-muted" />
                ))}
              </div>
            </Container>
          }
        >
          <NotificacoesData />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

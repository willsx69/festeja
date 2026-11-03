"use client";

import {
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import {
  markConversationReadAction,
  sendMessageAction,
  type MessageFormState,
} from "@/actions/messages";
import { ProviderAvatar } from "@/components/provider/provider-avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import type { Conversation, Message } from "@/types";

type MessagesPageProps = {
  userRole: "cliente" | "prestador" | "admin";
  userId: string;
  selectedId?: string;
};

export function MessagesPage({ userRole, userId, selectedId }: MessagesPageProps) {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeId, setActiveId] = useState<string | null>(selectedId ?? null);
  const [loading, setLoading] = useState(true);
  const [mobileThread, setMobileThread] = useState(Boolean(selectedId));
  const [, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const threadRequest = useRef(0);

  const loadThread = useCallback(async (id: string) => {
    const request = ++threadRequest.current;
    try {
      const response = await fetch(`/api/conversations/${id}`, { cache: "no-store" });
      if (!response.ok) return;
      const data = (await response.json()) as { messages: Message[] };
      if (threadRequest.current === request) setMessages(data.messages);
    } catch {
      // A próxima atualização tenta novamente.
    }
  }, []);

  const [state, formAction, pending] = useActionState<MessageFormState, FormData>(
    async (previousState, formData) => {
      const result = await sendMessageAction(previousState, formData);
      if (result.message) {
        formRef.current?.reset();
        const conversationId = String(formData.get("conversa") ?? "");
        if (conversationId) await loadThread(conversationId);
      }
      return result;
    },
    {},
  );

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch("/api/conversations");
        if (!response.ok) throw new Error("Falha ao carregar");
        const data = (await response.json()) as { conversations: Conversation[] };
        if (cancelled) return;

        const targetId = selectedId ?? data.conversations[0]?.id ?? null;
        setConversations(
          data.conversations.map((conversation) =>
            conversation.id === targetId ? { ...conversation, unreadCount: 0 } : conversation,
          ),
        );

        if (targetId) {
          setActiveId((current) => current ?? targetId);
          await loadThread(targetId);
        }
      } catch {
        if (!cancelled) setConversations([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [selectedId, loadThread]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    if (!activeId) return;
    startTransition(() => {
      void markConversationReadAction(activeId);
    });
  }, [activeId, startTransition]);

  useEffect(() => {
    if (!activeId) return;
    let cancelled = false;

    const interval = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      void (async () => {
        try {
          const response = await fetch("/api/conversations", { cache: "no-store" });
          if (!response.ok) return;
          const data = (await response.json()) as { conversations: Conversation[] };
          if (cancelled) return;
          setConversations(data.conversations);
          await loadThread(activeId);
        } catch {
          // A próxima atualização tenta novamente.
        }
      })();
    }, 8000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [activeId, loadThread]);

  function openConversation(id: string) {
    setActiveId(id);
    setMobileThread(true);
    router.replace(`/mensagens?con=${id}`, { scroll: false });
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === id ? { ...conversation, unreadCount: 0 } : conversation,
      ),
    );
    void loadThread(id);
  }

  const active = conversations.find((conversation) => conversation.id === activeId) ?? null;
  const activeOtherName = active
    ? userId === active.clientUserId
      ? active.providerName
      : active.clientName
    : "";
  const activeOtherAvatar = active
    ? userId === active.clientUserId
      ? active.providerAvatar
      : active.clientAvatar
    : undefined;

  return (
    <Container className="py-8 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold uppercase tracking-[0.04em] text-ink sm:text-3xl">
            Mensagens
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            {userRole === "cliente"
              ? "Converse com os prestadores antes de fechar o serviço."
              : "Responda os clientes interessados nos seus serviços."}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <aside className={cn(mobileThread && "hidden", "lg:block")}>
          <Card padded={false} className="overflow-hidden">
            <div className="border-b border-line px-4 py-3">
              <h2 className="text-sm font-semibold text-ink">Conversas</h2>
            </div>
            {loading ? (
              <div className="space-y-3 p-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-16 animate-pulse rounded-xl bg-surface-muted" />
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-ink-faint">
                {userRole === "cliente"
                  ? "Nenhuma conversa ainda. Visite um perfil e clique em “Conversar”."
                  : "Nenhuma conversa ainda. Compartilhe seu perfil para receber mensagens."}
              </p>
            ) : (
              <ul className="divide-y divide-line">
                {conversations.map((conversation) => {
                  const otherName =
                    userId === conversation.clientUserId
                      ? conversation.providerName
                      : conversation.clientName;
                  const otherAvatar =
                    userId === conversation.clientUserId
                      ? conversation.providerAvatar
                      : conversation.clientAvatar;
                  return (
                    <li key={conversation.id}>
                      <button
                        type="button"
                        onClick={() => openConversation(conversation.id)}
                        className={cn(
                          "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-muted",
                          activeId === conversation.id && "bg-brand-soft/60",
                        )}
                      >
                        <ProviderAvatar
                          name={otherName}
                          image={otherAvatar}
                          size="md"
                          className="size-11 text-sm"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-sm font-semibold text-ink">{otherName}</p>
                            {conversation.unreadCount > 0 ? (
                              <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-brand text-[0.65rem] font-semibold text-white">
                                {conversation.unreadCount}
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-0.5 truncate text-xs text-ink-faint">
                            {conversation.lastMessage ?? "Conversa iniciada"}
                          </p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </aside>

        <section className={cn(!mobileThread && "hidden", "lg:block")}>
          {!active ? (
            <Card className="flex h-96 flex-col items-center justify-center text-center">
              <p className="text-sm text-ink-soft">Selecione uma conversa para ler as mensagens.</p>
            </Card>
          ) : (
            <Card padded={false} className="flex h-[min(70dvh,40rem)] flex-col overflow-hidden">
              <div className="flex items-center gap-3 border-b border-line px-4 py-3">
                <button
                  type="button"
                  onClick={() => {
                    setMobileThread(false);
                    router.replace("/mensagens", { scroll: false });
                  }}
                  className="inline-flex size-9 items-center justify-center rounded-xl border border-line text-ink transition-colors hover:bg-surface-muted lg:hidden"
                  aria-label="Voltar para a lista"
                >
                  <ArrowLeft className="size-4" aria-hidden="true" />
                </button>
                <ProviderAvatar
                  name={activeOtherName}
                  image={activeOtherAvatar}
                  size="md"
                  className="size-10 text-sm"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">
                    {activeOtherName}
                  </p>
                  {userId === active.clientUserId && active.providerUsername ? (
                    <Link
                      href={`/prestador/${active.providerUsername}`}
                      className="text-xs text-brand transition-colors hover:text-brand-strong"
                    >
                      Ver perfil público
                    </Link>
                  ) : null}
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto bg-surface-muted/40 p-4">
                {messages.length === 0 ? (
                  <p className="py-10 text-center text-sm text-ink-faint">
                    Envie a primeira mensagem para começar a conversar.
                  </p>
                ) : (
                  messages.map((message) => {
                    const mine = message.senderUserId === userId;
                    return (
                      <div
                        key={message.id}
                        className={cn("flex", mine ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                            mine
                              ? "rounded-br-md bg-brand text-white"
                              : "rounded-bl-md border border-line bg-surface text-ink",
                          )}
                        >
                          <p className="whitespace-pre-wrap break-words">{message.body}</p>
                          <p
                            className={cn(
                              "mt-1 text-[0.65rem]",
                              mine ? "text-white/70" : "text-ink-faint",
                            )}
                          >
                            {new Date(`${message.createdAt.replace(" ", "T")}Z`).toLocaleString(
                              "pt-BR",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                                timeZone: "UTC",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              <form ref={formRef} action={formAction} className="border-t border-line p-3">
                <input type="hidden" name="conversa" value={active.id} />
                {state.errors?.mensagem || state.errors?.geral ? (
                  <p className="mb-2 text-xs font-medium text-danger">
                    {state.errors.mensagem ?? state.errors.geral}
                  </p>
                ) : null}
                <div className="flex gap-2">
                  <input
                    name="mensagem"
                    placeholder="Escreva uma mensagem…"
                    className="h-11 min-w-0 flex-1 rounded-xl border border-line-strong bg-surface px-3.5 text-sm text-ink transition-colors focus:border-brand"
                  />
                  <Button type="submit" size="md" disabled={pending}>
                    <Send className="size-4" aria-hidden="true" />
                    {pending ? "Enviando…" : "Enviar"}
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </section>
      </div>
    </Container>
  );
}

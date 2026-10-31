"use server";

import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { getCurrentUserAllowedByEmailPolicy, requireUser } from "@/lib/auth";
import {
  createNotification,
  getConversationForUser,
  getOrCreateConversation,
  getProviderUserId,
  markConversationRead,
  sendMessage,
} from "@/lib/db";
import { enforceRateLimit, retryMessage } from "@/lib/rate-limit";

export type MessageFormState = {
  errors?: Record<string, string>;
  message?: string;
};

export async function startConversationAction(
  _prevState: MessageFormState,
  formData: FormData,
): Promise<MessageFormState> {
  const user = await getCurrentUserAllowedByEmailPolicy();
  if (!user) redirect("/entrar");
  if (user.role !== "cliente") {
    return { errors: { geral: "Apenas contas de cliente podem iniciar conversas." } };
  }

  const providerUsername = String(formData.get("prestador") ?? "");
  const providerUserId = await getProviderUserId(providerUsername);
  if (!providerUserId) return { errors: { geral: "Prestador não encontrado." } };

  const conversationId = await getOrCreateConversation(user.id, providerUserId);
  redirect(`/mensagens?con=${conversationId}`);
}

export async function sendMessageAction(
  _prevState: MessageFormState,
  formData: FormData,
): Promise<MessageFormState> {
  const user = await requireUser(["cliente", "prestador"]);
  const conversationId = String(formData.get("conversa") ?? "");
  const body = String(formData.get("mensagem") ?? "").trim();

  if (body.length === 0) return { errors: { mensagem: "Escreva uma mensagem." } };
  if (body.length > 2000) return { errors: { mensagem: "Mensagem muito longa (máx. 2000 caracteres)." } };

  const limit = await enforceRateLimit("message", user.id, 20, 60 * 1000);
  if (!limit.allowed) {
    return { errors: { mensagem: retryMessage(limit.retryAfterSeconds) } };
  }

  const conversation = await getConversationForUser(conversationId, user.id);
  if (!conversation) return { errors: { geral: "Conversa não encontrada." } };

  const receiverId =
    conversation.clientUserId === user.id
      ? conversation.providerUserId
      : conversation.clientUserId;

  await sendMessage(conversationId, user.id, body);

  const receiverRole = receiverId === conversation.clientUserId ? "cliente" : "prestador";

  await createNotification({
    userId: receiverId,
    type: "mensagem",
    title: `Nova mensagem de ${user.name}`,
    body: body.length > 120 ? `${body.slice(0, 120)}…` : body,
    href:
      receiverRole === "cliente"
        ? `/mensagens?con=${conversationId}`
        : `/mensagens?con=${conversationId}`,
  });

  refresh();
  return { message: "Mensagem enviada." };
}

export async function markConversationReadAction(conversationId: string): Promise<void> {
  const user = await requireUser(["cliente", "prestador"]);

  const conversation = await getConversationForUser(conversationId, user.id);
  if (!conversation) return;

  await markConversationRead(conversationId, user.id);
  refresh();
}


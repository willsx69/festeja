"use server";

import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { getCurrentUserAllowedByEmailPolicy, requireUser } from "@/lib/auth";
import {
  createNotification,
  createQuote,
  getContractParticipant,
  getProviderUserId,
  getQuote,
  getQuoteClientUserId,
  setContractStatus,
  setQuoteStatus,
} from "@/lib/db";
import { formatShortDate } from "@/lib/format";
import { enforceRateLimit, retryMessage } from "@/lib/rate-limit";

export type QuoteFormState = {
  errors?: Record<string, string>;
  message?: string;
};

export async function createQuoteAction(
  _prevState: QuoteFormState,
  formData: FormData,
): Promise<QuoteFormState> {
  const user = await getCurrentUserAllowedByEmailPolicy();
  if (!user) redirect("/entrar");
  if (user.role !== "cliente") {
    return { errors: { geral: "Apenas contas de cliente podem solicitar orçamentos." } };
  }

  const limit = await enforceRateLimit("quote", user.id, 20, 24 * 60 * 60 * 1000);
  if (!limit.allowed) {
    return { errors: { geral: retryMessage(limit.retryAfterSeconds) } };
  }

  const providerUsername = String(formData.get("prestador") ?? "");
  const providerUserId = await getProviderUserId(providerUsername);
  if (!providerUserId) return { errors: { geral: "Prestador não encontrado." } };

  const serviceName = String(formData.get("servico") ?? "").trim() || null;
  const eventDate = String(formData.get("data-evento") ?? "").trim();
  const guestsRaw = String(formData.get("convidados") ?? "").trim();
  const guests = guestsRaw ? Number(guestsRaw) : null;
  const message = String(formData.get("mensagem") ?? "").trim();

  const errors: Record<string, string> = {};
  if (!eventDate) errors["data-evento"] = "Informe a data do evento.";
  if (guests !== null && (!Number.isFinite(guests) || guests <= 0)) {
    errors.convidados = "Informe um número válido de convidados.";
  }
  if (message.length < 20) errors.mensagem = "Conte mais detalhes do evento (mínimo 20 caracteres).";

  if (Object.keys(errors).length > 0) return { errors };

  await createQuote({
    providerUserId,
    clientUserId: user.id,
    serviceName,
    eventDate,
    guests: guests === null ? null : Math.round(guests),
    message,
  });

  await createNotification({
    userId: providerUserId,
    type: "orcamento",
    title: `Novo orçamento de ${user.name}`,
    body: serviceName
      ? `Solicitação para ${serviceName}, evento em ${formatShortDate(eventDate)}.`
      : `Solicitação para evento em ${formatShortDate(eventDate)}.`,
    href: "/painel/orcamentos",
  });

  refresh();
  return { message: "Solicitação enviada! O prestador responderá por aqui." };
}

export async function respondQuoteAction(
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const user = await requireUser(["prestador"]);
  if (!user.username) return { ok: false, error: "Perfil de prestador não encontrado." };

  const providerUserId = await getProviderUserId(user.username);
  if (!providerUserId) return { ok: false, error: "Perfil de prestador não encontrado." };

  const quoteId = String(formData.get("id") ?? "");
  const decision = formData.get("decisao") === "aceitar" ? "aceitar" : "recusar";
  const quote = await getQuote(quoteId);
  if (!quote) return { ok: false, error: "Orçamento não encontrado." };

  const clientUserId = await getQuoteClientUserId(quoteId);
  if (!clientUserId) return { ok: false, error: "Cliente não encontrado." };

  if (decision === "aceitar") {
    const amount = Number(formData.get("valor"));
    if (!Number.isInteger(amount) || amount <= 0) {
      return { ok: false, error: "Informe um valor inteiro maior que zero." };
    }
    const updated = await setQuoteStatus(quoteId, providerUserId, "aceito", {
      serviceName: quote.serviceName ?? "Serviço combinado",
      amount,
      eventDate: quote.eventDate,
    });
    if (!updated) return { ok: false, error: "Este orçamento já foi respondido." };

    await createNotification({
      userId: clientUserId,
      type: "contrato",
      title: "Orçamento aceito!",
      body: `${quote.providerName} aceitou sua solicitação. Um contrato foi criado.`,
      href: "/cliente/contratacoes",
    });
  } else {
    const updated = await setQuoteStatus(quoteId, providerUserId, "recusado");
    if (!updated) return { ok: false, error: "Este orçamento já foi respondido." };

    await createNotification({
      userId: clientUserId,
      type: "orcamento",
      title: "Orçamento recusado",
      body: `${quote.providerName} não poderá atender à sua solicitação.`,
      href: "/cliente/orcamentos",
    });
  }

  refresh();
  return { ok: true };
}

export async function completeContractAction(formData: FormData): Promise<void> {
  const user = await requireUser(["prestador"]);
  if (!user.username) return;

  const providerUserId = await getProviderUserId(user.username);
  if (!providerUserId) return;

  const contractId = String(formData.get("id") ?? "");
  const participant = await getContractParticipant(contractId);
  if (
    !participant ||
    participant.providerUserId !== providerUserId ||
    participant.status !== "pendente"
  ) {
    return;
  }

  if (!(await setContractStatus(contractId, "concluido", "pendente"))) return;

  await createNotification({
    userId: participant.clientUserId,
    type: "contrato",
    title: "Contrato concluído",
    body: `${user.name} marcou "${participant.serviceName}" como concluído. Avalie a experiência.`,
    href: "/cliente/avaliacoes",
  });

  refresh();
}

export async function cancelContractAction(formData: FormData): Promise<void> {
  const user = await getCurrentUserAllowedByEmailPolicy();
  if (!user) return;

  const contractId = String(formData.get("id") ?? "");
  const participant = await getContractParticipant(contractId);
  if (!participant || participant.status !== "pendente") return;

  const providerUserId =
    user.role === "prestador" && user.username
      ? await getProviderUserId(user.username)
      : undefined;
  const allowed =
    user.role === "admin" ||
    (user.role === "cliente" && participant.clientUserId === user.id) ||
    (user.role === "prestador" && participant.providerUserId === providerUserId);
  if (!allowed) return;

  if (!(await setContractStatus(contractId, "cancelado", "pendente"))) return;

  if (user.role === "admin") {
    await createNotification({
      userId: participant.clientUserId,
      type: "contrato",
      title: "Contrato cancelado",
      body: `O contrato "${participant.serviceName}" foi cancelado pela administração.`,
      href: "/cliente/contratacoes",
    });
    await createNotification({
      userId: participant.providerUserId,
      type: "contrato",
      title: "Contrato cancelado",
      body: `O contrato "${participant.serviceName}" foi cancelado pela administração.`,
      href: "/painel/contratos",
    });
  } else {
    const notifyId =
      user.id === participant.clientUserId
        ? participant.providerUserId
        : participant.clientUserId;
    await createNotification({
      userId: notifyId,
      type: "contrato",
      title: "Contrato cancelado",
      body: `O contrato "${participant.serviceName}" foi cancelado.`,
      href:
        user.id === participant.clientUserId
          ? "/painel/contratos"
          : "/cliente/contratacoes",
    });
  }

  refresh();
}



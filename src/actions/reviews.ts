"use server";

import { refresh } from "next/cache";
import { getVerifiedCurrentUser, requireUser } from "@/lib/auth";
import {
  canReviewContract,
  createNotification,
  createReviewForContract,
  getContractParticipant,
  getProviderUserId,
  getReview,
  recordModerationAction,
  replyToReview,
  reportReview,
  setReviewHidden,
  updateReportStatus,
  type ReportStatus,
} from "@/lib/db";
import { formatEventDate } from "@/lib/format";
import { enforceRateLimit } from "@/lib/rate-limit";

export type ReviewFormState = {
  errors?: Record<string, string>;
  message?: string;
};

export async function createReviewAction(
  _prevState: ReviewFormState,
  formData: FormData,
): Promise<ReviewFormState> {
  const user = await getVerifiedCurrentUser();
  if (!user || user.role !== "cliente") {
    return { errors: { geral: "Apenas contas de cliente podem avaliar." } };
  }

  const contractId = String(formData.get("contrato") ?? "");
  const rating = Number(formData.get("nota"));
  const event = String(formData.get("evento") ?? "").trim();
  const comment = String(formData.get("comentario") ?? "").trim();

  const eligibility = await canReviewContract(contractId, user.id);
  if (!eligibility.ok) return { errors: { geral: eligibility.reason } };

  const errors: Record<string, string> = {};
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) errors.nota = "Escolha de 1 a 5 estrelas.";
  if (event.length < 3) errors.evento = "Informe o tipo de evento.";
  if (comment.length < 10) errors.comentario = "Conte como foi a experiência (mínimo 10 caracteres).";
  if (Object.keys(errors).length > 0) return { errors };

  await createReviewForContract({
    contractId,
    clientUserId: user.id,
    authorName: user.name,
    event,
    eventDate: formatEventDate(new Date()),
    rating,
    comment,
  });

  const participant = await getContractParticipant(contractId);
  if (participant) {
    await createNotification({
      userId: participant.providerUserId,
      type: "avaliacao",
      title: `Nova avaliação de ${user.name}`,
      body: `${rating} estrelas — “${comment.slice(0, 100)}${comment.length > 100 ? "…" : ""}”`,
      href: "/painel/avaliacoes",
    });
  }

  refresh();
  return { message: "Avaliação publicada. Obrigado por compartilhar!" };
}

export async function replyReviewAction(
  _prevState: ReviewFormState,
  formData: FormData,
): Promise<ReviewFormState> {
  const user = await requireUser(["prestador"]);
  if (!user.username) return { errors: { geral: "Perfil não encontrado." } };

  const providerUserId = await getProviderUserId(user.username);
  if (!providerUserId) return { errors: { geral: "Perfil não encontrado." } };

  const reviewId = String(formData.get("id") ?? "");
  const body = String(formData.get("resposta") ?? "").trim();

  if (body.length < 5) return { errors: { resposta: "Escreva uma resposta mais completa." } };

  if (!(await replyToReview(reviewId, providerUserId, body))) {
    return { errors: { geral: "Avaliação não encontrada neste perfil." } };
  }

  refresh();
  return { message: "Resposta publicada." };
}

export async function reportReviewAction(formData: FormData): Promise<void> {
  const user = await getVerifiedCurrentUser();
  if (!user) return;

  if (!(await enforceRateLimit("review-report", user.id, 10, 24 * 60 * 60 * 1000)).allowed) {
    return;
  }

  const reviewId = String(formData.get("id") ?? "");
  const reason = String(formData.get("motivo") ?? "Conteúdo impróprio");
  await reportReview(reviewId, user.id, reason);
  refresh();
}

export async function moderateReviewAction(formData: FormData): Promise<void> {
  const admin = await requireUser(["admin"]);

  const reviewId = String(formData.get("id") ?? "");
  const reportId = String(formData.get("denuncia") ?? "");
  const note = String(formData.get("nota") ?? "").trim() || null;
  const action = String(formData.get("acao") ?? "");
  const review = await getReview(reviewId);
  if (!review) return;

  if (action === "ocultar") {
    await setReviewHidden(reviewId, true);
    if (reportId) await recordModerationAction(reportId, admin.id, "avaliacao_ocultada", note);
  }
  if (action === "mostrar") {
    await setReviewHidden(reviewId, false);
    if (reportId) await recordModerationAction(reportId, admin.id, "avaliacao_visivel", note);
  }
  refresh();
}

export async function updateReportStatusAction(formData: FormData): Promise<void> {
  const admin = await requireUser(["admin"]);

  const reportId = String(formData.get("id") ?? "");
  const requested = String(formData.get("acao") ?? "");
  const note = String(formData.get("nota") ?? "").trim() || null;

  const status: ReportStatus | null =
    requested === "em_analise" || requested === "reabrir"
      ? requested === "reabrir"
        ? "aberta"
        : "em_analise"
      : requested === "resolver"
        ? "resolvida"
        : null;
  if (!status) return;
  if (status === "resolvida" && (!note || note.length < 5)) return;

  if (await updateReportStatus(reportId, status, admin.id, note)) refresh();
}



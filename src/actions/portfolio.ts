"use server";

import { refresh } from "next/cache";
import { getVerifiedCurrentUser, requireUser } from "@/lib/auth";
import {
  createPortfolioPost,
  deletePortfolioPost,
  getProviderUserId,
  togglePortfolioLike,
} from "@/lib/db";
import { isOwnedUploadPath } from "@/lib/uploads";

export type PortfolioFormState = {
  errors?: Record<string, string>;
  message?: string;
};

export async function createPortfolioPostAction(
  _prevState: PortfolioFormState,
  formData: FormData,
): Promise<PortfolioFormState> {
  const user = await requireUser(["prestador"]);
  if (!user.username) return { errors: { geral: "Perfil de prestador não encontrado." } };

  const providerUserId = await getProviderUserId(user.username);
  if (!providerUserId) return { errors: { geral: "Perfil de prestador não encontrado." } };

  const title = String(formData.get("titulo") ?? "").trim();
  const meta = String(formData.get("legenda") ?? "").trim();
  const image = String(formData.get("imagem") ?? "").trim() || null;

  const errors: Record<string, string> = {};
  if (title.length < 3) errors.titulo = "Informe um título para a publicação.";
  if (meta.length < 3) errors.legenda = "Escreva uma legenda curta (ex.: Casamento · Manaus).";
  if (image && !isOwnedUploadPath(image, user.id)) errors.imagem = "Imagem inválida.";

  if (Object.keys(errors).length > 0) return { errors };

  await createPortfolioPost(providerUserId, { title, meta, image });
  refresh();
  return { message: "Publicação adicionada ao portfólio." };
}

export async function deletePortfolioPostAction(formData: FormData): Promise<void> {
  const user = await requireUser(["prestador"]);
  if (!user.username) return;

  const providerUserId = await getProviderUserId(user.username);
  if (!providerUserId) return;

  await deletePortfolioPost(providerUserId, String(formData.get("id") ?? ""));
  refresh();
}

export async function toggleLikeAction(postId: string): Promise<boolean | null> {
  const user = await getVerifiedCurrentUser();
  if (!user) return null;

  const liked = await togglePortfolioLike(postId, user.id);
  refresh();
  return liked;
}


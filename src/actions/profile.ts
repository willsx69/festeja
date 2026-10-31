"use server";

import { refresh } from "next/cache";
import {
  getCurrentUser,
  getVerifiedCurrentUser,
  getViewerKey,
  requireUser,
} from "@/lib/auth";
import { categories } from "@/data/categories";
import {
  canonicalManausNeighborhood,
  SERVICE_CITY,
  SERVICE_STATE,
} from "@/data/locations";
import {
  getProviderUserId,
  recordProfileView,
  setProviderCover,
  setProviderImage,
  toggleFavorite,
  updateProviderProfile,
} from "@/lib/db";
import { isOwnedUploadPath } from "@/lib/uploads";
import type { CategoryId, WeekDay } from "@/types";

export type ProfileFormState = {
  errors?: Record<string, string>;
  message?: string;
};

export async function recordProfileViewAction(username: string): Promise<void> {
  const providerUserId = await getProviderUserId(username);
  if (!providerUserId) return;

  const user = await getCurrentUser();
  const viewerKey = await getViewerKey(user);
  await recordProfileView(providerUserId, viewerKey);
}

export async function toggleFavoriteAction(providerUsername: string): Promise<boolean | null> {
  const user = await getVerifiedCurrentUser();
  if (!user || user.role !== "cliente") return null;

  const providerUserId = await getProviderUserId(providerUsername);
  if (!providerUserId) return null;

  const next = await toggleFavorite(user.id, providerUserId);
  refresh();
  return next;
}

const validDays: WeekDay[] = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"];

export async function updateProfileAction(
  _prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const user = await requireUser(["prestador"]);
  if (!user.username) return { errors: { geral: "Perfil de prestador não encontrado." } };

  const providerUserId = await getProviderUserId(user.username);
  if (!providerUserId) return { errors: { geral: "Perfil de prestador não encontrado." } };

  const bio = String(formData.get("bio") ?? "").trim();
  const neighborhood = canonicalManausNeighborhood(
    String(formData.get("bairro") ?? ""),
  );
  const category = String(formData.get("categoria") ?? "");
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  const priceFrom = Number(formData.get("preco"));
  const priceUnit = String(formData.get("unidade") ?? "").trim() || null;
  const days = formData
    .getAll("dias")
    .map((value) => String(value))
    .filter((day): day is WeekDay => validDays.includes(day as WeekDay));
  const responseTime = String(formData.get("tempo-resposta") ?? "").trim();
  const minimumNotice = String(formData.get("antecedencia") ?? "").trim();
  const availabilityNote = String(formData.get("nota-disponibilidade") ?? "").trim();
  const cover = String(formData.get("capa") ?? "").trim();

  const errors: Record<string, string> = {};

  if (bio.length < 40) errors.bio = "Conte um pouco mais sobre o seu trabalho (mínimo 40 caracteres).";
  if (!neighborhood) errors.bairro = "Escolha um bairro válido de Manaus.";
  if (!categories.some((item) => item.id === category)) errors.categoria = "Escolha uma categoria.";
  if (tags.length === 0) errors.tags = "Adicione ao menos uma palavra-chave.";
  if (tags.length > 5) errors.tags = "Use no máximo 5 palavras-chave.";
  if (tags.some((tag) => tag.length > 24)) errors.tags = "Cada palavra-chave pode ter até 24 caracteres.";
  if (!Number.isFinite(priceFrom) || priceFrom < 0) errors.preco = "Informe um preço inicial válido.";
  if (days.length === 0) errors.dias = "Marque ao menos um dia de atendimento.";
  if (!responseTime) errors["tempo-resposta"] = "Informe o tempo médio de resposta.";
  if (!minimumNotice) errors.antecedencia = "Informe a antecedência mínima.";
  if (cover && !isOwnedUploadPath(cover, user.id)) {
    errors.geral = "Imagem enviada não pertence à sua conta.";
  }

  if (Object.keys(errors).length > 0 || !neighborhood) return { errors };

  await updateProviderProfile(providerUserId, {
    bio,
    city: SERVICE_CITY,
    state: SERVICE_STATE,
    neighborhood,
    tags,
    priceFrom: Math.round(priceFrom),
    priceUnit,
    category: category as CategoryId,
    availabilityDays: days,
    responseTime,
    minimumNotice,
    availabilityNote,
  });

  if (cover) {
    await setProviderCover(providerUserId, cover);
  }

  refresh();
  return { message: "Perfil atualizado com sucesso." };
}

export async function setProfileImageAction(url: string): Promise<boolean> {
  const user = await requireUser(["prestador"]);
  if (!user.username) return false;
  if (!isOwnedUploadPath(url, user.id)) return false;

  const providerUserId = await getProviderUserId(user.username);
  if (!providerUserId) return false;

  await setProviderImage(providerUserId, url);
  refresh();
  return true;
}


"use server";

import { refresh } from "next/cache";
import { requireUser } from "@/lib/auth";
import {
  createNotification,
  getProviderUserId,
  setProviderFeatured,
  setProviderVerified,
} from "@/lib/db";

export async function toggleProviderVerifiedAction(formData: FormData): Promise<void> {
  await requireUser(["admin"]);

  const userId = String(formData.get("id") ?? "");
  const value = formData.get("valor") === "1";

  await setProviderVerified(userId, value);

  await createNotification({
    userId,
    type: "sistema",
    title: value ? "Perfil verificado" : "Verificação removida",
    body: value
      ? "Seu perfil foi verificado pela equipe Festeja."
      : "A verificação do seu perfil foi removida.",
    href: "/painel",
  });

  refresh();
}

export async function toggleProviderFeaturedAction(formData: FormData): Promise<void> {
  await requireUser(["admin"]);

  const userId = String(formData.get("id") ?? "");
  const value = formData.get("valor") === "1";

  await setProviderFeatured(userId, value);

  await createNotification({
    userId,
    type: "sistema",
    title: value ? "Perfil em destaque" : "Destaque removido",
    body: value
      ? "Seu perfil agora aparece na página inicial em destaque."
      : "Seu perfil não está mais em destaque na página inicial.",
    href: "/painel",
  });

  refresh();
}

export async function notifyProviderAction(formData: FormData): Promise<void> {
  await requireUser(["admin"]);

  const username = String(formData.get("username") ?? "");
  const providerUserId = await getProviderUserId(username);
  if (!providerUserId) return;

  const title = String(formData.get("titulo") ?? "").trim() || "Mensagem da equipe Festeja";
  const body = String(formData.get("corpo") ?? "").trim();
  if (!body) return;

  await createNotification({
    userId: providerUserId,
    type: "sistema",
    title,
    body,
    href: "/painel",
  });

  refresh();
}


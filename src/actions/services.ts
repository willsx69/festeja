"use server";

import { refresh } from "next/cache";
import { requireUser } from "@/lib/auth";
import { createService, deleteService, getProviderUserId, updateService } from "@/lib/db";

export type ServiceFormState = {
  errors?: Record<string, string>;
  message?: string;
};

async function requireProviderId(): Promise<string | null> {
  const user = await requireUser(["prestador"]);
  if (!user.username) return null;
  return (await getProviderUserId(user.username)) ?? null;
}

function parseServiceForm(formData: FormData) {
  const name = String(formData.get("nome") ?? "").trim();
  const description = String(formData.get("descricao") ?? "").trim();
  const price = Number(formData.get("preco"));
  const priceUnit = String(formData.get("unidade") ?? "").trim() || null;

  const errors: Record<string, string> = {};
  if (name.length < 3) errors.nome = "Informe o nome do serviço.";
  if (description.length < 10) errors.descricao = "Descreva o serviço em pelo menos 10 caracteres.";
  if (!Number.isFinite(price) || price <= 0) errors.preco = "Informe um preço válido.";

  return { values: { name, description, price: Math.round(price), priceUnit }, errors };
}

export async function createServiceAction(
  _prevState: ServiceFormState,
  formData: FormData,
): Promise<ServiceFormState> {
  const providerUserId = await requireProviderId();
  if (!providerUserId) return { errors: { geral: "Perfil de prestador não encontrado." } };

  const { values, errors } = parseServiceForm(formData);
  if (Object.keys(errors).length > 0) return { errors };

  await createService(providerUserId, values);
  refresh();
  return { message: "Serviço adicionado." };
}

export async function updateServiceAction(
  _prevState: ServiceFormState,
  formData: FormData,
): Promise<ServiceFormState> {
  const providerUserId = await requireProviderId();
  if (!providerUserId) return { errors: { geral: "Perfil de prestador não encontrado." } };

  const serviceId = String(formData.get("id") ?? "");
  const { values, errors } = parseServiceForm(formData);
  if (Object.keys(errors).length > 0) return { errors };

  await updateService(providerUserId, serviceId, values);
  refresh();
  return { message: "Serviço atualizado." };
}

export async function deleteServiceAction(formData: FormData): Promise<void> {
  const providerUserId = await requireProviderId();
  if (!providerUserId) return;

  await deleteService(providerUserId, String(formData.get("id") ?? ""));
  refresh();
}


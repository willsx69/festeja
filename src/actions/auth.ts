"use server";

import { redirect } from "next/navigation";
import { endSession, startSession } from "@/lib/auth";
import { getPostAuthDestination } from "@/lib/auth-redirect";
import { getSignupRole } from "@/lib/roles";
import { categories } from "@/data/categories";
import {
  createUser,
  emailExists,
  getUserByEmail,
  updateProviderBusinessAddress,
  updateProviderProfile,
  usernameExists,
} from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email-verification";
import { isEmailVerificationRequired } from "@/lib/email-verification-policy";
import { hashPassword, verifyPassword } from "@/lib/password";
import { enforceRequestRateLimit, resetRateLimit, retryMessage } from "@/lib/rate-limit";
import {
  normalizeBusinessAddress,
  validateBusinessAddress,
  validateLogin,
  validateSignup,
} from "@/lib/validate";
import {
  isProfileSlug,
  normalizeProfileSlug,
  PROFILE_SLUG_MAX_LENGTH,
  PROFILE_SLUG_MIN_LENGTH,
} from "@/lib/slug";
import {
  canonicalManausNeighborhood,
  SERVICE_CITY,
  SERVICE_STATE,
} from "@/data/locations";
import type { CategoryId } from "@/types";

export type AuthFormState = {
  errors?: Record<string, string>;
};

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const values = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("senha") ?? ""),
  };

  const errors = validateLogin(values);
  if (Object.keys(errors).length > 0) return { errors };

  const limit = await enforceRequestRateLimit(
    "login",
    values.email.trim().toLowerCase(),
    10,
    15 * 60 * 1000,
  );
  if (!limit.allowed) {
    return { errors: { email: retryMessage(limit.retryAfterSeconds) } };
  }

  const user = await getUserByEmail(values.email);
  if (!user || !verifyPassword(values.password, user.passwordHash)) {
    return { errors: { email: "E-mail ou senha incorretos." } };
  }

  await resetRateLimit(limit);
  await startSession(user);
  redirect(getPostAuthDestination(user, formData.get("retorno")));
}

export async function signupAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const values = {
    name: String(formData.get("nome") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("senha") ?? ""),
    confirm: String(formData.get("confirmar-senha") ?? ""),
    accept: formData.get("aceite") === "on",
  };
  const account = getSignupRole(formData.get("tipo-conta"));
  const usernameInput = normalizeProfileSlug(String(formData.get("username") ?? ""));
  const businessAddress = normalizeBusinessAddress(
    String(formData.get("endereco-comercial") ?? ""),
  );
  const category = String(formData.get("categoria") ?? "");
  const neighborhood = canonicalManausNeighborhood(
    String(formData.get("bairro") ?? ""),
  );

  const errors: Record<string, string> = { ...validateSignup(values) };

  if (account === "prestador") {
    if (!usernameInput) {
      errors.username = "Escolha o link do seu perfil.";
    } else if (!isProfileSlug(usernameInput)) {
      errors.username = `O link precisa ter entre ${PROFILE_SLUG_MIN_LENGTH} e ${PROFILE_SLUG_MAX_LENGTH} caracteres.`;
    } else if (await usernameExists(usernameInput)) {
      errors.username = "Esse link já está em uso. Escolha outro.";
    }

    const businessAddressError = validateBusinessAddress(businessAddress);
    if (businessAddressError) errors.businessAddress = businessAddressError;

    if (!categories.some((item) => item.id === category)) {
      errors.category = "Escolha a categoria do seu trabalho.";
    }

    if (!neighborhood) {
      errors.bairro = "Escolha um bairro válido de Manaus.";
    }
  }

  if (Object.keys(errors).length > 0 || (account === "prestador" && !neighborhood)) {
    return { errors };
  }

  const limit = await enforceRequestRateLimit("signup", "global", 5, 60 * 60 * 1000);
  if (!limit.allowed) {
    return { errors: { email: retryMessage(limit.retryAfterSeconds) } };
  }

  if (await emailExists(values.email)) {
    return { errors: { email: "Já existe uma conta com este e-mail." } };
  }

  const user = await createUser({
    name: values.name.trim(),
    email: values.email,
    passwordHash: hashPassword(values.password),
    role: account,
    username: account === "prestador" ? usernameInput : undefined,
  });

  if (account === "prestador" && user.username && neighborhood) {
    await updateProviderProfile(user.id, {
      bio: "",
      city: SERVICE_CITY,
      state: SERVICE_STATE,
      neighborhood,
      tags: [],
      priceFrom: 0,
      priceUnit: null,
      category: category as CategoryId,
      availabilityDays: ["seg", "ter", "qua", "qui", "sex"],
      responseTime: "a combinar",
      minimumNotice: "a combinar",
      availabilityNote: "Fale com o prestador para confirmar a disponibilidade.",
    });
    await updateProviderBusinessAddress(user.id, businessAddress || null);
  }

  if (isEmailVerificationRequired()) await sendVerificationEmail(user);
  await startSession(user);
  redirect(
    getPostAuthDestination(
      { role: user.role, emailVerified: false },
      formData.get("retorno"),
    ),
  );
}

export async function logoutAction(): Promise<void> {
  await endSession();
  redirect("/");
}


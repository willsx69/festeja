"use server";

import { redirect } from "next/navigation";
import {
  consumePasswordResetToken,
  createPasswordResetToken,
  deleteUserSessions,
  getUserByEmail,
  invalidatePasswordResetTokens,
  updateUserPassword,
} from "@/lib/db";
import { appUrl, sendTransactionalEmail } from "@/lib/email";
import { hashPassword, randomToken, sha256 } from "@/lib/password";
import { enforceRequestRateLimit } from "@/lib/rate-limit";

const RECOVERY_MESSAGE =
  "Se este e-mail estiver cadastrado, você receberá instruções de recuperação.";

export type RecoveryFormState = {
  errors?: Record<string, string>;
  message?: string;
};

export async function requestPasswordResetAction(
  _prevState: RecoveryFormState,
  formData: FormData,
): Promise<RecoveryFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email.includes("@")) return { errors: { email: "Informe um e-mail válido." } };

  const limit = await enforceRequestRateLimit(
    "password-reset",
    email,
    3,
    60 * 60 * 1000,
  );
  if (!limit.allowed) return { message: RECOVERY_MESSAGE };

  const user = await getUserByEmail(email);
  if (!user) return { message: RECOVERY_MESSAGE };

  const token = randomToken();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  await createPasswordResetToken(sha256(token), user.id, expiresAt);

  await sendTransactionalEmail({
    to: user.email,
    subject: "Redefinição de senha na Festeja",
    text: [
      `Olá, ${user.name}!`,
      "",
      "Recebemos um pedido para redefinir a senha da sua conta na Festeja:",
      appUrl(`/redefinir-senha?token=${token}`),
      "",
      "O link expira em 1 hora e só pode ser usado uma vez.",
      "Se você não fez este pedido, ignore esta mensagem.",
    ].join("\n"),
  });

  return { message: RECOVERY_MESSAGE };
}

export type ResetFormState = {
  errors?: Record<string, string>;
  message?: string;
};

export async function resetPasswordAction(
  _prevState: ResetFormState,
  formData: FormData,
): Promise<ResetFormState> {
  const token = String(formData.get("token") ?? "").trim();
  const password = String(formData.get("senha") ?? "");
  const confirm = String(formData.get("confirmar") ?? "");

  const errors: Record<string, string> = {};

  if (!token) errors.token = "Token inválido ou expirado.";
  if (password.length < 8) errors.senha = "A senha precisa ter pelo menos 8 caracteres.";
  if (password !== confirm) errors.confirmar = "As senhas não coincidem.";

  if (Object.keys(errors).length > 0) return { errors };

  const limit = await enforceRequestRateLimit(
    "password-reset-submit",
    "global",
    20,
    60 * 60 * 1000,
  );
  if (!limit.allowed) {
    return { errors: { token: "Muitas tentativas. Solicite um novo link mais tarde." } };
  }

  const userId = await consumePasswordResetToken(sha256(token));
  if (!userId) {
    return { errors: { token: "Este link de recuperação é inválido ou já foi utilizado." } };
  }

  await updateUserPassword(userId, hashPassword(password));
  await invalidatePasswordResetTokens(userId);
  await deleteUserSessions(userId);

  redirect("/entrar");
}


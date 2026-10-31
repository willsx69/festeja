"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { endSession, requireAccountUser, startSession } from "@/lib/auth";
import {
  deleteUserAccount,
  deleteUserSessions,
  emailTakenByOther,
  getUserByEmail,
  getUserProfile,
  invalidatePasswordResetTokens,
  setEmailVerified,
  updateUserAvatar,
  updateUserPassword,
  updateUserProfile,
} from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email-verification";
import { hashPassword, verifyPassword } from "@/lib/password";
import { enforceRateLimit, retryMessage } from "@/lib/rate-limit";
import { isOwnedUploadPath, removeUserUploads } from "@/lib/uploads";

export type AccountFormState = {
  errors?: Record<string, string>;
  message?: string;
};

export async function updateAccountAction(
  _prevState: AccountFormState,
  formData: FormData,
): Promise<AccountFormState> {
  const user = await requireAccountUser();

  const name = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("telefone") ?? "").trim() || null;

  const errors: Record<string, string> = {};

  if (name.length < 3) errors.nome = "Informe seu nome completo.";
  if (!email.includes("@") || !email.includes(".")) errors.email = "Use um e-mail válido.";
  if (await emailTakenByOther(email, user.id)) {
    errors.email = "Já existe uma conta com este e-mail.";
  }

  if (Object.keys(errors).length > 0) return { errors };

  const previous = await getUserProfile(user.id);
  await updateUserProfile(user.id, { name, email, phone });

  const emailChanged = Boolean(previous && previous.email !== email);
  let deliveryOk = true;
  if (emailChanged) {
    await setEmailVerified(user.id, false);
    const delivery = await sendVerificationEmail({ id: user.id, name, email });
    deliveryOk = delivery.ok;
  }

  refresh();
  if (!emailChanged) return { message: "Dados atualizados com sucesso." };
  return {
    message: deliveryOk
      ? "Dados atualizados. Confirme o novo e-mail para verificá-lo."
      : "Dados atualizados. Não foi possível enviar a confirmação agora; tente reenviar em Configurações.",
  };
}

export async function changePasswordAction(
  _prevState: AccountFormState,
  formData: FormData,
): Promise<AccountFormState> {
  const user = await requireAccountUser();

  const current = String(formData.get("senha-atual") ?? "");
  const next = String(formData.get("senha-nova") ?? "");
  const confirm = String(formData.get("senha-confirmar") ?? "");

  const errors: Record<string, string> = {};

  if (!current) errors["senha-atual"] = "Informe sua senha atual.";
  if (next.length < 8) errors["senha-nova"] = "A nova senha precisa ter pelo menos 8 caracteres.";
  if (next !== confirm) errors["senha-confirmar"] = "As senhas não coincidem.";

  if (Object.keys(errors).length > 0) return { errors };

  const account = await getUserByEmail(user.email);
  if (!account || !verifyPassword(current, account.passwordHash)) {
    return { errors: { "senha-atual": "Senha atual incorreta." } };
  }

  await updateUserPassword(user.id, hashPassword(next));
  await invalidatePasswordResetTokens(user.id);
  await deleteUserSessions(user.id);
  await startSession(user);

  refresh();
  return { message: "Senha alterada com sucesso." };
}

export async function updateAvatarAction(url: string): Promise<boolean> {
  const user = await requireAccountUser();
  if (!isOwnedUploadPath(url, user.id)) return false;

  await updateUserAvatar(user.id, url);
  refresh();
  return true;
}

export async function removeAvatarAction(): Promise<void> {
  const user = await requireAccountUser();
  await updateUserAvatar(user.id, null);
  refresh();
}

export type VerificationState = {
  errors?: Record<string, string>;
  message?: string;
};

export async function resendVerificationEmailAction(): Promise<VerificationState> {
  const user = await requireAccountUser();
  const profile = await getUserProfile(user.id);
  if (!profile) return { errors: { geral: "Conta não encontrada." } };
  if (profile.emailVerified) return { message: "Seu e-mail já está verificado." };

  const limit = await enforceRateLimit(
    "verify-email-resend",
    user.id,
    3,
    60 * 60 * 1000,
  );
  if (!limit.allowed) {
    return { errors: { geral: retryMessage(limit.retryAfterSeconds) } };
  }

  const result = await sendVerificationEmail(profile);
  if (result.ok) {
    return { message: "Enviamos um novo link de confirmação para o seu e-mail." };
  }
  if (result.reason === "not_configured") {
    return {
      errors: {
        geral: "O envio de e-mails ainda não está configurado neste ambiente.",
      },
    };
  }
  return { errors: { geral: "Não foi possível enviar o e-mail agora. Tente novamente." } };
}

export type DeleteAccountState = {
  errors?: Record<string, string>;
};

export async function deleteAccountAction(
  _prevState: DeleteAccountState,
  formData: FormData,
): Promise<DeleteAccountState> {
  const user = await requireAccountUser();
  if (user.role === "admin") {
    return { errors: { geral: "Contas administrativas não podem ser excluídas por aqui." } };
  }

  const password = String(formData.get("senha") ?? "");
  const confirmation = String(formData.get("confirmacao") ?? "").trim();
  const errors: Record<string, string> = {};

  if (!password) errors.senha = "Informe sua senha para confirmar.";
  if (confirmation !== "EXCLUIR") {
    errors.confirmacao = "Digite EXCLUIR para confirmar a exclusão.";
  }
  if (Object.keys(errors).length > 0) return { errors };

  const limit = await enforceRateLimit("delete-account", user.id, 5, 60 * 60 * 1000);
  if (!limit.allowed) {
    return { errors: { geral: retryMessage(limit.retryAfterSeconds) } };
  }

  const account = await getUserByEmail(user.email);
  if (!account || !verifyPassword(password, account.passwordHash)) {
    return { errors: { senha: "Senha incorreta." } };
  }

  if (!(await deleteUserAccount(user.id))) {
    return { errors: { geral: "Não foi possível excluir a conta. Tente novamente." } };
  }

  try {
    await removeUserUploads(user.id);
  } catch {
    console.error("[uploads] Não foi possível remover os arquivos da conta excluída.");
  }

  await endSession();
  redirect("/");
}



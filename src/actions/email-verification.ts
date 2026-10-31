"use server";

import { refresh } from "next/cache";
import { verifyEmailToken } from "@/lib/db";
import { sha256 } from "@/lib/password";
import { enforceRequestRateLimit, retryMessage } from "@/lib/rate-limit";

export type VerifyEmailState = {
  success?: boolean;
  message?: string;
  error?: string;
};

export async function verifyEmailAction(
  _prevState: VerifyEmailState,
  formData: FormData,
): Promise<VerifyEmailState> {
  const token = String(formData.get("token") ?? "").trim();
  if (!token) {
    return { error: "Link de confirmação inválido ou ausente." };
  }

  const limit = await enforceRequestRateLimit(
    "verify-email",
    "global",
    20,
    60 * 60 * 1000,
  );
  if (!limit.allowed) {
    return { error: retryMessage(limit.retryAfterSeconds) };
  }

  const userId = await verifyEmailToken(sha256(token));
  if (!userId) {
    return { error: "Este link de confirmação é inválido ou já foi utilizado." };
  }

  refresh();
  return {
    success: true,
    message: "E-mail confirmado. Sua conta está verificada.",
  };
}

import {
  createEmailVerificationToken,
  invalidateEmailVerificationTokens,
} from "@/lib/db";
import { appUrl, sendTransactionalEmail } from "@/lib/email";
import { randomToken, sha256 } from "@/lib/password";

export async function sendVerificationEmail(input: {
  id: string;
  name: string;
  email: string;
}) {
  const token = randomToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  await invalidateEmailVerificationTokens(input.id);
  await createEmailVerificationToken(sha256(token), input.id, input.email, expiresAt);

  const link = appUrl(`/verificar-email?token=${token}`);

  return sendTransactionalEmail({
    to: input.email,
    subject: "Confirme seu e-mail na Festeja",
    text: [
      `Olá, ${input.name}!`,
      "",
      "Confirme seu e-mail para proteger sua conta na Festeja:",
      link,
      "",
      "O link expira em 24 horas. Se você não criou esta conta, ignore esta mensagem.",
    ].join("\n"),
  });
}

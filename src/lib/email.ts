type EmailInput = {
  to: string;
  subject: string;
  text: string;
};

export type EmailDeliveryResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "provider_error" };

export function appUrl(path: string): string {
  const configured = process.env.APP_URL?.trim();
  const vercelHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.VERCEL_URL?.trim();
  const base = configured || (vercelHost ? `https://${vercelHost}` : undefined);

  if (!base && process.env.NODE_ENV === "production") {
    throw new Error("APP_URL não configurada para o ambiente de produção.");
  }

  const url = new URL(base || "http://localhost:3000");
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("APP_URL precisa usar http ou https.");
  }
  return new URL(path, url).toString();
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.EMAIL_FROM?.trim());
}

export async function sendTransactionalEmail(input: EmailInput): Promise<EmailDeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();

  if (!apiKey || !from) {
    console.warn(
      "[email] Envio não configurado. Defina RESEND_API_KEY e EMAIL_FROM para ativar e-mails transacionais.",
    );
    return { ok: false, reason: "not_configured" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject: input.subject,
        text: input.text,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      console.error(`[email] Provedor recusou o envio (status ${response.status}).`);
      return { ok: false, reason: "provider_error" };
    }

    return { ok: true };
  } catch {
    console.error("[email] Falha de rede ao enviar e-mail transacional.");
    return { ok: false, reason: "provider_error" };
  }
}

import { headers } from "next/headers";
import { clearRateLimit, consumeRateLimit, type RateLimitResult } from "@/lib/db";
import { sha256 } from "@/lib/password";

export type { RateLimitResult };

export async function getClientIp(): Promise<string> {
  const store = await headers();
  const forwarded = store.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || store.get("x-real-ip") || "local";
}

export async function enforceRateLimit(
  scope: string,
  identifier: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const key = `rl:${sha256(`${scope}:${identifier}`)}`;
  return consumeRateLimit(key, limit, windowMs);
}

export async function enforceRequestRateLimit(
  scope: string,
  identifier: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const ip = await getClientIp();
  return enforceRateLimit(scope, `${ip}|${identifier}`, limit, windowMs);
}

export async function resetRateLimit(result: RateLimitResult) {
  await clearRateLimit(result.key);
}

export function retryMessage(retryAfterSeconds: number): string {
  const minutes = Math.max(1, Math.ceil(retryAfterSeconds / 60));
  return `Muitas tentativas. Tente novamente em ${minutes} minuto${minutes === 1 ? "" : "s"}.`;
}

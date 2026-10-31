import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSession, deleteSession, getSessionUser } from "@/lib/db";
import { buildLoginHref } from "@/lib/auth-redirect";
import { randomToken, sha256 } from "@/lib/password";
import { getRoleHomePath } from "@/lib/roles";
import type { SessionUser, User, UserRole } from "@/types";

export const SESSION_COOKIE = "festeja_session";
export const VISITOR_COOKIE = "festeja_visitor";

const SESSION_MAX_AGE = 60 * 60 * 24 * 30;
const VISITOR_MAX_AGE = 60 * 60 * 24 * 365;

export async function getSessionToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value;
}

export async function getCurrentUser(): Promise<SessionUser | undefined> {
  const token = await getSessionToken();
  if (!token) return undefined;
  return getSessionUser(sha256(token));
}

export async function getCurrentUserFromToken(
  token: string | undefined,
): Promise<SessionUser | undefined> {
  if (!token) return undefined;
  return getSessionUser(sha256(token));
}

export async function requireUser(roles?: UserRole[], returnTo?: string): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect(returnTo ? buildLoginHref(returnTo) : "/entrar");
  if (!user.emailVerified) redirect("/verificar-email");
  if (roles && !roles.includes(user.role)) redirect(getRoleHomePath(user.role));
  return user;
}

export async function requireAccountUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar");
  return user;
}

export async function getVerifiedCurrentUser(): Promise<SessionUser | undefined> {
  const user = await getCurrentUser();
  return user?.emailVerified ? user : undefined;
}

export async function startSession(user: User): Promise<void> {
  const store = await cookies();
  const token = randomToken();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000).toISOString();
  await createSession(user.id, sha256(token), expiresAt);
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await deleteSession(sha256(token));
  store.delete(SESSION_COOKIE);
}

export async function getViewerKey(user?: SessionUser): Promise<string> {
  if (user) return `u:${user.id}`;

  const store = await cookies();
  const existing = store.get(VISITOR_COOKIE)?.value;
  if (existing) return `v:${existing}`;

  const visitor = randomToken().slice(0, 32);
  store.set(VISITOR_COOKIE, visitor, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: VISITOR_MAX_AGE,
  });
  return `v:${visitor}`;
}

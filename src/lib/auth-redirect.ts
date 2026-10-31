import { getRoleHomePath } from "@/lib/roles";
import type { UserRole } from "@/types";

const APP_ORIGIN = "https://festeja.local";
const blockedAuthPaths = [
  "/entrar",
  "/cadastro",
  "/esqueci-senha",
  "/redefinir-senha",
] as const;

const restrictedRoots: { root: string; roles: UserRole[] }[] = [
  { root: "/admin", roles: ["admin"] },
  { root: "/painel", roles: ["prestador"] },
  { root: "/cliente", roles: ["cliente"] },
  { root: "/agendamentos", roles: ["cliente"] },
  { root: "/favoritos", roles: ["cliente"] },
  { root: "/avaliacoes", roles: ["cliente"] },
  { root: "/mensagens", roles: ["cliente", "prestador"] },
];

function matchesRoot(pathname: string, root: string): boolean {
  return pathname === root || pathname.startsWith(`${root}/`);
}

export function getSafeReturnPath(
  value: FormDataEntryValue | string | null | undefined,
  role?: UserRole,
): string | undefined {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return undefined;
  }
  if (/[\\\u0000-\u001f\u007f]/.test(value)) return undefined;

  let url: URL;
  try {
    url = new URL(value, APP_ORIGIN);
  } catch {
    return undefined;
  }

  if (url.origin !== APP_ORIGIN) return undefined;
  if (blockedAuthPaths.some((path) => matchesRoot(url.pathname, path))) return undefined;

  if (role) {
    const restriction = restrictedRoots.find(({ root }) => matchesRoot(url.pathname, root));
    if (restriction && !restriction.roles.includes(role)) return undefined;
  }

  return `${url.pathname}${url.search}${url.hash}`;
}

export function getPostAuthPath(
  role: UserRole,
  returnValue?: FormDataEntryValue | string | null,
): string {
  return getSafeReturnPath(returnValue, role) ?? getRoleHomePath(role);
}

export function buildLoginHref(returnTo: string): string {
  return `/entrar?retorno=${encodeURIComponent(returnTo)}`;
}

export function buildSignupHref(returnTo: string): string {
  return `/cadastro?retorno=${encodeURIComponent(returnTo)}`;
}

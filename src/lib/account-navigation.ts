import type { SessionUser, UserRole } from "@/types";

const accountRoleLabels = {
  admin: "Administrador",
  prestador: "Prestador",
  cliente: "Cliente",
} as const satisfies Record<UserRole, string>;

export function getAccountNavigation(
  user: Pick<SessionUser, "role" | "username">,
): { profileHref: string; panelHref: string; roleLabel: string } {
  if (user.role === "admin") {
    return {
      profileHref: "/configuracoes#dados-pessoais",
      panelHref: "/admin",
      roleLabel: accountRoleLabels.admin,
    };
  }

  if (user.role === "prestador") {
    return {
      profileHref: user.username
        ? `/prestador/${user.username}`
        : "/configuracoes#dados-pessoais",
      panelHref: "/painel",
      roleLabel: accountRoleLabels.prestador,
    };
  }

  return {
    profileHref: "/configuracoes#dados-pessoais",
    panelHref: "/cliente",
    roleLabel: accountRoleLabels.cliente,
  };
}

import type { UserRole } from "@/types";

const roleHomePaths = {
  admin: "/admin",
  prestador: "/painel",
  cliente: "/cliente",
} as const satisfies Record<UserRole, string>;

export function getRoleHomePath(role: UserRole): string {
  return roleHomePaths[role];
}

export function getSignupRole(value: FormDataEntryValue | string | null): "cliente" | "prestador" {
  return value === "prestador" ? "prestador" : "cliente";
}

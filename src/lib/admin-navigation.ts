export const adminTabIds = [
  "visao",
  "usuarios",
  "prestadores",
  "categorias",
  "moderacao",
] as const;

export type AdminTab = (typeof adminTabIds)[number];

export const adminHeaderLinks = [
  { href: "/admin", label: "Painel", tab: "visao" },
  { href: "/admin?aba=usuarios", label: "Usuários", tab: "usuarios" },
  { href: "/admin?aba=prestadores", label: "Prestadores", tab: "prestadores" },
  { href: "/admin?aba=moderacao", label: "Moderação", tab: "moderacao" },
] as const satisfies ReadonlyArray<{ href: string; label: string; tab: AdminTab }>;

export function parseAdminTab(value: string | string[] | null | undefined): AdminTab {
  const candidate = Array.isArray(value) ? value[0] : value;
  return adminTabIds.find((tab) => tab === candidate) ?? "visao";
}

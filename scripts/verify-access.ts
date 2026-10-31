import { adminHeaderLinks, adminTabIds, parseAdminTab } from "@/lib/admin-navigation";
import { getAccountNavigation } from "@/lib/account-navigation";
import { getPostAuthPath, getSafeReturnPath } from "@/lib/auth-redirect";
import { closeDb, getProviderUserId } from "@/lib/db";
import { getRoleHomePath, getSignupRole } from "@/lib/roles";
import { clientHeaderLinks, providerHeaderLinks } from "@/lib/role-navigation";

let failures = 0;

function check(label: string, condition: boolean, extra?: unknown) {
  if (condition) {
    console.log(`  ok   ${label}`);
  } else {
    failures++;
    console.log(`  FAIL ${label}`, extra ?? "");
  }
}

async function main() {
console.log("destino por papel");
check("admin vai para o painel administrativo", getRoleHomePath("admin") === "/admin");
check("prestador vai para o painel profissional", getRoleHomePath("prestador") === "/painel");
check("cliente vai para o painel de contratação", getRoleHomePath("cliente") === "/cliente");
check("admin não usa a home como área autorizada", getRoleHomePath("admin") !== "/");
check(
  "cadastro respeita os tipos de conta permitidos",
  getSignupRole("cliente") === "cliente" &&
    getSignupRole("prestador") === "prestador" &&
    getSignupRole("admin") === "cliente",
);

console.log("navegação administrativa");
check("sem parâmetro abre visão geral", parseAdminTab(null) === "visao");
check("parâmetro inválido abre visão geral", parseAdminTab("inexistente") === "visao");
check(
  "todas as abas válidas são preservadas",
  adminTabIds.every((tab) => parseAdminTab(tab) === tab),
);
check(
  "links do header selecionam a aba correspondente",
  adminHeaderLinks.every((link) => {
    const url = new URL(link.href, "http://localhost");
    return parseAdminTab(url.searchParams.get("aba")) === link.tab;
  }),
);
check(
  "header administrativo não repete seções",
  new Set(adminHeaderLinks.map((link) => link.tab)).size === adminHeaderLinks.length,
);

console.log("menu da conta");
const adminAccount = getAccountNavigation({ role: "admin" });
check(
  "admin usa painel administrativo",
  adminAccount.panelHref === "/admin" && adminAccount.profileHref === "/configuracoes#dados-pessoais",
  adminAccount,
);
const providerAccount = getAccountNavigation({
  role: "prestador",
  username: "ana-beatriz-confeitaria",
});
check(
  "prestador usa painel e perfil público próprios",
  providerAccount.panelHref === "/painel" &&
    providerAccount.profileHref === "/prestador/ana-beatriz-confeitaria",
  providerAccount,
);
const clientAccount = getAccountNavigation({ role: "cliente" });
check(
  "cliente usa área autorizada",
  clientAccount.panelHref === "/cliente" &&
    clientAccount.profileHref === "/configuracoes#dados-pessoais",
  clientAccount,
);

console.log("navegação por papel");
check(
  "cliente tem apenas links da sua jornada",
  clientHeaderLinks.some((link) => link.href === "/cliente") &&
    clientHeaderLinks.some((link) => link.href === "/cliente/orcamentos") &&
    clientHeaderLinks.every((link) => !link.href.startsWith("/painel") && !link.href.startsWith("/admin")),
);
check(
  "prestador entra pelo painel profissional",
  providerHeaderLinks[0]?.href === "/painel" &&
    providerHeaderLinks.every((link) => !link.href.startsWith("/cliente") && !link.href.startsWith("/admin")),
);

console.log("retorno seguro após autenticação");
check(
  "cliente retorna à ação pública iniciada",
  getPostAuthPath("cliente", "/prestador/ana-beatriz-confeitaria?aba=orcamento") ===
    "/prestador/ana-beatriz-confeitaria?aba=orcamento",
);
check(
  "cliente retorna à própria rota privada",
  getPostAuthPath("cliente", "/cliente/orcamentos") === "/cliente/orcamentos",
);
check(
  "destino incompatível cai na home do papel",
  getPostAuthPath("cliente", "/painel") === "/cliente" &&
    getPostAuthPath("prestador", "/cliente/favoritos") === "/painel" &&
    getPostAuthPath("admin", "/mensagens") === "/admin",
);
check(
  "URLs externas e relativas a protocolo são recusadas",
  getSafeReturnPath("https://example.com") === undefined &&
    getSafeReturnPath("//example.com") === undefined &&
    getSafeReturnPath("/\\example.com") === undefined,
);
check(
  "rotas de autenticação não criam ciclos",
  getSafeReturnPath("/entrar?retorno=/cliente") === undefined &&
    getSafeReturnPath("/cadastro") === undefined,
);

console.log("perfil profissional");
check(
  "prestador do seed tem perfil profissional",
  Boolean(await getProviderUserId("ana-beatriz-confeitaria")),
);
check(
  "identificador sem perfil não resolve",
  (await getProviderUserId("admin")) === undefined,
);

await closeDb();

if (failures > 0) {
  console.error(`\n${failures} verificação(ões) falharam.`);
  process.exit(1);
}

console.log("\nTODOS OS TESTES PASSARAM");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

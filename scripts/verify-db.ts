import {
  closeDb,
  execute,
  getAllProviders,
  listProvidersForAdmin,
  queryRow,
  queryRows,
  resolveDatabasePath,
  updateProviderBusinessAddress,
  updateUserAvatar,
  usernameExists,
} from "@/lib/db";
import { isManausNeighborhood } from "@/data/locations";

let failures = 0;

function check(label: string, condition: boolean, extra?: unknown) {
  if (condition) {
    console.log(`  ok   ${label}`);
  } else {
    failures++;
    console.log(`  FAIL ${label}`, extra ?? "");
  }
}

if (!process.env.FESTEJA_DB_PATH) {
  throw new Error("FESTEJA_DB_PATH precisa apontar para um banco temporário.");
}

async function main() {
console.log("schema e seed");
check("caminho do banco respeita FESTEJA_DB_PATH", resolveDatabasePath() === process.env.FESTEJA_DB_PATH);

const migrationCount = await queryRow<{ total: number }>(
  "SELECT COUNT(*) AS total FROM schema_migrations",
);
const appliedMigrations = Number(migrationCount?.total ?? 0);
check("migrações aplicadas", appliedMigrations >= 8, appliedMigrations);

const providers = await getAllProviders();
check("20 prestadores no seed", providers.length === 20, providers.length);
check(
  "todos os prestadores têm bairro",
  providers.every((provider) => provider.neighborhood.length > 0),
);
check(
  "todos os prestadores atendem somente Manaus - AM",
  providers.every((provider) => provider.city === "Manaus" && provider.state === "AM"),
);
check(
  "todos os bairros são oficiais de Manaus",
  providers.every((provider) => isManausNeighborhood(provider.neighborhood)),
);
check(
  "nenhum usuário duplicado",
  await (async () => {
    const rows = await queryRows<{ total: number }>(
      "SELECT email, COUNT(*) AS total FROM users GROUP BY email",
    );
    return rows.every((row) => Number(row.total) === 1);
  })(),
);
check("slug existente é detectado", await usernameExists("ana-beatriz-confeitaria"));

const providerUser = await queryRow<{ user_id: string }>(
  "SELECT user_id FROM provider_profiles WHERE username = ?",
  ["ana-beatriz-confeitaria"],
);
if (!providerUser) throw new Error("Prestador do seed não encontrado.");

await updateUserAvatar(providerUser.user_id, "/uploads/teste/avatar.webp");
const adminProvider = (await listProvidersForAdmin()).find(
  (provider) => provider.username === "ana-beatriz-confeitaria",
);
check(
  "consulta administrativa inclui o avatar real do usuário",
  adminProvider?.avatar === "/uploads/teste/avatar.webp",
  adminProvider,
);
await updateUserAvatar(providerUser.user_id, null);
await updateProviderBusinessAddress(providerUser.user_id, "Rua Linhares, 10");
const storedAddress = await queryRow<{ business_address: string | null }>(
  "SELECT business_address FROM provider_profiles WHERE user_id = ?",
  [providerUser.user_id],
);
check(
  "endereço comercial é persistido separadamente",
  storedAddress?.business_address === "Rua Linhares, 10",
  storedAddress,
);
check(
  "endereço comercial não é exposto no catálogo público",
  providers.every((provider) => !("businessAddress" in provider)),
);

await execute("DELETE FROM schema_migrations WHERE id = ?", ["006_manaus_only"]);
await execute(
  "UPDATE provider_profiles SET city = 'São Paulo', state = 'SP', neighborhood = 'Pinheiros' WHERE username = ?",
  ["ana-beatriz-confeitaria"],
);
await closeDb();
check("reabrir o banco não duplica o seed", (await getAllProviders()).length === 20);
const migratedProvider = (await getAllProviders()).find(
  (provider) => provider.id === "ana-beatriz-confeitaria",
);
check(
  "migração converte localização antiga para Manaus",
  migratedProvider?.city === "Manaus" &&
    migratedProvider.state === "AM" &&
    migratedProvider.neighborhood === "Adrianópolis",
  migratedProvider,
);
const finalMigrationCount = await queryRow<{ total: number }>(
  "SELECT COUNT(*) AS total FROM schema_migrations",
);
check(
  "schema_migrations permanece estável",
  Number(finalMigrationCount?.total ?? -1) === appliedMigrations,
);

console.log("");
console.log(failures === 0 ? "TODOS OS TESTES PASSARAM" : `${failures} FALHA(S)`);
process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

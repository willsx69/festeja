import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { closeDb, queryRow, withTransaction } from "@/lib/db";

const sourcePath = path.resolve(
  process.env.SQLITE_SOURCE_PATH?.trim() || "data/festeja.db",
);
const backupPath = path.resolve(
  process.env.SQLITE_BACKUP_PATH?.trim() ||
    "data/backups/festeja-20261031-before-vercel-migration.db",
);

const tableOrder = [
  "users",
  "provider_profiles",
  "services",
  "portfolio_posts",
  "contracts",
  "reviews",
  "review_replies",
  "review_reports",
  "moderation_actions",
  "favorites",
  "quote_requests",
  "profile_views",
  "conversations",
  "messages",
  "notifications",
  "password_reset_tokens",
  "email_verification_tokens",
  "rate_limits",
  "app_meta",
  "portfolio_likes",
  "sessions",
] as const;

type SqliteRow = Record<string, unknown>;

function sha256(filePath: string): string {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

function assertBackup() {
  if (!existsSync(sourcePath)) throw new Error(`SQLite não encontrado: ${sourcePath}`);
  if (!existsSync(backupPath)) throw new Error(`Backup não encontrado: ${backupPath}`);
  if (statSync(sourcePath).size !== statSync(backupPath).size) {
    throw new Error("O tamanho do backup difere do banco de origem.");
  }
  if (sha256(sourcePath) !== sha256(backupPath)) {
    throw new Error("O hash do backup difere do banco de origem.");
  }
}

function quotedIdentifier(value: string): string {
  if (!/^[a-z_][a-z0-9_]*$/.test(value)) {
    throw new Error(`Identificador SQL inválido: ${value}`);
  }
  return `"${value}"`;
}

async function main() {
  if (!process.env.DATABASE_URL?.trim()) {
    throw new Error("DATABASE_URL do PostgreSQL de destino não foi configurada.");
  }
  assertBackup();

  const sqlite = new DatabaseSync(sourcePath, { readOnly: true });
  try {
    const sourceRows = new Map<string, SqliteRow[]>();
    for (const table of tableOrder) {
      const exists = sqlite
        .prepare(
          "SELECT 1 AS found FROM sqlite_master WHERE type = 'table' AND name = ?",
        )
        .get(table);
      sourceRows.set(
        table,
        exists
          ? (sqlite.prepare(`SELECT * FROM ${quotedIdentifier(table)}`).all() as SqliteRow[])
          : [],
      );
    }

    const usersById = new Map(
      (sourceRows.get("users") ?? []).map((user) => [String(user.id), String(user.email)]),
    );
    sourceRows.set(
      "email_verification_tokens",
      (sourceRows.get("email_verification_tokens") ?? []).map((token) => ({
        ...token,
        email: usersById.get(String(token.user_id)),
      })),
    );

    // Initializes the current schema and migrations without seeding.
    process.env.FESTEJA_SEED = "0";
    await queryRow("SELECT 1 AS ready");

    const existing = await queryRow<{ total: number }>(
      `SELECT SUM(total) AS total FROM (
         SELECT COUNT(*) AS total FROM users
         UNION ALL SELECT COUNT(*) FROM provider_profiles
         UNION ALL SELECT COUNT(*) FROM services
         UNION ALL SELECT COUNT(*) FROM portfolio_posts
         UNION ALL SELECT COUNT(*) FROM contracts
         UNION ALL SELECT COUNT(*) FROM reviews
       ) AS data`,
    );
    if (Number(existing?.total ?? 0) > 0) {
      throw new Error(
        "O PostgreSQL de destino já contém dados. Migração cancelada para evitar sobreposição.",
      );
    }

    await withTransaction(async (query) => {
      for (const table of tableOrder) {
        const records = sourceRows.get(table) ?? [];
        if (records.length === 0) continue;

        const targetColumns = await query<{ column_name: string }>(
          `SELECT column_name
           FROM information_schema.columns
           WHERE table_schema = 'public' AND table_name = ?`,
          [table],
        );
        const allowed = new Set(targetColumns.rows.map((column) => column.column_name));
        const columns = Object.keys(records[0]).filter(
          (column) => allowed.has(column) && records.every((record) => record[column] !== undefined),
        );
        if (columns.length === 0) continue;

        const sql = `INSERT INTO ${quotedIdentifier(table)} (${columns
          .map(quotedIdentifier)
          .join(", ")}) VALUES (${columns.map(() => "?").join(", ")}) ON CONFLICT DO NOTHING`;
        for (const record of records) {
          await query(sql, columns.map((column) => record[column]));
        }
      }
    });

    for (const table of tableOrder) {
      const expected = sourceRows.get(table)?.length ?? 0;
      const result = await queryRow<{ total: number }>(
        `SELECT COUNT(*) AS total FROM ${quotedIdentifier(table)}`,
      );
      const actual = Number(result?.total ?? 0);
      if (actual !== expected) {
        throw new Error(
          `Verificação falhou em ${table}: origem=${expected}, destino=${actual}.`,
        );
      }
      console.log(`${table}: ${actual}`);
    }
    console.log("Migração SQLite -> PostgreSQL concluída e verificada.");
  } finally {
    sqlite.close();
    await closeDb();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

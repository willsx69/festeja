import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { list, put } from "@vercel/blob";
import { closeDb, queryRow, withTransaction } from "@/lib/db";

const uploadsRoot = path.resolve(
  process.env.FESTEJA_UPLOADS_DIR?.trim() || "public/uploads",
);

const contentTypes: Record<string, string> = {
  ".gif": "image/gif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

async function allBlobs() {
  const blobs = new Map<string, string>();
  let cursor: string | undefined;
  do {
    const result = await list({ prefix: "uploads/", cursor });
    for (const blob of result.blobs) blobs.set(blob.pathname, blob.url);
    cursor = result.hasMore ? result.cursor : undefined;
  } while (cursor);
  return blobs;
}

async function main() {
  if (!process.env.DATABASE_URL?.trim()) {
    throw new Error("DATABASE_URL do PostgreSQL não foi configurada.");
  }
  if (!process.env.BLOB_STORE_ID?.trim() && !process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
    throw new Error("Credenciais do Vercel Blob não foram configuradas.");
  }
  if (!existsSync(uploadsRoot)) {
    throw new Error(`Diretório de uploads não encontrado: ${uploadsRoot}`);
  }

  const users = await queryRow<{ total: number }>("SELECT COUNT(*) AS total FROM users");
  if (Number(users?.total ?? 0) === 0) {
    throw new Error("O PostgreSQL está vazio. Migre o SQLite antes dos uploads.");
  }

  const existing = await allBlobs();
  const migrated = new Map<string, string>();

  for (const owner of readdirSync(uploadsRoot, { withFileTypes: true })) {
    if (!owner.isDirectory() || !/^[A-Za-z0-9_-]+$/.test(owner.name)) continue;
    const ownerDir = path.join(uploadsRoot, owner.name);
    for (const file of readdirSync(ownerDir, { withFileTypes: true })) {
      if (!file.isFile() || !/^[A-Za-z0-9][A-Za-z0-9._-]{0,96}$/.test(file.name)) continue;
      const extension = path.extname(file.name).toLowerCase();
      const contentType = contentTypes[extension];
      if (!contentType) continue;

      const pathname = `uploads/${owner.name}/${file.name}`;
      let url = existing.get(pathname);
      if (!url) {
        const blob = await put(pathname, readFileSync(path.join(ownerDir, file.name)), {
          access: "public",
          addRandomSuffix: false,
          contentType,
        });
        url = blob.url;
      }
      migrated.set(`/${pathname}`, url);
    }
  }

  let referencesUpdated = 0;
  await withTransaction(async (query) => {
    for (const [localUrl, blobUrl] of migrated) {
      for (const [table, column] of [
        ["users", "avatar"],
        ["provider_profiles", "image"],
        ["provider_profiles", "cover"],
        ["portfolio_posts", "image"],
      ] as const) {
        const result = await query(
          `UPDATE ${table} SET ${column} = ? WHERE ${column} = ?`,
          [blobUrl, localUrl],
        );
        referencesUpdated += result.rowCount;
      }
    }
  });

  console.log(`Arquivos preservados no Blob: ${migrated.size}`);
  console.log(`Referências atualizadas no PostgreSQL: ${referencesUpdated}`);
  console.log("Os arquivos locais não foram removidos.");
  await closeDb();
}

main().catch(async (error) => {
  console.error(error instanceof Error ? error.message : error);
  await closeDb().catch(() => undefined);
  process.exitCode = 1;
});

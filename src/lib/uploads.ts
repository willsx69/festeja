import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { UserRole } from "@/types";
import {
  MAX_UPLOAD_SIZE,
  MAX_UPLOAD_SIZE_LABEL,
} from "@/lib/upload-policy";

export { MAX_UPLOAD_SIZE, MAX_UPLOAD_SIZE_LABEL };

export function uploadsRoot(): string {
  return process.env.FESTEJA_UPLOADS_DIR
    ? path.resolve(process.env.FESTEJA_UPLOADS_DIR)
    : path.join(process.cwd(), "public", "uploads");
}

function usesBlobStorage(): boolean {
  return Boolean(
    process.env.VERCEL ||
      process.env.BLOB_READ_WRITE_TOKEN ||
      process.env.BLOB_STORE_ID,
  );
}

export async function storeUpload(input: {
  userId: string;
  fileName: string;
  bytes: Uint8Array;
  contentType: SupportedImageType;
}): Promise<string> {
  if (usesBlobStorage()) {
    const { put } = await import("@vercel/blob");
    const blob = await put(
      `uploads/${input.userId}/${input.fileName}`,
      Buffer.from(input.bytes),
      {
        access: "public",
        addRandomSuffix: false,
        contentType: input.contentType,
      },
    );
    return blob.url;
  }

  const userDir = path.join(uploadsRoot(), input.userId);
  mkdirSync(userDir, { recursive: true });
  writeFileSync(path.join(userDir, input.fileName), input.bytes, { flag: "wx" });
  return uploadUrlFor(input.userId, input.fileName);
}

export async function removeUserUploads(userId: string): Promise<void> {
  if (!/^[A-Za-z0-9_-]+$/.test(userId)) return;

  if (usesBlobStorage()) {
    const { del, list } = await import("@vercel/blob");
    let cursor: string | undefined;
    do {
      const result = await list({ prefix: `uploads/${userId}/`, cursor });
      if (result.blobs.length > 0) {
        await del(result.blobs.map((blob) => blob.url));
      }
      cursor = result.hasMore ? result.cursor : undefined;
    } while (cursor);
    return;
  }

  const root = uploadsRoot();
  rmSync(path.join(root, userId), { recursive: true, force: true });
}

export type UploadScope = "avatar" | "provider";

export type SupportedImageType = "image/jpeg" | "image/png" | "image/webp" | "image/gif";

export const IMAGE_EXTENSIONS: Record<SupportedImageType, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function allowedUploadScopes(role: UserRole): UploadScope[] {
  if (role === "cliente") return ["avatar"];
  if (role === "prestador" || role === "admin") return ["avatar", "provider"];
  return [];
}

export function isUploadScope(value: string): value is UploadScope {
  return value === "avatar" || value === "provider";
}

function startsWith(bytes: Uint8Array, signature: number[]): boolean {
  if (bytes.length < signature.length) return false;
  return signature.every((value, index) => bytes[index] === value);
}

function isWebp(bytes: Uint8Array): boolean {
  if (bytes.length < 12) return false;
  const riff = [0x52, 0x49, 0x46, 0x46];
  const webp = [0x57, 0x45, 0x42, 0x50];
  return (
    startsWith(bytes, riff) &&
    bytes[8] === webp[0] &&
    bytes[9] === webp[1] &&
    bytes[10] === webp[2] &&
    bytes[11] === webp[3]
  );
}

export function detectImageType(bytes: Uint8Array): SupportedImageType | undefined {
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return "image/jpeg";
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return "image/png";
  }
  if (startsWith(bytes, [0x47, 0x49, 0x46, 0x38])) return "image/gif";
  if (isWebp(bytes)) return "image/webp";
  return undefined;
}

export function validateUpload(input: {
  declaredType: string;
  size: number;
  bytes: Uint8Array;
  role: UserRole;
  scope: string;
}): { ok: true; mime: SupportedImageType; extension: string; scope: UploadScope } | { ok: false; error: string } {
  const allowed = allowedUploadScopes(input.role);
  if (allowed.length === 0) {
    return { ok: false, error: "Sua conta não pode enviar imagens." };
  }
  if (!isUploadScope(input.scope) || !allowed.includes(input.scope)) {
    return { ok: false, error: "Tipo de envio não permitido para a sua conta." };
  }
  if (input.size <= 0) {
    return { ok: false, error: "O arquivo está vazio." };
  }
  if (input.size > MAX_UPLOAD_SIZE) {
    return {
      ok: false,
      error: `Imagem muito grande (máximo ${MAX_UPLOAD_SIZE_LABEL}).`,
    };
  }

  const detected = detectImageType(input.bytes);
  if (!detected) {
    return { ok: false, error: "O arquivo não é uma imagem JPEG, PNG, WebP ou GIF válida." };
  }
  if (input.declaredType && input.declaredType !== detected) {
    return { ok: false, error: "O tipo declarado não corresponde ao conteúdo do arquivo." };
  }

  return {
    ok: true,
    mime: detected,
    extension: IMAGE_EXTENSIONS[detected],
    scope: input.scope,
  };
}

export function isOwnedUploadPath(url: string, userId: string): boolean {
  const localMatch = /^\/uploads\/([A-Za-z0-9_-]+)\/([A-Za-z0-9][A-Za-z0-9._-]{0,96})$/.exec(url);
  if (localMatch) {
    const [, owner, fileName] = localMatch;
    return owner === userId && !fileName.includes("..");
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }
  if (
    parsed.protocol !== "https:" ||
    !parsed.hostname.endsWith(".public.blob.vercel-storage.com") ||
    parsed.search ||
    parsed.hash
  ) {
    return false;
  }

  const match = /^\/uploads\/([A-Za-z0-9_-]+)\/([A-Za-z0-9][A-Za-z0-9._-]{0,96})$/.exec(
    parsed.pathname,
  );
  if (!match) return false;
  const [, owner, fileName] = match;
  return owner === userId && !fileName.includes("..");
}

export function uploadUrlFor(userId: string, fileName: string): string {
  return `/uploads/${userId}/${fileName}`;
}

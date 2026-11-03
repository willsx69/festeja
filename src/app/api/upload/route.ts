import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getCurrentUserAllowedByEmailPolicy } from "@/lib/auth";
import { enforceRateLimit, retryMessage } from "@/lib/rate-limit";
import {
  MAX_UPLOAD_SIZE,
  MAX_UPLOAD_SIZE_LABEL,
  storeUpload,
  validateUpload,
} from "@/lib/uploads";

const MAX_REQUEST_SIZE = MAX_UPLOAD_SIZE + 256 * 1024;

export async function POST(request: Request) {
  const user = await getCurrentUserAllowedByEmailPolicy();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const limit = await enforceRateLimit("upload", user.id, 40, 60 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: retryMessage(limit.retryAfterSeconds) },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_SIZE) {
    return NextResponse.json(
      { error: `Imagem muito grande (máximo ${MAX_UPLOAD_SIZE_LABEL}).` },
      { status: 413 },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Envio de arquivo inválido." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Envie um arquivo de imagem." }, { status: 400 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const validation = validateUpload({
    declaredType: file.type,
    size: file.size,
    bytes,
    role: user.role,
    scope: String(form.get("scope") ?? "provider"),
  });

  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const fileName = `${randomUUID()}.${validation.extension}`;
  let url: string;
  try {
    url = await storeUpload({
      userId: user.id,
      fileName,
      bytes,
      contentType: validation.mime,
    });
  } catch {
    console.error("[uploads] Não foi possível armazenar a imagem.");
    return NextResponse.json(
      { error: "Não foi possível salvar a imagem agora." },
      { status: 503 },
    );
  }

  return NextResponse.json({
    url,
    scope: validation.scope,
  });
}


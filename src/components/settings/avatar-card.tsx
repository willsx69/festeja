"use client";

import { useState, useTransition } from "react";
import { CircleAlert, Trash2, Upload } from "lucide-react";
import { removeAvatarAction, updateAvatarAction } from "@/actions/account";
import { ProviderAvatar } from "@/components/provider/provider-avatar";
import { Button } from "@/components/ui/button";

type AvatarCardProps = {
  currentAvatar: string | null;
  userName: string;
};

export function AvatarCard({ currentAvatar, userName }: AvatarCardProps) {
  const [avatar, setAvatar] = useState(currentAvatar);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [, startTransition] = useTransition();

  async function handleUpload(file: File) {
    setBusy(true);
    setError("");
    const body = new FormData();
    body.set("file", file);
    body.set("scope", "avatar");
    try {
      const response = await fetch("/api/upload", { method: "POST", body });
      const data = (await response.json()) as { url?: string; error?: string };
      if (response.ok && data.url) {
        const ok = await updateAvatarAction(data.url);
        if (ok) setAvatar(data.url);
        else setError("Não foi possível salvar a imagem.");
      } else {
        setError(data.error ?? "Não foi possível enviar a imagem.");
      }
    } catch {
      setError("Falha na conexão ao enviar a imagem.");
    } finally {
      setBusy(false);
    }
  }

  function handleRemove() {
    startTransition(() => {
      void removeAvatarAction().then(() => setAvatar(null));
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatar}
            alt={`Foto de ${userName}`}
            className="size-20 shrink-0 rounded-2xl border border-line object-cover"
          />
        ) : (
          <ProviderAvatar name={userName} size="xl" className="size-20 text-xl" />
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{userName}</p>
          <p className="mt-0.5 text-xs text-ink-faint">
            JPEG, PNG, WebP ou GIF, até 4MB.
          </p>
        </div>
      </div>

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        disabled={busy}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleUpload(file);
        }}
        className="block w-full text-sm text-ink-soft file:mr-3 file:rounded-lg file:border-0 file:bg-brand-soft file:px-3.5 file:py-2 file:text-sm file:font-medium file:text-brand"
      />

      {busy ? <p className="text-xs text-ink-faint">Enviando imagem…</p> : null}

      {error ? (
        <p className="flex items-center gap-1.5 text-xs font-medium text-danger">
          <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}

      {avatar ? (
        <Button type="button" variant="ghost" size="sm" onClick={handleRemove} disabled={busy}>
          <Trash2 className="size-4" aria-hidden="true" />
          Remover foto
        </Button>
      ) : null}

      {!avatar ? (
        <p className="flex items-center gap-1.5 text-xs text-ink-faint">
          <Upload className="size-3.5" aria-hidden="true" />
          Sem foto, mostramos suas iniciais.
        </p>
      ) : null}
    </div>
  );
}

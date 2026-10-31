"use client";

import { useId, useState } from "react";
import { CircleAlert } from "lucide-react";

type ImageUploadFieldProps = {
  name: string;
  label: string;
  hint?: string;
  scope?: "provider";
};

export function ImageUploadField({
  name,
  label,
  hint,
  scope = "provider",
}: ImageUploadFieldProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const id = useId();
  const hintId = `${id}-hint`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink">{label}</label>
      {hint ? <p id={hintId} className="mt-0.5 text-xs text-ink-faint">{hint}</p> : null}
      <input type="hidden" name={name} value={url} />
      <input
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        disabled={busy}
        aria-describedby={hint ? hintId : undefined}
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) return;

          setBusy(true);
          setError("");
          const body = new FormData();
          body.set("file", file);
          body.set("scope", scope);
          try {
            const response = await fetch("/api/upload", { method: "POST", body });
            const data = (await response.json()) as { url?: string; error?: string };
            if (response.ok && data.url) setUrl(data.url);
            else setError(data.error ?? "Não foi possível enviar a imagem.");
          } catch {
            setError("Falha na conexão ao enviar a imagem.");
          } finally {
            setBusy(false);
          }
        }}
        className="mt-1.5 block w-full text-sm text-ink-soft file:mr-3 file:rounded-lg file:border-0 file:bg-brand-soft file:px-3.5 file:py-2 file:text-sm file:font-medium file:text-brand"
      />
      {busy ? <p role="status" className="mt-1.5 text-xs text-ink-faint">Enviando imagem…</p> : null}
      {error ? (
        <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-danger">
          <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="Pré-visualização" className="mt-2 h-24 rounded-xl border border-line object-cover" />
      ) : null}
    </div>
  );
}

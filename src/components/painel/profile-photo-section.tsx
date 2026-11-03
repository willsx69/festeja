"use client";

import {
  CheckCircle2,
  CircleAlert,
  ExternalLink,
  Info,
  LayoutGrid,
  Loader2,
  MessageSquare,
  PanelTop,
  Save,
  Search,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { ProviderAvatar } from "@/components/provider/provider-avatar";
import { ProviderMedia } from "@/components/provider/provider-media";
import {
  PROFILE_PHOTO_CONFIG,
  PROFILE_PHOTO_MAX_SIZE_LABEL,
  type ProfilePhotoKind,
} from "@/components/painel/profile-photo-types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CategoryId, Tone } from "@/types";

const whereIcons = {
  Search,
  LayoutGrid,
  MessageSquare,
  Star,
  PanelTop,
} as const;

export type PhotoFeedback = {
  tone: "success" | "error";
  message: string;
};

export type PhotoActivity = "saving" | "removing" | null;

export type ProfilePhotoSectionProps = {
  kind: ProfilePhotoKind;
  step: 1 | 2;
  name: string;
  categoryId: CategoryId;
  categoryTone: Tone;
  savedImage: string | null;
  pendingImage: string | null;
  locked: boolean;
  activity: PhotoActivity;
  confirmingRemove: boolean;
  feedback: PhotoFeedback | null;
  onSelect: () => void;
  onSave: () => void;
  onDiscard: () => void;
  onRequestRemove: () => void;
  onConfirmRemove: () => void;
  onCancelRemove: () => void;
};

export function ProfilePhotoSection({
  kind,
  step,
  name,
  categoryId,
  categoryTone,
  savedImage,
  pendingImage,
  locked,
  activity,
  confirmingRemove,
  feedback,
  onSelect,
  onSave,
  onDiscard,
  onRequestRemove,
  onConfirmRemove,
  onCancelRemove,
}: ProfilePhotoSectionProps) {
  const config = PROFILE_PHOTO_CONFIG[kind];
  const titleId = `photo-${kind}-title`;
  const shown = pendingImage ?? savedImage;
  const hasPending = Boolean(pendingImage);
  const saving = activity === "saving";
  const removing = activity === "removing";

  return (
    <section
      aria-labelledby={titleId}
      data-photo-kind={kind}
      aria-busy={Boolean(activity)}
      className="flex flex-col rounded-[1.75rem] border border-line bg-surface p-5 shadow-card sm:p-6"
    >
      <header>
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.08em] text-brand">
          Etapa {step} de 2
        </p>
        <h3
          id={titleId}
          className="mt-1 text-lg font-extrabold tracking-[-0.03em] text-ink"
        >
          {config.stepTitle}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{config.intro}</p>
      </header>

      <ul aria-label="Onde esta foto aparece" className="mt-4 flex flex-wrap gap-1.5">
        {config.where.map((item) => {
          const Icon = whereIcons[item.icon];
          return (
            <li key={item.label}>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-2.5 py-1 text-[0.7rem] font-semibold text-ink-soft">
                <Icon className="size-3.5 text-brand" aria-hidden="true" />
                {item.label}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="mt-5 flex flex-1 flex-col items-center rounded-2xl border border-line bg-surface-muted/35 p-4">
        {kind === "avatar" ? (
          <ProviderAvatar
            name={name}
            image={shown}
            size="xl"
            className="size-32 text-3xl ring-4 ring-surface sm:size-36"
          />
        ) : (
          <ProviderMedia
            categoryId={categoryId}
            tone={categoryTone}
            image={shown ?? undefined}
            alt={`Capa de ${name}`}
            sizes="(max-width: 1024px) 100vw, 36vw"
            className="aspect-[16/5] w-full rounded-xl border border-line"
          />
        )}

        <p className="mt-3 text-center text-xs text-ink-faint">
          {hasPending ? (
            <span className="inline-flex items-center rounded-full bg-yellow-soft px-2.5 py-1 font-semibold text-ink">
              Nova foto: ainda não salva
            </span>
          ) : shown ? (
            "Foto atual do seu perfil"
          ) : (
            "Nenhuma foto enviada. Mostramos a imagem padrão da sua categoria."
          )}
        </p>
      </div>

      <p className="mt-4 flex gap-1.5 text-xs leading-relaxed text-ink-soft">
        <Info className="mt-0.5 size-3.5 shrink-0 text-brand" aria-hidden="true" />
        <span>
          <strong className="font-semibold text-ink">Dica:</strong> {config.tip}
        </span>
      </p>
      <p className="mt-2 text-[0.7rem] text-ink-faint">
        JPG, PNG ou WebP, até {PROFILE_PHOTO_MAX_SIZE_LABEL}. {config.recommendation}.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {hasPending ? (
          <>
            <Button type="button" onClick={onSave} disabled={locked} aria-label={`Salvar ${config.cardTitle.toLowerCase()}`}>
              {saving ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Save className="size-4" aria-hidden="true" />
              )}
              {saving ? "Salvando..." : "Salvar foto"}
            </Button>
            <Button type="button" variant="ghost" onClick={onDiscard} disabled={locked}>
              <X className="size-4" aria-hidden="true" />
              Descartar
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={onSelect}
              disabled={locked}
              aria-label={savedImage ? config.replaceLabel : config.sendLabel}
            >
              <Upload className="size-4" aria-hidden="true" />
              {savedImage ? "Substituir foto" : "Enviar foto"}
            </Button>
            {savedImage ? (
              <>
                <a
                  href={savedImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-sm font-medium text-brand transition-colors hover:bg-brand-soft hover:text-brand-strong"
                >
                  <ExternalLink className="size-4" aria-hidden="true" />
                  Ver original
                </a>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onRequestRemove}
                  disabled={locked || confirmingRemove}
                  aria-label={config.removeLabel}
                  className="text-ink-faint hover:bg-danger-soft hover:text-danger"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                  Remover
                </Button>
              </>
            ) : null}
          </>
        )}
      </div>

      {confirmingRemove ? (
        <div className="mt-3 rounded-xl border border-danger/20 bg-danger-soft p-3">
          <p className="text-xs font-semibold text-danger">Remover esta foto?</p>
          <p className="mt-0.5 text-[0.7rem] leading-relaxed text-danger/80">
            {config.confirmRemoveText}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onConfirmRemove}
              disabled={locked}
              className="text-danger hover:bg-danger/10"
            >
              {removing ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Trash2 className="size-4" aria-hidden="true" />
              )}
              {removing ? "Removendo..." : "Sim, remover"}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={onCancelRemove} disabled={locked}>
              Cancelar
            </Button>
          </div>
        </div>
      ) : null}

      {feedback ? (
        <p
          role={feedback.tone === "error" ? "alert" : "status"}
          className={cn(
            "mt-3 flex items-center gap-1.5 text-xs font-medium",
            feedback.tone === "error" ? "text-danger" : "text-brand",
          )}
        >
          {feedback.tone === "error" ? (
            <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
          ) : (
            <CheckCircle2 className="size-3.5 shrink-0" aria-hidden="true" />
          )}
          {feedback.message}
        </p>
      ) : null}
    </section>
  );
}

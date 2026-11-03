"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Camera } from "lucide-react";
import { removeAvatarAction, updateAvatarAction } from "@/actions/account";
import { updateCoverAction } from "@/actions/profile";
import { ProfilePhotoCropDialog } from "@/components/painel/profile-photo-crop-dialog";
import {
  ProfilePhotoSection,
  type PhotoActivity,
  type PhotoFeedback,
} from "@/components/painel/profile-photo-section";
import {
  PROFILE_PHOTO_ACCEPT,
  PROFILE_PHOTO_CONFIG,
  PROFILE_PHOTO_MAX_SIZE_LABEL,
  validateProfilePhotoFile,
  type CropRequest,
  type ProfilePhotoKind,
} from "@/components/painel/profile-photo-types";
import { ProviderAvatar } from "@/components/provider/provider-avatar";
import { ProviderMedia } from "@/components/provider/provider-media";
import { Badge } from "@/components/ui/badge";
import { getCategory } from "@/data/categories";
import type { CategoryId } from "@/types";

type ProfilePhotoManagerProps = {
  name: string;
  username: string;
  categoryId: CategoryId;
  city: string;
  state: string;
  neighborhood: string;
  initialAvatar: string | null;
  initialCover: string | null;
};

type PendingPhoto = {
  blob: Blob;
  url: string;
};

type PendingPhotos = Record<ProfilePhotoKind, PendingPhoto | null>;

type FeedbackState = PhotoFeedback & { kind: ProfilePhotoKind };

export function ProfilePhotoManager({
  name,
  username,
  categoryId,
  city,
  state,
  neighborhood,
  initialAvatar,
  initialCover,
}: ProfilePhotoManagerProps) {
  const [avatar, setAvatar] = useState(initialAvatar);
  const [cover, setCover] = useState(initialCover);
  // Fotos escolhidas e recortadas, ainda não enviadas. Só viram "salvas" após o upload e a gravação.
  const [pending, setPending] = useState<PendingPhotos>({ avatar: null, cover: null });
  const [cropRequest, setCropRequest] = useState<CropRequest | null>(null);
  const [activity, setActivity] = useState<{
    kind: ProfilePhotoKind;
    action: Exclude<PhotoActivity, null>;
  } | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [confirmingRemove, setConfirmingRemove] = useState<ProfilePhotoKind | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const category = getCategory(categoryId);
  const location = neighborhood
    ? `${neighborhood}, ${city} • ${state}`
    : `${city} • ${state}`;
  const busy = activity !== null;
  const hasChanges = Boolean(pending.avatar || pending.cover);

  // Libera as URLs temporárias quando são substituídas, descartadas ou ao desmontar.
  useEffect(() => {
    const url = pending.avatar?.url;
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [pending.avatar]);

  useEffect(() => {
    const url = pending.cover?.url;
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [pending.cover]);

  useEffect(() => {
    const src = cropRequest?.src;
    return () => {
      if (src) URL.revokeObjectURL(src);
    };
  }, [cropRequest]);

  function openFilePicker(kind: ProfilePhotoKind) {
    setFeedback((current) => (current?.kind === kind ? null : current));
    setConfirmingRemove(null);
    if (kind === "avatar") avatarInputRef.current?.click();
    else coverInputRef.current?.click();
  }

  function handleFile(kind: ProfilePhotoKind, file: File) {
    const error = validateProfilePhotoFile(file);
    if (error) {
      setFeedback({ kind, tone: "error", message: error });
      return;
    }

    setFeedback(null);
    setCropRequest({
      kind,
      file,
      src: URL.createObjectURL(file),
    });
  }

  function handleCropConfirm(blob: Blob) {
    if (!cropRequest) return;
    const { kind } = cropRequest;
    const url = URL.createObjectURL(blob);

    setPending((current) => ({ ...current, [kind]: { blob, url } }));
    setFeedback(null);
    setCropRequest(null);
  }

  function discardPending(kind: ProfilePhotoKind) {
    setPending((current) => ({ ...current, [kind]: null }));
    setFeedback(null);
  }

  async function handleSave(kind: ProfilePhotoKind) {
    const photo = pending[kind];
    if (!photo || busy) return;

    const config = PROFILE_PHOTO_CONFIG[kind];
    setActivity({ kind, action: "saving" });
    setFeedback(null);

    try {
      const file = new File([photo.blob], `${kind}-${Date.now()}.${config.outputExtension}`, {
        type: config.outputType,
      });
      const body = new FormData();
      body.set("file", file);
      body.set("scope", config.scope);

      const response = await fetch("/api/upload", { method: "POST", body });
      const data = (await response.json().catch(() => null)) as
        | { url?: string; error?: string }
        | null;
      if (!response.ok || !data?.url) {
        throw new Error(data?.error ?? "Não foi possível enviar a imagem. Tente novamente.");
      }

      const saved =
        kind === "avatar"
          ? await updateAvatarAction(data.url)
          : await updateCoverAction(data.url);
      if (!saved) {
        throw new Error("Não foi possível salvar a imagem no seu perfil.");
      }

      if (kind === "avatar") setAvatar(data.url);
      else setCover(data.url);
      setPending((current) => ({ ...current, [kind]: null }));
      setFeedback({ kind, tone: "success", message: config.savedMessage });
    } catch (error) {
      setFeedback({
        kind,
        tone: "error",
        message:
          error instanceof Error ? error.message : "Não foi possível salvar a imagem.",
      });
    } finally {
      setActivity(null);
    }
  }

  async function handleRemove(kind: ProfilePhotoKind) {
    const config = PROFILE_PHOTO_CONFIG[kind];
    setActivity({ kind, action: "removing" });
    setFeedback(null);

    try {
      if (kind === "avatar") {
        await removeAvatarAction();
        setAvatar(null);
      } else {
        const saved = await updateCoverAction(null);
        if (!saved) throw new Error("Não foi possível remover a foto de capa.");
        setCover(null);
      }

      setConfirmingRemove(null);
      setFeedback({ kind, tone: "success", message: config.removedMessage });
    } catch (error) {
      setFeedback({
        kind,
        tone: "error",
        message:
          error instanceof Error ? error.message : "Não foi possível remover a foto.",
      });
    } finally {
      setActivity(null);
    }
  }

  const previewAvatar = pending.avatar?.url ?? avatar;
  const previewCover = pending.cover?.url ?? cover;

  function feedbackFor(kind: ProfilePhotoKind): PhotoFeedback | null {
    return feedback?.kind === kind
      ? { tone: feedback.tone, message: feedback.message }
      : null;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-[1.75rem] border border-line bg-surface p-5 shadow-card sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand">
            <Camera className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-xl font-extrabold tracking-[-0.035em] text-ink">
              Fotos do seu perfil
            </h2>
            <p className="mt-1 max-w-[62ch] text-sm leading-relaxed text-ink-soft">
              São duas imagens com funções diferentes. A foto de perfil identifica você e a
              foto de capa destaca o seu trabalho. Escolha, ajuste e salve cada uma.
            </p>
          </div>
        </div>
        <Badge tone="brand" className="w-fit shrink-0">
          JPG, PNG ou WebP • até {PROFILE_PHOTO_MAX_SIZE_LABEL}
        </Badge>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ProfilePhotoSection
          kind="avatar"
          step={1}
          name={name}
          categoryId={categoryId}
          categoryTone={category.tone}
          savedImage={avatar}
          pendingImage={pending.avatar?.url ?? null}
          locked={busy}
          activity={activity?.kind === "avatar" ? activity.action : null}
          confirmingRemove={confirmingRemove === "avatar"}
          feedback={feedbackFor("avatar")}
          onSelect={() => openFilePicker("avatar")}
          onSave={() => void handleSave("avatar")}
          onDiscard={() => discardPending("avatar")}
          onRequestRemove={() => setConfirmingRemove("avatar")}
          onConfirmRemove={() => void handleRemove("avatar")}
          onCancelRemove={() => setConfirmingRemove(null)}
        />

        <ProfilePhotoSection
          kind="cover"
          step={2}
          name={name}
          categoryId={categoryId}
          categoryTone={category.tone}
          savedImage={cover}
          pendingImage={pending.cover?.url ?? null}
          locked={busy}
          activity={activity?.kind === "cover" ? activity.action : null}
          confirmingRemove={confirmingRemove === "cover"}
          feedback={feedbackFor("cover")}
          onSelect={() => openFilePicker("cover")}
          onSave={() => void handleSave("cover")}
          onDiscard={() => discardPending("cover")}
          onRequestRemove={() => setConfirmingRemove("cover")}
          onConfirmRemove={() => void handleRemove("cover")}
          onCancelRemove={() => setConfirmingRemove(null)}
        />
      </div>

      <section
        aria-labelledby="profile-photo-preview-title"
        className="rounded-[1.75rem] border border-line bg-surface p-5 shadow-card sm:p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3
              id="profile-photo-preview-title"
              className="text-sm font-extrabold uppercase tracking-[0.04em] text-ink"
            >
              Veja como seu perfil ficará
            </h3>
            <p className="mt-0.5 text-xs text-ink-faint">
              Prévia do topo do seu perfil público. Ela mostra as fotos escolhidas antes de salvar.
            </p>
          </div>
          <Badge
            tone="neutral"
            className={hasChanges ? "bg-yellow-soft" : "bg-canvas"}
          >
            {hasChanges ? "Alterações não salvas" : "Prévia ao vivo"}
          </Badge>
        </div>

        <div
          data-testid="profile-photo-preview"
          className="mt-4 overflow-hidden rounded-[1.25rem] border border-line bg-canvas"
        >
          <ProviderMedia
            categoryId={categoryId}
            tone={category.tone}
            image={previewCover ?? undefined}
            alt={`Capa de ${name}`}
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="h-32 sm:h-44"
          />
          <div className="relative px-4 pb-4">
            <div className="-mt-9 flex items-end gap-3">
              <ProviderAvatar
                name={name}
                image={previewAvatar}
                size="xl"
                className="size-16 text-lg ring-4 ring-surface sm:size-20 sm:text-xl"
              />
              <div className="min-w-0 pb-1">
                <p className="truncate text-base font-extrabold tracking-[-0.02em] text-ink sm:text-lg">
                  {name}
                </p>
                <p className="truncate text-xs text-ink-soft">
                  {category.name} • {location}
                </p>
              </div>
            </div>
            <p className="mt-2 text-[0.7rem] text-ink-faint">
              Os clientes encontram seu perfil em{" "}
              <Link
                href={`/prestador/${username}`}
                className="font-medium text-brand transition-colors hover:text-brand-strong"
              >
                festeja.com.br/prestador/{username}
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <input
        ref={avatarInputRef}
        type="file"
        accept={PROFILE_PHOTO_ACCEPT}
        tabIndex={-1}
        aria-label="Selecionar foto de perfil"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) handleFile("avatar", file);
        }}
      />
      <input
        ref={coverInputRef}
        type="file"
        accept={PROFILE_PHOTO_ACCEPT}
        tabIndex={-1}
        aria-label="Selecionar foto de capa"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) handleFile("cover", file);
        }}
      />

      <ProfilePhotoCropDialog
        request={cropRequest}
        uploading={busy}
        error=""
        onClose={() => setCropRequest(null)}
        onConfirm={handleCropConfirm}
      />
    </div>
  );
}

"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import NextImage from "next/image";
import { CircleAlert, Loader2, RotateCcw } from "lucide-react";
import {
  PROFILE_PHOTO_CONFIG,
  type CropRequest,
} from "@/components/painel/profile-photo-types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  clampOffset,
  cropRect,
  displayedImageSize,
  outputSizeForFrame,
  type CropOffset,
  type CropSize,
} from "@/lib/image-crop";
import { cn } from "@/lib/utils";

type ProfilePhotoCropDialogProps = {
  request: CropRequest | null;
  uploading: boolean;
  error: string;
  onClose: () => void;
  onConfirm: (blob: Blob) => void;
};

type CropEditorProps = {
  request: CropRequest;
  uploading: boolean;
  error: string;
  onClose: () => void;
  onConfirm: (blob: Blob) => void;
  onPreparingChange: (value: boolean) => void;
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Não foi possível abrir esta imagem."));
    image.src = src;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

async function renderCrop(
  request: CropRequest,
  imageSize: CropSize,
  frame: CropSize,
  zoom: number,
  offset: CropOffset,
): Promise<Blob> {
  const config = PROFILE_PHOTO_CONFIG[request.kind];
  const image = await loadImage(request.src);
  const rect = cropRect(imageSize, frame, zoom, offset);
  const output = outputSizeForFrame(frame, config.outputWidth);

  if (output.width <= 0 || output.height <= 0) {
    throw new Error("Não foi possível preparar o recorte.");
  }

  const canvas = document.createElement("canvas");
  canvas.width = output.width;
  canvas.height = output.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Seu navegador não conseguiu processar a imagem.");

  const scale = output.width / frame.width;
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.fillStyle = "#fbfaff";
  context.fillRect(0, 0, output.width, output.height);
  context.drawImage(
    image,
    rect.left * scale,
    rect.top * scale,
    rect.width * scale,
    rect.height * scale,
  );

  const blob = await canvasToBlob(canvas, config.outputType, config.outputQuality);
  if (!blob) throw new Error("Não foi possível gerar a imagem recortada.");
  return blob;
}

function CropEditor({
  request,
  uploading,
  error,
  onClose,
  onConfirm,
  onPreparingChange,
}: CropEditorProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<{
    x: number;
    y: number;
    offset: CropOffset;
  } | null>(null);

  const [imageSize, setImageSize] = useState<CropSize | null>(null);
  const [frameSize, setFrameSize] = useState<CropSize>({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [offset, setOffset] = useState<CropOffset>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState("");
  const [preparing, setPreparing] = useState(false);

  const config = PROFILE_PHOTO_CONFIG[request.kind];
  const safeOffset = imageSize
    ? clampOffset(imageSize, frameSize, zoom, offset)
    : offset;
  const displayed = imageSize
    ? displayedImageSize(imageSize, frameSize, zoom)
    : { width: 0, height: 0 };
  const ready = Boolean(imageSize) && frameSize.width > 0;
  const message = localError || error;

  useEffect(() => {
    let cancelled = false;
    const image = new Image();
    image.onload = () => {
      if (cancelled) return;
      setImageSize({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = () => {
      if (cancelled) return;
      setLocalError("Não foi possível abrir esta imagem. Tente outro arquivo.");
    };
    image.src = request.src;

    return () => {
      cancelled = true;
      image.onload = null;
      image.onerror = null;
    };
  }, [request.src]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setFrameSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  function close() {
    if (uploading || preparing) return;
    onClose();
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!ready || uploading) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = {
      x: event.clientX,
      y: event.clientY,
      offset: safeOffset,
    };
    setDragging(true);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragging || !dragStart.current || !imageSize) return;
    const next = clampOffset(imageSize, frameSize, zoom, {
      x: dragStart.current.offset.x + event.clientX - dragStart.current.x,
      y: dragStart.current.offset.y + event.clientY - dragStart.current.y,
    });
    setOffset(next);
  }

  function finishDrag(event: PointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragStart.current = null;
    setDragging(false);
  }

  function handleZoomChange(value: number) {
    const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
    setZoom(nextZoom);
    if (imageSize) {
      setOffset((current) => clampOffset(imageSize, frameSize, nextZoom, current));
    }
  }

  function resetPosition() {
    setZoom(MIN_ZOOM);
    setOffset({ x: 0, y: 0 });
  }

  async function handleConfirm() {
    if (!ready || !imageSize || uploading || preparing) return;

    setPreparing(true);
    onPreparingChange(true);
    setLocalError("");
    try {
      const blob = await renderCrop(request, imageSize, frameSize, zoom, safeOffset);
      onConfirm(blob);
    } catch (cropError) {
      setLocalError(
        cropError instanceof Error
          ? cropError.message
          : "Não foi possível preparar a imagem.",
      );
    } finally {
      setPreparing(false);
      onPreparingChange(false);
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{config.dialogTitle}</DialogTitle>
        <DialogDescription>{config.dialogDescription}</DialogDescription>
      </DialogHeader>

      <div>
        <div
          ref={frameRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
          className={cn(
            "relative mx-auto w-full touch-none select-none overflow-hidden rounded-2xl border border-white/10 bg-ink",
            ready && !uploading && "cursor-grab",
            dragging && "cursor-grabbing",
          )}
          style={{ aspectRatio: config.aspectRatio }}
        >
          {ready ? (
            <NextImage
              src={request.src}
              alt=""
              width={Math.max(1, Math.round(displayed.width))}
              height={Math.max(1, Math.round(displayed.height))}
              unoptimized
              draggable={false}
              className="pointer-events-none absolute max-w-none select-none"
              style={{
                width: displayed.width,
                height: displayed.height,
                left:
                  frameSize.width / 2 +
                  safeOffset.x -
                  displayed.width / 2,
                top:
                  frameSize.height / 2 +
                  safeOffset.y -
                  displayed.height / 2,
              }}
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-white/70">
              <Loader2 className="size-7 animate-spin" aria-hidden="true" />
              <span className="sr-only">Carregando imagem</span>
            </div>
          )}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-1/3 h-px bg-white/20"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-2/3 h-px bg-white/20"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-1/3 w-px bg-white/20"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-2/3 w-px bg-white/20"
          />
          {request.kind === "avatar" ? (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-white/55"
            />
          ) : null}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/25"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label
            htmlFor="profile-photo-zoom"
            className="text-sm font-medium text-ink"
          >
            Zoom
          </label>
          <input
            id="profile-photo-zoom"
            type="range"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={0.01}
            value={zoom}
            disabled={!ready || uploading}
            onChange={(event) => handleZoomChange(Number(event.target.value))}
            className="min-w-32 flex-1 accent-brand"
          />
          <span className="w-12 text-right text-xs font-medium tabular-nums text-ink-faint">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={resetPosition}
            disabled={!ready || uploading}
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Centralizar
          </Button>
        </div>

        <p className="mt-2 text-xs text-ink-faint">
          Arraste a imagem dentro da área para ajustar o enquadramento.{" "}
          {config.recommendation}.
        </p>
      </div>

      {message ? (
        <p
          role="alert"
          className="flex items-center gap-1.5 rounded-xl border border-danger/20 bg-danger-soft px-3 py-2 text-xs font-medium text-danger"
        >
          <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
          {message}
        </p>
      ) : null}

      <DialogFooter>
        <Button
          type="button"
          variant="secondary"
          onClick={close}
          disabled={uploading || preparing}
        >
          Cancelar
        </Button>
        <Button
          type="button"
          onClick={() => void handleConfirm()}
          disabled={!ready || uploading || preparing}
        >
          {uploading || preparing ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Enviando...
            </>
          ) : (
            "Usar como prévia"
          )}
        </Button>
      </DialogFooter>
    </>
  );
}

export function ProfilePhotoCropDialog({
  request,
  uploading,
  error,
  onClose,
  onConfirm,
}: ProfilePhotoCropDialogProps) {
  const [preparing, setPreparing] = useState(false);
  const busy = uploading || preparing;

  function handleOpenChange(open: boolean) {
    if (!open && !busy) onClose();
  }

  return (
    <Dialog open={Boolean(request)} onOpenChange={handleOpenChange}>
      {request ? (
        <DialogContent showClose={!busy}>
          <CropEditor
            key={request.src}
            request={request}
            uploading={uploading}
            error={error}
            onClose={onClose}
            onConfirm={onConfirm}
            onPreparingChange={setPreparing}
          />
        </DialogContent>
      ) : null}
    </Dialog>
  );
}

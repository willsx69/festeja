"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { CategoryIcon } from "@/components/category/category-icon";
import { cn } from "@/lib/utils";
import type { CategoryId, PortfolioItem } from "@/types";

type PortfolioLightboxProps = {
  items: PortfolioItem[];
  categoryId: CategoryId;
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export function PortfolioLightbox({
  items,
  categoryId,
  index,
  onClose,
  onNavigate,
}: PortfolioLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const open = index !== null;

  const close = useCallback(() => onClose(), [onClose]);
  const next = useCallback(
    () => onNavigate(index === null ? 0 : (index + 1) % items.length),
    [index, items.length, onNavigate],
  );
  const prev = useCallback(
    () => onNavigate(index === null ? 0 : (index - 1 + items.length) % items.length),
    [index, items.length, onNavigate],
  );

  useEffect(() => {
    if (!open) return;

    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") prev();
      if (event.key !== "Tab") return;

      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        "button:not([disabled])",
      );
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previousFocus?.focus();
    };
  }, [open, close, next, prev]);

  if (index === null) return null;
  const item = items[index];
  if (!item) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="portfolio-lightbox-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/92 p-4 backdrop-blur-md sm:p-6"
      onClick={close}
    >
      <button
        ref={closeButtonRef}
        type="button"
        aria-label="Fechar imagem"
        className="absolute right-4 top-4 z-10 inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30 sm:right-6 sm:top-6"
        onClick={close}
      >
        <X className="size-5" aria-hidden="true" />
      </button>

      {items.length > 1 ? (
        <>
          <button
            type="button"
            aria-label="Imagem anterior"
            className="absolute left-2 z-10 inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30 sm:left-6"
            onClick={(event) => {
              event.stopPropagation();
              prev();
            }}
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            aria-label="Próxima imagem"
            className="absolute right-2 z-10 inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30 sm:right-6"
            onClick={(event) => {
              event.stopPropagation();
              next();
            }}
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </>
      ) : null}

      <figure
        className="relative w-full max-w-5xl overflow-hidden rounded-[1.5rem] bg-surface shadow-[0_40px_120px_-30px_rgb(0_0_0_/_0.7)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative aspect-[4/3] w-full bg-brand-soft sm:aspect-[16/10]">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-contain"
            />
          ) : (
            <div className="relative flex size-full items-center justify-center overflow-hidden bg-[linear-gradient(120deg,#f0e8ff,#fdfbff_55%,#fff0f6)]">
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-50 [background-image:radial-gradient(circle,rgba(109,61,245,0.16)_1px,transparent_1px)] [background-size:24px_24px]"
              />
              <CategoryIcon
                categoryId={categoryId}
                className="relative size-28 text-brand/25 sm:size-40"
              />
            </div>
          )}
        </div>

        <figcaption className="flex flex-col gap-3 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
          <div className="min-w-0">
            <p id="portfolio-lightbox-title" className="text-base font-bold text-ink sm:text-lg">
              {item.title}
            </p>
            <p className="mt-1 text-sm text-ink-faint">{item.meta}</p>
          </div>
          <p
            aria-live="polite"
            className="shrink-0 rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold tabular-nums text-ink-soft"
          >
            {index + 1} de {items.length}
          </p>
        </figcaption>
      </figure>
    </div>
  );
}

type PortfolioGridProps = {
  items: PortfolioItem[];
  categoryId: CategoryId;
  onOpen: (index: number) => void;
};

export function PortfolioGrid({ items, categoryId, onOpen }: PortfolioGridProps) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map((item, index) => {
        const featured = index === 0;

        return (
          <li key={item.id} className={cn(featured && "sm:col-span-2")}>
            <button
              type="button"
              onClick={() => onOpen(index)}
              aria-label={`Ampliar ${item.title}`}
              aria-haspopup="dialog"
              className="group block h-full w-full overflow-hidden rounded-[1.25rem] border border-line bg-surface text-left shadow-card transition-[border-color,box-shadow] hover:border-brand/30 hover:shadow-pop focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-ring/60"
            >
              <div
                className={cn(
                  "relative overflow-hidden",
                  item.image ? "bg-surface-muted" : "bg-brand-soft",
                  featured ? "aspect-[16/10] sm:aspect-[2.15/1]" : "aspect-[4/3]",
                )}
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes={
                      featured
                        ? "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 66vw"
                        : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    }
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none"
                  />
                ) : (
                  <div className="relative flex size-full items-center justify-center overflow-hidden bg-[linear-gradient(120deg,#f0e8ff,#fdfbff_55%,#fff0f6)]">
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 opacity-50 [background-image:radial-gradient(circle,rgba(109,61,245,0.16)_1px,transparent_1px)] [background-size:22px_22px]"
                    />
                    <CategoryIcon
                      categoryId={categoryId}
                      className={cn(
                        "relative text-brand/25",
                        featured ? "size-24 sm:size-32" : "size-20",
                      )}
                    />
                  </div>
                )}

                <span
                  aria-hidden="true"
                  className="absolute bottom-3 right-3 grid size-9 place-items-center rounded-full bg-surface/92 text-ink-soft shadow-sm backdrop-blur-sm transition-colors group-hover:bg-brand group-hover:text-white"
                >
                  <Expand className="size-4" />
                </span>
              </div>

              <div className="flex flex-col gap-1 p-4">
                <p className="text-sm font-bold text-ink">{item.title}</p>
                <p className="text-xs leading-relaxed text-ink-faint">{item.meta}</p>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

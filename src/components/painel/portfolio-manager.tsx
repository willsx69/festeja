"use client";

import { useActionState, useId } from "react";
import { CircleAlert, Images, Trash2 } from "lucide-react";
import {
  createPortfolioPostAction,
  deletePortfolioPostAction,
  type PortfolioFormState,
} from "@/actions/portfolio";
import { ImageUploadField } from "@/components/painel/image-upload-field";
import { PainelEmptyState } from "@/components/painel/painel-empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProviderMedia } from "@/components/provider/provider-media";
import { getCategory } from "@/data/categories";
import { cn } from "@/lib/utils";
import type { CategoryId, PortfolioItem } from "@/types";

const inputClass =
  "mt-1.5 h-11 w-full rounded-xl border bg-surface px-3.5 text-sm text-ink transition-colors focus:border-brand";

type PortfolioManagerProps = {
  items: PortfolioItem[];
  categoryId: CategoryId;
};

export function PortfolioManager({ items, categoryId }: PortfolioManagerProps) {
  const [state, formAction, pending] = useActionState<PortfolioFormState, FormData>(
    createPortfolioPostAction,
    {},
  );
  const errors = state.errors ?? {};
  const category = getCategory(categoryId);
  const id = useId();

  return (
    <div className="space-y-6">
      <Card className="border-brand/15 shadow-none">
        <h3 className="text-base font-extrabold uppercase tracking-[-0.01em] text-ink">Nova publicação</h3>
        <form action={formAction} className="mt-4 space-y-4" noValidate>
          {state.message ? (
            <p role="status" className="rounded-xl border border-brand/30 bg-brand-soft px-3.5 py-2.5 text-sm font-medium text-brand">
              {state.message}
            </p>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`${id}-titulo`} className="block text-sm font-medium text-ink">Título</label>
              <input
                id={`${id}-titulo`}
                name="titulo"
                placeholder="Ex.: Bolo de três andares"
                className={cn(
                  inputClass,
                  errors.titulo ? "border-danger" : "border-line-strong",
                )}
              />
              {errors.titulo ? <FieldError message={errors.titulo} /> : null}
            </div>
            <div>
              <label htmlFor={`${id}-legenda`} className="block text-sm font-medium text-ink">Legenda</label>
              <input
                id={`${id}-legenda`}
                name="legenda"
                placeholder="Aniversário · 120 convidados"
                className={cn(
                  inputClass,
                  errors.legenda ? "border-danger" : "border-line-strong",
                )}
              />
              {errors.legenda ? <FieldError message={errors.legenda} /> : null}
            </div>
          </div>

          <ImageUploadField
            name="imagem"
            label="Imagem do trabalho"
            hint="Opcional. Sem imagem, entra o destaque da categoria."
          />
          {errors.imagem ? <FieldError message={errors.imagem} /> : null}

          <Button type="submit" disabled={pending}>
            {pending ? "Publicando..." : "Publicar no portfólio"}
          </Button>
        </form>
      </Card>

      {items.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
          <li key={item.id}>
            <Card padded={false} className="overflow-hidden shadow-none">
              <ProviderMedia
                categoryId={category.id}
                tone={category.tone}
                image={item.image}
                className="aspect-[4/3]"
                iconClassName="size-28"
              />
              <div className="flex items-start justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{item.title}</p>
                  <p className="mt-0.5 truncate text-xs text-ink-faint">{item.meta}</p>
                </div>
                <form action={deletePortfolioPostAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <button
                    type="submit"
                    aria-label={`Excluir ${item.title}`}
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-line text-ink-faint transition-colors hover:border-danger hover:text-danger"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </form>
              </div>
            </Card>
          </li>
          ))}
        </ul>
      ) : (
        <PainelEmptyState
          icon={Images}
          title="Seu portfólio ainda está vazio"
          description="Publique acima um trabalho real para mostrar seu estilo aos clientes."
        />
      )}
    </div>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-danger">
      <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

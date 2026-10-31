"use client";

import { useActionState, useState } from "react";
import { CircleAlert, Trash2 } from "lucide-react";
import { deleteAccountAction, type DeleteAccountState } from "@/actions/account";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const inputClass =
  "mt-1.5 h-11 w-full rounded-xl border border-line-strong bg-surface px-3.5 text-sm text-ink transition-colors focus:border-brand";

export function DeleteAccountCard() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<DeleteAccountState, FormData>(
    deleteAccountAction,
    {},
  );
  const errors = state.errors ?? {};

  return (
    <Card className="border-danger/30">
      <div className="flex items-start gap-2">
        <Trash2 className="mt-0.5 size-5 shrink-0 text-danger" aria-hidden="true" />
        <div>
          <h2 className="text-base font-semibold uppercase tracking-[0.04em] text-ink">
            Excluir conta
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">
            A exclusão remove permanentemente seus dados, conversas, contratos,
            avaliações e imagens enviadas. Esta ação não pode ser desfeita.
          </p>
        </div>
      </div>

      {!open ? (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="mt-4 border-danger/40 text-danger hover:bg-danger-soft"
          onClick={() => setOpen(true)}
        >
          Quero excluir minha conta
        </Button>
      ) : (
        <form action={formAction} className="mt-4 space-y-3 border-t border-line pt-4">
          {errors.geral ? (
            <p
              role="alert"
              className="flex items-center gap-1.5 rounded-xl border border-danger/30 bg-danger-soft px-3.5 py-2.5 text-sm font-medium text-danger"
            >
              <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
              {errors.geral}
            </p>
          ) : null}

          <div>
            <label htmlFor="exclusao-senha" className="block text-sm font-medium text-ink">
              Senha atual
            </label>
            <input
              id="exclusao-senha"
              name="senha"
              type="password"
              autoComplete="current-password"
              className={cn(
                inputClass,
                errors.senha ? "border-danger" : "border-line-strong",
              )}
            />
            {errors.senha ? (
              <p className="mt-1.5 text-xs font-medium text-danger">{errors.senha}</p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="exclusao-confirmacao"
              className="block text-sm font-medium text-ink"
            >
              Digite EXCLUIR para confirmar
            </label>
            <input
              id="exclusao-confirmacao"
              name="confirmacao"
              autoComplete="off"
              placeholder="EXCLUIR"
              className={cn(
                inputClass,
                errors.confirmacao ? "border-danger" : "border-line-strong",
              )}
            />
            {errors.confirmacao ? (
              <p className="mt-1.5 text-xs font-medium text-danger">
                {errors.confirmacao}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="submit"
              size="sm"
              className="bg-danger text-white hover:bg-danger/90"
              disabled={pending}
            >
              {pending ? "Excluindo..." : "Excluir definitivamente"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              disabled={pending}
            >
              Cancelar
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}

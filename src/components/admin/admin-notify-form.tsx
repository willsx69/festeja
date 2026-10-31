"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { notifyProviderAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";

type AdminNotifyFormProps = {
  username: string;
};

export function AdminNotifyForm({ username }: AdminNotifyFormProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {!open ? (
        <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(true)}>
          <Send className="size-4" aria-hidden="true" />
          Enviar notificação
        </Button>
      ) : (
        <form
          action={async (formData) => {
            await notifyProviderAction(formData);
            setOpen(false);
          }}
          className="space-y-3"
        >
          <input type="hidden" name="username" value={username} />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              name="titulo"
              placeholder="Título da notificação"
              className="h-10 w-full rounded-xl border border-line-strong bg-surface px-3.5 text-sm text-ink focus:border-brand"
            />
            <input
              name="corpo"
              placeholder="Mensagem para o prestador"
              className="h-10 w-full rounded-xl border border-line-strong bg-surface px-3.5 text-sm text-ink focus:border-brand"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm">
              <Send className="size-4" aria-hidden="true" />
              Enviar
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

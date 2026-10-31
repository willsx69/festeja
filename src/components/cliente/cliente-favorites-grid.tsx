"use client";

import { useState, useTransition } from "react";
import { Heart, Trash2 } from "lucide-react";
import { toggleFavoriteAction } from "@/actions/profile";
import { ProviderCard } from "@/components/provider/provider-card";
import { ButtonLink } from "@/components/ui/button";
import type { Provider } from "@/types";

export function ClienteFavoritesGrid({ initialItems }: { initialItems: Provider[] }) {
  const [items, setItems] = useState(initialItems);
  const [message, setMessage] = useState("");

  if (items.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-12 text-center">
        <Heart className="mx-auto size-9 text-pink" aria-hidden="true" />
        <h2 className="mt-3 text-lg font-bold text-ink">Sua lista ainda está vazia</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
          Salve os perfis que combinam com a sua festa e volte para comparar quando quiser.
        </p>
        <ButtonLink href="/buscar" className="mt-5">
          Explorar profissionais
        </ButtonLink>
        {message ? <p role="status" className="mt-3 text-sm text-brand">{message}</p> : null}
      </div>
    );
  }

  return (
    <>
      <p className="sr-only" role="status" aria-live="polite">{message}</p>
      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((provider) => (
          <FavoriteItem
            key={provider.id}
            provider={provider}
            onRemoved={() => {
              setItems((current) => current.filter((item) => item.id !== provider.id));
              setMessage(`${provider.name} foi removido dos favoritos.`);
            }}
          />
        ))}
      </ul>
    </>
  );
}

function FavoriteItem({ provider, onRemoved }: { provider: Provider; onRemoved: () => void }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  return (
    <li className="flex flex-col gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          setError("");
          startTransition(async () => {
            const favorited = await toggleFavoriteAction(provider.id);
            if (favorited === false) onRemoved();
            else setError("Não foi possível remover este favorito.");
          });
        }}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-pink bg-pink-soft px-4 text-sm font-semibold text-pink-strong transition-colors hover:bg-pink hover:text-white disabled:opacity-60"
      >
        <Trash2 className="size-4" aria-hidden="true" />
        {pending ? "Removendo..." : "Remover dos favoritos"}
      </button>
      {error ? <p role="alert" className="text-xs font-medium text-danger">{error}</p> : null}
      <ProviderCard provider={provider} />
    </li>
  );
}

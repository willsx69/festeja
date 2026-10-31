"use client";

import type { ComponentPropsWithoutRef } from "react";
import { CircleAlert } from "lucide-react";
import { MANAUS_NEIGHBORHOODS } from "@/data/locations";
import { cn } from "@/lib/utils";

type ManausNeighborhoodFieldProps = Omit<
  ComponentPropsWithoutRef<"input">,
  "list" | "type"
> & {
  label?: string;
  error?: string;
};

export function ManausNeighborhoodField({
  id = "bairro",
  name = "bairro",
  label = "Bairro em Manaus",
  error,
  className,
  ...props
}: ManausNeighborhoodFieldProps) {
  const listId = `${id}-bairros-manaus`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        {...props}
        id={id}
        name={name}
        type="text"
        list={listId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-erro` : undefined}
        className={cn(
          "mt-1.5 h-11 w-full rounded-xl border bg-surface px-3.5 text-sm text-ink transition-colors placeholder:text-ink-faint focus:border-brand",
          error ? "border-danger" : "border-line-strong hover:border-brand/50",
          className,
        )}
      />
      <datalist id={listId}>
        {MANAUS_NEIGHBORHOODS.map((neighborhood) => (
          <option key={neighborhood} value={neighborhood} />
        ))}
      </datalist>
      <p className="mt-1 text-xs text-ink-faint">
        Comece a digitar e escolha um dos bairros oficiais de Manaus.
      </p>
      {error ? (
        <p
          id={`${id}-erro`}
          className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-danger"
        >
          <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

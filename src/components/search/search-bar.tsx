"use client";

import { Search } from "lucide-react";
import { NeighborhoodCombobox } from "@/components/search/neighborhood-combobox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SearchValues = { q: string; local: string };

type SearchBarProps = {
  action?: string;
  defaultQ?: string;
  defaultLocal?: string;
  onSubmit?: (values: SearchValues) => void;
  className?: string;
};

export function SearchBar({
  action = "/buscar",
  defaultQ,
  defaultLocal,
  onSubmit,
  className,
}: SearchBarProps) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (!onSubmit) return;
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onSubmit({
      q: String(data.get("q") ?? ""),
      local: String(data.get("local") ?? ""),
    });
  }

  return (
    <form
      role="search"
      action={onSubmit ? undefined : action}
      method={onSubmit ? undefined : "get"}
      onSubmit={onSubmit ? handleSubmit : undefined}
      className={cn(
        "flex flex-col gap-2 rounded-2xl border border-line bg-surface p-2 shadow-card sm:flex-row sm:items-center sm:gap-0 sm:rounded-2xl sm:p-1.5",
        className,
      )}
    >
      <label className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3 sm:rounded-xl sm:focus-within:bg-brand-soft">
        <Search className="size-4 shrink-0 text-brand" aria-hidden="true" />
        <span className="sr-only">O que você procura</span>
        <input
          type="search"
          name="q"
          defaultValue={defaultQ}
          placeholder="O que você precisa? DJ, bolo, decoração..."
          className="w-full min-w-0 bg-transparent text-sm font-medium text-ink placeholder:font-normal placeholder:text-ink-faint focus:outline-none"
        />
      </label>

      <span aria-hidden="true" className="hidden h-6 w-px bg-line sm:block" />

      <NeighborhoodCombobox defaultValue={defaultLocal} />

      <Button type="submit" size="lg" className="w-full px-7 sm:w-auto">
        Buscar
      </Button>
    </form>
  );
}

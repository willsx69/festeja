"use client";

import { useId, useState } from "react";
import { Check, ChevronDown, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MANAUS_NEIGHBORHOODS } from "@/data/locations";
import { cn } from "@/lib/utils";

function searchKey(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[-–—]+/g, " ")
    .toLowerCase();
}

type NeighborhoodComboboxProps = {
  defaultValue?: string;
};

export function NeighborhoodCombobox({ defaultValue = "" }: NeighborhoodComboboxProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const listId = useId();

  function select(nextValue: string) {
    setValue(nextValue);
    setOpen(false);
  }

  return (
    <div className="min-w-0 flex-1">
      <input type="hidden" name="local" value={value} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-haspopup="listbox"
            aria-label="Selecionar bairro em Manaus"
            className="h-auto w-full min-w-0 justify-start rounded-xl px-3 py-3 font-medium hover:bg-brand-soft focus-visible:bg-brand-soft sm:px-3"
          >
            <MapPin className="size-4 shrink-0 text-brand" aria-hidden="true" />
            <span className={cn("min-w-0 flex-1 truncate text-left text-sm", value ? "text-brand" : "text-ink-soft")}>
              {value || "Todos os bairros"}
            </span>
            <ChevronDown
              className={cn("size-4 shrink-0 text-ink-faint transition-transform", open && "rotate-180 text-brand")}
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[var(--radix-popover-trigger-width)] max-w-[calc(100vw-2rem)] p-0"
        >
          <Command>
            <CommandInput placeholder="Pesquisar bairro..." aria-label="Pesquisar bairro" />
            <CommandList id={listId}>
              <CommandEmpty>Nenhum bairro encontrado.</CommandEmpty>
              <CommandGroup heading="Bairros de Manaus">
                <CommandItem
                  value="Todos os bairros"
                  keywords={["todos", "qualquer", "manaus"]}
                  onSelect={() => select("")}
                  className={cn(!value && "bg-brand-soft text-brand")}
                >
                  <Check className={cn("size-4", value ? "opacity-0" : "opacity-100")} aria-hidden="true" />
                  Todos os bairros
                </CommandItem>
                {MANAUS_NEIGHBORHOODS.map((neighborhood) => {
                  const selected = value === neighborhood;
                  return (
                    <CommandItem
                      key={neighborhood}
                      value={neighborhood}
                      keywords={[searchKey(neighborhood)]}
                      onSelect={() => select(neighborhood)}
                      className={cn(selected && "bg-brand-soft text-brand")}
                    >
                      <Check className={cn("size-4", selected ? "opacity-100" : "opacity-0")} aria-hidden="true" />
                      <span className="truncate">{neighborhood}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

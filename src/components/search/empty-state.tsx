import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  hasFilters: boolean;
  onClear: () => void;
};

export function EmptyState({ hasFilters, onClear }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line-strong bg-canvas px-6 py-16 text-center">
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-surface-muted">
        <SearchX className="size-6 text-ink-faint" aria-hidden="true" />
      </span>
      <h3 className="text-base font-semibold text-ink">
        Nenhum prestador encontrado
      </h3>
      <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
        {hasFilters
          ? "Tente remover algum filtro ou buscar por outro termo para ver mais resultados."
          : "Ainda não há prestadores cadastrados para essa busca."}
      </p>
      {hasFilters ? (
        <Button type="button" variant="secondary" size="md" onClick={onClear}>
          Limpar filtros
        </Button>
      ) : null}
    </div>
  );
}

"use client";

import { useTransition, useState } from "react";
import { Check, Inbox, X } from "lucide-react";
import { respondQuoteAction } from "@/actions/quotes";
import { PainelEmptyState } from "@/components/painel/painel-empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatShortDate } from "@/lib/format";
import type { QuoteRequest } from "@/types";

const statusLabel: Record<QuoteRequest["status"], { label: string; tone: "brand" | "pink" | "yellow" }> = {
  aberto: { label: "Aguardando resposta", tone: "yellow" },
  aceito: { label: "Aceito", tone: "brand" },
  recusado: { label: "Recusado", tone: "pink" },
};

export function QuotesManager({ quotes }: { quotes: QuoteRequest[] }) {
  if (quotes.length === 0) {
    return (
      <PainelEmptyState
        icon={Inbox}
        title="Nenhum orçamento recebido"
        description="Compartilhe seu perfil público para começar a receber solicitações de clientes."
      />
    );
  }

  return (
    <ul className="space-y-4">
      {[...quotes].reverse().map((quote) => (
        <li key={quote.id}>
          <QuoteCard quote={quote} />
        </li>
      ))}
    </ul>
  );
}

function QuoteCard({ quote }: { quote: QuoteRequest }) {
  const status = statusLabel[quote.status];
  const [pending, startTransition] = useTransition();
  const [decided, setDecided] = useState<null | "aceito" | "recusado">(
    quote.status === "aberto" ? null : quote.status,
  );
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  function respond(decision: "aceitar" | "recusar") {
    const parsedAmount = Number(amount);
    if (decision === "aceitar" && (!Number.isInteger(parsedAmount) || parsedAmount <= 0)) {
      setError("Informe um valor inteiro maior que zero.");
      return;
    }
    setError("");
    const formData = new FormData();
    formData.set("id", quote.id);
    formData.set("decisao", decision);
    if (decision === "aceitar") formData.set("valor", amount);
    startTransition(async () => {
      const result = await respondQuoteAction(formData);
      if (!result.ok) {
        setError(result.error ?? "Não foi possível responder ao orçamento.");
        return;
      }
      setDecided(decision === "aceitar" ? "aceito" : "recusado");
    });
  }

  return (
    <Card className="shadow-none">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-ink">{quote.clientName}</p>
          <p className="mt-0.5 text-sm text-ink-faint">
            {quote.serviceName ?? "Serviço a combinar"} · Evento em{" "}
            {formatShortDate(quote.eventDate)}
            {quote.guests ? ` · ${quote.guests} convidados` : ""}
          </p>
        </div>
        <Badge tone={status.tone}>{status.label}</Badge>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-ink-soft">“{quote.message}”</p>

      {quote.status === "aberto" && decided === null ? (
        <div className="mt-4 flex flex-wrap items-end gap-3 border-t border-line pt-4">
          <div>
            <label htmlFor={`valor-${quote.id}`} className="block text-sm font-medium text-ink">
              Valor proposto (R$)
            </label>
            <input
              id={`valor-${quote.id}`}
              type="number"
              min={1}
              step={1}
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="Ex.: 1500"
              className="mt-1.5 h-11 w-40 rounded-xl border border-line-strong bg-surface px-3.5 text-sm text-ink transition-colors focus:border-brand"
            />
            {error ? <p role="alert" className="mt-1.5 text-xs font-medium text-danger">{error}</p> : null}
          </div>
          <Button
            type="button"
            disabled={pending || !amount}
            onClick={() => respond("aceitar")}
          >
            <Check className="size-4" aria-hidden="true" />
            Aceitar e criar contrato
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={pending}
            onClick={() => respond("recusar")}
          >
            <X className="size-4" aria-hidden="true" />
            Recusar
          </Button>
        </div>
      ) : null}
    </Card>
  );
}

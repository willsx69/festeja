"use client";

import { useActionState, useId } from "react";
import { CircleAlert } from "lucide-react";
import { replyReviewAction, type ReviewFormState } from "@/actions/reviews";
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";

type ReplyFormProps = {
  review: {
    id: string;
    author: string;
    event: string;
    date: string;
    rating: number;
    comment: string;
    reply?: string;
  };
};

export function ReplyForm({ review }: ReplyFormProps) {
  const [state, formAction, pending] = useActionState<ReviewFormState, FormData>(
    replyReviewAction,
    {},
  );
  const replyId = useId();

  return (
    <div>
      <p className="text-sm font-semibold text-ink">{review.author}</p>
      <p className="mt-0.5 text-xs text-ink-faint">
        {review.event} · {review.date}
      </p>
      <div className="mt-2">
        <Rating value={review.rating} />
      </div>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">“{review.comment}”</p>

      {review.reply ? (
        <div className="mt-3 rounded-xl bg-surface-muted p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
            Sua resposta
          </p>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">{review.reply}</p>
        </div>
      ) : null}

      <form action={formAction} className="mt-3 space-y-2">
        <input type="hidden" name="id" value={review.id} />
        {state.message ? (
          <p role="status" className="rounded-xl border border-brand/30 bg-brand-soft px-3.5 py-2 text-sm font-medium text-brand">
            {state.message}
          </p>
        ) : null}
        {state.errors?.resposta ? (
          <p role="alert" className="flex items-center gap-1.5 text-xs font-medium text-danger">
            <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
            {state.errors.resposta}
          </p>
        ) : null}
        {state.errors?.geral ? (
          <p role="alert" className="flex items-center gap-1.5 text-xs font-medium text-danger">
            <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
            {state.errors.geral}
          </p>
        ) : null}
        <label htmlFor={replyId} className="sr-only">Resposta à avaliação de {review.author}</label>
        <textarea
          id={replyId}
          name="resposta"
          rows={2}
          defaultValue={review.reply ?? ""}
          placeholder="Agradeça o cliente e reforce um diferencial…"
          className="w-full rounded-xl border border-line-strong bg-surface px-3.5 py-2.5 text-sm text-ink transition-colors focus:border-brand"
        />
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Salvando..." : review.reply ? "Atualizar resposta" : "Responder"}
        </Button>
      </form>
    </div>
  );
}

"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Flag } from "lucide-react";
import { reportReviewAction } from "@/actions/reviews";

export function ReviewReportButton({ reviewId, loggedIn }: { reviewId: string; loggedIn: boolean }) {
  const router = useRouter();
  const [reported, setReported] = useState(false);
  const [pending, startTransition] = useTransition();

  if (reported) {
    return <p className="text-xs font-medium text-ink-faint">Denúncia enviada para análise.</p>;
  }

  return (
    <button
      type="button"
      disabled={pending || !loggedIn}
      title={loggedIn ? "Denunciar avaliação" : "Entre para denunciar"}
      onClick={() => {
        if (!loggedIn) {
          router.push("/entrar");
          return;
        }
        const formData = new FormData();
        formData.set("id", reviewId);
        formData.set("motivo", "Conteúdo impróprio");
        startTransition(async () => {
          await reportReviewAction(formData);
          setReported(true);
        });
      }}
      className="inline-flex items-center gap-1 text-xs font-medium text-ink-faint transition-colors hover:text-danger disabled:cursor-not-allowed"
    >
      <Flag className="size-3" aria-hidden="true" />
      Denunciar
    </button>
  );
}

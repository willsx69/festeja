import { Star } from "lucide-react";
import { formatCount, formatRating } from "@/lib/format";
import { cn } from "@/lib/utils";

type RatingProps = {
  value: number;
  reviews?: number;
  className?: string;
};

export function Rating({ value, reviews, className }: RatingProps) {
  return (
    <div className={cn("flex items-center gap-1.5 text-sm", className)}>
      <Star className="size-4 fill-yellow text-yellow" aria-hidden="true" />
      <span className="font-medium text-ink tabular-nums">{formatRating(value)}</span>
      {typeof reviews === "number" ? (
        <span className="text-ink-faint tabular-nums">({formatCount(reviews)})</span>
      ) : null}
      <span className="sr-only">
        {formatRating(value)} de 5{reviews ? `, ${formatCount(reviews)} avaliações` : ""}
      </span>
    </div>
  );
}

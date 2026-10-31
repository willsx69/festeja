import type { ComponentType } from "react";
import {
  Cake,
  Camera,
  Disc3,
  Palette,
  PartyPopper,
  PersonStanding,
  Shapes,
  UtensilsCrossed,
} from "lucide-react";
import type { CategoryId } from "@/types";
import { cn } from "@/lib/utils";

const icons: Record<CategoryId, ComponentType<{ className?: string }>> = {
  confeitaria: Cake,
  decoracao: Palette,
  buffet: UtensilsCrossed,
  dj: Disc3,
  fotografia: Camera,
  animacao: PartyPopper,
  danca: PersonStanding,
  outros: Shapes,
};

type CategoryIconProps = {
  categoryId: CategoryId;
  className?: string;
};

export function CategoryIcon({ categoryId, className }: CategoryIconProps) {
  const Icon = icons[categoryId];
  return <Icon className={cn("size-5", className)} />;
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Building2, Flag, LayoutList, Users } from "lucide-react";
import type { AdminTab } from "@/lib/admin-navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "visao", label: "Visão geral", icon: LayoutGrid },
  { id: "usuarios", label: "Usuários", icon: Users },
  { id: "prestadores", label: "Prestadores", icon: Building2 },
  { id: "categorias", label: "Categorias", icon: LayoutList },
  { id: "moderacao", label: "Moderação", icon: Flag },
] satisfies ReadonlyArray<{ id: AdminTab; label: string; icon: typeof LayoutGrid }>;

type AdminTabsProps = {
  active: AdminTab;
};

export function AdminTabs({ active }: AdminTabsProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Seções do painel" className="mt-6 border-b border-line">
      <ul className="flex gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <li key={tab.id}>
              <Link
                href={`${pathname}?aba=${tab.id}`}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "inline-flex whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "border-brand text-brand"
                    : "border-transparent text-ink-soft hover:text-ink",
                )}
              >
                <Icon className="mr-2 size-4" aria-hidden="true" />
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

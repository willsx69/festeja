"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileCheck2,
  Images,
  Inbox,
  LayoutDashboard,
  PackageOpen,
  Star,
  UserRound,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

const links = [
  { href: "/painel", label: "Visão geral", icon: LayoutDashboard },
  { href: "/painel/perfil", label: "Meu perfil", icon: UserRound },
  { href: "/painel/servicos", label: "Serviços", icon: PackageOpen },
  { href: "/painel/portfolio", label: "Portfólio", icon: Images },
  { href: "/painel/orcamentos", label: "Orçamentos", icon: Inbox },
  { href: "/painel/contratos", label: "Contratos", icon: FileCheck2 },
  { href: "/painel/avaliacoes", label: "Avaliações", icon: Star },
];

export function PainelNav() {
  const pathname = usePathname();
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const active = list?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!list || !active) return;

    const listRect = list.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    if (activeRect.left >= listRect.left && activeRect.right <= listRect.right) return;

    list.scrollLeft +=
      activeRect.left - listRect.left - (listRect.width - activeRect.width) / 2;
  }, [pathname]);

  return (
    <nav
      aria-label="Seções do painel"
      className="sticky top-16 z-40 border-y border-line/90 bg-canvas/94 backdrop-blur-xl"
    >
      <Container>
        <ul ref={listRef} className="festeja-scrollbar flex gap-1 overflow-x-auto">
          {links.map((link) => {
            const active =
              link.href === "/painel" ? pathname === "/painel" : pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <li key={link.href} className="shrink-0">
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative inline-flex h-12 items-center gap-2 whitespace-nowrap px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-ring/70",
                    "after:absolute after:inset-x-3 after:bottom-0 after:h-[3px] after:rounded-t-full after:transition-colors",
                    active
                      ? "text-brand after:bg-brand"
                      : "text-ink-soft after:bg-transparent hover:bg-surface hover:text-ink",
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </nav>
  );
}

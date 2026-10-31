"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileHeart,
  FileText,
  Heart,
  Home,
  MessageCircle,
  Search,
  Star,
  UserRound,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

const links = [
  { href: "/cliente", label: "Início", icon: Home },
  { href: "/cliente/orcamentos", label: "Orçamentos", icon: FileText },
  { href: "/cliente/contratacoes", label: "Contratações", icon: FileHeart },
  { href: "/cliente/favoritos", label: "Favoritos", icon: Heart },
  { href: "/cliente/avaliacoes", label: "Avaliações", icon: Star },
  { href: "/buscar", label: "Buscar", icon: Search },
  { href: "/mensagens", label: "Mensagens", icon: MessageCircle },
  { href: "/cliente/perfil", label: "Meu perfil", icon: UserRound },
];

export function ClienteNav() {
  const pathname = usePathname();
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const active = list?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!list || !active) return;

    const listRect = list.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    if (activeRect.left >= listRect.left && activeRect.right <= listRect.right) return;

    list.scrollLeft += activeRect.left - listRect.left - (listRect.width - activeRect.width) / 2;
  }, [pathname]);

  return (
    <nav
      aria-label="Área do cliente"
      className="sticky top-16 z-40 border-y border-line/90 bg-canvas/95 backdrop-blur-xl"
    >
      <Container>
        <ul ref={listRef} className="festeja-scrollbar flex gap-1 overflow-x-auto">
          {links.map((link) => {
            const isClientHome = link.href === "/cliente";
            const active = isClientHome
              ? pathname === link.href
              : pathname === link.href || pathname.startsWith(`${link.href}/`);
            const Icon = link.icon;

            return (
              <li key={link.href} className="shrink-0">
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative inline-flex h-12 items-center gap-2 whitespace-nowrap px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-ring/70",
                    "after:absolute after:inset-x-3 after:bottom-0 after:h-[3px] after:rounded-t-full",
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

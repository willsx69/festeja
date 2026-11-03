"use client";

import { ViewTransition, type ReactNode } from "react";
import { usePathname } from "next/navigation";

type RouteTransitionProps = {
  children: ReactNode;
};

// Troca o conteúdo com uma transição curta quando a rota muda.
// A chave é o pathname: recargas e atualizações da mesma rota (filtros,
// router.refresh, revalidações) não disparam animação e não bloqueiam cliques.
// Sem suporte a View Transitions, a troca acontece de forma instantânea.
export function RouteTransition({ children }: RouteTransitionProps) {
  const pathname = usePathname();

  return (
    <ViewTransition key={pathname} enter="route-enter" exit="route-exit" update="none">
      {children}
    </ViewTransition>
  );
}

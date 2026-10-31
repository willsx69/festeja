import Link from "next/link";
import { TabAutoScroll } from "@/components/provider/tab-auto-scroll";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

export type ProfileTabId = "sobre" | "portfolio" | "servicos" | "avaliacoes" | "orcamento";

export const profileTabs: { id: ProfileTabId; label: string }[] = [
  { id: "sobre", label: "Sobre" },
  { id: "portfolio", label: "Portfólio" },
  { id: "servicos", label: "Serviços" },
  { id: "avaliacoes", label: "Avaliações" },
  { id: "orcamento", label: "Orçamento" },
];

export function parseProfileTab(
  value: string | string[] | undefined,
): ProfileTabId {
  const candidate = Array.isArray(value) ? value[0] : value;
  return profileTabs.some((tab) => tab.id === candidate)
    ? (candidate as ProfileTabId)
    : "sobre";
}

type ProfileTabsProps = {
  username: string;
  active: ProfileTabId;
  counts?: Partial<Record<ProfileTabId, number>>;
};

export function ProfileTabs({ username, active, counts = {} }: ProfileTabsProps) {
  return (
    <nav
      aria-label="Seções do perfil"
      className="sticky top-16 z-40 border-b border-line/90 bg-canvas/92 backdrop-blur-xl"
    >
      <Container>
        <TabAutoScroll activeKey={active}>
          <ul data-tab-scroll className="festeja-scrollbar flex gap-1.5 overflow-x-auto py-2.5">
            {profileTabs.map((tab) => {
              const activeTab = active === tab.id;
              const count = counts[tab.id];

              return (
                <li key={tab.id} className="shrink-0">
                  <Link
                    href={`/prestador/${username}?aba=${tab.id}#conteudo-perfil`}
                    aria-current={activeTab ? "page" : undefined}
                    className={cn(
                      "inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-ring/70",
                      activeTab
                        ? "bg-brand text-white shadow-[0_8px_20px_-12px_rgb(109_61_245_/_0.9)]"
                        : "text-ink-soft hover:bg-surface hover:text-ink",
                    )}
                  >
                    {tab.label}
                    {typeof count === "number" && count > 0 ? (
                      <span
                        aria-hidden="true"
                        className={cn(
                          "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[0.65rem] font-bold leading-none tabular-nums",
                          activeTab ? "bg-white/20 text-white" : "bg-surface-muted text-ink-faint",
                        )}
                      >
                        {count}
                      </span>
                    ) : null}
                    {typeof count === "number" && count > 0 ? (
                      <span className="sr-only">, {count} itens</span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </TabAutoScroll>
      </Container>
    </nav>
  );
}

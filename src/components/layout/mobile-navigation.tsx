"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Bell,
  Building2,
  CalendarDays,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Route,
  Search,
  Settings,
  Shapes,
  ShieldCheck,
  Sparkles,
  Store,
  Users,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { AccountAvatar } from "@/components/layout/account-avatar";
import { Logo } from "@/components/brand/logo";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getAccountNavigation } from "@/lib/account-navigation";
import {
  adminHeaderLinks,
  parseAdminTab,
  type AdminTab,
} from "@/lib/admin-navigation";
import { cn } from "@/lib/utils";
import { clientHeaderLinks, providerHeaderLinks } from "@/lib/role-navigation";
import type { SessionUser } from "@/types";

const homeLinks = [
  { href: "#categorias", label: "Categorias", icon: Shapes },
  { href: "#destaques", label: "Destaques", icon: Sparkles },
  { href: "#como-funciona", label: "Como funciona", icon: Route },
  { href: "#para-prestadores", label: "Para prestadores", icon: Store },
];

const roleLinkIcons: Record<string, LucideIcon> = {
  "/cliente": LayoutDashboard,
  "/cliente/orcamentos": CalendarDays,
  "/cliente/favoritos": Heart,
  "/painel": LayoutDashboard,
  "/buscar": Search,
  "/mensagens": MessageCircle,
};

const clientLinks = clientHeaderLinks.map((link) => ({
  ...link,
  icon: roleLinkIcons[link.href],
}));

const providerLinks = providerHeaderLinks.map((link) => ({
  ...link,
  icon: roleLinkIcons[link.href],
}));

function isRolePathActive(pathname: string, href: string): boolean {
  if (href === "/cliente") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

const adminIcons: Record<AdminTab, LucideIcon> = {
  visao: LayoutDashboard,
  usuarios: Users,
  prestadores: Building2,
  categorias: Shapes,
  moderacao: ShieldCheck,
};

const roleDescriptions = {
  admin: "Conta de administrador",
  prestador: "Área do prestador",
  cliente: "Área do cliente",
} satisfies Record<SessionUser["role"], string>;

type MobileNavigationProps = {
  user: SessionUser | null;
  unreadMessages?: number;
  unreadNotifications?: number;
};

type MenuLinkProps = {
  href: string;
  label: string;
  icon: LucideIcon;
  active?: boolean;
  badge?: number;
  onNavigate: () => void;
};

function MenuLink({ href, label, icon: Icon, active = false, badge, onNavigate }: MenuLinkProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex min-h-12 items-center gap-3 rounded-xl px-3 py-2.5 text-[0.9375rem] font-bold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-ring/70",
        active
          ? "bg-brand-soft text-brand"
          : "text-ink-soft hover:bg-surface-muted hover:text-ink active:bg-brand-soft",
      )}
    >
      {active ? <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-brand" /> : null}
      <span
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-lg transition-colors",
          active ? "bg-brand text-white" : "bg-surface-muted text-ink-faint group-hover:text-brand",
        )}
      >
        <Icon className="size-[1.125rem]" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {badge && badge > 0 ? (
        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-pink px-1.5 py-0.5 text-[0.6875rem] font-extrabold text-white">
          {badge > 99 ? "99+" : badge}
        </span>
      ) : null}
    </Link>
  );
}

function AdminMenuLinks({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = pathname === "/admin" ? parseAdminTab(searchParams.get("aba")) : null;

  return adminHeaderLinks.map((link) => (
    <MenuLink
      key={link.href}
      href={link.href}
      label={link.label}
      icon={adminIcons[link.tab]}
      active={activeTab === link.tab}
      onNavigate={onNavigate}
    />
  ));
}

function AdminMenuFallback({ onNavigate }: { onNavigate: () => void }) {
  return adminHeaderLinks.map((link) => (
    <MenuLink
      key={link.href}
      href={link.href}
      label={link.label}
      icon={adminIcons[link.tab]}
      onNavigate={onNavigate}
    />
  ));
}

function UtilityLink({ href, label, icon: Icon, badge, onNavigate }: MenuLinkProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="flex min-h-10 items-center gap-2.5 rounded-lg px-2.5 text-sm font-semibold text-ink-soft transition-colors hover:bg-brand-soft hover:text-brand focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-ring/70"
    >
      <Icon className="size-[1.125rem]" aria-hidden="true" />
      <span className="flex-1">{label}</span>
      {badge && badge > 0 ? (
        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-pink px-1.5 py-0.5 text-[0.6875rem] font-extrabold text-white">
          {badge > 99 ? "99+" : badge}
        </span>
      ) : null}
    </Link>
  );
}

export function MobileNavigation({
  user,
  unreadMessages = 0,
  unreadNotifications = 0,
}: MobileNavigationProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const close = () => setOpen(false);
  const firstName = user?.name.split(" ")[0];
  const unreadTotal = unreadMessages + unreadNotifications;
  const showDiscovery = !user;
  const roleLinks = user?.role === "prestador" ? providerLinks : user?.role === "cliente" ? clientLinks : [];
  const accountNavigation = user ? getAccountNavigation(user) : null;

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const closeAtDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeAtDesktop);
    return () => desktop.removeEventListener("change", closeAtDesktop);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label={unreadTotal > 0 ? `Abrir menu (${unreadTotal} pendentes)` : "Abrir menu"}
          className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-line-strong bg-surface px-3 text-sm font-bold text-ink shadow-[0_1px_0_rgb(23_22_37_/_0.04)] transition-colors hover:border-brand/35 hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-ring/70 md:hidden"
        >
          <span className="relative grid size-6 place-items-center rounded-full bg-brand text-white">
            <Menu className="size-3.5" aria-hidden="true" />
            {unreadTotal > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full border-2 border-surface bg-pink" />
            ) : null}
          </span>
          Menu
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[min(94vw,22rem)] gap-0 overflow-hidden border-l-0 p-0 md:hidden [&>button]:right-3 [&>button]:top-3 [&>button]:size-11 [&>button]:text-white [&>button]:hover:bg-white/15 [&>button]:hover:text-white [&>button]:focus-visible:ring-white/50"
      >
        <SheetHeader className="relative gap-0 bg-brand px-5 pb-6 pt-5 text-left">
          <Link href="/" onClick={close} className="w-fit rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50">
            <Logo tone="white" size="md" />
          </Link>
          {user ? (
            <div className="mt-7 flex items-center gap-3 pr-8">
              <AccountAvatar
                user={user}
                className="size-12 border-white/30 ring-white/25"
              />
              <div className="min-w-0">
                <SheetTitle className="truncate text-xl font-extrabold tracking-[-0.04em] text-white">
                  Olá, {firstName}
                </SheetTitle>
                <SheetDescription className="mt-0.5 truncate text-sm text-white/75">
                  {roleDescriptions[user.role]}
                </SheetDescription>
              </div>
            </div>
          ) : (
            <div className="mt-8 pr-8">
              <SheetTitle className="text-2xl font-extrabold tracking-[-0.04em] text-white">
                Tudo para sua festa
              </SheetTitle>
              <SheetDescription className="mt-1 max-w-64 text-sm leading-6 text-white/75">
                Encontre profissionais e organize cada detalhe em um só lugar.
              </SheetDescription>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 flex h-1.5" aria-hidden="true">
            <span className="flex-[3] bg-yellow" />
            <span className="flex-1 bg-pink" />
          </div>
        </SheetHeader>

        <div className="festeja-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto bg-surface">
          <nav aria-label="Navegação mobile" className="flex flex-col gap-1 px-3 py-4">
            {showDiscovery
              ? homeLinks.map((link) => (
                  <MenuLink
                    key={link.href}
                    href={pathname === "/" ? link.href : `/${link.href}`}
                    label={link.label}
                    icon={link.icon}
                    onNavigate={close}
                  />
                ))
              : user?.role === "admin" ? (
                  <Suspense fallback={<AdminMenuFallback onNavigate={close} />}>
                    <AdminMenuLinks onNavigate={close} />
                  </Suspense>
                ) : (
                  roleLinks.map((link) => (
                    <MenuLink
                      key={link.href}
                      href={link.href}
                      label={link.label}
                      icon={link.icon}
                      active={isRolePathActive(pathname, link.href)}
                      badge={link.href === "/mensagens" ? unreadMessages : undefined}
                      onNavigate={close}
                    />
                  ))
                )}
          </nav>

          <div className="mt-auto border-t border-line px-3 py-3">
            {user ? (
              <>
                <UtilityLink
                  href={accountNavigation?.profileHref ?? "/configuracoes#dados-pessoais"}
                  label="Meu perfil"
                  icon={UserRound}
                  onNavigate={close}
                />
                <UtilityLink
                  href="/notificacoes"
                  label="Notificações"
                  icon={Bell}
                  badge={unreadNotifications}
                  onNavigate={close}
                />
                <UtilityLink
                  href="/configuracoes"
                  label="Configurações"
                  icon={Settings}
                  onNavigate={close}
                />
                <form action={logoutAction} onSubmit={close} className="mt-1 border-t border-line pt-2">
                  <button
                    type="submit"
                    className="flex min-h-10 w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 text-sm font-semibold text-ink-soft transition-colors hover:bg-danger-soft hover:text-danger focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-ring/70"
                  >
                    <LogOut className="size-[1.125rem]" aria-hidden="true" />
                    Sair da conta
                  </button>
                </form>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/entrar"
                  onClick={close}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-line-strong text-sm font-bold text-ink transition-colors hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-ring/70"
                >
                  Entrar
                </Link>
                <Link
                  href="/cadastro"
                  onClick={close}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-yellow px-3 text-sm font-extrabold text-ink transition-colors hover:bg-[#ffd564] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-ring/70"
                >
                  Criar conta
                </Link>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

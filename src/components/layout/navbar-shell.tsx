"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Bell,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Menu,
  Settings,
} from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { AccountMenu } from "@/components/layout/account-menu";
import { Logo } from "@/components/brand/logo";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { Button, ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { adminHeaderLinks, parseAdminTab } from "@/lib/admin-navigation";
import { clientHeaderLinks, providerHeaderLinks } from "@/lib/role-navigation";
import { cn } from "@/lib/utils";
import type { SessionUser } from "@/types";

const homeLinks = [
  { hash: "#categorias", label: "Categorias" },
  { hash: "#destaques", label: "Destaques" },
  { hash: "#como-funciona", label: "Como funciona" },
  { hash: "#para-prestadores", label: "Para prestadores" },
];

function isPathActive(pathname: string, href: string): boolean {
  if (href === "/cliente") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

type NavbarShellProps = {
  user: SessionUser | null;
  unreadMessages?: number;
  unreadNotifications?: number;
};

function NavLink({
  href,
  label,
  isActive,
  onClick,
}: {
  href: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-ring/70",
        isActive ? "bg-brand-soft text-brand" : "text-ink-soft hover:bg-brand-soft hover:text-brand",
      )}
    >
      {label}
    </Link>
  );
}

function MobileNavLink({
  href,
  label,
  isActive,
  onClick,
}: {
  href: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "cursor-pointer rounded-xl px-4 py-3 text-base font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-ring/70",
        isActive
          ? "bg-brand-soft text-brand"
          : "text-ink hover:bg-brand-soft hover:text-brand",
      )}
    >
      {label}
    </Link>
  );
}

function AdminNavItems({
  mobile = false,
  onClick,
  pathname,
}: {
  mobile?: boolean;
  onClick?: () => void;
  pathname: string;
}) {
  const searchParams = useSearchParams();
  const activeTab = pathname === "/admin" ? parseAdminTab(searchParams.get("aba")) : null;

  return adminHeaderLinks.map((link) =>
    mobile ? (
      <MobileNavLink
        key={link.href}
        href={link.href}
        label={link.label}
        isActive={activeTab === link.tab}
        onClick={onClick}
      />
    ) : (
      <NavLink
        key={link.href}
        href={link.href}
        label={link.label}
        isActive={activeTab === link.tab}
      />
    ),
  );
}

function AdminNavFallback({ mobile = false }: { mobile?: boolean }) {
  return adminHeaderLinks.map((link) =>
    mobile ? (
      <MobileNavLink key={link.href} href={link.href} label={link.label} isActive={false} />
    ) : (
      <NavLink key={link.href} href={link.href} label={link.label} isActive={false} />
    ),
  );
}

function IconLink({
  href,
  icon: Icon,
  label,
  badge,
  onClick,
}: {
  href: string;
  icon: typeof Bell;
  label: string;
  badge?: number;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-label={badge ? `${label} (${badge} não lidas)` : label}
      title={label}
      className="relative inline-flex size-9 items-center justify-center rounded-xl text-ink-soft transition-colors hover:bg-brand-soft hover:text-brand"
    >
      <Icon className="size-5" aria-hidden="true" />
      {badge && badge > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 inline-flex size-4 items-center justify-center rounded-full bg-pink text-[10px] font-bold text-white">
          {badge > 9 ? "9+" : badge}
        </span>
      ) : null}
    </Link>
  );
}

export function NavbarShell({ user, unreadMessages = 0, unreadNotifications = 0 }: NavbarShellProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const close = () => setOpen(false);
  const hrefFor = (hash: string) => (pathname === "/" ? hash : `/${hash}`);
  const firstName = user ? user.name.split(" ")[0] : null;
  const roleLinks =
    user?.role === "prestador"
      ? providerHeaderLinks
      : user?.role === "cliente"
        ? clientHeaderLinks
        : [];

  const accountArea = user ? (
    <div className="hidden items-center gap-1.5 lg:flex">
      {user.role !== "admin" ? (
        <IconLink href="/mensagens" icon={MessageCircle} label="Mensagens" badge={unreadMessages} />
      ) : null}
      <IconLink href="/notificacoes" icon={Bell} label="Notificações" badge={unreadNotifications} />
      <AccountMenu user={user} />
    </div>
  ) : (
    <div className="hidden items-center gap-2 lg:flex">
      <ButtonLink href="/entrar" variant="ghost" size="sm">
        Entrar
      </ButtonLink>
      <ButtonLink href="/cadastro" variant="primary" size="sm">
        Cadastre-se
      </ButtonLink>
    </div>
  );

  const accountAreaMobile = user ? (
    <div className="mt-3 flex flex-col gap-2">
      <div className="flex gap-1">
        {user.role !== "admin" ? (
          <IconLink href="/mensagens" icon={MessageCircle} label="Mensagens" badge={unreadMessages} onClick={close} />
        ) : null}
        <IconLink href="/notificacoes" icon={Bell} label="Notificações" badge={unreadNotifications} onClick={close} />
        <IconLink href="/configuracoes" icon={Settings} label="Configurações" onClick={close} />
        {user.role === "admin" ? (
          <IconLink href="/admin" icon={LayoutDashboard} label="Painel admin" onClick={close} />
        ) : user.role === "prestador" ? (
          <IconLink href="/painel" icon={LayoutDashboard} label="Painel" onClick={close} />
        ) : (
          <IconLink href="/cliente" icon={LayoutDashboard} label="Meu painel" onClick={close} />
        )}
      </div>
      <p className="px-3 text-sm font-medium text-ink">Olá, {firstName}</p>
      <form action={logoutAction}>
        <button
          type="submit"
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-line-strong px-5 text-sm font-medium text-ink-soft transition-colors hover:border-brand hover:text-brand"
        >
          <LogOut className="size-4" aria-hidden="true" />
          Sair da conta
        </button>
      </form>
    </div>
  ) : (
    <div className="mt-3 flex flex-col gap-2">
      <ButtonLink href="/entrar" variant="secondary" size="md" onClick={close}>
        Entrar
      </ButtonLink>
      <ButtonLink href="/cadastro" variant="primary" size="md" onClick={close}>
        Cadastre-se
      </ButtonLink>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-nav-border bg-nav-bg/90 backdrop-blur-xl">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href={pathname === "/" ? "#top" : "/"} onClick={close} aria-label="Festeja — início">
            <Logo size="sm" />
          </Link>

          <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
            {pathname === "/" && !user
              ? homeLinks.map((link) => (
                  <a
                    key={link.hash}
                    href={hrefFor(link.hash)}
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-ink-soft transition-colors hover:bg-brand-soft hover:text-brand"
                  >
                    {link.label}
                  </a>
                ))
              : user?.role === "admin" ? (
                  <Suspense fallback={<AdminNavFallback />}>
                    <AdminNavItems pathname={pathname} />
                  </Suspense>
                ) : roleLinks.map((link) => (
                  <NavLink
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    isActive={isPathActive(pathname, link.href)}
                  />
                ))}
          </nav>

          {accountArea}

          <MobileNavigation
            user={user}
            unreadMessages={unreadMessages}
            unreadNotifications={unreadNotifications}
          />

          <div className="hidden md:block lg:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="size-10 px-0 lg:hidden"
                  aria-label="Abrir menu"
                >
                  <Menu className="size-5" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent className="hidden p-6 pt-18 md:flex lg:hidden">
                <SheetHeader className="sr-only">
                  <SheetTitle>Menu principal</SheetTitle>
                  <SheetDescription>Navegue pelo Festeja e acesse sua conta.</SheetDescription>
                </SheetHeader>

                <Link href={pathname === "/" ? "#top" : "/"} onClick={close} className="mb-5 w-fit">
                  <Logo size="md" />
                </Link>

                <nav aria-label="Menu móvel" className="flex flex-col gap-1">
                  {pathname === "/" && !user
                    ? homeLinks.map((link) => (
                        <a
                          key={link.hash}
                          href={hrefFor(link.hash)}
                          onClick={close}
                          className="rounded-xl px-4 py-3 text-base font-semibold text-ink transition-colors hover:bg-brand-soft hover:text-brand"
                        >
                          {link.label}
                        </a>
                      ))
                    : user?.role === "admin" ? (
                        <Suspense fallback={<AdminNavFallback mobile />}>
                          <AdminNavItems mobile pathname={pathname} onClick={close} />
                        </Suspense>
                      ) : roleLinks.map((link) => (
                        <MobileNavLink
                          key={link.href}
                          href={link.href}
                          label={link.label}
                          isActive={isPathActive(pathname, link.href)}
                          onClick={close}
                        />
                      ))}
                </nav>
                <div className="mt-auto border-t border-line pt-4">{accountAreaMobile}</div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Container>
    </header>
  );
}

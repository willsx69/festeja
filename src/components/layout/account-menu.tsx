"use client";

import Link from "next/link";
import { ChevronDown, LayoutDashboard, LogOut, Settings, UserRound } from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { AccountAvatar } from "@/components/layout/account-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAccountNavigation } from "@/lib/account-navigation";
import type { SessionUser } from "@/types";

export function AccountMenu({ user }: { user: SessionUser }) {
  const firstName = user.name.split(" ")[0];
  const navigation = getAccountNavigation(user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Abrir menu da conta de ${user.name}`}
          className="group ml-1 inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-transparent py-0.5 pl-0.5 pr-2 text-ink transition-colors hover:border-line-strong hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-ring/70"
        >
          <AccountAvatar user={user} className="size-9 transition-transform group-data-[state=open]:scale-[0.96]" />
          <span className="hidden max-w-28 truncate text-sm font-semibold xl:block">
            {firstName}
          </span>
          <ChevronDown
            className="size-4 text-ink-faint transition-transform group-data-[state=open]:rotate-180"
            aria-hidden="true"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>
          <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
          <p className="mt-0.5 truncate text-xs font-normal text-ink-faint">{user.email}</p>
          <p className="mt-1.5 w-fit rounded-full bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand">
            {navigation.roleLabel}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={navigation.profileHref}>
            <UserRound aria-hidden="true" />
            Meu perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={navigation.panelHref}>
            <LayoutDashboard aria-hidden="true" />
            Meu painel
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/configuracoes">
            <Settings aria-hidden="true" />
            Configurações
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action={logoutAction}>
          <DropdownMenuItem
            className="text-danger focus:bg-danger-soft focus:text-danger"
            onSelect={(event) => {
              event.preventDefault();
              (event.currentTarget as HTMLElement | null)?.closest("form")?.requestSubmit();
            }}
          >
            <LogOut aria-hidden="true" />
            Sair
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

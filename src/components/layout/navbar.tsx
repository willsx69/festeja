import { Suspense } from "react";
import { connection } from "next/server";
import { NavbarShell } from "@/components/layout/navbar-shell";
import { getCurrentUser } from "@/lib/auth";
import { countUnreadMessages, countUnreadNotifications } from "@/lib/db";

async function NavbarSession() {
  await connection();
  const user = await getCurrentUser();

  if (!user) {
    return <NavbarShell state="unauthenticated" />;
  }

  const [unreadMessages, unreadNotifications] = await Promise.all([
    user.role === "admin" ? Promise.resolve(0) : countUnreadMessages(user.id),
    countUnreadNotifications(user.id),
  ]);

  return (
    <NavbarShell
      state="authenticated"
      user={user}
      unreadMessages={unreadMessages}
      unreadNotifications={unreadNotifications}
    />
  );
}

export function Navbar() {
  return (
    <Suspense fallback={<NavbarShell state="loading" />}>
      <NavbarSession />
    </Suspense>
  );
}

import { Suspense } from "react";
import { connection } from "next/server";
import { NavbarShell } from "@/components/layout/navbar-shell";
import { getCurrentUser } from "@/lib/auth";
import { countUnreadMessages, countUnreadNotifications } from "@/lib/db";

async function NavbarSession() {
  await connection();
  const user = await getCurrentUser();
  let unreadMessages = 0;
  let unreadNotifications = 0;
  if (user) {
    unreadMessages = await countUnreadMessages(user.id);
    unreadNotifications = await countUnreadNotifications(user.id);
  }
  return (
    <NavbarShell
      user={user ?? null}
      unreadMessages={unreadMessages}
      unreadNotifications={unreadNotifications}
    />
  );
}

export function Navbar() {
  return (
    <Suspense fallback={<NavbarShell user={null} />}>
      <NavbarSession />
    </Suspense>
  );
}

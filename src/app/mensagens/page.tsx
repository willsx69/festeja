import { Suspense } from "react";
import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { MessagesPage } from "@/components/messages/messages-page";
import { MessagesSkeleton } from "@/components/messages/messages-skeleton";
import { requireUser } from "@/lib/auth";
import { getOrCreateConversation, getProviderUserId } from "@/lib/db";

export const metadata: Metadata = {
  title: "Mensagens",
  description: "Converse com clientes e prestadores sobre seus eventos.",
};

export const instant = false;

async function MessagesContent({
  searchParams,
  userId,
  role,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  userId: string;
  role: "cliente" | "prestador" | "admin";
}) {
  const sp = await searchParams;
  const selected = typeof sp.con === "string" ? sp.con : undefined;
  const startWith = typeof sp.com === "string" ? sp.com : undefined;

  let selectedId = selected;
  if (!selectedId && startWith && role === "cliente") {
    const providerUserId = await getProviderUserId(startWith);
    if (providerUserId) {
      selectedId = await getOrCreateConversation(userId, providerUserId);
    }
  }

  return <MessagesPage userRole={role} userId={userId} selectedId={selectedId} />;
}

export default async function MensagensRoute({
  searchParams,
}: PageProps<"/mensagens">) {
  const user = await requireUser(["cliente", "prestador"]);

  return (
    <div id="top" className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1 bg-canvas">
        <Suspense fallback={<MessagesSkeleton />}>
          <MessagesContent searchParams={searchParams} userId={user.id} role={user.role} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

import { Suspense, type ReactNode } from "react";
import { ClienteNav } from "@/components/cliente/cliente-nav";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";
import { requireUser } from "@/lib/auth";

function ClienteFallback() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1 bg-canvas">
        <Container className="space-y-5 py-8 sm:py-10">
          <Skeleton className="h-12 w-72 max-w-full" />
          <Skeleton className="h-52 rounded-[1.75rem]" />
          <Skeleton className="h-12" />
          <Skeleton className="h-44" />
        </Container>
      </main>
      <Footer />
    </div>
  );
}

async function ClienteShell({ children }: { children: ReactNode }) {
  await requireUser(["cliente"], "/cliente");

  return (
    <div id="top" className="flex min-h-dvh flex-col">
      <Navbar />
      <ClienteNav />
      <main className="flex-1 bg-canvas">{children}</main>
      <Footer />
    </div>
  );
}

export default function ClienteLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<ClienteFallback />}>
      <ClienteShell>{children}</ClienteShell>
    </Suspense>
  );
}

import { Suspense, type ReactNode } from "react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { PainelHeader } from "@/components/painel/painel-header";
import { PainelNav } from "@/components/painel/painel-nav";
import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";
import { requireUser } from "@/lib/auth";
import { getProviderProfileDetails, getProviderUserId } from "@/lib/db";

function PainelFallback() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1 bg-canvas">
        <Container className="space-y-6 py-10">
          <Skeleton className="h-44 rounded-[1.75rem] sm:h-40" />
          <Skeleton className="h-12" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[0, 1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-36" />
            ))}
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

async function PainelShell({ children }: { children: ReactNode }) {
  const user = await requireUser(["prestador"]);
  const profileUsername =
    user.username && (await getProviderUserId(user.username)) ? user.username : undefined;
  const details = profileUsername
    ? await getProviderProfileDetails(profileUsername)
    : undefined;

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1 bg-canvas">
        <Container className="py-5 sm:py-7">
          {details ? (
            <PainelHeader details={details} />
          ) : (
            <div className="rounded-[1.75rem] border border-line bg-surface p-6 shadow-card">
              <h1 className="text-2xl font-extrabold tracking-[-0.035em] text-ink">
                {user.name}
              </h1>
              <p className="mt-1.5 text-sm font-medium text-ink-faint">
                Perfil público não configurado
              </p>
            </div>
          )}
        </Container>

        {profileUsername && details ? (
          <>
            <PainelNav />
            <Container className="py-8 sm:py-10">{children}</Container>
          </>
        ) : (
          <Container className="py-8">
            <div className="rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-12 text-center">
              <p className="text-base font-semibold text-ink">Perfil profissional não encontrado</p>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-ink-soft">
                Sua conta está autenticada, mas ainda não possui um perfil de prestador
                associado. O painel profissional fica disponível após a criação desse perfil.
              </p>
            </div>
          </Container>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default function PainelLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<PainelFallback />}>
      <PainelShell>{children}</PainelShell>
    </Suspense>
  );
}

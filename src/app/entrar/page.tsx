import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { getCurrentUser } from "@/lib/auth";
import { getPostAuthPath, getSafeReturnPath } from "@/lib/auth-redirect";

export const metadata: Metadata = {
  title: "Entrar",
  description:
    "Acesse sua conta Festeja para conversar com prestadores, acompanhar pedidos e avaliar quem fez a festa acontecer.",
};

async function LoginContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [user, params] = await Promise.all([getCurrentUser(), searchParams]);
  const returnValue = typeof params.retorno === "string" ? params.retorno : undefined;
  if (user) redirect(getPostAuthPath(user.role, returnValue));

  return <LoginForm returnTo={getSafeReturnPath(returnValue)} />;
}

export default function EntrarPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <div id="top" className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1">
        <AuthShell
          title="Bem-vindo de volta"
          description="Entre para continuar de onde parou: conversas com prestadores, orçamentos, pedidos e avaliações em um lugar só."
        >
          <Suspense fallback={<div className="h-80 animate-pulse rounded-xl bg-surface-muted" />}>
            <LoginContent searchParams={searchParams} />
          </Suspense>
        </AuthShell>
      </main>
      <Footer />
    </div>
  );
}

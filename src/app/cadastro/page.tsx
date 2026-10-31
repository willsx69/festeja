import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { getCurrentUser } from "@/lib/auth";
import { getPostAuthPath, getSafeReturnPath } from "@/lib/auth-redirect";

export const metadata: Metadata = {
  title: "Criar conta",
  description:
    "Crie sua conta Festeja grátis: contrate prestadores para sua festa ou divulgue seus serviços e receba pedidos.",
};

async function SignupContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [user, params] = await Promise.all([getCurrentUser(), searchParams]);
  const returnValue = typeof params.retorno === "string" ? params.retorno : undefined;
  if (user) redirect(getPostAuthPath(user.role, returnValue));

  return <SignupForm returnTo={getSafeReturnPath(returnValue)} />;
}

export default function CadastroPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <div id="top" className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1">
        <AuthShell
          title="Sua festa começa aqui"
          description="Crie sua conta grátis para guardar seus favoritos, falar com prestadores e acompanhar todos os pedidos do seu evento."
        >
          <Suspense
            fallback={
              <div className="h-96 animate-pulse rounded-xl bg-surface-muted" />
            }
          >
            <SignupContent searchParams={searchParams} />
          </Suspense>
        </AuthShell>
      </main>
      <Footer />
    </div>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetForm } from "@/components/auth/reset-form";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "Redefinir senha",
  description: "Crie uma nova senha para sua conta Festeja.",
};

export default function RedefinirSenhaPage({
  searchParams,
}: PageProps<"/redefinir-senha">) {
  return (
    <div id="top" className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1">
        <AuthShell
          title="Crie uma nova senha"
          description="Defina uma nova senha com pelo menos 8 caracteres para proteger sua conta."
        >
          <Suspense
            fallback={
              <div className="h-64 animate-pulse rounded-xl bg-surface-muted" />
            }
          >
            <ResetFormWrapper searchParams={searchParams} />
          </Suspense>
        </AuthShell>
      </main>
      <Footer />
    </div>
  );
}

async function ResetFormWrapper({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const token = typeof sp.token === "string" ? sp.token : "";
  return <ResetForm token={token} />;
}

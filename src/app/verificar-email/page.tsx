import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "Confirmar e-mail",
  description: "Confirme seu endereço de e-mail na Festeja.",
};

export default function VerificarEmailPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <div id="top" className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1">
        <AuthShell
          title="Confirme seu e-mail"
          description="A verificação ajuda a proteger sua conta e confirma que o endereço informado pertence a você."
        >
          <Suspense
            fallback={
              <div className="h-44 animate-pulse rounded-xl bg-surface-muted" />
            }
          >
            <VerifyEmailFormWrapper searchParams={searchParams} />
          </Suspense>
        </AuthShell>
      </main>
      <Footer />
    </div>
  );
}

async function VerifyEmailFormWrapper({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";
  return <VerifyEmailForm token={token} />;
}

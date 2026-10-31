import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { RecoveryForm } from "@/components/auth/recovery-form";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "Esqueci minha senha",
  description: "Recupere o acesso à sua conta Festeja.",
};

export default function EsqueciSenhaPage() {
  return (
    <div id="top" className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1">
        <AuthShell
          title="Recupere seu acesso"
          description="Informe o e-mail da sua conta e enviaremos as instruções para criar uma nova senha."
        >
          <RecoveryForm />
          <p className="mt-4 text-center text-sm text-ink-soft">
            Lembrou a senha?{" "}
            <Link
              href="/entrar"
              className="font-medium text-brand transition-colors hover:text-brand-strong"
            >
              Voltar para o login
            </Link>
          </p>
        </AuthShell>
      </main>
      <Footer />
    </div>
  );
}

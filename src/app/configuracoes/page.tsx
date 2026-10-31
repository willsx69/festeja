import { Suspense } from "react";
import type { Metadata } from "next";
import { Camera, KeyRound, User } from "lucide-react";
import { AccountForm } from "@/components/settings/account-form";
import { AvatarCard } from "@/components/settings/avatar-card";
import { DeleteAccountCard } from "@/components/settings/delete-account-card";
import { EmailVerification } from "@/components/settings/email-verification";
import { PasswordForm } from "@/components/settings/password-form";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { requireAccountUser } from "@/lib/auth";
import { getUserProfile } from "@/lib/db";

export const metadata: Metadata = {
  title: "Configurações",
  description: "Edite seus dados pessoais, foto e senha.",
};

export const instant = false;

async function ConfiguracoesData() {
  const user = await requireAccountUser();
  const profile = await getUserProfile(user.id);
  if (!profile) {
    return (
      <Container className="py-10">
        <p className="rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-12 text-center text-sm text-ink-soft">
          Não foi possível carregar seus dados. Tente novamente.
        </p>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <div>
        <h1 className="text-2xl font-semibold uppercase tracking-[0.04em] text-ink sm:text-3xl">
          Configurações
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">
          Gerencie seus dados pessoais, foto de perfil e senha.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <section id="dados-pessoais" aria-label="Dados pessoais" className="scroll-mt-24">
            <Card>
              <div className="flex items-center gap-2 border-b border-line pb-4">
                <User className="size-5 text-brand" aria-hidden="true" />
                <h2 className="text-base font-semibold uppercase tracking-[0.04em] text-ink">
                  Dados pessoais
                </h2>
              </div>
              <div className="pt-4">
                <AccountForm
                  initialName={profile.name}
                  initialEmail={profile.email}
                  initialPhone={profile.phone ?? ""}
                />
              </div>
              <div className="mt-4 border-t border-line pt-4">
                <EmailVerification
                  email={profile.email}
                  verified={profile.emailVerified}
                />
              </div>
            </Card>
          </section>

          <section aria-label="Alterar senha">
            <Card>
              <div className="flex items-center gap-2 border-b border-line pb-4">
                <KeyRound className="size-5 text-brand" aria-hidden="true" />
                <h2 className="text-base font-semibold uppercase tracking-[0.04em] text-ink">
                  Alterar senha
                </h2>
              </div>
              <div className="pt-4">
                <PasswordForm />
              </div>
            </Card>
          </section>

          <section aria-label="Excluir conta">
            <DeleteAccountCard />
          </section>
        </div>

        <aside>
          <Card>
            <div className="flex items-center gap-2 border-b border-line pb-4">
              <Camera className="size-5 text-brand" aria-hidden="true" />
              <h2 className="text-base font-semibold uppercase tracking-[0.04em] text-ink">
                Foto de perfil
              </h2>
            </div>
            <div className="pt-4">
              <AvatarCard currentAvatar={profile.avatar ?? null} userName={profile.name} />
            </div>
          </Card>

          {profile.role === "prestador" && profile.username ? (
            <Card className="mt-6 bg-surface-muted">
              <p className="text-sm font-semibold text-ink">Perfil público</p>
              <p className="mt-1 text-sm text-ink-soft">
                Edite sua bio, capa, serviços e disponibilidade no painel do prestador.
              </p>
              <a
                href="/painel/perfil"
                className="mt-3 inline-flex text-sm font-medium text-brand transition-colors hover:text-brand-strong"
              >
                Abrir painel do prestador →
              </a>
            </Card>
          ) : null}
        </aside>
      </div>
    </Container>
  );
}

export default function ConfiguracoesPage() {
  return (
    <div id="top" className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1 bg-canvas">
        <Suspense
          fallback={
            <Container className="py-10">
              <div className="h-9 w-64 animate-pulse rounded-lg bg-surface-muted" />
              <div className="mt-6 h-72 animate-pulse rounded-2xl bg-surface-muted" />
            </Container>
          }
        >
          <ConfiguracoesData />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

import type { Metadata } from "next";
import { ClienteFavoritesGrid } from "@/components/cliente/cliente-favorites-grid";
import { ClientePageHeader } from "@/components/cliente/cliente-page-header";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { requireUser } from "@/lib/auth";
import { listFavorites } from "@/lib/db";

export const metadata: Metadata = {
  title: "Meus favoritos",
  description: "Profissionais salvos para comparar depois.",
};

export default async function ClienteFavoritosPage() {
  const user = await requireUser(["cliente"], "/cliente/favoritos");
  const favorites = await listFavorites(user.id);

  return (
    <Container className="py-8 sm:py-10">
      <ClientePageHeader title="Favoritos" description="Sua seleção de profissionais para comparar antes de decidir." action={<ButtonLink href="/buscar" variant="secondary">Encontrar profissionais</ButtonLink>} />
      <ClienteFavoritesGrid initialItems={favorites} />
    </Container>
  );
}

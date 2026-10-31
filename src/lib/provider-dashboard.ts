import type { ProviderProfileDetails } from "@/lib/db";

type CompletionInput = {
  details: ProviderProfileDetails;
  servicesCount: number;
  portfolioCount: number;
};

export type ProfileCompletionItem = {
  id: string;
  label: string;
  complete: boolean;
  href: string;
};

export type ProfileCompletion = {
  percentage: number;
  completed: number;
  total: number;
  items: ProfileCompletionItem[];
  missing: ProfileCompletionItem[];
};

export function calculateProfileCompletion({
  details,
  servicesCount,
  portfolioCount,
}: CompletionInput): ProfileCompletion {
  const items: ProfileCompletionItem[] = [
    {
      id: "photo",
      label: "Adicionar foto de perfil",
      complete: Boolean(details.avatar),
      href: "/configuracoes",
    },
    {
      id: "cover",
      label: "Adicionar imagem de capa",
      complete: Boolean(details.cover),
      href: "/painel/perfil",
    },
    {
      id: "bio",
      label: "Escrever uma apresentação completa",
      complete: details.bio.trim().length >= 40,
      href: "/painel/perfil",
    },
    {
      id: "category",
      label: "Definir a categoria profissional",
      complete: Boolean(details.category),
      href: "/painel/perfil",
    },
    {
      id: "services",
      label: "Cadastrar pelo menos um serviço",
      complete: servicesCount > 0,
      href: "/painel/servicos",
    },
    {
      id: "portfolio",
      label: "Publicar pelo menos um trabalho",
      complete: portfolioCount > 0,
      href: "/painel/portfolio",
    },
    {
      id: "availability",
      label: "Informar disponibilidade e prazos",
      complete:
        details.availabilityDays.length > 0 &&
        Boolean(details.responseTime.trim()) &&
        Boolean(details.minimumNotice.trim()),
      href: "/painel/perfil",
    },
    {
      id: "location",
      label: "Informar a localização profissional",
      complete: Boolean(
        details.city.trim() && details.state.trim() && details.neighborhood.trim(),
      ),
      href: "/painel/perfil",
    },
  ];
  const completed = items.filter((item) => item.complete).length;

  return {
    percentage: Math.round((completed / items.length) * 100),
    completed,
    total: items.length,
    items,
    missing: items.filter((item) => !item.complete),
  };
}

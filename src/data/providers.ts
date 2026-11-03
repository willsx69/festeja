import { cache } from "react";
import {
  getAllProviders as queryAllProviders,
  getProviderByUsername,
} from "@/lib/db";
import type { Provider } from "@/types";

const featuredPortraits: Record<string, string> = {
  "ana-beatriz-confeitaria": "/images/providers/ana-beatriz-confeitaria.webp",
  "buffet-sabor-e-festa": "/images/providers/buffet-sabor-e-festa.webp",
  "dj-marcelo-vibe": "/images/providers/dj-marcelo-vibe.webp",
  "estudio-lume-fotografia": "/images/providers/estudio-lume-fotografia.webp",
  "decora-mimo": "/images/providers/decora-mimo.webp",
  "trio-festa-alegre": "/images/providers/trio-festa-alegre.webp",
};

export function resolveProviderAvatar(
  id: string,
  avatar?: string | null,
): Pick<Provider, "avatar" | "portraitIllustrative"> {
  if (avatar) return { avatar, portraitIllustrative: false };

  const portrait = featuredPortraits[id];
  return portrait ? { avatar: portrait, portraitIllustrative: true } : {};
}

function withPortrait(provider: Provider): Provider {
  return {
    ...provider,
    ...resolveProviderAvatar(provider.id, provider.avatar),
  };
}

export const getAllProviders = cache(async (): Promise<Provider[]> => {
  return (await queryAllProviders()).map(withPortrait);
});

export const getFeaturedProviders = cache(async (): Promise<Provider[]> => {
  return (await getAllProviders()).filter((provider) => provider.featured);
});

export const getProvider = cache(async (id: string): Promise<Provider | undefined> => {
  const provider = await getProviderByUsername(id);
  return provider ? withPortrait(provider) : undefined;
});

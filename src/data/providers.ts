import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  getAllProviders as queryAllProviders,
  getFeaturedProviders as queryFeaturedProviders,
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
  if (!portrait) return {};

  const portraitPath = join(process.cwd(), "public", portrait.slice(1));
  return existsSync(portraitPath)
    ? { avatar: portrait, portraitIllustrative: true }
    : {};
}

function withPortrait(provider: Provider): Provider {
  return {
    ...provider,
    ...resolveProviderAvatar(provider.id, provider.avatar),
  };
}

export async function getAllProviders(): Promise<Provider[]> {
  return (await queryAllProviders()).map(withPortrait);
}

export async function getFeaturedProviders(): Promise<Provider[]> {
  return (await queryFeaturedProviders()).map(withPortrait);
}

export async function getProvider(id: string): Promise<Provider | undefined> {
  const provider = await getProviderByUsername(id);
  return provider ? withPortrait(provider) : undefined;
}

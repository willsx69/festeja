import { getProviderProfile as queryProviderProfile, getProfileUsernames } from "@/lib/db";
import type { CategoryId, ProviderProfile } from "@/types";

export async function getProviderProfile(
  provider: { id: string; category?: CategoryId },
): Promise<ProviderProfile | undefined> {
  void provider.category;
  return queryProviderProfile(provider.id);
}

export async function getProfileIds(): Promise<string[]> {
  return getProfileUsernames();
}

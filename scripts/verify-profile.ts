import { getCategory } from "@/data/categories";
import { getProfileIds, getProviderProfile } from "@/data/provider-profiles";
import {
  getAllProviders,
  getProvider,
  resolveProviderAvatar,
} from "@/data/providers";
import { hasPrice } from "@/lib/format";
import type { WeekDay } from "@/types";

const validDays: WeekDay[] = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"];

let failures = 0;

function check(label: string, condition: boolean, extra?: unknown) {
  if (condition) {
    console.log(`  ok   ${label}`);
  } else {
    failures++;
    console.log(`  FAIL ${label}`, extra ?? "");
  }
}

async function main() {
const allProviders = await getAllProviders();
const profileIds = await getProfileIds();

console.log("cobertura");
check("20 prestadores", allProviders.length === 20, allProviders.length);
check("20 perfis", profileIds.length === 20, profileIds.length);
check(
  "todo prestador tem perfil",
  allProviders.every((provider) => profileIds.includes(provider.id)),
);
check(
  "nenhum perfil órfão",
  profileIds.every((id) => allProviders.some((provider) => provider.id === id)),
);
check(
  "nenhum texto repetido",
  new Set(
    await Promise.all(
      allProviders.map(async (provider) => (await getProviderProfile(provider))?.about),
    ),
  ).size === 20,
);
const demoPortraitIds = [
  "ana-beatriz-confeitaria",
  "buffet-sabor-e-festa",
  "dj-marcelo-vibe",
  "estudio-lume-fotografia",
  "decora-mimo",
  "trio-festa-alegre",
];
const providersWithDemoPortrait = allProviders
  .filter((provider) => provider.portraitIllustrative)
  .map((provider) => provider.id)
  .sort();
check(
  "somente os seis perfis demonstrativos recebem retrato ilustrativo",
  providersWithDemoPortrait.join() === [...demoPortraitIds].sort().join(),
  providersWithDemoPortrait,
);
const demoPortraitsMatch = await (async () => {
  for (const id of demoPortraitIds) {
    if ((await getProvider(id))?.avatar !== `/images/providers/${id}.webp`) {
      return false;
    }
  }
  return true;
})();
check(
  "retratos demonstrativos apontam para os arquivos correspondentes",
  demoPortraitsMatch,
);
const uploadedAvatar = resolveProviderAvatar(
  "ana-beatriz-confeitaria",
  "/uploads/prestador/avatar-real.webp",
);
check(
  "avatar enviado pelo prestador tem prioridade sobre o demonstrativo",
  uploadedAvatar.avatar === "/uploads/prestador/avatar-real.webp" &&
    uploadedAvatar.portraitIllustrative === false,
  uploadedAvatar,
);
check(
  "preços zerados ou ausentes são tratados como sob consulta",
  !hasPrice(0) && !hasPrice(-10) && !hasPrice(null) && !hasPrice(undefined),
);
check("preços positivos são exibidos normalmente", hasPrice(1) && hasPrice(350));

console.log("conteúdo do perfil");
const globalIds = new Set<string>();

for (const provider of allProviders) {
  const profile = await getProviderProfile(provider);
  const category = getCategory(provider.category);

  if (!profile) {
    check(`perfil de ${provider.id}`, false);
    continue;
  }

  const label = provider.id;
  const providerRecord = await getProvider(provider.id);
  const ok =
    providerRecord?.id === provider.id &&
    profile.id === provider.id &&
    profile.about.trim().length >= 120 &&
    profile.portfolio.length >= 3 &&
    profile.services.length >= 3 &&
    profile.reviews.length >= 2 &&
    profile.availability.days.length >= 2 &&
    profile.availability.days.every((day) => validDays.includes(day)) &&
    profile.availability.responseTime.length > 0 &&
    profile.availability.minimumNotice.length > 0 &&
    category.name.length > 0;

  check(`${label} — estrutura completa`, ok);

  const ids = [
    ...profile.portfolio.map((item) => item.id),
    ...profile.services.map((item) => item.id),
    ...profile.reviews.map((item) => item.id),
  ];
  check(`${label} — ids únicos`, new Set(ids).size === ids.length);
  check(
    `${label} — ids não colidem entre perfis`,
    ids.every((id) => !globalIds.has(id)),
  );
  ids.forEach((id) => globalIds.add(id));

  check(
    `${label} — preços válidos`,
    profile.services.every((service) => service.price > 0 && service.name.length > 0),
  );
  check(
    `${label} — avaliações válidas`,
    profile.reviews.every(
      (review) => review.rating >= 1 && review.rating <= 5 && review.comment.length > 10,
    ),
  );
  check(
    `${label} — portfolio com legenda`,
    profile.portfolio.every((item) => item.title.length > 0 && item.meta.length > 0),
  );
  check(
    `${label} — dias únicos`,
    new Set(profile.availability.days).size === profile.availability.days.length,
  );
}

console.log("disponibilidade");
const dj = await getProviderProfile({ id: "dj-marcelo-vibe", category: "dj" });
check("padrão da categoria dj", dj?.availability.days.join() === "sex,sab,dom", dj?.availability.days);
const bruno = await getProviderProfile({ id: "dj-bruno-costa", category: "dj" });
check(
  "sobrescrita por prestador",
  bruno?.availability.days.join() === "sex,sab" &&
    bruno?.availability.note.includes("deslocamento"),
  bruno?.availability,
);
const confeitaria = await getProviderProfile({
  id: "ana-beatriz-confeitaria",
  category: "confeitaria",
});
check(
  "padrão da categoria confeitaria",
  confeitaria?.availability.days.join() === "seg,ter,qua,qui,sex",
  confeitaria?.availability.days,
);
check(
  "perfil desconhecido devolve undefined",
  (await getProviderProfile({ id: "nao-existe", category: "dj" })) === undefined,
);

console.log("");
console.log(failures === 0 ? "TODOS OS TESTES PASSARAM" : `${failures} FALHA(S)`);
process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

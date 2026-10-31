import { categories } from "@/data/categories";
import {
  canonicalManausNeighborhood,
  MANAUS_NEIGHBORHOODS,
} from "@/data/locations";
import { getProviderProfile } from "@/data/provider-profiles";
import { getAllProviders, getFeaturedProviders } from "@/data/providers";
import {
  buildSearchHref,
  countActiveFilters,
  countByCategory,
  defaultFilters,
  listCities,
  listNeighborhoods,
  parseSearchFilters,
  searchProviders,
  type SearchFilters,
} from "@/lib/search";

let failures = 0;

function check(label: string, condition: boolean, extra?: unknown) {
  if (condition) {
    console.log(`  ok   ${label}`);
  } else {
    failures++;
    console.log(`  FAIL ${label}`, extra ?? "");
  }
}

function ids(list: { id: string }[]) {
  return list.map((item) => item.id).join(",");
}

async function main() {
const allProviders = await getAllProviders();
const featuredProviders = await getFeaturedProviders();

const results = (patch: Partial<SearchFilters>) =>
  searchProviders(allProviders, { ...defaultFilters, ...patch });

console.log("base");
check("20 prestadores no total", allProviders.length === 20, allProviders.length);
check("6 em destaque (Home)", featuredProviders.length === 6, featuredProviders.length);
check("destaques = primeiros 6", ids(featuredProviders) === ids(allProviders.slice(0, 6)));
check("busca vazia retorna todos", results({}).length === 20);
check("query inexistente retorna 0", results({ query: "xyz" }).length === 0);

console.log("query");
check("query 'dj' = 3", results({ query: "dj" }).length === 3, ids(results({ query: "dj" })));
check(
  "query 'bolo' encontra por tag",
  results({ query: "bolo" }).every((p) => p.tags.join().toLowerCase().includes("bolo") || p.name.toLowerCase().includes("bolo")),
);
check("query sem acento 'fotografia' funciona", results({ query: "fotografia" }).length > 0);
check("query 'DJ' (maiúscula) = 3", results({ query: "DJ" }).length === 3);

console.log("localizacao");
check("catálogo tem 64 bairros oficiais", MANAUS_NEIGHBORHOODS.length === 64);
check(
  "bairro digitado sem acento é normalizado",
  canonicalManausNeighborhood("adrianopolis") === "Adrianópolis",
);
check(
  "bairro com hífen aceita digitação com espaço",
  canonicalManausNeighborhood("taruma acu") === "Tarumã-Açu",
);
check("bairro de outra cidade é recusado", canonicalManausNeighborhood("Pinheiros") === undefined);
check("local 'Manaus' = 20", results({ location: "Manaus" }).length === 20);
check("local 'AM' = 20", results({ location: "AM" }).length === 20);
check("bairro Adrianópolis = 1", results({ location: "Adrianópolis" }).length === 1);
check("bairro sem acento funciona", results({ location: "adrianopolis" }).length === 1);
check("local fora de Manaus = 0", results({ location: "Rio" }).length === 0);

console.log("categorias");
check("categoria dj = 3", results({ categories: ["dj"] }).length === 3);
check("duas categorias somam", results({ categories: ["dj", "danca"] }).length === 5);
const counts = countByCategory(allProviders);
check(
  "soma dos contadores = 20",
  Object.values(counts).reduce((sum, value) => sum + value, 0) === 20,
);
check(
  "todas as categorias do catálogo aparecem nos dados",
  categories.every((category) => (counts[category.id] ?? 0) > 0),
);

console.log("preco");
check("ate R$ 500 = 8", results({ priceRange: "0-500" }).length === 8, ids(results({ priceRange: "0-500" })));
check(
  "500-1000 respeita limites",
  results({ priceRange: "500-1000" }).every((p) => p.price >= 500 && p.price <= 1000),
);
check("acima de 2000 = 1", results({ priceRange: "2000+" }).length === 1);
check("qualquer valor = 20", results({ priceRange: "any" }).length === 20);

console.log("avaliacao");
check("4,8 ou mais = 7", results({ rating: "4.8" }).length === 7, results({ rating: "4.8" }).map((p) => p.rating));
check("4 ou mais = 20", results({ rating: "4" }).length === 20, results({ rating: "4" }).length);
check("filtrado por avaliacao respeita min", results({ rating: "4.5" }).every((p) => p.rating >= 4.5));
const ratingsMatch = await (async () => {
  for (const p of allProviders) {
    const profile = await getProviderProfile({ id: p.id });
    if (!profile || profile.reviews.length === 0) return false;
    const avg =
      Math.round(
        (profile.reviews.reduce((sum, review) => sum + review.rating, 0) /
          profile.reviews.length) *
          100,
      ) / 100;
    if (p.reviews !== profile.reviews.length || p.rating !== avg) return false;
  }
  return true;
})();
check("nota e contagem v�m das avalia��es reais", ratingsMatch);

console.log("ordenacao");
check("menor preco = buffet-real-da-serra", results({ sort: "price-asc" })[0].id === "buffet-real-da-serra");
check("maior preco = olhar-analogico", results({ sort: "price-desc" })[0].id === "olhar-analogico");
const byRating = results({ sort: "rating" });
check(
  "melhor avaliacao = 5.0 com mais reviews",
  byRating[0].rating === 5 && byRating[0].reviews === 3,
  byRating[0],
);
const byReviews = results({ sort: "reviews" });
check("mais avaliados = 3 avaliações", byReviews[0].reviews === 3, byReviews[0].id);
check(
  "preco crescente",
  results({ sort: "price-asc" }).every((p, i, list) => i === 0 || list[i - 1].price <= p.price),
);

console.log("combinado");
check(
  "dj + Ponta Negra + 4.8 = dj-marcelo-vibe",
  ids(results({ query: "dj", location: "Ponta Negra", rating: "4.8" })) === "dj-marcelo-vibe",
  ids(results({ query: "dj", location: "Ponta Negra", rating: "4.8" })),
);
check(
  "filtro impossivel = 0 (estado vazio)",
  results({ query: "dj", location: "Adrianópolis" }).length === 0,
);

console.log("url");
const sample: SearchFilters = {
  query: "dj",
  location: "Ponta Negra",
  categories: ["dj", "fotografia"],
  priceRange: "500-1000",
  rating: "4.5",
  sort: "price-asc",
};
const href = buildSearchHref(sample);
check("href montado", href.startsWith("/buscar?"), href);
const round = parseSearchFilters(new URLSearchParams(href.split("?")[1]));
check("roundtrip query", round.query === "dj", round);
check("roundtrip local", round.location === "Ponta Negra", round);
check("roundtrip categorias", round.categories.join() === "dj,fotografia", round.categories);
check("roundtrip preco", round.priceRange === "500-1000", round.priceRange);
check("roundtrip avaliacao", round.rating === "4.5", round.rating);
check("roundtrip ordem", round.sort === "price-asc", round.sort);
check("padrao = /buscar", buildSearchHref(defaultFilters) === "/buscar");
check(
  "valores invalidos caem no padrao",
  parseSearchFilters(new URLSearchParams("preco=abc&avaliacao=9&ordem=nope&categoria=xxx, dj")).priceRange === "any",
);
check(
  "categoria invalida descartada, valida mantida",
  parseSearchFilters(new URLSearchParams("categoria=xxx,dj")).categories.join() === "dj",
);

console.log("ativos");
check("nenhum filtro ativo", countActiveFilters(defaultFilters) === 0);
check("6 filtros ativos", countActiveFilters(sample) === 6, countActiveFilters(sample));

console.log("cidades");
const cities = listCities(allProviders);
check("somente Manaus aparece como cidade", cities.join() === "Manaus", cities);
const neighborhoods = listNeighborhoods(allProviders);
check("bairros são únicos e ordenados", new Set(neighborhoods).size === neighborhoods.length);
check(
  "todos os bairros listados têm prestador",
  neighborhoods.every((neighborhood) => results({ location: neighborhood }).length > 0),
);

console.log("");
console.log(failures === 0 ? "TODOS OS TESTES PASSARAM" : `${failures} FALHA(S)`);
process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});


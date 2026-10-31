export const SERVICE_CITY = "Manaus";
export const SERVICE_STATE = "AM";

export const MANAUS_NEIGHBORHOODS = [
  "Adrianópolis",
  "Aleixo",
  "Alvorada",
  "Armando Mendes",
  "Betânia",
  "Cachoeirinha",
  "Centro",
  "Chapada",
  "Cidade de Deus",
  "Cidade Nova",
  "Colônia Antônio Aleixo",
  "Colônia Japonesa",
  "Colônia Oliveira Machado",
  "Colônia Santo Antônio",
  "Colônia Terra Nova",
  "Compensa",
  "Coroado",
  "Crespo",
  "Da Paz",
  "Distrito Industrial I",
  "Distrito Industrial II",
  "Dom Pedro",
  "Educandos",
  "Flores",
  "Gilberto Mestrinho",
  "Glória",
  "Japiim",
  "Jorge Teixeira",
  "Lago Azul",
  "Lírio do Vale",
  "Mauazinho",
  "Monte das Oliveiras",
  "Morro da Liberdade",
  "Nossa Senhora Aparecida",
  "Nossa Senhora das Graças",
  "Nova Cidade",
  "Nova Esperança",
  "Novo Aleixo",
  "Novo Israel",
  "Parque 10 de Novembro",
  "Petrópolis",
  "Planalto",
  "Ponta Negra",
  "Praça 14 de Janeiro",
  "Presidente Vargas",
  "Puraquequara",
  "Raiz",
  "Redenção",
  "Santa Etelvina",
  "Santa Luzia",
  "Santo Agostinho",
  "Santo Antônio",
  "São Francisco",
  "São Geraldo",
  "São Jorge",
  "São José Operário",
  "São Lázaro",
  "São Raimundo",
  "Tancredo Neves",
  "Tarumã",
  "Tarumã-Açu",
  "Vila Buriti",
  "Vila da Prata",
  "Zumbi dos Palmares",
] as const;

function normalizeLocation(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[-–—]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

const neighborhoodsByNormalizedName = new Map(
  MANAUS_NEIGHBORHOODS.map((neighborhood) => [
    normalizeLocation(neighborhood),
    neighborhood,
  ]),
);

export function canonicalManausNeighborhood(value: string): string | undefined {
  return neighborhoodsByNormalizedName.get(normalizeLocation(value));
}

export function isManausNeighborhood(value: string): boolean {
  return canonicalManausNeighborhood(value) !== undefined;
}

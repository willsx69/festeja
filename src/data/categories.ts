import type { Category, CategoryId } from "@/types";

export const categories: Category[] = [
  { id: "confeitaria", name: "Confeiteiros", tone: "brand" },
  { id: "buffet", name: "Buffets", tone: "yellow" },
  { id: "decoracao", name: "Decoradores", tone: "pink" },
  { id: "dj", name: "DJs", tone: "brand" },
  { id: "fotografia", name: "Fotógrafos", tone: "pink" },
  { id: "animacao", name: "Animadores", tone: "yellow" },
  { id: "danca", name: "Dança", tone: "brand" },
  { id: "outros", name: "Outros serviços", tone: "pink" },
];

export const categoryImages: Partial<Record<CategoryId, string>> = {
  confeitaria: "/images/categorias/01-confeitaria.png",
  buffet: "/images/categorias/02-buffet.png",
  dj: "/images/categorias/03-dj.png",
  fotografia: "/images/categorias/04-fotografia.png",
  decoracao: "/images/categorias/05-decoracao.png",
  animacao: "/images/categorias/06-animacao-infantil.png",
};

export const categoryImageAlt: Partial<Record<CategoryId, string>> = {
  confeitaria: "Bolo de dois andares decorado com flores e frutas vermelhas",
  buffet: "Bandejas de comida quente servidas em um buffet de festa",
  dj: "Mesa de mixagem com fones de ouvido sob luzes coloridas",
  fotografia: "Fotógrafo registrando um evento com a câmera na mão",
  decoracao: "Mesa posta com arranjos de flores e balões em tons de rosa e roxo",
  animacao: "Animadora brincando com crianças em uma festa infantil",
};

export function getCategory(id: CategoryId): Category {
  return categories.find((category) => category.id === id) ?? categories[0];
}

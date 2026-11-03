import {
  MAX_UPLOAD_SIZE,
  MAX_UPLOAD_SIZE_LABEL,
  PROFILE_IMAGE_ACCEPT,
  isProfileImageType,
} from "@/lib/upload-policy";

export type ProfilePhotoKind = "avatar" | "cover";

export type CropRequest = {
  kind: ProfilePhotoKind;
  file: File;
  src: string;
};

export const PROFILE_PHOTO_CONFIG = {
  avatar: {
    kind: "avatar",
    scope: "avatar",
    stepTitle: "Personalize sua foto de perfil",
    cardTitle: "Foto de perfil",
    intro:
      "Ela identifica você nas buscas, mensagens, avaliações e cartões de prestadores.",
    where: [
      { icon: "Search", label: "Buscas" },
      { icon: "LayoutGrid", label: "Cartões" },
      { icon: "MessageSquare", label: "Mensagens" },
      { icon: "Star", label: "Avaliações" },
    ],
    tip: "Use seu rosto ou o logotipo do seu negócio, centralizado e com boa luz.",
    frameLabel: "Formato quadrado",
    sendLabel: "Enviar foto de perfil",
    replaceLabel: "Substituir foto de perfil",
    removeLabel: "Remover foto de perfil",
    confirmRemoveText: "A foto deixa de aparecer em todo o Festeja.",
    savedMessage: "Foto de perfil atualizada.",
    removedMessage: "Foto de perfil removida.",
    dialogTitle: "Ajustar foto de perfil",
    dialogDescription:
      "Arraste a imagem para posicionar o rosto e use o zoom para enquadrar. O resultado será quadrado.",
    recommendation: "Recomendado: 400 × 400 px ou maior",
    aspectRatio: 1,
    outputWidth: 800,
    outputType: "image/jpeg",
    outputExtension: "jpg",
    outputQuality: 0.92,
  },
  cover: {
    kind: "cover",
    scope: "provider",
    stepTitle: "Personalize sua foto de capa",
    cardTitle: "Foto de capa",
    intro:
      "Ela aparece no topo do seu perfil público e nos cartões de resultado da busca.",
    where: [
      { icon: "PanelTop", label: "Topo do perfil" },
      { icon: "LayoutGrid", label: "Cartões" },
      { icon: "Search", label: "Buscas" },
    ],
    tip: "Escolha uma foto larga do seu trabalho. Evite textos pequenos nas bordas.",
    frameLabel: "Formato panorâmico",
    sendLabel: "Enviar foto de capa",
    replaceLabel: "Substituir foto de capa",
    removeLabel: "Remover foto de capa",
    confirmRemoveText: "O topo do seu perfil volta ao visual padrão da categoria.",
    savedMessage: "Foto de capa atualizada.",
    removedMessage: "Foto de capa removida.",
    dialogTitle: "Ajustar foto de capa",
    dialogDescription:
      "Arraste a imagem para escolher o enquadramento e use o zoom para destacar o melhor trecho. O resultado será panorâmico.",
    recommendation: "Recomendado: 1600 × 500 px (proporção 16:5)",
    aspectRatio: 16 / 5,
    outputWidth: 1600,
    outputType: "image/jpeg",
    outputExtension: "jpg",
    outputQuality: 0.92,
  },
} as const;

export const PROFILE_PHOTO_ACCEPT = PROFILE_IMAGE_ACCEPT;
export const PROFILE_PHOTO_MAX_SIZE_LABEL = MAX_UPLOAD_SIZE_LABEL;

export function validateProfilePhotoFile(file: File): string | null {
  if (!isProfileImageType(file.type)) {
    return "Escolha uma imagem JPG, PNG ou WebP.";
  }
  if (file.size <= 0) {
    return "O arquivo está vazio.";
  }
  if (file.size > MAX_UPLOAD_SIZE) {
    return `A imagem deve ter no máximo ${MAX_UPLOAD_SIZE_LABEL}.`;
  }
  return null;
}

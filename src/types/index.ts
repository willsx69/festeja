export type CategoryId =
  | "confeitaria"
  | "decoracao"
  | "buffet"
  | "dj"
  | "fotografia"
  | "animacao"
  | "danca"
  | "outros";

export type Tone = "brand" | "pink" | "yellow";

export type Category = {
  id: CategoryId;
  name: string;
  tone: Tone;
};

export type Provider = {
  id: string;
  name: string;
  category: CategoryId;
  image?: string;
  avatar?: string;
  portraitIllustrative?: boolean;
  city: string;
  state: string;
  neighborhood: string;
  rating: number;
  reviews: number;
  price: number;
  priceUnit?: string;
  tags: string[];
  verified: boolean;
  featured?: boolean;
};

export type WeekDay = "seg" | "ter" | "qua" | "qui" | "sex" | "sab" | "dom";

export type PortfolioItem = {
  id: string;
  title: string;
  meta: string;
  image?: string;
};

export type ProviderService = {
  id: string;
  name: string;
  description: string;
  price: number;
  priceUnit?: string;
};

export type ProviderReview = {
  id: string;
  author: string;
  event: string;
  date: string;
  rating: number;
  comment: string;
  reply?: string;
  hidden?: boolean;
};

export type ProviderAvailability = {
  days: WeekDay[];
  responseTime: string;
  minimumNotice: string;
  note: string;
};

export type ProviderProfile = {
  id: string;
  name: string;
  about: string;
  portfolio: PortfolioItem[];
  services: ProviderService[];
  availability: ProviderAvailability;
  reviews: ProviderReview[];
};

export type UserRole = "cliente" | "prestador" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  username?: string;
  phone?: string;
  avatar?: string;
};

export type SessionUser = User & {
  emailVerified: boolean;
};

export type ContractStatus = "pendente" | "concluido" | "cancelado";

export type Contract = {
  id: string;
  providerUsername: string;
  providerName: string;
  clientName: string;
  serviceName: string;
  amount: number;
  eventDate: string;
  status: ContractStatus;
};

export type QuoteRequest = {
  id: string;
  providerUsername: string;
  providerName: string;
  clientName: string;
  serviceName?: string;
  eventDate: string;
  guests?: number;
  message: string;
  status: "aberto" | "aceito" | "recusado";
  createdAt: string;
};

export type Message = {
  id: string;
  conversationId: string;
  senderUserId: string;
  senderName: string;
  body: string;
  createdAt: string;
  readAt: string | null;
};

export type Conversation = {
  id: string;
  clientUserId: string;
  clientName: string;
  clientAvatar?: string;
  providerUserId: string;
  providerName: string;
  providerAvatar?: string;
  providerUsername?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  lastSenderUserId?: string;
  unreadCount: number;
  createdAt: string;
};

export type NotificationType =
  | "mensagem"
  | "orcamento"
  | "contrato"
  | "avaliacao"
  | "sistema";

export type AppNotification = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  href: string | null;
  read: boolean;
  createdAt: string;
};

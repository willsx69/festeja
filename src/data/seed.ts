import type { CategoryId, WeekDay } from "@/types";

export type SeedProvider = {
  id: string;
  name: string;
  category: CategoryId;
  image?: string;
  city: string;
  state: string;
  neighborhood: string;
  price: number;
  priceUnit?: string;
  tags: string[];
  verified: boolean;
  featured?: boolean;
};

export type SeedPortfolioItem = { title: string; meta: string };

export type SeedService = {
  name: string;
  description: string;
  price: number;
  priceUnit?: string;
};

export type SeedReview = {
  author: string;
  event: string;
  date: string;
  rating: number;
  comment: string;
};

export type ProfileSeed = {
  about: string;
  portfolio: SeedPortfolioItem[];
  services: SeedService[];
  reviews: SeedReview[];
  availability?: Partial<{
    days: WeekDay[];
    responseTime: string;
    minimumNotice: string;
    note: string;
  }>;
};

export const availabilityByCategory: Record<
  CategoryId,
  { days: WeekDay[]; responseTime: string; minimumNotice: string; note: string }
> = {
  confeitaria: {
    days: ["seg", "ter", "qua", "qui", "sex"],
    responseTime: "cerca de 1 hora",
    minimumNotice: "5 dias de antecedência",
    note: "Retirada no ateliê ou entrega com taxa conforme a região.",
  },
  decoracao: {
    days: ["seg", "ter", "qua", "qui", "sex"],
    responseTime: "cerca de 2 horas",
    minimumNotice: "10 dias de antecedência",
    note: "Montagem no dia do evento ou na véspera, mediante consulta.",
  },
  buffet: {
    days: ["qui", "sex", "sab", "dom"],
    responseTime: "cerca de 30 minutos",
    minimumNotice: "15 dias de antecedência",
    note: "Orçamento inclui degustação agendada antes da contratação.",
  },
  dj: {
    days: ["sex", "sab", "dom"],
    responseTime: "cerca de 15 minutos",
    minimumNotice: "7 dias de antecedência",
    note: "Visita técnica e teste de som sem custo.",
  },
  fotografia: {
    days: ["seg", "ter", "qua", "qui", "sex", "sab"],
    responseTime: "cerca de 1 hora",
    minimumNotice: "20 dias de antecedência",
    note: "Pré-ensaio e visita ao local inclusos nos pacotes completos.",
  },
  animacao: {
    days: ["sex", "sab", "dom"],
    responseTime: "cerca de 20 minutos",
    minimumNotice: "10 dias de antecedência",
    note: "Também atendemos festas em dias úteis mediante consulta.",
  },
  danca: {
    days: ["seg", "ter", "qua", "qui", "sex", "sab"],
    responseTime: "cerca de 45 minutos",
    minimumNotice: "12 dias de antecedência",
    note: "Ensaios extras podem ser combinados antes do evento.",
  },
  outros: {
    days: ["seg", "ter", "qua", "qui", "sex", "sab"],
    responseTime: "cerca de 30 minutos",
    minimumNotice: "7 dias de antecedência",
    note: "Produção antecipada para pedidos personalizados.",
  },
};

export const seedProviders: SeedProvider[] = [
  {
    id: "ana-beatriz-confeitaria",
    name: "Ana Beatriz Confeitaria",
    category: "confeitaria",
    image: "/images/categorias/01-confeitaria.png",
    city: "Manaus",
    state: "AM",
    neighborhood: "Adrianópolis",
    price: 350,
    tags: ["Bolo de aniversário", "Doces finos", "Sem glúten"],
    verified: true,
    featured: true,
  },
  {
    id: "buffet-sabor-e-festa",
    name: "Buffet Sabor & Festa",
    category: "buffet",
    image: "/images/categorias/02-buffet.png",
    city: "Manaus",
    state: "AM",
    neighborhood: "Cidade Nova",
    price: 89,
    priceUnit: "/ pessoa",
    tags: ["Coquetel", "Menu completo", "Serviço na hora"],
    verified: true,
    featured: true,
  },
  {
    id: "dj-marcelo-vibe",
    name: "DJ Marcelo Vibe",
    category: "dj",
    image: "/images/categorias/03-dj.png",
    city: "Manaus",
    state: "AM",
    neighborhood: "Ponta Negra",
    price: 1200,
    tags: ["Casamentos", "Formaturas", "Sound & light"],
    verified: true,
    featured: true,
  },
  {
    id: "estudio-lume-fotografia",
    name: "Estúdio Lume Fotografia",
    category: "fotografia",
    image: "/images/categorias/04-fotografia.png",
    city: "Manaus",
    state: "AM",
    neighborhood: "Parque 10 de Novembro",
    price: 1800,
    tags: ["Fotografia", "Vídeo", "Álbum digital"],
    verified: true,
    featured: true,
  },
  {
    id: "decora-mimo",
    name: "Decora Mimo",
    category: "decoracao",
    image: "/images/categorias/05-decoracao.png",
    city: "Manaus",
    state: "AM",
    neighborhood: "Flores",
    price: 650,
    tags: ["Temas", "Painel de flores", "Mesas postas"],
    verified: false,
    featured: true,
  },
  {
    id: "trio-festa-alegre",
    name: "Trio Festa Alegre",
    category: "animacao",
    image: "/images/categorias/06-animacao-infantil.png",
    city: "Manaus",
    state: "AM",
    neighborhood: "Alvorada",
    price: 900,
    tags: ["Infantil", "Circo", "Oficinas"],
    verified: true,
    featured: true,
  },
  {
    id: "doceria-ponto-de-doce",
    name: "Doceria Ponto de Doce",
    category: "confeitaria",
    image: "/images/categorias/01-confeitaria.png",
    city: "Manaus",
    state: "AM",
    neighborhood: "Japiim",
    price: 280,
    tags: ["Brigadeiro gourmet", "Mesa de doces", "Doceria"],
    verified: true,
  },
  {
    id: "confeitaria-flor-de-lis",
    name: "Confeitaria Flor de Lis",
    category: "confeitaria",
    image: "/images/categorias/01-confeitaria.png",
    city: "Manaus",
    state: "AM",
    neighborhood: "Aleixo",
    price: 420,
    tags: ["Bolo de dois andares", "Tortas", "Vegano"],
    verified: false,
  },
  {
    id: "villa-buffet-eventos",
    name: "Villa Buffet Eventos",
    category: "buffet",
    image: "/images/categorias/02-buffet.png",
    city: "Manaus",
    state: "AM",
    neighborhood: "Nossa Senhora das Graças",
    price: 120,
    priceUnit: "/ pessoa",
    tags: ["Casamento", "Coquetel", "Churrasco"],
    verified: true,
  },
  {
    id: "buffet-real-da-serra",
    name: "Buffet Real da Serra",
    category: "buffet",
    image: "/images/categorias/02-buffet.png",
    city: "Manaus",
    state: "AM",
    neighborhood: "Compensa",
    price: 75,
    priceUnit: "/ pessoa",
    tags: ["Comida caseira", "Coffee break", "Confraternização"],
    verified: false,
  },
  {
    id: "decor-viva",
    name: "Decor Viva Decoradores",
    category: "decoracao",
    image: "/images/categorias/05-decoracao.png",
    city: "Manaus",
    state: "AM",
    neighborhood: "Tarumã",
    price: 1100,
    tags: ["Casamentos", "Ambientação", "Paisagismo"],
    verified: true,
  },
  {
    id: "atelie-festa-chic",
    name: "Ateliê Festa Chic",
    category: "decoracao",
    image: "/images/categorias/05-decoracao.png",
    city: "Manaus",
    state: "AM",
    neighborhood: "Dom Pedro",
    price: 480,
    tags: ["Mesas temáticas", "Painéis", "Balões"],
    verified: false,
  },
  {
    id: "dj-nave-eletronica",
    name: "DJ Nave Eletrônica",
    category: "dj",
    image: "/images/categorias/03-dj.png",
    city: "Manaus",
    state: "AM",
    neighborhood: "Centro",
    price: 950,
    tags: ["Festas", "Eletrônica", "Equipamento próprio"],
    verified: true,
  },
  {
    id: "dj-bruno-costa",
    name: "DJ Bruno Costa",
    category: "dj",
    image: "/images/categorias/03-dj.png",
    city: "Manaus",
    state: "AM",
    neighborhood: "São José Operário",
    price: 700,
    tags: ["Aniversários", "Axé", "Sertanejo"],
    verified: false,
  },
  {
    id: "olhar-analogico",
    name: "Olhar Analógico",
    category: "fotografia",
    image: "/images/categorias/04-fotografia.png",
    city: "Manaus",
    state: "AM",
    neighborhood: "Planalto",
    price: 2400,
    tags: ["Filmagem", "Drone", "Making of"],
    verified: true,
  },
  {
    id: "fotografia-movimento",
    name: "Fotografia Movimento",
    category: "fotografia",
    image: "/images/categorias/04-fotografia.png",
    city: "Manaus",
    state: "AM",
    neighborhood: "Petrópolis",
    price: 1300,
    tags: ["Cobertura completa", "Álbum", "Cinegraph"],
    verified: true,
  },
  {
    id: "risos-e-cia",
    name: "Risos & Cia Animação",
    category: "animacao",
    image: "/images/categorias/06-animacao-infantil.png",
    city: "Manaus",
    state: "AM",
    neighborhood: "Coroado",
    price: 750,
    tags: ["Teatro", "Mágica", "Pintura facial"],
    verified: true,
  },
  {
    id: "ballet-encanto",
    name: "Ballet Encanto",
    category: "danca",
    city: "Manaus",
    state: "AM",
    neighborhood: "Cidade de Deus",
    price: 600,
    tags: ["Ballet", "Apresentação", "Oficina"],
    verified: true,
  },
  {
    id: "grupo-ritmo-e-cia",
    name: "Grupo Ritmo & Cia",
    category: "danca",
    city: "Manaus",
    state: "AM",
    neighborhood: "São Francisco",
    price: 850,
    tags: ["Forró", "Samba", "Apresentação ao vivo"],
    verified: false,
  },
  {
    id: "lembrancas-e-cia",
    name: "Lembranças & Cia",
    category: "outros",
    city: "Manaus",
    state: "AM",
    neighborhood: "Redenção",
    price: 320,
    tags: ["Lembrancinhas", "Convites", "Kits festa"],
    verified: true,
  },
];

export const seedProfiles: Record<string, ProfileSeed> = {
  "ana-beatriz-confeitaria": {
    about:
      "Confeitaria artesanal especializada em bolos de aniversário e doces finos, produzidos em pequenos lotes com ingredientes selecionados. Atende festas infantis, adultas e encomendas sem glúten com produção separada.",
    portfolio: [
      { title: "Bolo de três andares", meta: "Aniversário · 120 convidados" },
      { title: "Mesa de doces finos", meta: "Casamento · Adrianópolis" },
      { title: "Cupcakes sem glúten", meta: "Festa infantil · 60 unidades" },
    ],
    services: [
      {
        name: "Bolo de aniversário",
        description: "Bolo personalizado de até 4kg com recheio à escolha e acabamento sob medida.",
        price: 350,
      },
      {
        name: "Mesa de doces",
        description: "Montagem completa com brigadeiros, tartes, docinhos e douradinhos.",
        price: 780,
      },
      {
        name: "Kit festa completo",
        description: "Bolo, mesa de doces, salgadinhos e bandejas temáticas para até 60 pessoas.",
        price: 1450,
      },
    ],
    reviews: [
      {
        author: "Camila Duarte",
        event: "Aniversário da Manu",
        date: "18 de agosto de 2026",
        rating: 5,
        comment: "O bolo lindíssimo e o sabor aprovado por todo mundo, entrega no horário.",
      },
      {
        author: "Rafael Nunes",
        event: "Casamento",
        date: "27 de junho de 2026",
        rating: 5,
        comment: "A mesa de doces foi o ponto alto da festa, tudo fresquinho e bem apresentado.",
      },
      {
        author: "Juliana Prado",
        event: "Chá de bebê",
        date: "12 de abril de 2026",
        rating: 4,
        comment: "Ótimo atendimento e entregou antes do combinado, recomendo.",
      },
    ],
  },
  "buffet-sabor-e-festa": {
    about:
      "Buffet com mais de 15 anos de estrada em Manaus, equipe própria de cozinha e salão. Trabalha com cardápios executivos para casamentos, formaturas e eventos corporativos, com serviço de garçons incluso.",
    portfolio: [
      { title: "Coquetel de recepção", meta: "Casamento · 200 convidados" },
      { title: "Jantar em pratos", meta: "Formatura · 350 convidados" },
      { title: "Serviço na hora", meta: "Corporativo · Cidade Nova" },
    ],
    services: [
      {
        name: "Coquetel volante",
        description: "Finger food quente e frio, bebidas não alcoólicas e equipe de atendimento.",
        price: 89,
        priceUnit: "/ pessoa",
      },
      {
        name: "Menu completo",
        description: "Entrada, prato principal, sobremesa e café, com opções vegetarianas.",
        price: 145,
        priceUnit: "/ pessoa",
      },
      {
        name: "Buffet livre",
        description: "Ilhas de comida ao vivo, chapa quente, salada bar e sobremesas montadas.",
        price: 189,
        priceUnit: "/ pessoa",
      },
    ],
    reviews: [
      {
        author: "Patrícia Lemos",
        event: "Casamento",
        date: "5 de setembro de 2026",
        rating: 5,
        comment: "Comida excelente e equipe atenciosa do começo ao fim, não faltou nada.",
      },
      {
        author: "Eduardo Ramos",
        event: "Formatura",
        date: "22 de maio de 2026",
        rating: 5,
        comment: "Montagem impecável e os convidados não pararam de elogiar o jantar.",
      },
      {
        author: "Letícia Barros",
        event: "Aniversário corporativo",
        date: "14 de março de 2026",
        rating: 4,
        comment: "Muito bem organizado, só gostaria de mais opções de sobremesa.",
      },
    ],
  },
  "dj-marcelo-vibe": {
    about:
      "DJ com atuação em casamentos e formaturas há 12 anos, mixando música ao vivo entre os convidados. Equipamento próprio de som e iluminação, com leitura de pista e repertório montado junto com os contratantes.",
    portfolio: [
      { title: "Casamento na Ponta Negra", meta: "Ponta Negra · 300 convidados" },
      { title: "Formatura de Direito", meta: "Manaus · 500 convidados" },
      { title: "Baile de debutantes", meta: "Copacabana · 180 convidados" },
    ],
    services: [
      {
        name: "DJ + sonorização",
        description: "Até 5 horas de evento com mesa profissional, microfone e curadoria.",
        price: 1200,
      },
      {
        name: "DJ + sound & light",
        description: "Som, iluminação cênica e pista com focos e dancarinas.",
        price: 1850,
      },
      {
        name: "Pacote cerimônia",
        description: "Som para a cerimônia, DJ e locução do roteiro com o casal.",
        price: 2400,
      },
    ],
    reviews: [
      {
        author: "Marina Alcântara",
        event: "Casamento",
        date: "30 de agosto de 2026",
        rating: 5,
        comment: "Leitura de pista perfeita, a pista nunca ficou vazia nem por um minuto.",
      },
      {
        author: "Gustavo Peixoto",
        event: "Formatura",
        date: "11 de julho de 2026",
        rating: 5,
        comment: "Chegou cedo, testou tudo e ainda montou a playlist que pedimos.",
      },
      {
        author: "Bianca Moreira",
        event: "Aniversário de 30 anos",
        date: "19 de abril de 2026",
        rating: 5,
        comment: "Superou as expectativas, o som ficou perfeito para o salão.",
      },
    ],
  },
  "estudio-lume-fotografia": {
    about:
      "Estúdio de fotografia e vídeo focado em eventos sociais, com equipe de dois fotógrafos e edição em até 30 dias. Entrega em galeria online, álbuns impressos e vídeo no formato cinematográfico.",
    portfolio: [
      { title: "Cobertura de casamento", meta: "Parque 10 · 12 horas" },
      { title: "Formatura e recepção", meta: "Parque 10 · 300 convidados" },
      { title: "Álbum digital", meta: "Aniversário · 80 páginas" },
    ],
    services: [
      {
        name: "Cobertura fotográfica",
        description: "8 horas de evento, 400 fotos tratadas e galeria online por 12 meses.",
        price: 1800,
      },
      {
        name: "Foto + vídeo",
        description: "Cobertura completa com vídeo de 6 minutos em captação de câmera dupla.",
        price: 3200,
      },
      {
        name: "Pré-wedding",
        description: "Ensaio de 2 horas em locação à escolha com 60 fotos editadas.",
        price: 950,
      },
    ],
    reviews: [
      {
        author: "Fernanda Rocha",
        event: "Casamento",
        date: "15 de setembro de 2026",
        rating: 5,
        comment: "As fotos ficaram lindas e a entrega foi antes do prazo combinado.",
      },
      {
        author: "Thiago Menezes",
        event: "Formatura",
        date: "3 de junho de 2026",
        rating: 5,
        comment: "Equipe discreta que capturou momentos que nem sabíamos que existiam.",
      },
    ],
  },
  "decora-mimo": {
    about:
      "Decoração temática para festas infantis e sociais, com produção de painéis, mesas postas e cenários sob medida. Trabalha com locação de objetos e montagem no local do evento em Manaus.",
    portfolio: [
      { title: "Tema jardim encantado", meta: "Aniversário · 70 convidados" },
      { title: "Painel de flores", meta: "Casamento · Flores" },
      { title: "Mesa posta temática", meta: "Festa infantil · 40 convidados" },
    ],
    services: [
      {
        name: "Mesa de doces montada",
        description: "Painel, adereços, bandejas temáticas e montagem completa no local.",
        price: 650,
      },
      {
        name: "Decoração de salão",
        description: "Cenário de entrada, mesa principal, balões e iluminação ambiente.",
        price: 1250,
      },
      {
        name: "Pacote temático completo",
        description: "Toda a decoração do evento mais convites e lembrancinhas combinadas.",
        price: 2100,
      },
    ],
    reviews: [
      {
        author: "Aline Ferraz",
        event: "Aniversário da Helena",
        date: "24 de agosto de 2026",
        rating: 5,
        comment: "Cada detalhe do tema ficou do jeito que eu tinha imaginado, amei.",
      },
      {
        author: "Diego Sanchez",
        event: "Casamento",
        date: "9 de maio de 2026",
        rating: 4,
        comment: "Montagem rápida e tudo muito bem cuidado, satisfeito com o serviço.",
      },
    ],
  },
  "trio-festa-alegre": {
    about:
      "Trio de animação com artistas formados em circo e pedagogia, atendendo festas infantis com shows interativos. Cada apresentação inclui oficina de malabarismo, pintura facial e brincadeiras guiadas.",
    portfolio: [
      { title: "Show de circo", meta: "Aniversário · 60 crianças" },
      { title: "Oficina de malabarismo", meta: "Festa escolar · Alvorada" },
      { title: "Pintura facial", meta: "Festival de bairro · 150 crianças" },
    ],
    services: [
      {
        name: "Show infantil",
        description: "45 minutos de apresentação com truques, música e brincadeiras.",
        price: 900,
      },
      {
        name: "Show + oficina",
        description: "Apresentação seguida de oficina de malabarismo para as crianças.",
        price: 1250,
      },
      {
        name: "Pacote de festa",
        description: "Show, pintura facial, oficina e mágica, com dois artistas.",
        price: 1800,
      },
    ],
    reviews: [
      {
        author: "Camila Weber",
        event: "Aniversário do Pedro",
        date: "29 de agosto de 2026",
        rating: 5,
        comment: "As crianças amaram e os pais também, super recomendo.",
      },
      {
        author: "Rodrigo Antunes",
        event: "Festa de encerramento",
        date: "17 de maio de 2026",
        rating: 5,
        comment: "Profissionais pontuais e muito bem preparados com o público infantil.",
      },
    ],
  },
  "doceria-ponto-de-doce": {
    about:
      "Doceria especializada em brigadeiro gourmet e mesas de doces para eventos em Manaus. Produção diária com entrega em embalagens prontas para servir.",
    portfolio: [
      { title: "Mesa de doces", meta: "Casamento · 250 convidados" },
      { title: "Brigadeiro gourmet", meta: "Aniversário · 300 unidades" },
      { title: "Caixa de doces", meta: "Corporativo · Japiim" },
    ],
    services: [
      {
        name: "Caixa com 100 doces",
        description: "Sabores sortidos montados em caixa personalizada para o evento.",
        price: 280,
      },
      {
        name: "Mesa de doces",
        description: "Montagem com estrutura, bandejas e doces para até 100 pessoas.",
        price: 690,
      },
      {
        name: "Mesa + bolo",
        description: "Mesa de doces completa com bolo personalizado de dois andares.",
        price: 980,
      },
    ],
    reviews: [
      {
        author: "Tatiana Correia",
        event: "Aniversário",
        date: "13 de setembro de 2026",
        rating: 5,
        comment: "O brigadeiro de pistache virou assunto da festa, chegou tudo certinho.",
      },
      {
        author: "Bruno Sá",
        event: "Casamento",
        date: "21 de abril de 2026",
        rating: 4,
        comment: "Doces ótimos e entrega pontual, voltaremos a contratar.",
      },
    ],
  },
  "confeitaria-flor-de-lis": {
    about:
      "Confeitaria voltada a bolos artesanais de dois andares, tortas e opções veganas, com produção encomendada para bairros de Manaus. Fichas técnicas disponíveis para restrições alimentares.",
    portfolio: [
      { title: "Bolo de dois andares", meta: "Casamento · Aleixo" },
      { title: "Torta de frutas", meta: "Aniversário · 60 fatias" },
      { title: "Opção vegana", meta: "Festa particular · 40 convidados" },
    ],
    services: [
      {
        name: "Bolo de aniversário",
        description: "Bolo artesanal de até 3 andares com decoração personalizada.",
        price: 420,
      },
      {
        name: "Torta gourmet",
        description: "Torta recheada de até 30 fatias com finalização em frutas.",
        price: 360,
      },
      {
        name: "Mesa vegana",
        description: "Seleção de doces e bolos sem ingredientes de origem animal.",
        price: 740,
      },
    ],
    reviews: [
      {
        author: "Isabela Kraus",
        event: "Casamento",
        date: "6 de setembro de 2026",
        rating: 5,
        comment: "Belo, leve e a parte vegana agradou até quem não é vegano.",
      },
      {
        author: "Marcos Piltz",
        event: "Aniversário",
        date: "28 de março de 2026",
        rating: 4,
        comment: "Entrega cuidadosa e sabor ótimo, gostei do atendimento.",
      },
    ],
  },
  "villa-buffet-eventos": {
    about:
      "Buffet com três formatos de serviço para eventos em Manaus, da recepção ao churrasco montado no local. Equipe contratada para salão, cozinha e garçons, com cardápio revisado com o cliente.",
    portfolio: [
      { title: "Casamento no salão", meta: "Nossa Senhora das Graças · 400 convidados" },
      { title: "Coquetel dançante", meta: "Aniversário · 250 convidados" },
      { title: "Churrasco montado", meta: "Confraternização · 120 convidados" },
    ],
    services: [
      {
        name: "Coquetel dançante",
        description: "Móveis montados, garçons e ilha quente por 4 horas de evento.",
        price: 120,
        priceUnit: "/ pessoa",
      },
      {
        name: "Churrasco completo",
        description: "Carnes selecionadas, acompanhamentos e serviço no local.",
        price: 165,
        priceUnit: "/ pessoa",
      },
      {
        name: "Jantar servido",
        description: "Entrada, prato único servido, sobremesa e bar de bebidas.",
        price: 210,
        priceUnit: "/ pessoa",
      },
    ],
    reviews: [
      {
        author: "Renata Vilela",
        event: "Casamento",
        date: "16 de agosto de 2026",
        rating: 5,
        comment: "Coordenação impecável, os convidados ficaram impressionados com o serviço.",
      },
      {
        author: "André Coelho",
        event: "Aniversário de 50 anos",
        date: "7 de junho de 2026",
        rating: 4,
        comment: "Comida muito boa e equipe educada, apenas o início atrasou um pouco.",
      },
      {
        author: "Sofia Mendes",
        event: "Corporativo",
        date: "10 de fevereiro de 2026",
        rating: 5,
        comment: "Montagem rápida e cardápio personalizado conforme pedimos.",
      },
    ],
  },
  "buffet-real-da-serra": {
    about:
      "Buffet de comida caseira em Manaus, com pratos quentes servidos na hora e coffee break para eventos de qualquer tamanho. Preço acessível sem abrir mão de comida bem servida.",
    portfolio: [
      { title: "Coffee break", meta: "Corporativo · 80 pessoas" },
      { title: "Confraternização", meta: "Escola · 200 convidados" },
      { title: "Bufê self-service", meta: "Aniversário · Compensa" },
    ],
    services: [
      {
        name: "Coffee break",
        description: "Café, bolos salgados, doces e frutas servidos por 2 horas.",
        price: 75,
        priceUnit: "/ pessoa",
      },
      {
        name: "Bufê self-service",
        description: "Pratos quentes, saladas e sobremesa em ilha montada no local.",
        price: 110,
        priceUnit: "/ pessoa",
      },
      {
        name: "Confraternização completa",
        description: "Bufê, bebidas, louça, garçons e limpeza do espaço ao final.",
        price: 149,
        priceUnit: "/ pessoa",
      },
    ],
    reviews: [
      {
        author: "Vanderlei Ramos",
        event: "Confraternização",
        date: "25 de julho de 2026",
        rating: 4,
        comment: "Comida caseira de verdade e preço justo, serviço muito bem avaliado.",
      },
      {
        author: "Cláudia Nogueira",
        event: "Aniversário",
        date: "2 de março de 2026",
        rating: 4,
        comment: "Simples e gostoso, atendeu bem o que precisávamos.",
      },
    ],
  },
  "decor-viva": {
    about:
      "Equipe de decoração e ambientação para casamentos e eventos de marca em Manaus, com produção de cenários, paisagismo em vasos e mobiliário sob locação. Projeto visual aprovado antes da montagem.",
    portfolio: [
      { title: "Cenário de casamento", meta: "Tarumã · 350 convidados" },
      { title: "Ambientação externa", meta: "Evento ao ar livre · 200 convidados" },
      { title: "Paisagismo em vasos", meta: "Corporativo · Barra" },
    ],
    services: [
      {
        name: "Decoração de mesa",
        description: "Toalha, centro de mesa, locação de louça e arranjos florais.",
        price: 1100,
      },
      {
        name: "Cenário de entrada",
        description: "Arco, painel, iluminação e recepção montados no local.",
        price: 1950,
      },
      {
        name: "Projeto completo",
        description: "Toda a ambientação do evento com equipe de montagem e desmontagem.",
        price: 3400,
      },
    ],
    reviews: [
      {
        author: "Larissa Santana",
        event: "Casamento",
        date: "23 de agosto de 2026",
        rating: 5,
        comment: "O cenário ficou deslumbrante e o time cuidou de cada detalhe.",
      },
      {
        author: "Paulo Estrela",
        event: "Lançamento de produto",
        date: "19 de junho de 2026",
        rating: 5,
        comment: "Entenderam a identidade da marca e entregaram acima do esperado.",
      },
    ],
  },
  "atelie-festa-chic": {
    about:
      "Ateliê de decoração para mesas temáticas, painéis e arranjos de balões em Manaus. Produção artesanal com peças exclusivas e montagem cuidadosa para festas íntimas e eventos sociais.",
    portfolio: [
      { title: "Mesa temática", meta: "Aniversário · 50 convidados" },
      { title: "Painel de balões", meta: "Chá de bebê · Dom Pedro" },
      { title: "Arco de portas", meta: "Casamento · Taguatinga" },
    ],
    services: [
      {
        name: "Mesa temática",
        description: "Painel, adereços, bandejas e montagem para até 60 convidados.",
        price: 480,
      },
      {
        name: "Painel exclusivo",
        description: "Painel personalizado com nome e tema do evento, montado no local.",
        price: 690,
      },
      {
        name: "Decoração completa",
        description: "Mesa, entrada, balões, mesas laterais e acabamento do salão.",
        price: 1450,
      },
    ],
    reviews: [
      {
        author: "Daniela Paiva",
        event: "Chá de bebê",
        date: "8 de setembro de 2026",
        rating: 5,
        comment: "Peças lindas e acabamento perfeito, tudo entregue com antecedência.",
      },
      {
        author: "Henrique Bastos",
        event: "Aniversário",
        date: "30 de abril de 2026",
        rating: 4,
        comment: "Muito capricho na mesa, atendimento ágil pelo WhatsApp.",
      },
    ],
  },
  "dj-nave-eletronica": {
    about:
      "DJ de música eletrônica com residências em casas de Manaus e set de até 6 horas, com equipamento próprio de som e controladores. Atende festas, aniversários e eventos com linha melódica e tech house.",
    portfolio: [
      { title: "Set na Lagoa", meta: "Festa · 400 pessoas" },
      { title: "Aniversário eletrônico", meta: "Centro · 250 pessoas" },
      { title: "Sunset session", meta: "Evento ao ar livre · 150 pessoas" },
    ],
    services: [
      {
        name: "Set de 3 horas",
        description: "DJ com equipamento próprio, mesa e monitoração para festas menores.",
        price: 950,
      },
      {
        name: "Set de 5 horas",
        description: "Repertório sob medida, iluminação de pista e microfone.",
        price: 1500,
      },
      {
        name: "Set + estrutura",
        description: "DJ, som para até 500 pessoas, iluminação e técnico no local.",
        price: 2600,
      },
    ],
    reviews: [
      {
        author: "Vitor Camargo",
        event: "Aniversário",
        date: "29 de agosto de 2026",
        rating: 5,
        comment: "Som perfeito e repertório certeiro, a festa bombou até o fim.",
      },
      {
        author: "Nathalia Reis",
        event: "Festa na praia",
        date: "11 de julho de 2026",
        rating: 4,
        comment: "Muito bom, equipamento próprio fez toda a diferença.",
      },
    ],
  },
  "dj-bruno-costa": {
    about:
      "DJ manauara especializado em axé e sertanejo para aniversários, com repertório montado em conversa com o contratante. Atende Manaus com equipamento compacto.",
    portfolio: [
      { title: "Festa de aniversário", meta: "São José Operário · 120 convidados" },
      { title: "Festa sertaneja", meta: "Maracanaú · 200 convidados" },
      { title: "Bloco de quintal", meta: "Aquiraz · 90 convidados" },
    ],
    services: [
      {
        name: "DJ para festa",
        description: "3 horas de música com mesa, microfone e playlist personalizada.",
        price: 700,
      },
      {
        name: "DJ + sonorização",
        description: "Som para salão de até 200 pessoas e 5 horas de evento.",
        price: 1150,
      },
      {
        name: "Pacote com iluminação",
        description: "DJ, som, iluminação de pista e efeitos para a festa.",
        price: 1600,
      },
    ],
    reviews: [
      {
        author: "Eliane Furtado",
        event: "Aniversário",
        date: "17 de agosto de 2026",
        rating: 4,
        comment: "Bem animado e atencioso, a galera gostou muito do repertório.",
      },
      {
        author: "Wesley Tavares",
        event: "Festa sertaneja",
        date: "5 de julho de 2026",
        rating: 4,
        comment: "Pontual e flexível com os pedidos de música, recomendo.",
      },
    ],
    availability: {
      days: ["sex", "sab"],
      responseTime: "cerca de 3 horas",
      note: "Atende bairros de Manaus mediante consulta de deslocamento.",
    },
  },
  "olhar-analogico": {
    about:
      "Produtora de foto e vídeo com estética analógica e captação aérea por drone, sediada em Manaus. Equipe de três profissionais para coberturas de casamento com edição autoral e entrega em galeria privada.",
    portfolio: [
      { title: "Casamento analógico", meta: "Planalto · 12 horas" },
      { title: "Vídeo com drone", meta: "Fazenda · Araucária" },
      { title: "Pré-wedding na serra", meta: "Morretes · 25 fotos" },
    ],
    services: [
      {
        name: "Cobertura premium",
        description: "12 horas, dois fotógrafos, drone e galeria completa tratada.",
        price: 2400,
      },
      {
        name: "Pacote casamento",
        description: "Foto, vídeo de 8 minutos, drone e álbum impresso de 40 páginas.",
        price: 4200,
      },
      {
        name: "Pré-wedding",
        description: "Ensaio de 3 horas em duas locações com 80 fotos editadas.",
        price: 1300,
      },
    ],
    reviews: [
      {
        author: "Helena Vargas",
        event: "Casamento",
        date: "29 de agosto de 2026",
        rating: 5,
        comment: "A estética ficou exatamente como sonhei, entrega impecável.",
      },
      {
        author: "Ricardo Bhering",
        event: "Casamento",
        date: "22 de maio de 2026",
        rating: 5,
        comment: "Equipe presente sem ser invasiva e o vídeo nos deixou sem palavras.",
      },
      {
        author: "Mariana Fontes",
        event: "Pré-wedding",
        date: "8 de março de 2026",
        rating: 5,
        comment: "Um passeio virou uma sessão de fotos incrível, amamos o resultado.",
      },
    ],
  },
  "fotografia-movimento": {
    about:
      "Cobertura fotográfica completa com foco em momentos espontâneos, atendendo bairros de Manaus. Equipe de dois fotógrafos, álbum impresso e vídeo opcional com captação em 4K.",
    portfolio: [
      { title: "Cobertura completa", meta: "Petrópolis · 10 horas" },
      { title: "Álbum impresso", meta: "Casamento · 60 páginas" },
      { title: "Cinegraph", meta: "Formatura · 180 convidados" },
    ],
    services: [
      {
        name: "Cobertura fotográfica",
        description: "8 horas de evento com 500 fotos tratadas e galeria online.",
        price: 1300,
      },
      {
        name: "Foto + cinegraph",
        description: "Cobertura com vídeo de 4 minutos editado na semana seguinte.",
        price: 2100,
      },
      {
        name: "Álbum premium",
        description: "Álbum artesanal de 60 páginas com capa em couro e caixa.",
        price: 890,
      },
    ],
    reviews: [
      {
        author: "Aline Coutinho",
        event: "Casamento",
        date: "12 de setembro de 2026",
        rating: 5,
        comment: "As fotos capturaram a emoção de cada momento, família amou o álbum.",
      },
      {
        author: "Jean Itaboraí",
        event: "Formatura",
        date: "26 de junho de 2026",
        rating: 4,
        comment: "Trabalho sério e bem organizado, entrega dentro do prazo.",
      },
    ],
  },
  "risos-e-cia": {
    about:
      "Grupo de animação com artistas de teatro e mágica para festas infantis e eventos de escolas em Manaus. Apresentações interativas com participação das crianças e pintura facial em todos os pacotes.",
    portfolio: [
      { title: "Show de mágica", meta: "Aniversário · 80 crianças" },
      { title: "Pintura facial", meta: "Festa escolar · 120 crianças" },
      { title: "Teatro interativo", meta: "Corporativo · Coroado" },
    ],
    services: [
      {
        name: "Animação de 1 hora",
        description: "Teatro, mágica e brincadeiras com dois artistas.",
        price: 750,
      },
      {
        name: "Animação + pintura",
        description: "Apresentação de 1 hora mais pintura facial de todas as crianças.",
        price: 980,
      },
      {
        name: "Pacote escolar",
        description: "3 horas de evento com atrações, oficinas e premiação.",
        price: 1650,
      },
    ],
    reviews: [
      {
        author: "Simone Tavares",
        event: "Aniversário da Alice",
        date: "6 de setembro de 2026",
        rating: 5,
        comment: "Mágica arrancou risadas de adultos e crianças, super indico.",
      },
      {
        author: "Marcos Vinícius",
        event: "Festa de escola",
        date: "14 de maio de 2026",
        rating: 5,
        comment: "Organização impecável e as crianças ficaram entretidas a tarde toda.",
      },
    ],
  },
  "ballet-encanto": {
    about:
      "Escola de ballet com apresentações em eventos sociais e formaturas em Manaus. Turmas de base com alunas formadas, montagem de coreografias sob o tema escolhido pelo contratante.",
    portfolio: [
      { title: "Apresentação de ballet", meta: "Aniversário · 40 alunas" },
      { title: "Dança temática", meta: "Casamento · Cidade de Deus" },
      { title: "Oficina de dança", meta: "Festa infantil · 25 crianças" },
    ],
    services: [
      {
        name: "Apresentação infantil",
        description: "Duas coreografias com até 12 bailarinas e figurino incluso.",
        price: 600,
      },
      {
        name: "Apresentação temática",
        description: "Coreografia sob medida com prova de ensaio antes do evento.",
        price: 950,
      },
      {
        name: "Oficina de dança",
        description: "1 hora de oficina participativa para as crianças do evento.",
        price: 480,
      },
    ],
    reviews: [
      {
        author: "Regina Amaral",
        event: "Aniversário",
        date: "20 de agosto de 2026",
        rating: 5,
        comment: "As meninas arrasaram e o tema ficou lindo no salão.",
      },
      {
        author: "Cléber Nogueira",
        event: "Casamento",
        date: "27 de abril de 2026",
        rating: 5,
        comment: "Ensaios bem conduzidos e pontualidade do início ao fim.",
      },
    ],
  },
  "grupo-ritmo-e-cia": {
    about:
      "Companhia de dança com números de forró e samba para eventos em Manaus, com trio de dançarinos e apresentação ao vivo com percussão. Apresentações de 15 a 30 minutos conforme o roteiro do evento.",
    portfolio: [
      { title: "Forró ao vivo", meta: "Festa · São Francisco" },
      { title: "Samba de salão", meta: "Casamento · 250 convidados" },
      { title: "Roda de samba", meta: "Corporativo · São Francisco" },
    ],
    services: [
      {
        name: "Apresentação de dança",
        description: "Um número de 15 minutos com três dançarinos e trilha ao vivo.",
        price: 850,
      },
      {
        name: "Roda de samba",
        description: "Percussão e cantores por 1 hora, com repertório clássico carioca.",
        price: 1600,
      },
      {
        name: "Espetáculo completo",
        description: "Dois números, oficina de passos com os convidados e encerramento.",
        price: 2400,
      },
    ],
    reviews: [
      {
        author: "Sérgio Bastos",
        event: "Casamento",
        date: "9 de setembro de 2026",
        rating: 5,
        comment: "Todos os convidados queriam saber o nome do grupo, animou a noite.",
      },
      {
        author: "Cláudia Ribeiro",
        event: "Festa junina",
        date: "18 de junho de 2026",
        rating: 4,
        comment: "Apresentação ótima, organização e horários bem respeitados.",
      },
    ],
  },
  "lembrancas-e-cia": {
    about:
      "Fabricação de lembrancinhas, convites e kits de festa personalizados em Manaus, com impressão e acabamento próprios. Prazo médio de produção de 7 dias úteis, com entrega em bairros da cidade.",
    portfolio: [
      { title: "Kits de festa", meta: "Aniversário · 80 unidades" },
      { title: "Convites personalizados", meta: "Casamento · 120 convites" },
      { title: "Lembrancinhas", meta: "Chá de bebê · Redenção" },
    ],
    services: [
      {
        name: "Convites personalizados",
        description: "100 convites impressos com envelope e nome do evento.",
        price: 320,
      },
      {
        name: "Lembrancinhas",
        description: "50 unidades personalizadas com etiqueta e embalagem individual.",
        price: 450,
      },
      {
        name: "Kit festa completo",
        description: "Convites, lembrancinhas, toalhinha e placas para mesa.",
        price: 980,
      },
    ],
    reviews: [
      {
        author: "Priscila Gomes",
        event: "Aniversário da Lia",
        date: "1 de setembro de 2026",
        rating: 5,
        comment: "Lembrancinhas lindas e chegaram antes do prazo, ficaram perfeitas.",
      },
      {
        author: "Fábio Assis",
        event: "Casamento",
        date: "16 de maio de 2026",
        rating: 4,
        comment: "Convites com acabamento ótimo e atendimento muito prestativo.",
      },
    ],
  },
};

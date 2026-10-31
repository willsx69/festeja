# Festeja

Plataforma local que conecta clientes que organizam festas e eventos em Manaus a
prestadores de serviços da cidade: confeiteiros, decoradores, buffets, DJs,
fotógrafos, animadores e profissionais de dança.

O projeto está em estágio de MVP funcional. A plataforma não processa pagamentos
nem intermedeia valores: contratação, escopo e execução são combinados diretamente
entre cliente e prestador.

## Requisitos

- Node.js 24 ou superior
- npm

## Instalação

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

Abra `http://localhost:3000`.

No PowerShell, use `Copy-Item .env.example .env.local`. Em outros shells, use
`cp .env.example .env.local`.

## Configuração

| Variável | Padrão | Descrição |
| --- | --- | --- |
| `APP_URL` | `http://localhost:3000` | Base dos links de confirmação de e-mail e recuperação de senha. |
| `REQUIRE_EMAIL_VERIFICATION` | `false` | `true` exige confirmação antes de liberar contas não verificadas. |
| `DATABASE_URL` | vazio | PostgreSQL obrigatório na Vercel; use endpoint com pool para serverless. |
| `FESTEJA_DB_PATH` | `./data/festeja.db` | Base do diretório PGlite usado no desenvolvimento e nos testes. |
| `FESTEJA_SEED` | ativo fora de produção | `1`/`true` popula dados demo; `0`/`false` não popula. |
| `FESTEJA_UPLOADS_DIR` | `./public/uploads` | Diretório de imagens usado somente fora da Vercel. |
| `BLOB_READ_WRITE_TOKEN` | vazio | Token criado ao conectar um Vercel Blob. |
| `RESEND_API_KEY` | vazio | Chave da API Resend para e-mails transacionais. |
| `EMAIL_FROM` | vazio | Remetente verificado no provedor de e-mail. |

### Banco de dados

O desenvolvimento e os testes usam PGlite em `data/`. Em produção, configure
`DATABASE_URL` com PostgreSQL persistente e faça backup antes de aplicar uma
atualização com dados reais usando a ferramenta oferecida pelo provedor.

O schema e as migrações são aplicados automaticamente ao iniciar. Em produção o
seed nunca é executado, mesmo se `FESTEJA_SEED=1`; mantenha `FESTEJA_SEED=0` para
deixar a intenção explícita.

### E-mail transacional

A confirmação de e-mail e a recuperação de senha usam a API da Resend. Sem
`RESEND_API_KEY` e `EMAIL_FROM`, nenhum e-mail é enviado: os fluxos habilitados
informam que o envio não está configurado e os tokens não são expostos ao navegador.

Com `REQUIRE_EMAIL_VERIFICATION=false`, contas novas continuam registradas como
não verificadas, mas podem usar a plataforma imediatamente. Ao alterar a variável
para `true`, todas as contas ainda não verificadas, inclusive as criadas durante
esse período, voltam a precisar de confirmação. O link pode ser solicitado em
Configurações; senhas, sessões e autorização por papel não são afetadas pela flag.

### Uploads

Imagens são validadas pelo conteúdo real (JPEG, PNG, WebP ou GIF, até 4 MB). No
desenvolvimento são gravadas em `FESTEJA_UPLOADS_DIR/<userId>/`; na Vercel são
enviadas ao Blob conectado ao projeto. Não use o filesystem efêmero da função.

## Comandos

```bash
npm run dev          # desenvolvimento
npm run build        # build de produção
npm run start        # servidor de produção
npm run lint         # ESLint
npm run typecheck    # TypeScript
npm run check        # typecheck + lint
npm test             # todos os testes em banco temporário
npm run test:db      # schema, migrações e seed
npm run test:search  # busca e filtros
npm run test:profile # perfis de prestador
npm run test:auth    # validação de login e cadastro
npm run test:security # rate limit, verificação de e-mail e exclusão de conta
npm run migrate:sqlite # copia o SQLite para um PostgreSQL vazio
npm run migrate:uploads # copia uploads locais para o Blob e atualiza URLs
```

Os testes usam `FESTEJA_DB_PATH`, `FESTEJA_UPLOADS_DIR` e `FESTEJA_SEED=1`
temporários, sem tocar no banco local.

## Funcionalidades

- Busca por texto, bairro de Manaus, categoria, preço e avaliação com URL compartilhável.
- Catálogo validado dos 64 bairros oficiais de Manaus com autocomplete.
- Perfis de prestador com portfólio, serviços, disponibilidade, avaliações e favoritos.
- Cadastro e login com sessão HTTP-only, senha com hash scrypt e validação de conta.
- Confirmação de e-mail, reenvio de confirmação, recuperação e alteração de senha.
- Painel do prestador: perfil, portfólio, serviços, orçamentos, contratos e avaliações.
- Área do cliente: favoritos, agendamentos, avaliações, notificações e mensagens.
- Mensagens com polling, marcação de leitura e notificações.
- Moderação de denúncias de avaliações com histórico e status.
- Exclusão de conta pelo próprio usuário, com remoção dos uploads associados.
- Rate limiting para login, cadastro, recuperação de senha, uploads e mensagens.

## Rotas principais

| Rota | Descrição |
| --- | --- |
| `/` | Home com busca, categorias e destaques. |
| `/buscar` | Busca e filtros de prestadores. |
| `/prestadores/[id]` | Perfil público por id. |
| `/prestador/[username]` | Perfil público por username. |
| `/entrar`, `/cadastro` | Acesso e criação de conta. |
| `/esqueci-senha`, `/redefinir-senha` | Recuperação de senha. |
| `/verificar-email` | Confirmação de e-mail. |
| `/configuracoes` | Dados pessoais, foto, senha e exclusão de conta. |
| `/painel` | Painel do prestador. |
| `/agendamentos`, `/avaliacoes`, `/favoritos` | Área do cliente. |
| `/mensagens`, `/notificacoes` | Comunicação e avisos. |
| `/admin` | Moderação e administração. |
| `/termos`, `/privacidade` | Termos de uso e política de privacidade. |

## Estrutura

```text
src/
  app/            rotas, layouts e APIs
  actions/        server actions por domínio
  components/     UI organizada por área
  data/           seed e definições de categorias
  lib/            banco, autenticação, e-mail, rate limit, busca e uploads
  types/          tipos de domínio
scripts/          testes de verificação
data/             banco SQLite local (ignorado pelo Git)
public/uploads/   imagens locais (ignorado pelo Git)
```

## Segurança e privacidade

- Sessões em cookie HTTP-only com token hasheado no banco.
- Senhas armazenadas com scrypt e salt individual.
- Upload restrito por papel, validado por assinatura e limitado a 4 MB.
- Recuperação de senha não revela se um e-mail está cadastrado.
- Links de confirmação e recuperação expiram e só podem ser usados uma vez.
- Denúncias de avaliações possuem fluxo de moderação e auditoria.
- A exclusão de conta remove os dados associados e os arquivos enviados pelo usuário.

Antes de publicar em produção, revise os termos e a política de privacidade com
apoio jurídico e configure um provedor de e-mail, armazenamento persistente e
backups.

## Limitações conhecidas

- Não há processamento de pagamentos, escrow ou repasse financeiro.
- O envio real de e-mail depende da configuração da Resend.
- O desenvolvimento local usa PGlite; produção exige PostgreSQL.
- Categorias são definidas no código; ainda não há CRUD administrativo de categorias.

## Deploy na Vercel

1. Crie um PostgreSQL e configure `DATABASE_URL` nos ambientes Production e Preview.
2. Conecte um Vercel Blob ao projeto para disponibilizar as credenciais de storage.
3. Configure `APP_URL`, `FESTEJA_SEED=0`, `RESEND_API_KEY` e `EMAIL_FROM`.
4. Execute `npm run check`, `npm test` e `npm run build` antes de publicar.
5. Faça primeiro um deployment de Preview e valide cadastro, e-mail, upload e mensagens.

### Migração de uma instalação local

Antes da migração, faça backups do SQLite e de `public/uploads`. A migração exige
um PostgreSQL vazio, confere o backup por hash, copia os registros em uma única
transação e não remove os dados locais:

```powershell
$env:DATABASE_URL="postgresql://..."
$env:SQLITE_SOURCE_PATH="data/festeja.db"
$env:SQLITE_BACKUP_PATH="data/backups/festeja-backup.db"
npm run migrate:sqlite
npm run migrate:uploads
```

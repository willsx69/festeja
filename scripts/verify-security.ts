import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  clearRateLimit,
  consumePasswordResetToken,
  consumeRateLimit,
  createEmailVerificationToken,
  createPasswordResetToken,
  createQuote,
  createReviewForContract,
  createSession,
  createUser,
  deleteUserAccount,
  deleteUserSessions,
  getOrCreateConversation,
  getProviderByUsername,
  getSessionUser,
  getUserById,
  getUserProfile,
  invalidatePasswordResetTokens,
  listContractsForClient,
  queryRow,
  sendMessage,
  setContractStatus,
  setQuoteStatus,
  updateProviderProfile,
  verifyEmailToken,
} from "@/lib/db";
import { randomToken, sha256 } from "@/lib/password";
import { removeUserUploads, uploadsRoot } from "@/lib/uploads";

let failures = 0;

function check(label: string, condition: boolean, extra?: unknown) {
  if (condition) {
    console.log(`  ok   ${label}`);
  } else {
    failures++;
    console.log(`  FAIL ${label}`, extra ?? "");
  }
}

if (!process.env.FESTEJA_DB_PATH) {
  throw new Error("FESTEJA_DB_PATH precisa apontar para um banco temporário.");
}

async function main() {
console.log("rate limit");
const limitKey = `test-rate-${Date.now()}`;
const first = await consumeRateLimit(limitKey, 2, 60_000);
const second = await consumeRateLimit(limitKey, 2, 60_000);
const third = await consumeRateLimit(limitKey, 2, 60_000);
check("primeira tentativa permitida", first.allowed && first.remaining === 1, first);
check("segunda tentativa permitida", second.allowed && second.remaining === 0, second);
check("terceira tentativa bloqueada", !third.allowed && third.retryAfterSeconds > 0, third);
await clearRateLimit(limitKey);
check("limite pode ser reiniciado", (await consumeRateLimit(limitKey, 2, 60_000)).allowed);
await clearRateLimit(limitKey);

console.log("verificação de e-mail");
const emailUser = await createUser({
  name: "Usuário Segurança",
  email: `seguranca-${Date.now()}@example.com`,
  passwordHash: "scrypt:test:test",
  role: "cliente",
});
check(
  "conta nova começa não verificada",
  (await getUserProfile(emailUser.id))?.emailVerified === false,
);

const expiredToken = randomToken();
await createEmailVerificationToken(
  sha256(expiredToken),
  emailUser.id,
  emailUser.email,
  new Date(Date.now() - 1000).toISOString(),
);
check("token expirado é recusado", (await verifyEmailToken(sha256(expiredToken))) === undefined);

const validToken = randomToken();
await createEmailVerificationToken(
  sha256(validToken),
  emailUser.id,
  emailUser.email,
  new Date(Date.now() + 60_000).toISOString(),
);
check("token válido confirma a conta", (await verifyEmailToken(sha256(validToken))) === emailUser.id);
check("conta fica verificada", (await getUserProfile(emailUser.id))?.emailVerified === true);
check("token não pode ser reutilizado", (await verifyEmailToken(sha256(validToken))) === undefined);

console.log("sessões");
const expiredSessionToken = randomToken();
await createSession(
  emailUser.id,
  sha256(expiredSessionToken),
  new Date(Date.now() - 1000).toISOString(),
);
check(
  "sessão expirada é recusada",
  (await getSessionUser(sha256(expiredSessionToken))) === undefined,
);

const validSessionToken = randomToken();
await createSession(
  emailUser.id,
  sha256(validSessionToken),
  new Date(Date.now() + 60_000).toISOString(),
);
check(
  "sessão válida é aceita",
  (await getSessionUser(sha256(validSessionToken)))?.id === emailUser.id,
);
await deleteUserSessions(emailUser.id);
check(
  "sessões podem ser revogadas",
  (await getSessionUser(sha256(validSessionToken))) === undefined,
);

console.log("recuperação de senha");
const expiredResetToken = randomToken();
await createPasswordResetToken(
  sha256(expiredResetToken),
  emailUser.id,
  new Date(Date.now() - 1000).toISOString(),
);
check(
  "token de recuperação expirado é recusado",
  (await consumePasswordResetToken(sha256(expiredResetToken))) === undefined,
);

const supersededResetToken = randomToken();
await createPasswordResetToken(
  sha256(supersededResetToken),
  emailUser.id,
  new Date(Date.now() + 60_000).toISOString(),
);

const validResetToken = randomToken();
await createPasswordResetToken(
  sha256(validResetToken),
  emailUser.id,
  new Date(Date.now() + 60_000).toISOString(),
);
check(
  "novo token invalida o anterior",
  (await consumePasswordResetToken(sha256(supersededResetToken))) === undefined,
);
check(
  "token de recuperação válido é aceito",
  (await consumePasswordResetToken(sha256(validResetToken))) === emailUser.id,
);
check(
  "token de recuperação não pode ser reutilizado",
  (await consumePasswordResetToken(sha256(validResetToken))) === undefined,
);

const revokedResetToken = randomToken();
await createPasswordResetToken(
  sha256(revokedResetToken),
  emailUser.id,
  new Date(Date.now() + 60_000).toISOString(),
);
await invalidatePasswordResetTokens(emailUser.id);
check(
  "tokens podem ser revogados após trocar a senha",
  (await consumePasswordResetToken(sha256(revokedResetToken))) === undefined,
);

console.log("exclusão de conta");
const provider = await createUser({
  name: "Prestador Segurança",
  email: `prestador-seguranca-${Date.now()}@example.com`,
  passwordHash: "scrypt:test:test",
  role: "prestador",
  username: `seguranca-${Date.now()}`,
});
await updateProviderProfile(provider.id, {
  bio: "Perfil temporário criado para validar a exclusão de conta.",
  city: "Manaus",
  state: "AM",
  neighborhood: "Adrianópolis",
  tags: ["teste"],
  priceFrom: 100,
  priceUnit: null,
  category: "outros",
  availabilityDays: ["seg"],
  responseTime: "1 dia",
  minimumNotice: "1 dia",
  availabilityNote: "",
});

const client = await createUser({
  name: "Cliente Segurança",
  email: `cliente-seguranca-${Date.now()}@example.com`,
  passwordHash: "scrypt:test:test",
  role: "cliente",
});

const quoteId = await createQuote({
  providerUserId: provider.id,
  clientUserId: client.id,
  serviceName: "Serviço temporário",
  eventDate: "2026-12-01",
  guests: 10,
  message: "Solicitação temporária para validar exclusão de conta.",
});
await setQuoteStatus(quoteId, provider.id, "aceito", {
  serviceName: "Serviço temporário",
  amount: 100,
  eventDate: "2026-12-01",
});
const contract = (await listContractsForClient(client.id))[0];
check("contrato de teste criado", Boolean(contract));
if (contract) {
  await setContractStatus(contract.id, "concluido", "pendente");
  await createReviewForContract({
    contractId: contract.id,
    clientUserId: client.id,
    authorName: client.name,
    event: "Evento teste",
    eventDate: "01/12/2026",
    rating: 5,
    comment: "Avaliação temporária para validar exclusão de conta.",
  });
}

const conversationId = await getOrCreateConversation(client.id, provider.id);
await sendMessage(conversationId, client.id, "Mensagem temporária.");
const contractCount = await queryRow<{ total: number }>(
  "SELECT COUNT(*) AS total FROM contracts WHERE client_user_id = ?",
  [client.id],
);
check(
  "dados dependentes criados",
  Number(contractCount?.total ?? 0) === 1,
);

const uploadsDir = path.join(uploadsRoot(), client.id);
mkdirSync(uploadsDir, { recursive: true });
writeFileSync(path.join(uploadsDir, "teste.png"), "temporário");

check("prestador excluído", await deleteUserAccount(provider.id));
check("usuário prestador removido", (await getUserById(provider.id)) === undefined);
check(
  "perfil público removido",
  (await getProviderByUsername(provider.username ?? "")) === undefined,
);
check("contratos do cliente removidos", (await listContractsForClient(client.id)).length === 0);
const messageCount = await queryRow<{ total: number }>(
  "SELECT COUNT(*) AS total FROM messages WHERE conversation_id = ?",
  [conversationId],
);
check(
  "conversas e mensagens removidas",
  Number(messageCount?.total ?? 0) === 0,
);

check("cliente excluído", await deleteUserAccount(client.id));
check("usuário cliente removido", (await getUserById(client.id)) === undefined);
await removeUserUploads(client.id);
check("uploads do cliente removidos", !existsSync(uploadsDir));

console.log("");
console.log(failures === 0 ? "TODOS OS TESTES PASSARAM" : `${failures} FALHA(S)`);
process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});


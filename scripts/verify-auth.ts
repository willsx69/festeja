import { isProfileSlug, normalizeProfileSlug } from "@/lib/slug";
import {
  isEmail,
  validateBusinessAddress,
  validateLogin,
  validateSignup,
} from "@/lib/validate";

let failures = 0;

function check(label: string, condition: boolean, extra?: unknown) {
  if (condition) {
    console.log(`  ok   ${label}`);
  } else {
    failures++;
    console.log(`  FAIL ${label}`, extra ?? "");
  }
}

console.log("isEmail");
check("aceita nome@dominio.com", isEmail("ana@email.com"));
check("aceita subdominio", isEmail("ana.souza+tag@festeja.com.br"));
check("aceita com espaços nas pontas", isEmail("  ana@email.com  "));
check("rejeita vazio", !isEmail(""));
check("rejeita sem arroba", !isEmail("anaemail.com"));
check("rejeita sem domínio", !isEmail("ana@"));
check("rejeita sem TLD", !isEmail("ana@email"));
check("rejeita espaço no meio", !isEmail("ana souza@email.com"));

console.log("slug de perfil");
check(
  "normaliza maiúsculas, acentos e espaços",
  normalizeProfileSlug("Ana Beatriz Confeitaria") === "ana-beatriz-confeitaria",
);
check(
  "remove caracteres inválidos e hífens duplicados",
  normalizeProfileSlug("  João & Cia -- Festas!  ") === "joao-cia-festas",
);
check("slug normalizado é válido", isProfileSlug("ana-beatriz-confeitaria"));
check("slug com espaços é inválido", !isProfileSlug("ana beatriz"));
check("slug curto é inválido", !isProfileSlug("ab"));

console.log("endereço comercial");
check("aceita rua com vírgula", !validateBusinessAddress("Rua Linhares, 10"));
check("aceita avenida e número", !validateBusinessAddress("Avenida Brasil, 1500"));
check(
  "aceita complemento",
  !validateBusinessAddress("Rua das Flores, 25, sala 2"),
);
check("endereço vazio é aceito", !validateBusinessAddress(""));
check("limite de endereço é validado", Boolean(validateBusinessAddress("A".repeat(161))));

console.log("validateLogin");
const loginOk = validateLogin({ email: "ana@email.com", password: "segredo123" });
check("dados válidos não geram erros", Object.keys(loginOk).length === 0, loginOk);

const loginEmpty = validateLogin({ email: "", password: "" });
check("campos vazios: 2 erros", Object.keys(loginEmpty).length === 2, loginEmpty);
check("erro de e-mail obrigatório", loginEmpty.email === "Informe seu e-mail.");
check("erro de senha obrigatória", loginEmpty.password === "Informe sua senha.");

const loginBadEmail = validateLogin({ email: "errado", password: "x" });
check("e-mail inválido sinalizado", loginBadEmail.email?.includes("válido") === true);
check("senha preenchida não gera erro", loginBadEmail.password === undefined);

console.log("validateSignup");
const signupEmpty = validateSignup({
  name: "",
  email: "",
  password: "",
  confirm: "",
  accept: false,
});
check("formulário vazio: 5 erros", Object.keys(signupEmpty).length === 5, signupEmpty);

const signupShortName = validateSignup({
  name: "Ana",
  email: "ana@email.com",
  password: "12345678",
  confirm: "12345678",
  accept: true,
});
check("nome com 3 caracteres aceito", Object.keys(signupShortName).length === 0, signupShortName);

const signupName = validateSignup({
  name: "An",
  email: "ana@email.com",
  password: "12345678",
  confirm: "12345678",
  accept: true,
});
check("nome curto sinalizado", signupName.name === "Digite seu nome completo.");

const signupWeak = validateSignup({
  name: "Ana Beatriz",
  email: "ana@email.com",
  password: "12345",
  confirm: "12345",
  accept: true,
});
check("senha curta sinalizada", signupWeak.password?.includes("8 caracteres") === true);

const signupMismatch = validateSignup({
  name: "Ana Beatriz",
  email: "ana@email.com",
  password: "12345678",
  confirm: "87654321",
  accept: true,
});
check("senhas diferentes sinalizadas", signupMismatch.confirm === "As senhas não coincidem.");

const signupNoAccept = validateSignup({
  name: "Ana Beatriz",
  email: "ana@email.com",
  password: "12345678",
  confirm: "12345678",
  accept: false,
});
check("termos não aceitos sinalizados", signupNoAccept.accept === "Aceite os termos para continuar.");
check("só os termos falham", Object.keys(signupNoAccept).length === 1, signupNoAccept);

const signupOk = validateSignup({
  name: "Ana Beatriz Souza",
  email: "ana@email.com",
  password: "segredo123",
  confirm: "segredo123",
  accept: true,
});
check("formulário válido sem erros", Object.keys(signupOk).length === 0, signupOk);

console.log("");
console.log(failures === 0 ? "TODOS OS TESTES PASSARAM" : `${failures} FALHA(S)`);
process.exit(failures === 0 ? 0 : 1);

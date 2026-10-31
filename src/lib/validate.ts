export type LoginValues = {
  email: string;
  password: string;
};

export type SignupValues = {
  name: string;
  email: string;
  password: string;
  confirm: string;
  accept: boolean;
};

export type FormErrors<T> = Partial<Record<keyof T, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const BUSINESS_ADDRESS_MAX_LENGTH = 160;

export function isEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function normalizeBusinessAddress(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function validateBusinessAddress(value: string): string | undefined {
  const address = normalizeBusinessAddress(value);
  if (!address) return undefined;
  if (address.length > BUSINESS_ADDRESS_MAX_LENGTH) {
    return `Use no máximo ${BUSINESS_ADDRESS_MAX_LENGTH} caracteres.`;
  }
  if (/[\u0000-\u001f\u007f]/.test(address)) {
    return "Remova caracteres de controle do endereço.";
  }
  return undefined;
}

export function validateLogin(values: LoginValues): FormErrors<LoginValues> {
  const errors: FormErrors<LoginValues> = {};

  if (!values.email.trim()) {
    errors.email = "Informe seu e-mail.";
  } else if (!isEmail(values.email)) {
    errors.email = "Use um e-mail válido, como nome@exemplo.com.";
  }

  if (!values.password) {
    errors.password = "Informe sua senha.";
  }

  return errors;
}

export function validateSignup(values: SignupValues): FormErrors<SignupValues> {
  const errors: FormErrors<SignupValues> = {};
  const name = values.name.trim();

  if (!name) {
    errors.name = "Informe seu nome.";
  } else if (name.length < 3) {
    errors.name = "Digite seu nome completo.";
  }

  if (!values.email.trim()) {
    errors.email = "Informe seu e-mail.";
  } else if (!isEmail(values.email)) {
    errors.email = "Use um e-mail válido, como nome@exemplo.com.";
  }

  if (!values.password) {
    errors.password = "Crie uma senha.";
  } else if (values.password.length < 8) {
    errors.password = "A senha precisa ter pelo menos 8 caracteres.";
  }

  if (!values.confirm) {
    errors.confirm = "Repita a senha.";
  } else if (values.confirm !== values.password) {
    errors.confirm = "As senhas não coincidem.";
  }

  if (!values.accept) {
    errors.accept = "Aceite os termos para continuar.";
  }

  return errors;
}

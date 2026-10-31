export function isEmailVerificationRequired(
  value = process.env.REQUIRE_EMAIL_VERIFICATION,
): boolean {
  return value?.trim().toLowerCase() === "true";
}

export function canUseAccount(
  emailVerified: boolean,
  verificationRequired = isEmailVerificationRequired(),
): boolean {
  return emailVerified || !verificationRequired;
}

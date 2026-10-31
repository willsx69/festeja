export const PROFILE_SLUG_MIN_LENGTH = 3;
export const PROFILE_SLUG_MAX_LENGTH = 48;

const PROFILE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizeProfileSlug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, PROFILE_SLUG_MAX_LENGTH)
    .replace(/-+$/g, "");
}

export function isProfileSlug(value: string): boolean {
  return (
    value.length >= PROFILE_SLUG_MIN_LENGTH &&
    value.length <= PROFILE_SLUG_MAX_LENGTH &&
    PROFILE_SLUG_PATTERN.test(value)
  );
}

export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
export const MAX_UPLOAD_SIZE_LABEL = "5MB";

export const PROFILE_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const PROFILE_IMAGE_ACCEPT = PROFILE_IMAGE_TYPES.join(",");

export function isProfileImageType(
  value: string,
): value is (typeof PROFILE_IMAGE_TYPES)[number] {
  return PROFILE_IMAGE_TYPES.includes(
    value as (typeof PROFILE_IMAGE_TYPES)[number],
  );
}

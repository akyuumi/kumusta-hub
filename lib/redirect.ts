export function normalizeRedirectPath(value: string | null | undefined, fallback = "/mypage") {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  return value;
}

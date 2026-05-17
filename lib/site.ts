export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kumusta-hub.vercel.app";

export function absoluteUrl(path = "") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, siteUrl).toString();
}

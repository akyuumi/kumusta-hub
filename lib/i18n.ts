import { cookies } from "next/headers";
import { getDictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/types";

export const localeCookieName = "kumustahub-locale";

export function isLocale(value: unknown): value is Locale {
  return value === "ja" || value === "en";
}

export async function getLocale(lang?: string): Promise<Locale> {
  if (isLocale(lang)) return lang;

  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(localeCookieName)?.value;
  return isLocale(cookieLocale) ? cookieLocale : "en";
}

export { getDictionary };

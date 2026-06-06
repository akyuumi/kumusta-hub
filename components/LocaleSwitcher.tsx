"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Dictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/types";

export function LocaleSwitcher({ locale, labels }: { locale: Locale; labels: Dictionary["locale"] }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  function changeLocale(nextLocale: Locale) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", nextLocale);
    router.push(`${pathname}?${params.toString()}`);
    router.refresh();
  }

  return (
    <label className="flex items-center gap-2 text-sm text-muted">
      <span className="sr-only">{labels.label}</span>
      <select value={locale} onChange={(event) => changeLocale(event.target.value as Locale)} className="h-9 rounded-md border border-line bg-white px-2 text-sm outline-none focus:border-bay">
        <option value="en">{labels.en}</option>
        <option value="ja">{labels.ja}</option>
      </select>
    </label>
  );
}

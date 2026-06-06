import { Search } from "lucide-react";
import { categories as fallbackCategories, locations as fallbackLocations } from "@/lib/data";
import { dictionary } from "@/lib/dictionary";
import type { Category, Location, StoreSearchParams } from "@/lib/types";
import type { Locale } from "@/lib/types";

export function SearchForm({
  params,
  compact = false,
  locations = fallbackLocations,
  categories = fallbackCategories,
  locale = "en"
}: {
  params?: StoreSearchParams;
  compact?: boolean;
  locations?: Location[];
  categories?: Category[];
  locale?: Locale;
}) {
  const labels = dictionary[locale].searchForm;

  return (
    <form
      action="/search"
      className={
        compact
          ? "grid gap-3 rounded-lg border border-line bg-white p-3 shadow-sm md:grid-cols-[1.4fr_1fr_1fr_auto]"
          : "grid gap-3 rounded-lg bg-white p-3 shadow-soft md:grid-cols-[1.5fr_1fr_1fr_auto]"
      }
    >
      <input type="hidden" name="lang" value={locale} />
      <label className="relative">
        <span className="sr-only">{labels.keyword}</span>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
        <input
          name="q"
          defaultValue={params?.q}
          placeholder={labels.keywordPlaceholder}
          className="h-12 w-full rounded-md border border-line pl-10 pr-3 outline-none focus:border-bay"
        />
      </label>
      <label>
        <span className="sr-only">{labels.prefecture}</span>
        <select name="location" defaultValue={params?.location ?? params?.area ?? ""} className="h-12 w-full rounded-md border border-line px-3 outline-none focus:border-bay">
          <option value="">{labels.allPrefectures}</option>
          {locations.map((location) => (
            <option key={location.slug} value={location.slug}>
              {locale === "ja" ? location.nameJa : location.nameEn}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span className="sr-only">{labels.category}</span>
        <select
          name="category"
          defaultValue={params?.category ?? ""}
          className="h-12 w-full rounded-md border border-line px-3 outline-none focus:border-bay"
        >
          <option value="">{labels.allCategories}</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {locale === "ja" ? category.nameJa : category.nameEn}
            </option>
          ))}
        </select>
      </label>
      <button className="h-12 rounded-md bg-coral px-5 font-semibold text-white hover:bg-[#d84d40]">{labels.submit}</button>
    </form>
  );
}

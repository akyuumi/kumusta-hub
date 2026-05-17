import { Search } from "lucide-react";
import { areas as fallbackAreas, categories as fallbackCategories } from "@/lib/data";
import type { Area, Category, StoreSearchParams } from "@/lib/types";

export function SearchForm({
  params,
  compact = false,
  areas = fallbackAreas,
  categories = fallbackCategories
}: {
  params?: StoreSearchParams;
  compact?: boolean;
  areas?: Area[];
  categories?: Category[];
}) {
  return (
    <form
      action="/search"
      className={
        compact
          ? "grid gap-3 rounded-lg border border-line bg-white p-3 shadow-sm md:grid-cols-[1.4fr_1fr_1fr_auto]"
          : "grid gap-3 rounded-lg bg-white p-3 shadow-soft md:grid-cols-[1.5fr_1fr_1fr_auto]"
      }
    >
      <label className="relative">
        <span className="sr-only">Keyword</span>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
        <input
          name="q"
          defaultValue={params?.q}
          placeholder="sisig, grocery, remittance..."
          className="h-12 w-full rounded-md border border-line pl-10 pr-3 outline-none focus:border-bay"
        />
      </label>
      <label>
        <span className="sr-only">Prefecture</span>
        <select name="area" defaultValue={params?.area ?? ""} className="h-12 w-full rounded-md border border-line px-3 outline-none focus:border-bay">
          <option value="">All prefectures</option>
          {areas.map((area) => (
            <option key={area.slug} value={area.slug}>
              {area.nameEn}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span className="sr-only">Category</span>
        <select
          name="category"
          defaultValue={params?.category ?? ""}
          className="h-12 w-full rounded-md border border-line px-3 outline-none focus:border-bay"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.nameEn}
            </option>
          ))}
        </select>
      </label>
      <button className="h-12 rounded-md bg-coral px-5 font-semibold text-white hover:bg-[#d84d40]">Search</button>
    </form>
  );
}

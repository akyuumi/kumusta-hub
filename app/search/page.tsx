import type { Metadata } from "next";
import { MapPanel } from "@/components/MapPanel";
import { SearchForm } from "@/components/SearchForm";
import { StoreCard } from "@/components/StoreCard";
import { searchStores } from "@/lib/data";
import type { StoreSearchParams } from "@/lib/types";

export const metadata: Metadata = {
  title: "Search Filipino stores",
  description: "Search Filipino restaurants, groceries, remittance, and international delivery services in Japan."
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<StoreSearchParams> }) {
  const params = await searchParams;
  const results = searchStores(params);

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_420px]">
      <section className="space-y-5">
        <SearchForm params={params} compact />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ink">Search results</h1>
            <p className="mt-1 text-sm text-muted">{results.length} published stores found</p>
          </div>
          <form action="/search" className="hidden items-center gap-2 sm:flex">
            <input type="hidden" name="q" value={params.q ?? ""} />
            <input type="hidden" name="area" value={params.area ?? ""} />
            <input type="hidden" name="category" value={params.category ?? ""} />
            <label className="flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm">
              <input type="checkbox" name="tagalog" value="true" defaultChecked={params.tagalog === "true"} />
              Tagalog support
            </label>
            <select name="rating" defaultValue={params.rating ?? ""} className="rounded-md border border-line bg-white px-3 py-2 text-sm">
              <option value="">Any rating</option>
              <option value="4">4.0+</option>
              <option value="4.5">4.5+</option>
            </select>
            <button className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white">Apply</button>
          </form>
        </div>
        {results.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {results.map((store) => (
              <StoreCard key={store.slug} store={store} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-line bg-white p-8 text-center">
            <p className="font-semibold text-ink">No stores match your filters.</p>
            <p className="mt-2 text-sm text-muted">Try another area, category, or keyword.</p>
          </div>
        )}
      </section>
      <MapPanel stores={results} />
    </main>
  );
}

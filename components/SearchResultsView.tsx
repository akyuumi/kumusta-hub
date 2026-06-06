"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { List, Map } from "lucide-react";
import { LeafletMap } from "@/components/LeafletMap";
import { MapPanel } from "@/components/MapPanel";
import { StoreCard } from "@/components/StoreCard";
import { dictionary, formatMessage } from "@/lib/dictionary";
import type { Locale, Store, StoreSearchParams } from "@/lib/types";

type SearchResultsViewProps = {
  params: StoreSearchParams;
  results: Store[];
  filters: ReactNode;
  locale: Locale;
};

export function SearchResultsView({ params, results, filters, locale }: SearchResultsViewProps) {
  const [mobileView, setMobileView] = useState<"list" | "map">("list");
  const labels = dictionary[locale].searchResults;
  const mapPoints = results.map((store) => ({
    id: store.id,
    name: store.name,
    address: store.address,
    href: `/stores/${store.slug}`,
    lat: store.lat,
    lng: store.lng
  }));

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_420px]">
      <section className="space-y-5">
        {filters}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-ink">{labels.title}</h1>
            <p className="mt-1 text-sm text-muted">{formatMessage(labels.count, { count: results.length })}</p>
          </div>
          <form action="/search" className="hidden items-center gap-2 sm:flex">
            <input type="hidden" name="lang" value={locale} />
            <input type="hidden" name="q" value={params.q ?? ""} />
            <input type="hidden" name="location" value={params.location ?? params.area ?? ""} />
            <input type="hidden" name="category" value={params.category ?? ""} />
            <label className="flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm">
              <input type="checkbox" name="tagalog" value="true" defaultChecked={params.tagalog === "true"} />
              {labels.tagalogSupport}
            </label>
            <select name="rating" defaultValue={params.rating ?? ""} className="rounded-md border border-line bg-white px-3 py-2 text-sm">
              <option value="">{labels.anyRating}</option>
              <option value="4">4.0+</option>
              <option value="4.5">4.5+</option>
            </select>
            <button className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white">{labels.apply}</button>
          </form>
          <div className="grid h-10 grid-cols-2 rounded-md border border-line bg-white p-1 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileView("list")}
              aria-pressed={mobileView === "list"}
              className={`flex min-w-20 items-center justify-center gap-1 rounded px-3 text-sm font-semibold ${mobileView === "list" ? "bg-ink text-white" : "text-muted"}`}
            >
              <List size={16} />
              {labels.list}
            </button>
            <button
              type="button"
              onClick={() => setMobileView("map")}
              aria-pressed={mobileView === "map"}
              className={`flex min-w-20 items-center justify-center gap-1 rounded px-3 text-sm font-semibold ${mobileView === "map" ? "bg-ink text-white" : "text-muted"}`}
            >
              <Map size={16} />
              {labels.map}
            </button>
          </div>
        </div>

        <div className={mobileView === "list" ? "block" : "hidden lg:block"}>
          {results.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2">
              {results.map((store) => (
                <StoreCard key={store.slug} store={store} locale={locale} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-line bg-white p-8 text-center">
              <p className="font-semibold text-ink">{labels.emptyTitle}</p>
              <p className="mt-2 text-sm text-muted">{labels.emptyBody}</p>
            </div>
          )}
        </div>

        <div className={mobileView === "map" ? "block lg:hidden" : "hidden"}>
          <div className="h-[65vh] overflow-hidden rounded-lg border border-line bg-white shadow-sm">
            {mapPoints.length > 0 ? (
              <LeafletMap points={mapPoints} className="h-full rounded-none" zoom={13} />
            ) : (
              <div className="map-grid flex h-full items-center justify-center p-5 text-center text-sm font-semibold text-muted">{labels.emptyMap}</div>
            )}
          </div>
        </div>
      </section>
      <MapPanel stores={results} />
    </main>
  );
}

import type { Metadata } from "next";
import { SearchForm } from "@/components/SearchForm";
import { SearchResultsView } from "@/components/SearchResultsView";
import { getLocations, getCategories, searchStores } from "@/lib/db";
import { getLocale } from "@/lib/i18n";
import type { StoreSearchParams } from "@/lib/types";

export const metadata: Metadata = {
  title: "Search Filipino stores",
  description: "Search Filipino restaurants, groceries, remittance, and international delivery services in Japan."
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<StoreSearchParams> }) {
  const params = await searchParams;
  const [locations, categories, results, locale] = await Promise.all([getLocations(), getCategories(), searchStores(params), getLocale(params.lang)]);

  return (
    <SearchResultsView params={params} results={results} locale={locale} filters={<SearchForm params={params} compact locations={locations} categories={categories} locale={locale} />} />
  );
}

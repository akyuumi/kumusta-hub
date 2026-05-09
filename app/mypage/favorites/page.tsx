import type { Metadata } from "next";
import { StoreCard } from "@/components/StoreCard";
import { getStores } from "@/lib/db";

export const metadata: Metadata = {
  title: "Favorites"
};

export default async function FavoritesPage() {
  const stores = await getStores();
  const favoriteStores = stores.slice(0, 2);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-ink">Favorites</h1>
      <p className="mt-2 text-muted">MVP preview of saved stores. Persist favorites with Supabase after auth is connected.</p>
      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {favoriteStores.map((store) => (
          <StoreCard key={store.slug} store={store} />
        ))}
      </div>
    </main>
  );
}

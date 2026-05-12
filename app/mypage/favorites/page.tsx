import type { Metadata } from "next";
import { StoreCard } from "@/components/StoreCard";
import { requireUser } from "@/lib/auth";
import { getFavoriteStores } from "@/lib/db";

export const metadata: Metadata = {
  title: "Favorites"
};

export default async function FavoritesPage() {
  const user = await requireUser("/mypage/favorites");
  const favoriteStores = await getFavoriteStores(user.id);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-ink">Favorites</h1>
      <p className="mt-2 text-muted">Stores you saved for quick access.</p>
      {favoriteStores.length > 0 ? (
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {favoriteStores.map((store) => (
            <StoreCard key={store.slug} store={store} />
          ))}
        </div>
      ) : (
        <p className="mt-6 rounded-md bg-[#faf7f2] p-4 text-sm text-muted">No saved stores yet. Save stores from the store detail page.</p>
      )}
    </main>
  );
}

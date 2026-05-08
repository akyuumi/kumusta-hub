import Link from "next/link";
import { Heart, PlusCircle, Star } from "lucide-react";

export default function MyPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-ink">My page</h1>
      <p className="mt-2 text-muted">User dashboard shell for reviews, favorites, and store requests.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Link href="/mypage/favorites" className="rounded-lg border border-line bg-white p-5 hover:border-bay">
          <Heart className="text-coral" />
          <p className="mt-4 font-semibold">Favorites</p>
          <p className="mt-1 text-sm text-muted">Saved stores</p>
        </Link>
        <Link href="/store-request" className="rounded-lg border border-line bg-white p-5 hover:border-bay">
          <PlusCircle className="text-bay" />
          <p className="mt-4 font-semibold">Store request</p>
          <p className="mt-1 text-sm text-muted">Submit a new place</p>
        </Link>
        <Link href="/search" className="rounded-lg border border-line bg-white p-5 hover:border-bay">
          <Star className="text-mango" />
          <p className="mt-4 font-semibold">Reviews</p>
          <p className="mt-1 text-sm text-muted">Find a store to review</p>
        </Link>
      </div>
    </main>
  );
}

import Link from "next/link";
import { Heart, PlusCircle, Star, UserRound } from "lucide-react";
import { requireUser } from "@/lib/auth";

export default async function MyPage({
  searchParams
}: {
  searchParams: Promise<{
    error?: string;
  }>;
}) {
  const [user, params] = await Promise.all([requireUser("/mypage"), searchParams]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink">My page</h1>
          <p className="mt-2 text-muted">User dashboard shell for reviews, favorites, and store requests.</p>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-line bg-white px-4 py-3 text-sm">
          <UserRound size={18} className="text-bay" />
          <span className="font-medium">{user.email}</span>
        </div>
      </div>
      {params.error === "admin_required" && <p className="mt-4 rounded-md bg-[#fff5ea] p-3 text-sm font-medium text-coral">Admin access is restricted to approved operator accounts.</p>}
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

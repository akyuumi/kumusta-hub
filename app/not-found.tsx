import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-3xl place-items-center px-4 py-10 text-center sm:px-6">
      <section>
        <p className="text-sm font-semibold text-coral">404</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">Page not found</h1>
        <p className="mt-3 text-muted">The page may have moved, or the store listing is not published.</p>
        <Link href="/search" className="mt-6 inline-flex h-11 items-center rounded-md bg-coral px-5 font-semibold text-white">
          Back to search
        </Link>
      </section>
    </main>
  );
}

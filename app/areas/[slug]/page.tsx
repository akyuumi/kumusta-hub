import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoreCard } from "@/components/StoreCard";
import { getLocation, getStores } from "@/lib/db";
import { absoluteUrl } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const location = await getLocation(slug);
  return location
    ? {
        title: `${location.nameEn} Filipino stores`,
        description: `Find Filipino restaurants, groceries, remittance, and delivery services in ${location.nameEn}.`,
        alternates: { canonical: absoluteUrl(`/areas/${location.slug}`) },
        openGraph: {
          title: `${location.nameEn} Filipino stores`,
          description: `Find Filipino community stores in ${location.nameEn}.`,
          url: absoluteUrl(`/areas/${location.slug}`)
        }
      }
    : {};
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const location = await getLocation(slug);
  if (!location) notFound();

  const stores = await getStores();
  const locationStores = stores.filter((store) => store.locationSlug === location.slug && store.isPublished);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-ink">{location.nameEn}</h1>
      <p className="mt-2 text-muted">Filipino restaurants, groceries, remittance, and delivery services in {location.nameJa}.</p>
      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {locationStores.map((store) => (
          <StoreCard key={store.slug} store={store} />
        ))}
      </div>
    </main>
  );
}

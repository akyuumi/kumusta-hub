import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoreCard } from "@/components/StoreCard";
import { getBrand, getStores } from "@/lib/db";
import { absoluteUrl } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrand(slug);
  return brand
    ? {
        title: brand.nameEn,
        description: brand.description,
        alternates: { canonical: absoluteUrl(`/brands/${brand.slug}`) },
        openGraph: {
          title: brand.nameEn,
          description: brand.description,
          url: absoluteUrl(`/brands/${brand.slug}`)
        }
      }
    : {};
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = await getBrand(slug);
  if (!brand) notFound();

  const stores = await getStores();
  const brandStores = stores.filter((store) => store.brandSlug === brand.slug && store.isPublished);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-ink">{brand.nameEn}</h1>
      <p className="mt-2 max-w-2xl leading-7 text-muted">{brand.description}</p>
      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {brandStores.map((store) => (
          <StoreCard key={store.slug} store={store} />
        ))}
      </div>
    </main>
  );
}

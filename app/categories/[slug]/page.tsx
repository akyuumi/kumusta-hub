import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoreCard } from "@/components/StoreCard";
import { getCategory, getStores } from "@/lib/db";
import { absoluteUrl } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  return category
    ? {
        title: `${category.nameEn} in Japan`,
        description: `Find Filipino community ${category.nameEn.toLowerCase()} listings in Japan with reviews, photos, and store details.`,
        alternates: { canonical: absoluteUrl(`/categories/${category.slug}`) },
        openGraph: {
          title: `${category.nameEn} in Japan`,
          description: `Find ${category.nameEn} stores in Japan.`,
          url: absoluteUrl(`/categories/${category.slug}`)
        }
      }
    : {};
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();

  const stores = await getStores();
  const categoryStores = stores.filter((store) => store.categorySlug === category.slug && store.isPublished);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-ink">{category.nameEn}</h1>
      <p className="mt-2 text-muted">Browse {category.nameJa} listings for Filipino communities across Japan.</p>
      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {categoryStores.map((store) => (
          <StoreCard key={store.slug} store={store} />
        ))}
      </div>
    </main>
  );
}

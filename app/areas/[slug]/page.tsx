import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoreCard } from "@/components/StoreCard";
import { getArea, getStores } from "@/lib/db";
import { absoluteUrl } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const area = await getArea(slug);
  return area
    ? {
        title: `${area.nameEn} Filipino stores`,
        description: `Find Filipino restaurants, groceries, remittance, and delivery services in ${area.nameEn}.`,
        alternates: { canonical: absoluteUrl(`/areas/${area.slug}`) },
        openGraph: {
          title: `${area.nameEn} Filipino stores`,
          description: `Find Filipino community stores in ${area.nameEn}.`,
          url: absoluteUrl(`/areas/${area.slug}`)
        }
      }
    : {};
}

export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const area = await getArea(slug);
  if (!area) notFound();

  const stores = await getStores();
  const areaStores = stores.filter((store) => store.areaSlug === area.slug && store.isPublished);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-ink">{area.nameEn}</h1>
      <p className="mt-2 text-muted">Filipino restaurants, groceries, remittance, and delivery services in {area.nameJa}.</p>
      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {areaStores.map((store) => (
          <StoreCard key={store.slug} store={store} />
        ))}
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ExternalLink, Flag, Heart, MapPin, Phone, Star, ThumbsUp } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getArea, getBrand, getCategory, getStore, getStores, isFavoriteStore } from "@/lib/db";
import { formatRating } from "@/lib/utils";
import { createReviewAction, toggleFavoriteAction } from "./actions";

export async function generateStaticParams() {
  const stores = await getStores();
  return stores.map((store) => ({ slug: store.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const store = await getStore(slug);
  if (!store) return {};

  return {
    title: store.name,
    description: store.description,
    openGraph: {
      title: store.name,
      description: store.description,
      images: [store.photoUrl]
    }
  };
}

export default async function StoreDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    error?: string;
  }>;
}) {
  const { slug } = await params;
  const store = await getStore(slug);
  if (!store) notFound();

  const [area, category, brand, user, query] = await Promise.all([getArea(store.areaSlug), getCategory(store.categorySlug), getBrand(store.brandSlug), getCurrentUser(), searchParams]);
  const isFavorite = user ? await isFavoriteStore(user.id, store.id) : false;

  return (
    <main>
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted">
          <Link href="/search">Search</Link>
          <span>/</span>
          {area && <Link href={`/areas/${area.slug}`}>{area.nameEn}</Link>}
          <span>/</span>
          <span className="text-ink">{store.name}</span>
        </div>
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-[#efe8df]">
            <Image src={store.photoUrl} alt={store.photos[0]?.altText ?? ""} fill priority sizes="(min-width: 1024px) 760px, 100vw" className="object-cover" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <InfoTile label="Category" value={category?.nameEn ?? "Store"} href={category ? `/categories/${category.slug}` : undefined} />
            <InfoTile label="Brand" value={brand?.nameEn ?? "Independent"} href={brand ? `/brands/${brand.slug}` : undefined} />
            <InfoTile label="Area" value={area?.nameEn ?? "Japan"} href={area ? `/areas/${area.slug}` : undefined} />
            <InfoTile label="Hours" value={store.openingHours} />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-12 sm:px-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-ink">{store.name}</h1>
                <p className="mt-2 max-w-3xl leading-7 text-muted">{store.description}</p>
              </div>
              <div className="flex items-center gap-2 rounded-md bg-white px-3 py-2 shadow-sm">
                <Star size={18} className="fill-mango text-mango" />
                <span className="font-bold">{formatRating(store.averageRating)}</span>
                <span className="text-sm text-muted">({store.reviewCount})</span>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {store.tagalogSupport && <Badge>Tagalog support</Badge>}
              {store.gcashSupport && <Badge>GCash</Badge>}
              {store.filipinoProducts && <Badge>Filipino products</Badge>}
              {store.remittanceSupport && <Badge>Remittance</Badge>}
            </div>
          </div>

          <section className="rounded-lg border border-line bg-white p-5">
            <h2 className="text-xl font-bold text-ink">Popular menu and services</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {store.featuredMenu.map((item) => (
                <span key={item} className="rounded-full bg-[#fff5ea] px-3 py-1 text-sm font-medium">
                  {item}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted">Price range: {store.priceRange}</p>
          </section>

          <section id="reviews" className="rounded-lg border border-line bg-white p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-ink">Reviews</h2>
              {!user && (
                <Link href={`/login?next=/stores/${store.slug}`} className="rounded-md bg-coral px-4 py-2 text-sm font-semibold text-white">
                  Write review
                </Link>
              )}
            </div>
            {query.error === "invalid_rating" && <p className="mb-4 rounded-md bg-[#fff5ea] p-3 text-sm font-medium text-coral">Choose a rating from 1 to 5.</p>}
            {query.error === "review_too_long" && <p className="mb-4 rounded-md bg-[#fff5ea] p-3 text-sm font-medium text-coral">Review text must be 2,000 characters or less.</p>}
            {query.error === "too_many_review_photos" && <p className="mb-4 rounded-md bg-[#fff5ea] p-3 text-sm font-medium text-coral">Upload up to 3 photos per review.</p>}
            {query.error === "invalid_review_photo_type" && <p className="mb-4 rounded-md bg-[#fff5ea] p-3 text-sm font-medium text-coral">Review photos must be JPEG, PNG, or WebP.</p>}
            {query.error === "review_photo_too_large" && <p className="mb-4 rounded-md bg-[#fff5ea] p-3 text-sm font-medium text-coral">Each review photo must be 5MB or less.</p>}
            {query.error === "review_photo_upload_failed" && <p className="mb-4 rounded-md bg-[#fff5ea] p-3 text-sm font-medium text-coral">Photo upload failed. Please try again.</p>}
            {user ? <ReviewForm slug={store.slug} /> : <p className="mb-4 rounded-md bg-[#faf7f2] p-4 text-sm text-muted">Login to write a review and help the community find reliable Filipino places in Japan.</p>}
            <div className="space-y-4">
              {store.reviews.length > 0 ? (
                store.reviews.map((review) => (
                  <article key={review.id} className="rounded-md border border-line p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-ink">{review.authorName}</p>
                        <p className="text-xs text-muted">{review.createdAt}</p>
                      </div>
                      <div className="flex items-center gap-1 font-semibold">
                        <Star size={16} className="fill-mango text-mango" />
                        {review.rating}
                      </div>
                    </div>
                    <p className="mt-3 leading-7 text-muted">{review.body}</p>
                    {review.photos.length > 0 && (
                      <div className="mt-3 grid grid-cols-3 gap-2 sm:max-w-md">
                        {review.photos.map((photo) => (
                          <div key={photo.id} className="relative aspect-square overflow-hidden rounded-md bg-[#efe8df]">
                            <Image src={photo.imageUrl} alt="" fill sizes="(min-width: 640px) 130px, 30vw" className="object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-3 flex gap-3 text-sm text-muted">
                      <button className="flex items-center gap-1 hover:text-ink">
                        <ThumbsUp size={15} />
                        Helpful {review.helpfulCount}
                      </button>
                      <button className="flex items-center gap-1 hover:text-ink">
                        <Flag size={15} />
                        Report
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <p className="rounded-md bg-[#faf7f2] p-4 text-sm text-muted">No reviews yet. Be the first community member to review this store.</p>
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
            {user ? (
              <form action={toggleFavoriteAction}>
                <input type="hidden" name="slug" value={store.slug} />
                <button className="mb-4 flex h-11 w-full items-center justify-center gap-2 rounded-md border border-line font-semibold hover:border-coral">
                  <Heart size={18} className={isFavorite ? "fill-coral text-coral" : ""} />
                  {isFavorite ? "Saved" : "Save store"}
                </button>
              </form>
            ) : (
              <Link href={`/login?next=/stores/${store.slug}`} className="mb-4 flex h-11 w-full items-center justify-center gap-2 rounded-md border border-line font-semibold hover:border-coral">
                <Heart size={18} />
                Save store
              </Link>
            )}
            <div className="space-y-3 text-sm">
              <p className="flex gap-2">
                <MapPin size={18} className="shrink-0 text-bay" />
                {store.address}
              </p>
              <p className="flex gap-2">
                <Phone size={18} className="shrink-0 text-bay" />
                {store.phone}
              </p>
              <a className="flex gap-2 text-bay" href={store.websiteUrl} target="_blank" rel="noreferrer">
                <ExternalLink size={18} className="shrink-0" />
                Website
              </a>
              <a className="flex gap-2 text-bay" href={store.facebookUrl} target="_blank" rel="noreferrer">
                <ExternalLink size={18} className="shrink-0" />
                Facebook
              </a>
            </div>
          </div>
          <a
            href={`https://www.openstreetmap.org/?mlat=${store.lat}&mlon=${store.lng}#map=16/${store.lat}/${store.lng}`}
            target="_blank"
            rel="noreferrer"
            className="map-grid block h-72 rounded-lg border border-line p-4"
          >
            <span className="inline-flex rounded-md bg-white px-3 py-2 text-sm font-semibold shadow-sm">Open in OpenStreetMap</span>
          </a>
        </aside>
      </section>
    </main>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return <span className="rounded-full bg-[#eef7f4] px-3 py-1 text-sm font-semibold text-bay">{children}</span>;
}

function InfoTile({ label, value, href }: { label: string; value: string; href?: string }) {
  const content = (
    <div className="rounded-lg border border-line bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 font-semibold text-ink">{value}</p>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

function ReviewForm({ slug }: { slug: string }) {
  return (
    <form action={createReviewAction} className="mb-5 rounded-md border border-line bg-[#faf7f2] p-4">
      <input type="hidden" name="slug" value={slug} />
      <div className="grid gap-4 md:grid-cols-[160px_1fr]">
        <label className="space-y-1">
          <span className="text-sm font-semibold text-ink">Rating</span>
          <select name="rating" required defaultValue="5" className="h-11 w-full rounded-md border border-line bg-white px-3 outline-none focus:border-bay">
            <option value="5">5 stars</option>
            <option value="4">4 stars</option>
            <option value="3">3 stars</option>
            <option value="2">2 stars</option>
            <option value="1">1 star</option>
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-sm font-semibold text-ink">Review</span>
          <textarea name="body" maxLength={2000} rows={4} className="w-full rounded-md border border-line bg-white p-3 outline-none focus:border-bay" placeholder="Food, service, Tagalog support, product availability..." />
        </label>
      </div>
      <label className="mt-3 block space-y-1">
        <span className="text-sm font-semibold text-ink">Photos</span>
        <input name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none file:mr-3 file:rounded-md file:border-0 file:bg-bay file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white focus:border-bay" />
        <span className="block text-xs text-muted">Up to 3 photos, 5MB each.</span>
      </label>
      <div className="mt-3 flex justify-end">
        <button className="rounded-md bg-coral px-4 py-2 text-sm font-semibold text-white hover:bg-[#d84d40]">Post review</button>
      </div>
    </form>
  );
}

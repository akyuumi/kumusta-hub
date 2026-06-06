import Link from "next/link";
import type { ElementType } from "react";
import { ArrowRight, MapPinned, MessageSquareText, ShieldCheck } from "lucide-react";
import { SearchForm } from "@/components/SearchForm";
import { StoreCard } from "@/components/StoreCard";
import { getLocations, getCategories, getStores } from "@/lib/db";
import { getDictionary, getLocale } from "@/lib/i18n";
import type { StoreSearchParams } from "@/lib/types";

export default async function HomePage({ searchParams }: { searchParams: Promise<Pick<StoreSearchParams, "lang">> }) {
  const params = await searchParams;
  const [locations, categories, stores, locale] = await Promise.all([getLocations(), getCategories(), getStores(), getLocale(params.lang)]);
  const dict = getDictionary(locale);
  const featuredStores = stores.slice(0, 3);

  return (
    <main>
      <section className="bg-[#fff5ea]">
        <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-8">
            <div className="space-y-5">
              <p className="inline-flex rounded-full bg-white px-3 py-1 text-sm font-semibold text-bay shadow-sm">{dict.home.eyebrow}</p>
              <h1 className="max-w-3xl text-4xl font-bold leading-tight text-ink sm:text-5xl lg:text-6xl">
                {dict.home.headline}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted">
                {dict.home.lead}
              </p>
            </div>
            <SearchForm locations={locations} categories={categories} locale={locale} />
            <div className="flex flex-wrap gap-3">
              {locations.map((location) => (
                <Link key={location.slug} href={`/areas/${location.slug}`} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium hover:border-bay">
                  {locale === "ja" ? location.nameJa : location.nameEn}
                </Link>
              ))}
            </div>
          </div>
          <div className="relative hidden min-h-[520px] lg:block">
            <div className="absolute inset-x-8 top-0 overflow-hidden rounded-lg shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={featuredStores[0].photoUrl} alt="" className="h-72 w-full object-cover" />
            </div>
            <div className="absolute bottom-10 left-0 w-72 rounded-lg bg-white p-4 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-md bg-mango font-bold text-ink">4.6</span>
                <div>
                  <p className="font-semibold">{dict.home.communityReviewed}</p>
                  <p className="text-sm text-muted">{dict.home.realExperiences}</p>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 overflow-hidden rounded-lg shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={featuredStores[1].photoUrl} alt="" className="h-72 w-80 object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-ink">{dict.home.featuredStores}</h2>
            <p className="mt-2 text-muted">{dict.home.featuredDescription}</p>
          </div>
          <Link href="/search" className="hidden items-center gap-2 font-semibold text-coral sm:flex">
            {dict.home.viewAll} <ArrowRight size={18} />
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {featuredStores.map((store) => (
            <StoreCard key={store.slug} store={store} locale={locale} />
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-10 sm:px-6 md:grid-cols-3">
          <Value icon={MapPinned} title={dict.home.values[0].title} body={dict.home.values[0].body} />
          <Value icon={MessageSquareText} title={dict.home.values[1].title} body={dict.home.values[1].body} />
          <Value icon={ShieldCheck} title={dict.home.values[2].title} body={dict.home.values[2].body} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h2 className="mb-5 text-2xl font-bold text-ink">{dict.home.browseCategories}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.slug} href={`/categories/${category.slug}`} className="rounded-lg border border-line bg-white p-5 hover:border-bay">
              <p className="font-semibold text-ink">{locale === "ja" ? category.nameJa : category.nameEn}</p>
              <p className="mt-2 text-sm text-muted">{locale === "ja" ? category.nameEn : category.nameJa}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function Value({ icon: Icon, title, body }: { icon: ElementType; title: string; body: string }) {
  return (
    <div className="flex gap-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-[#eef7f4] text-bay">
        <Icon size={22} />
      </span>
      <div>
        <h3 className="font-semibold text-ink">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-muted">{body}</p>
      </div>
    </div>
  );
}

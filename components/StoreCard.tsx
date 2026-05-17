import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Heart, MapPin, Star } from "lucide-react";
import { categories, getCategory, getLocation, locations } from "@/lib/data";
import type { Store } from "@/lib/types";
import { formatRating } from "@/lib/utils";

export function StoreCard({ store }: { store: Store }) {
  const category = getCategory(store.categorySlug) ?? categories[0];
  const location = getLocation(store.locationSlug) ?? locations[0];

  return (
    <article className="overflow-hidden rounded-lg border border-line bg-white shadow-sm">
      <Link href={`/stores/${store.slug}`} className="block">
        <div className="relative aspect-[4/3] bg-[#efe8df]">
          <Image src={store.photoUrl} alt="" fill sizes="(min-width: 768px) 360px, 100vw" className="object-cover" />
          <button className="absolute right-3 top-3 rounded-full bg-white/95 p-2 text-ink shadow-sm" aria-label="Save store">
            <Heart size={18} />
          </button>
        </div>
        <div className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="line-clamp-1 font-semibold text-ink">{store.name}</h3>
              <p className="mt-1 text-sm text-muted">{category.nameEn}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1 text-sm font-semibold">
              <Star size={16} className="fill-mango text-mango" />
              {formatRating(store.averageRating)}
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted">
            <MapPin size={15} />
            {location.nameEn}
          </div>
          <div className="flex flex-wrap gap-2">
            {store.tagalogSupport && <Pill label="Tagalog" />}
            {store.gcashSupport && <Pill label="GCash" />}
            {store.filipinoProducts && <Pill label="Products" />}
            {store.remittanceSupport && <Pill label="Remittance" />}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">{store.reviewCount} reviews</span>
            <span className="flex items-center gap-1 font-medium text-bay">
              <BadgeCheck size={15} />
              Published
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

function Pill({ label }: { label: string }) {
  return <span className="rounded-full bg-[#eef7f4] px-2.5 py-1 text-xs font-medium text-bay">{label}</span>;
}

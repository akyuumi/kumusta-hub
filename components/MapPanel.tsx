import { MapPin } from "lucide-react";
import type { Store } from "@/lib/types";

export function MapPanel({ stores }: { stores: Store[] }) {
  return (
    <aside className="map-grid sticky top-20 hidden h-[calc(100vh-6rem)] overflow-hidden rounded-lg border border-line bg-white lg:block">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(232,93,79,0.16),transparent_24%),radial-gradient(circle_at_70%_70%,rgba(242,184,75,0.18),transparent_22%)]" />
      <div className="relative flex h-full flex-col justify-between p-5">
        <div className="rounded-md bg-white/95 p-4 shadow-sm">
          <p className="text-sm font-semibold text-ink">OpenStreetMap view</p>
          <p className="mt-1 text-xs leading-5 text-muted">MVP map shell. Replace this panel with Leaflet markers when live coordinates are loaded from Supabase.</p>
        </div>
        <div className="space-y-3">
          {stores.slice(0, 5).map((store, index) => (
            <a
              key={store.slug}
              href={`https://www.openstreetmap.org/?mlat=${store.lat}&mlon=${store.lng}#map=15/${store.lat}/${store.lng}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-md bg-white/95 p-3 text-sm shadow-sm"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-coral font-bold text-white">{index + 1}</span>
              <span className="min-w-0 flex-1 truncate">{store.name}</span>
              <MapPin size={16} className="text-bay" />
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}

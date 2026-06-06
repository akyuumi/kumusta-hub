import { LeafletMap } from "@/components/LeafletMap";
import type { Store } from "@/lib/types";

export function MapPanel({ stores }: { stores: Store[] }) {
  const points = stores.map((store) => ({
    id: store.id,
    name: store.name,
    address: store.address,
    href: `/stores/${store.slug}`,
    lat: store.lat,
    lng: store.lng
  }));

  return (
    <aside className="sticky top-20 hidden h-[calc(100vh-6rem)] overflow-hidden rounded-lg border border-line bg-white shadow-sm lg:block">
      {points.length > 0 ? (
        <LeafletMap points={points} className="h-full rounded-none" zoom={13} />
      ) : (
        <div className="map-grid flex h-full items-center justify-center p-5 text-center text-sm font-semibold text-muted">No store locations to show</div>
      )}
    </aside>
  );
}

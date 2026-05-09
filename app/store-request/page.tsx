import type { Metadata } from "next";
import { getAreas, getCategories } from "@/lib/db";

export const metadata: Metadata = {
  title: "Store request",
  description: "Request a new Filipino community store listing."
};

export default async function StoreRequestPage() {
  const [areas, categories] = await Promise.all([getAreas(), getCategories()]);
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-ink">Store request</h1>
      <p className="mt-2 text-muted">Submit a new Filipino-related store for admin review.</p>
      <form className="mt-6 space-y-4 rounded-lg border border-line bg-white p-5 shadow-sm">
        <Field label="Store name" name="name" placeholder="Example: Bayanihan Kitchen" />
        <Field label="Address" name="address" placeholder="Tokyo, Toshima City..." />
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm font-semibold">Category</span>
            <select name="category" className="h-11 w-full rounded-md border border-line px-3">
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.nameEn}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-sm font-semibold">Area</span>
            <select name="area" className="h-11 w-full rounded-md border border-line px-3">
              {areas.map((area) => (
                <option key={area.slug} value={area.slug}>
                  {area.nameEn}
                </option>
              ))}
            </select>
          </label>
        </div>
        <Field label="Website or Facebook" name="url" placeholder="https://..." />
        <label className="space-y-1">
          <span className="text-sm font-semibold">Notes</span>
          <textarea name="notes" rows={5} className="w-full rounded-md border border-line p-3" placeholder="Tagalog support, GCash, popular menu, opening hours..." />
        </label>
        <button type="button" className="h-11 rounded-md bg-coral px-5 font-semibold text-white">
          Submit request
        </button>
      </form>
    </main>
  );
}

function Field({ label, name, placeholder }: { label: string; name: string; placeholder: string }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-semibold">{label}</span>
      <input name={name} placeholder={placeholder} className="h-11 w-full rounded-md border border-line px-3" />
    </label>
  );
}

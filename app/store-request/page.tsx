import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { getCategories, getLocations } from "@/lib/db";
import { createStoreRequestAction } from "./actions";

export const metadata: Metadata = {
  title: "Store request",
  description: "Request a new Filipino community store listing."
};

export default async function StoreRequestPage({
  searchParams
}: {
  searchParams: Promise<{
    error?: string;
    status?: string;
  }>;
}) {
  await requireUser("/store-request");
  const [locations, categories, params] = await Promise.all([getLocations(), getCategories(), searchParams]);
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-ink">Store request</h1>
      <p className="mt-2 text-muted">Submit a new Filipino-related store for admin review.</p>
      {params.status === "submitted" && <p className="mt-4 rounded-md bg-[#eef7f4] p-3 text-sm font-medium text-bay">Store request submitted.</p>}
      {params.error && <p className="mt-4 rounded-md bg-[#fff5ea] p-3 text-sm font-medium text-coral">{getErrorMessage(params.error)}</p>}
      <form action={createStoreRequestAction} className="mt-6 space-y-4 rounded-lg border border-line bg-white p-5 shadow-sm">
        <Field label="Store name" name="storeName" required placeholder="Example: Bayanihan Kitchen" />
        <Field label="Address" name="address" required placeholder="Tokyo, Toshima City..." />
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm font-semibold">Category</span>
            <select name="categoryId" required className="h-11 w-full rounded-md border border-line px-3">
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nameEn}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-sm font-semibold">Prefecture</span>
            <select name="locationId" required className="h-11 w-full rounded-md border border-line px-3">
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.nameEn}
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
        <button className="h-11 rounded-md bg-coral px-5 font-semibold text-white">
          Submit request
        </button>
      </form>
    </main>
  );
}

function Field({ label, name, required, placeholder }: { label: string; name: string; required?: boolean; placeholder: string }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-semibold">{label}</span>
      <input name={name} required={required} placeholder={placeholder} className="h-11 w-full rounded-md border border-line px-3" />
    </label>
  );
}

function getErrorMessage(error: string) {
  const messages: Record<string, string> = {
    missing_fields: "Store name, address, category, and prefecture are required.",
    invalid_taxonomy: "Choose a valid category and prefecture.",
    store_request_rate_limited: "You have submitted several store requests recently. Please try again later."
  };

  return messages[error] ?? "Store request failed.";
}

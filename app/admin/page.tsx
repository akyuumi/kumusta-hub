import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { getAreas, getBrands, getCategories, getStores } from "@/lib/db";
import { uploadStorePhotoAction } from "./actions";

export const metadata: Metadata = {
  title: "Admin"
};

export default async function AdminPage({
  searchParams
}: {
  searchParams: Promise<{
    error?: string;
    status?: string;
  }>;
}) {
  await requireAdmin();
  const [areas, brands, categories, stores, params] = await Promise.all([getAreas(), getBrands(), getCategories(), getStores(), searchParams]);
  const reports = [
    { id: "report-1", review: "review-2", reason: "Possible outdated information", status: "Open" },
    { id: "report-2", review: "review-3", reason: "Duplicate review", status: "In review" }
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-ink">Admin</h1>
      <p className="mt-2 text-muted">MVP control surface for store, taxonomy, review, report, and user moderation workflows.</p>
      {params.status === "store_photo_uploaded" && <p className="mt-4 rounded-md bg-[#eef7f4] p-3 text-sm font-medium text-bay">Store photo uploaded.</p>}
      {params.error && <p className="mt-4 rounded-md bg-[#fff5ea] p-3 text-sm font-medium text-coral">{getAdminErrorMessage(params.error)}</p>}
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <Metric label="Stores" value={stores.length} />
        <Metric label="Brands" value={brands.length} />
        <Metric label="Categories" value={categories.length} />
        <Metric label="Areas" value={areas.length} />
      </div>
      <section className="mt-6 overflow-hidden rounded-lg border border-line bg-white">
        <div className="border-b border-line p-4">
          <h2 className="font-bold text-ink">Store management</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-[#faf7f2] text-muted">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Area</th>
                <th className="p-3">Category</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => (
                <tr key={store.id} className="border-t border-line">
                  <td className="p-3 font-medium">{store.name}</td>
                  <td className="p-3">{store.areaSlug}</td>
                  <td className="p-3">{store.categorySlug}</td>
                  <td className="p-3">{store.averageRating}</td>
                  <td className="p-3">{store.isPublished ? "Published" : "Hidden"}</td>
                  <td className="p-3">
                    <button className="rounded-md border border-line px-3 py-1.5 font-semibold">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="mt-6 rounded-lg border border-line bg-white p-5">
        <h2 className="font-bold text-ink">Store photos</h2>
        <p className="mt-1 text-sm text-muted">Upload operation-managed photos to Supabase Storage and attach them to a store.</p>
        <form action={uploadStorePhotoAction} className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr_auto]">
          <label className="space-y-1">
            <span className="text-sm font-semibold">Store</span>
            <select name="storeId" required className="h-11 w-full rounded-md border border-line bg-white px-3">
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-sm font-semibold">Photo</span>
            <input name="photo" type="file" accept="image/jpeg,image/png,image/webp" required className="block h-11 w-full rounded-md border border-line bg-white px-3 py-2 text-sm" />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-semibold">Alt text</span>
            <input name="altText" className="h-11 w-full rounded-md border border-line px-3" placeholder="Store exterior or menu" />
          </label>
          <div className="flex items-end gap-3">
            <label className="flex h-11 items-center gap-2 text-sm font-medium">
              <input type="checkbox" name="isPrimary" />
              Primary
            </label>
            <button className="h-11 rounded-md bg-coral px-4 text-sm font-semibold text-white">Upload</button>
          </div>
        </form>
      </section>
      <section className="mt-6 rounded-lg border border-line bg-white p-5">
        <h2 className="font-bold text-ink">Reports</h2>
        <div className="mt-4 grid gap-3">
          {reports.map((report) => (
            <div key={report.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-line p-3 text-sm">
              <span className="font-medium">{report.review}</span>
              <span className="text-muted">{report.reason}</span>
              <span className="rounded-full bg-[#fff5ea] px-3 py-1 font-semibold">{report.status}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function getAdminErrorMessage(error: string) {
  const messages: Record<string, string> = {
    missing_store_photo: "Choose a store and image file.",
    invalid_store_photo_type: "Upload a JPEG, PNG, or WebP image.",
    store_photo_too_large: "Store photos must be 5 MB or less.",
    store_not_found: "Store was not found.",
    store_photo_upload_failed: "Photo upload failed. Check the Supabase Storage bucket policy."
  };

  return messages[error] ?? "Admin action failed.";
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-line bg-white p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
    </div>
  );
}

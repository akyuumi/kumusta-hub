import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { getAdminStores, getAreas, getBrands, getCategories } from "@/lib/db";
import { createStoreAction, uploadStorePhotoAction } from "./actions";

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
  const [areas, brands, categories, stores, params] = await Promise.all([getAreas(), getBrands(), getCategories(), getAdminStores(), searchParams]);
  const reports = [
    { id: "report-1", review: "review-2", reason: "Possible outdated information", status: "Open" },
    { id: "report-2", review: "review-3", reason: "Duplicate review", status: "In review" }
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-ink">Admin</h1>
      <p className="mt-2 text-muted">MVP control surface for store, taxonomy, review, report, and user moderation workflows.</p>
      {params.status === "store_created" && <p className="mt-4 rounded-md bg-[#eef7f4] p-3 text-sm font-medium text-bay">Store created.</p>}
      {params.status === "store_photo_uploaded" && <p className="mt-4 rounded-md bg-[#eef7f4] p-3 text-sm font-medium text-bay">Store photo uploaded.</p>}
      {params.error && <p className="mt-4 rounded-md bg-[#fff5ea] p-3 text-sm font-medium text-coral">{getAdminErrorMessage(params.error)}</p>}
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <Metric label="Stores" value={stores.length} />
        <Metric label="Brands" value={brands.length} />
        <Metric label="Categories" value={categories.length} />
        <Metric label="Areas" value={areas.length} />
      </div>
      <section id="add-store" className="mt-6 rounded-lg border border-line bg-white p-5">
        <h2 className="font-bold text-ink">Add Store</h2>
        <p className="mt-1 text-sm text-muted">Create a store and optionally register its primary photo in one step.</p>
        <form action={createStoreAction} className="mt-4 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Name" name="name" required placeholder="Bayanihan Kitchen Shinjuku" />
            <Field label="Slug" name="slug" placeholder="bayanihan-kitchen-shinjuku" />
          </div>
          <label className="space-y-1">
            <span className="text-sm font-semibold">Description</span>
            <textarea name="description" rows={3} className="w-full rounded-md border border-line px-3 py-2" placeholder="Short public description" />
          </label>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-1">
              <span className="text-sm font-semibold">Category</span>
              <select name="categoryId" required className="h-11 w-full rounded-md border border-line bg-white px-3">
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nameEn}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-sm font-semibold">Area</span>
              <select name="areaId" required className="h-11 w-full rounded-md border border-line bg-white px-3">
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.nameEn}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-sm font-semibold">Brand</span>
              <select name="brandId" className="h-11 w-full rounded-md border border-line bg-white px-3">
                <option value="">Independent</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.nameEn}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <Field label="Address" name="address" required placeholder="Tokyo, Shinjuku City..." />
          <div className="grid gap-4 md:grid-cols-4">
            <Field label="Latitude" name="lat" required type="number" step="any" placeholder="35.6900" />
            <Field label="Longitude" name="lng" required type="number" step="any" placeholder="139.7000" />
            <Field label="Phone" name="phone" placeholder="03-0000-0000" />
            <Field label="Price range" name="priceRange" placeholder="¥¥" />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Website URL" name="websiteUrl" type="url" placeholder="https://example.com" />
            <Field label="Facebook URL" name="facebookUrl" type="url" placeholder="https://facebook.com/..." />
            <Field label="Opening hours" name="openingHours" placeholder="Mon-Sun 11:00-22:00" />
          </div>
          <Field label="Featured menu / services" name="featuredMenu" placeholder="Pork Sisig, Chicken Adobo, Halo-Halo" />
          <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
            <label className="space-y-1">
              <span className="text-sm font-semibold">Main photo</span>
              <input name="photo" type="file" accept="image/jpeg,image/png,image/webp" className="block h-11 w-full rounded-md border border-line bg-white px-3 py-2 text-sm" />
            </label>
            <Field label="Photo alt text" name="altText" placeholder="Store exterior or signature menu" />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-4 text-sm font-medium">
              <Checkbox name="isPublished" label="Published" />
              <Checkbox name="tagalogSupport" label="Tagalog" />
              <Checkbox name="gcashSupport" label="GCash" />
              <Checkbox name="filipinoProducts" label="Filipino products" />
              <Checkbox name="remittanceSupport" label="Remittance" />
            </div>
            <button className="h-11 rounded-md bg-coral px-5 text-sm font-semibold text-white">Add Store</button>
          </div>
        </form>
      </section>
      <section id="store-management" className="mt-6 overflow-hidden rounded-lg border border-line bg-white">
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
    missing_store_fields: "Name, category, area, address, latitude, and longitude are required.",
    invalid_store_taxonomy: "Choose a valid category, area, and brand.",
    store_slug_exists: "A store with this slug already exists.",
    missing_store_photo: "Choose a store and image file.",
    invalid_store_photo_type: "Upload a JPEG, PNG, or WebP image.",
    store_photo_too_large: "Store photos must be 5 MB or less.",
    store_not_found: "Store was not found.",
    store_photo_upload_failed: "Photo upload failed. Check the Supabase Storage bucket policy."
  };

  return messages[error] ?? "Admin action failed.";
}

function Field({
  label,
  name,
  required,
  type = "text",
  step,
  placeholder
}: {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  step?: string;
  placeholder?: string;
}) {
  return (
    <label className="space-y-1">
      <span className="text-sm font-semibold">{label}</span>
      <input name={name} required={required} type={type} step={step} placeholder={placeholder} className="h-11 w-full rounded-md border border-line px-3" />
    </label>
  );
}

function Checkbox({ name, label }: { name: string; label: string }) {
  return (
    <label className="flex h-11 items-center gap-2">
      <input type="checkbox" name={name} />
      {label}
    </label>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-line bg-white p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
    </div>
  );
}

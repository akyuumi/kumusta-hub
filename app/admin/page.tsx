import type { Metadata } from "next";
import Image from "next/image";
import { Fragment } from "react";
import { ImageFileInput } from "@/components/ImageFileInput";
import { requireAdmin } from "@/lib/auth";
import { getAdminContacts, getAdminReports, getAdminReviews, getAdminStoreRequests, getAdminStores, getBrands, getCategories, getLocations, getPrefectures } from "@/lib/db";
import {
  approveStoreRequestAction,
  createBrandAction,
  createCategoryAction,
  createLocationAction,
  createStoreAction,
  deleteBrandAction,
  deleteCategoryAction,
  deleteLocationAction,
  deleteStorePhotoAction,
  rejectStoreRequestAction,
  updateReportStatusAction,
  updateReviewVisibilityAction,
  updateBrandAction,
  updateCategoryAction,
  updateContactStatusAction,
  updateLocationAction,
  updateStoreAction,
  updateStoreArchiveAction,
  updateStorePhotoPrimaryAction,
  updateStorePublicationAction,
  uploadStorePhotoAction
} from "./actions";

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
  const [locations, brands, categories, prefectures, stores, reports, reviews, storeRequests, contacts, params] = await Promise.all([
    getLocations(),
    getBrands(),
    getCategories(),
    getPrefectures(),
    getAdminStores(),
    getAdminReports(),
    getAdminReviews(),
    getAdminStoreRequests(),
    getAdminContacts(),
    searchParams
  ]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-ink">Admin</h1>
      <p className="mt-2 text-muted">MVP control surface for store, taxonomy, review, report, and user moderation workflows.</p>
      {params.status === "store_created" && <p className="mt-4 rounded-md bg-[#eef7f4] p-3 text-sm font-medium text-bay">Store created.</p>}
      {params.status === "store_updated" && <p className="mt-4 rounded-md bg-[#eef7f4] p-3 text-sm font-medium text-bay">Store updated.</p>}
      {params.status === "store_visibility_updated" && <p className="mt-4 rounded-md bg-[#eef7f4] p-3 text-sm font-medium text-bay">Store visibility updated.</p>}
      {params.status === "store_archived" && <p className="mt-4 rounded-md bg-[#eef7f4] p-3 text-sm font-medium text-bay">Store archived.</p>}
      {params.status === "store_restored" && <p className="mt-4 rounded-md bg-[#eef7f4] p-3 text-sm font-medium text-bay">Store restored.</p>}
      {params.status === "store_photo_uploaded" && <p className="mt-4 rounded-md bg-[#eef7f4] p-3 text-sm font-medium text-bay">Store photo uploaded.</p>}
      {params.status === "store_photo_primary_updated" && <p className="mt-4 rounded-md bg-[#eef7f4] p-3 text-sm font-medium text-bay">Primary store photo updated.</p>}
      {params.status === "store_photo_deleted" && <p className="mt-4 rounded-md bg-[#eef7f4] p-3 text-sm font-medium text-bay">Store photo deleted.</p>}
      {params.status === "store_request_approved" && <p className="mt-4 rounded-md bg-[#eef7f4] p-3 text-sm font-medium text-bay">Store request approved.</p>}
      {params.status === "store_request_rejected" && <p className="mt-4 rounded-md bg-[#eef7f4] p-3 text-sm font-medium text-bay">Store request rejected.</p>}
      {params.status === "taxonomy_created" && <p className="mt-4 rounded-md bg-[#eef7f4] p-3 text-sm font-medium text-bay">Taxonomy created.</p>}
      {params.status === "taxonomy_updated" && <p className="mt-4 rounded-md bg-[#eef7f4] p-3 text-sm font-medium text-bay">Taxonomy updated.</p>}
      {params.status === "taxonomy_deleted" && <p className="mt-4 rounded-md bg-[#eef7f4] p-3 text-sm font-medium text-bay">Taxonomy deleted.</p>}
      {params.status === "contact_updated" && <p className="mt-4 rounded-md bg-[#eef7f4] p-3 text-sm font-medium text-bay">Contact status updated.</p>}
      {params.status === "report_updated" && <p className="mt-4 rounded-md bg-[#eef7f4] p-3 text-sm font-medium text-bay">Report status updated.</p>}
      {params.status === "review_visibility_updated" && <p className="mt-4 rounded-md bg-[#eef7f4] p-3 text-sm font-medium text-bay">Review visibility updated.</p>}
      {params.error && <p className="mt-4 rounded-md bg-[#fff5ea] p-3 text-sm font-medium text-coral">{getAdminErrorMessage(params.error)}</p>}
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <Metric label="Stores" value={stores.length} />
        <Metric label="Brands" value={brands.length} />
        <Metric label="Categories" value={categories.length} />
        <Metric label="Prefectures" value={locations.length} />
      </div>
      <section id="taxonomy" className="mt-6 rounded-lg border border-line bg-white p-5">
        <h2 className="font-bold text-ink">Taxonomy management</h2>
        <p className="mt-1 text-sm text-muted">Manage brands, categories, and prefecture-level locations used by store registration and search filters.</p>
        <div className="mt-4 grid gap-5 xl:grid-cols-3">
          <div className="rounded-md border border-line bg-[#faf7f2] p-4">
            <h3 className="font-semibold text-ink">Brands</h3>
            <form action={createBrandAction} className="mt-3 grid gap-3">
              <AdminInput label="Name JA" name="nameJa" required />
              <AdminInput label="Name EN" name="nameEn" required />
              <AdminInput label="Slug" name="slug" />
              <label className="space-y-1">
                <span className="text-sm font-semibold">Description</span>
                <textarea name="description" rows={2} className="w-full rounded-md border border-line bg-white px-3 py-2" />
              </label>
              <button className="h-10 rounded-md bg-coral px-4 text-sm font-semibold text-white">Add Brand</button>
            </form>
            <div className="mt-4 space-y-3">
              {brands.map((brand) => (
                <details key={brand.id} className="rounded-md border border-line bg-white p-3">
                  <summary className="cursor-pointer font-medium">{brand.nameEn}</summary>
                  <form action={updateBrandAction} className="mt-3 grid gap-3">
                    <input type="hidden" name="brandId" value={brand.id} />
                    <AdminInput label="Name JA" name="nameJa" required defaultValue={brand.nameJa} />
                    <AdminInput label="Name EN" name="nameEn" required defaultValue={brand.nameEn} />
                    <AdminInput label="Slug" name="slug" required defaultValue={brand.slug} />
                    <label className="space-y-1">
                      <span className="text-sm font-semibold">Description</span>
                      <textarea name="description" rows={2} defaultValue={brand.description} className="w-full rounded-md border border-line bg-white px-3 py-2" />
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button className="h-9 rounded-md border border-line px-3 text-sm font-semibold">Save</button>
                    </div>
                  </form>
                  <form action={deleteBrandAction} className="mt-2">
                    <input type="hidden" name="brandId" value={brand.id} />
                    <button className="h-9 rounded-md border border-line px-3 text-sm font-semibold text-coral">Delete</button>
                  </form>
                </details>
              ))}
            </div>
          </div>
          <div className="rounded-md border border-line bg-[#faf7f2] p-4">
            <h3 className="font-semibold text-ink">Categories</h3>
            <form action={createCategoryAction} className="mt-3 grid gap-3">
              <AdminInput label="Name JA" name="nameJa" required />
              <AdminInput label="Name EN" name="nameEn" required />
              <AdminInput label="Slug" name="slug" />
              <button className="h-10 rounded-md bg-coral px-4 text-sm font-semibold text-white">Add Category</button>
            </form>
            <div className="mt-4 space-y-3">
              {categories.map((category) => (
                <details key={category.id} className="rounded-md border border-line bg-white p-3">
                  <summary className="cursor-pointer font-medium">{category.nameEn}</summary>
                  <form action={updateCategoryAction} className="mt-3 grid gap-3">
                    <input type="hidden" name="categoryId" value={category.id} />
                    <AdminInput label="Name JA" name="nameJa" required defaultValue={category.nameJa} />
                    <AdminInput label="Name EN" name="nameEn" required defaultValue={category.nameEn} />
                    <AdminInput label="Slug" name="slug" required defaultValue={category.slug} />
                    <button className="h-9 rounded-md border border-line px-3 text-sm font-semibold">Save</button>
                  </form>
                  <form action={deleteCategoryAction} className="mt-2">
                    <input type="hidden" name="categoryId" value={category.id} />
                    <button className="h-9 rounded-md border border-line px-3 text-sm font-semibold text-coral">Delete</button>
                  </form>
                </details>
              ))}
            </div>
          </div>
          <div className="rounded-md border border-line bg-[#faf7f2] p-4">
            <h3 className="font-semibold text-ink">Prefectures</h3>
            <form action={createLocationAction} className="mt-3 grid gap-3">
              <label className="space-y-1">
                <span className="text-sm font-semibold">Prefecture</span>
                <select name="prefectureId" required className="h-11 w-full rounded-md border border-line bg-white px-3">
                  {prefectures.map((prefecture) => (
                    <option key={prefecture.id} value={prefecture.id}>
                      {prefecture.nameEn}
                    </option>
                  ))}
                </select>
              </label>
              <AdminInput label="Name JA" name="nameJa" required />
              <AdminInput label="Name EN" name="nameEn" required />
              <AdminInput label="Slug" name="slug" />
              <button className="h-10 rounded-md bg-coral px-4 text-sm font-semibold text-white">Add Prefecture Location</button>
            </form>
            <div className="mt-4 space-y-3">
              {locations.map((location) => (
                <details key={location.id} className="rounded-md border border-line bg-white p-3">
                  <summary className="cursor-pointer font-medium">{location.nameEn}</summary>
                  <form action={updateLocationAction} className="mt-3 grid gap-3">
                    <input type="hidden" name="locationId" value={location.id} />
                    <label className="space-y-1">
                      <span className="text-sm font-semibold">Prefecture</span>
                      <select name="prefectureId" required defaultValue={location.prefectureId} className="h-11 w-full rounded-md border border-line bg-white px-3">
                        {prefectures.map((prefecture) => (
                          <option key={prefecture.id} value={prefecture.id}>
                            {prefecture.nameEn}
                          </option>
                        ))}
                      </select>
                    </label>
                    <AdminInput label="Name JA" name="nameJa" required defaultValue={location.nameJa} />
                    <AdminInput label="Name EN" name="nameEn" required defaultValue={location.nameEn} />
                    <AdminInput label="Slug" name="slug" required defaultValue={location.slug} />
                    <button className="h-9 rounded-md border border-line px-3 text-sm font-semibold">Save</button>
                  </form>
                  <form action={deleteLocationAction} className="mt-2">
                    <input type="hidden" name="locationId" value={location.id} />
                    <button className="h-9 rounded-md border border-line px-3 text-sm font-semibold text-coral">Delete</button>
                  </form>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section id="add-store" className="mt-6 rounded-lg border border-line bg-white p-5">
        <h2 className="font-bold text-ink">Add Store</h2>
        <p className="mt-1 text-sm text-muted">Create a store and optionally register its primary photo in one step.</p>
        <form action={createStoreAction} className="mt-4 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Name" name="name" required placeholder="Bayanihan Kitchen Tokyo" />
            <Field label="Slug" name="slug" placeholder="bayanihan-kitchen-tokyo" />
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
              <span className="text-sm font-semibold">Prefecture</span>
              <select name="locationId" required className="h-11 w-full rounded-md border border-line bg-white px-3">
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.nameEn}
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
              <ImageFileInput name="photo" maxSizeMb={5} className="block h-11 w-full rounded-md border border-line bg-white px-3 py-2 text-sm" />
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
          <p className="mt-1 text-sm text-muted">Edit store basics and control public visibility without a code change.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-[#faf7f2] text-muted">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Prefecture</th>
                <th className="p-3">Category</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => (
                <Fragment key={store.id}>
                  <tr className="border-t border-line align-top">
                    <td className="p-3">
                      <p className="font-medium">{store.name}</p>
                      <p className="mt-1 text-xs text-muted">{store.slug}</p>
                    </td>
                    <td className="p-3">{store.locationSlug}</td>
                    <td className="p-3">{store.categorySlug}</td>
                    <td className="p-3">
                      {store.averageRating} ({store.reviewCount})
                    </td>
                    <td className="p-3">
                      <span
                        className={
                          store.archivedAt
                            ? "rounded-full bg-[#eee] px-3 py-1 font-semibold text-muted"
                            : store.isPublished
                              ? "rounded-full bg-[#eef7f4] px-3 py-1 font-semibold text-bay"
                              : "rounded-full bg-[#fff5ea] px-3 py-1 font-semibold text-coral"
                        }
                      >
                        {store.archivedAt ? "Archived" : store.isPublished ? "Published" : "Hidden"}
                      </span>
                      {store.archivedAt && <p className="mt-2 text-xs text-muted">Archived {store.archivedAt}</p>}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        {!store.archivedAt && (
                          <form action={updateStorePublicationAction}>
                            <input type="hidden" name="storeId" value={store.id} />
                            <input type="hidden" name="isPublished" value={store.isPublished ? "false" : "true"} />
                            <button className="h-9 rounded-md border border-line px-3 font-semibold">{store.isPublished ? "Hide" : "Publish"}</button>
                          </form>
                        )}
                        <form action={updateStoreArchiveAction}>
                          <input type="hidden" name="storeId" value={store.id} />
                          <input type="hidden" name="archive" value={store.archivedAt ? "false" : "true"} />
                          <button className="h-9 rounded-md border border-line px-3 font-semibold text-coral">{store.archivedAt ? "Restore" : "Archive"}</button>
                        </form>
                        <span className="inline-flex h-9 items-center rounded-md border border-line px-3 font-semibold text-muted">Edit below</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-t border-line bg-[#faf7f2]/50">
                    <td colSpan={6} className="p-4">
                      <details>
                        <summary className="mb-4 cursor-pointer font-semibold text-ink">Edit {store.name}</summary>
                        <form action={updateStoreAction} className="grid gap-4">
                          <input type="hidden" name="storeId" value={store.id} />
                          <div className="grid gap-4 md:grid-cols-2">
                            <AdminInput label="Name" name="name" required defaultValue={store.name} />
                            <AdminInput label="Slug" name="slug" required defaultValue={store.slug} />
                          </div>
                          <label className="space-y-1">
                            <span className="text-sm font-semibold">Description</span>
                            <textarea name="description" rows={3} defaultValue={store.description} className="w-full rounded-md border border-line bg-white px-3 py-2" />
                          </label>
                          <div className="grid gap-4 md:grid-cols-3">
                            <label className="space-y-1">
                              <span className="text-sm font-semibold">Category</span>
                              <select name="categoryId" required defaultValue={store.categoryId} className="h-11 w-full rounded-md border border-line bg-white px-3">
                                {categories.map((category) => (
                                  <option key={category.id} value={category.id}>
                                    {category.nameEn}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <label className="space-y-1">
                              <span className="text-sm font-semibold">Prefecture</span>
                              <select name="locationId" required defaultValue={store.locationId} className="h-11 w-full rounded-md border border-line bg-white px-3">
                                {locations.map((location) => (
                                  <option key={location.id} value={location.id}>
                                    {location.nameEn}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <label className="space-y-1">
                              <span className="text-sm font-semibold">Brand</span>
                              <select name="brandId" defaultValue={store.brandId} className="h-11 w-full rounded-md border border-line bg-white px-3">
                                <option value="">Independent</option>
                                {brands.map((brand) => (
                                  <option key={brand.id} value={brand.id}>
                                    {brand.nameEn}
                                  </option>
                                ))}
                              </select>
                            </label>
                          </div>
                          <AdminInput label="Address" name="address" required defaultValue={store.address} />
                          <div className="grid gap-4 md:grid-cols-4">
                            <AdminInput label="Latitude" name="lat" required type="number" step="any" defaultValue={String(store.lat)} />
                            <AdminInput label="Longitude" name="lng" required type="number" step="any" defaultValue={String(store.lng)} />
                            <AdminInput label="Phone" name="phone" defaultValue={store.phone} />
                            <AdminInput label="Price range" name="priceRange" defaultValue={store.priceRange} />
                          </div>
                          <div className="grid gap-4 md:grid-cols-3">
                            <AdminInput label="Website URL" name="websiteUrl" type="url" defaultValue={store.websiteUrl} />
                            <AdminInput label="Facebook URL" name="facebookUrl" type="url" defaultValue={store.facebookUrl} />
                            <AdminInput label="Opening hours" name="openingHours" defaultValue={store.openingHours} />
                          </div>
                          <AdminInput label="Featured menu / services" name="featuredMenu" defaultValue={store.featuredMenu.join(", ")} />
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-wrap gap-4 text-sm font-medium">
                              <Checkbox name="isPublished" label="Published" defaultChecked={store.isPublished} />
                              <Checkbox name="tagalogSupport" label="Tagalog" defaultChecked={store.tagalogSupport} />
                              <Checkbox name="gcashSupport" label="GCash" defaultChecked={store.gcashSupport} />
                              <Checkbox name="filipinoProducts" label="Filipino products" defaultChecked={store.filipinoProducts} />
                              <Checkbox name="remittanceSupport" label="Remittance" defaultChecked={store.remittanceSupport} />
                            </div>
                            <button className="h-11 rounded-md bg-coral px-5 text-sm font-semibold text-white">Save Store</button>
                          </div>
                        </form>
                      </details>
                    </td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section id="store-requests" className="mt-6 rounded-lg border border-line bg-white p-5">
        <h2 className="font-bold text-ink">Store requests</h2>
        {storeRequests.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[1180px] text-left text-sm">
              <thead className="bg-[#faf7f2] text-muted">
                <tr>
                  <th className="p-3">Request</th>
                  <th className="p-3">Taxonomy</th>
                  <th className="p-3">Details</th>
                  <th className="p-3">Requester</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Approve</th>
                  <th className="p-3">Reject</th>
                </tr>
              </thead>
              <tbody>
                {storeRequests.map((request) => (
                  <tr key={request.id} className="border-t border-line align-top">
                    <td className="p-3">
                      <p className="font-medium">{request.storeName}</p>
                      <p className="mt-1 text-muted">{request.address}</p>
                    </td>
                    <td className="p-3">
                      <p>{request.categoryName}</p>
                      <p className="mt-1 text-muted">{request.locationName}</p>
                    </td>
                    <td className="max-w-xs p-3 text-muted">
                      {request.url ? (
                        <a href={request.url} className="font-medium text-bay underline" target="_blank" rel="noreferrer">
                          Website
                        </a>
                      ) : (
                        <span>No URL</span>
                      )}
                      <p className="mt-1">{request.notes || "No notes"}</p>
                    </td>
                    <td className="p-3">
                      <p className="font-mono text-xs text-muted">{request.requesterId.slice(0, 8)}</p>
                      <p className="mt-1 text-muted">{request.createdAt}</p>
                    </td>
                    <td className="p-3">
                      <span className="rounded-full bg-[#fff5ea] px-3 py-1 font-semibold">{formatStoreRequestStatus(request.status)}</span>
                      {request.rejectionReason && <p className="mt-2 text-xs text-muted">{request.rejectionReason}</p>}
                    </td>
                    <td className="p-3">
                      {request.status !== "approved" ? (
                        <form action={approveStoreRequestAction} className="grid min-w-56 gap-2">
                          <input type="hidden" name="requestId" value={request.id} />
                          <input name="slug" required defaultValue={slugify(request.storeName)} className="h-9 rounded-md border border-line px-2" placeholder="store-slug" />
                          <div className="grid grid-cols-2 gap-2">
                            <input name="lat" required type="number" step="any" className="h-9 rounded-md border border-line px-2" placeholder="Lat" />
                            <input name="lng" required type="number" step="any" className="h-9 rounded-md border border-line px-2" placeholder="Lng" />
                          </div>
                          <textarea name="description" rows={2} className="rounded-md border border-line px-2 py-1" placeholder="Public description" />
                          <label className="flex items-center gap-2 text-sm font-medium">
                            <input type="checkbox" name="isPublished" />
                            Published
                          </label>
                          <button className="h-9 rounded-md bg-coral px-3 font-semibold text-white">Approve</button>
                        </form>
                      ) : (
                        <span className="text-muted">Approved</span>
                      )}
                    </td>
                    <td className="p-3">
                      {request.status !== "approved" ? (
                        <form action={rejectStoreRequestAction} className="grid min-w-48 gap-2">
                          <input type="hidden" name="requestId" value={request.id} />
                          <textarea name="rejectionReason" rows={3} className="rounded-md border border-line px-2 py-1" placeholder="Reason" />
                          <button className="h-9 rounded-md border border-line px-3 font-semibold">Reject</button>
                        </form>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 rounded-md bg-[#faf7f2] p-4 text-sm text-muted">No store requests yet.</p>
        )}
      </section>
      <section id="store-photos" className="mt-6 rounded-lg border border-line bg-white p-5">
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
            <ImageFileInput name="photo" required maxSizeMb={5} className="block h-11 w-full rounded-md border border-line bg-white px-3 py-2 text-sm" />
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
        <div className="mt-6 space-y-4">
          {stores.map((store) => (
            <details key={store.id} className="rounded-md border border-line bg-[#faf7f2] p-4">
              <summary className="cursor-pointer font-semibold text-ink">
                {store.name} photos ({store.photos.length})
              </summary>
              {store.photos.length > 0 ? (
                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {store.photos.map((photo) => (
                    <div key={photo.id} className="rounded-md border border-line bg-white p-3">
                      <div className="relative aspect-video overflow-hidden rounded-md bg-[#efe8df]">
                        <Image src={photo.imageUrl} alt={photo.altText} fill sizes="(min-width: 1280px) 260px, (min-width: 768px) 45vw, 90vw" className="object-cover" />
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <span className={photo.isPrimary ? "rounded-full bg-[#eef7f4] px-3 py-1 text-xs font-semibold text-bay" : "rounded-full bg-[#fff5ea] px-3 py-1 text-xs font-semibold text-muted"}>
                          {photo.isPrimary ? "Primary" : `Order ${photo.sortOrder}`}
                        </span>
                        <span className="truncate text-xs text-muted">{photo.altText}</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {!photo.isPrimary && (
                          <form action={updateStorePhotoPrimaryAction}>
                            <input type="hidden" name="photoId" value={photo.id} />
                            <button className="h-9 rounded-md border border-line px-3 text-sm font-semibold">Make primary</button>
                          </form>
                        )}
                        <form action={deleteStorePhotoAction}>
                          <input type="hidden" name="photoId" value={photo.id} />
                          <button className="h-9 rounded-md border border-line px-3 text-sm font-semibold text-coral">Delete</button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 rounded-md bg-white p-4 text-sm text-muted">No photos registered.</p>
              )}
            </details>
          ))}
        </div>
      </section>
      <section id="reports" className="mt-6 rounded-lg border border-line bg-white p-5">
        <h2 className="font-bold text-ink">Reports</h2>
        {reports.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-[#faf7f2] text-muted">
                <tr>
                  <th className="p-3">Store</th>
                  <th className="p-3">Review</th>
                  <th className="p-3">Review status</th>
                  <th className="p-3">Review reports</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Reporter</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Created</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className="border-t border-line align-top">
                    <td className="p-3 font-medium">{report.storeName}</td>
                    <td className="max-w-xs p-3 text-muted">{report.reviewBody || "No body"}</td>
                    <td className="p-3">
                      <span className={report.reviewIsHidden ? "rounded-full bg-[#fff5ea] px-3 py-1 font-semibold text-coral" : "rounded-full bg-[#eef7f4] px-3 py-1 font-semibold text-bay"}>{report.reviewIsHidden ? "Hidden" : "Visible"}</span>
                    </td>
                    <td className="p-3 font-semibold">{report.reviewReportCount}</td>
                    <td className="p-3">{formatReportReason(report.reason)}</td>
                    <td className="p-3 font-mono text-xs text-muted">{report.reporterId.slice(0, 8)}</td>
                    <td className="p-3">
                      <span className="rounded-full bg-[#fff5ea] px-3 py-1 font-semibold">{formatReportStatus(report.status)}</span>
                    </td>
                    <td className="p-3 text-muted">{report.createdAt}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                      <form action={updateReportStatusAction} className="flex gap-2">
                        <input type="hidden" name="reportId" value={report.id} />
                        <select name="status" defaultValue={report.status} className="h-9 rounded-md border border-line bg-white px-2">
                          <option value="open">Open</option>
                          <option value="in_review">In review</option>
                          <option value="resolved">Resolved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        <button className="h-9 rounded-md border border-line px-3 font-semibold">Update</button>
                      </form>
                      <form action={updateReviewVisibilityAction}>
                        <input type="hidden" name="reviewId" value={report.reviewId} />
                        <input type="hidden" name="isHidden" value={report.reviewIsHidden ? "false" : "true"} />
                        <input type="hidden" name="returnTo" value="reports" />
                        <button className="h-9 rounded-md border border-line px-3 font-semibold">{report.reviewIsHidden ? "Restore" : "Hide"}</button>
                      </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 rounded-md bg-[#faf7f2] p-4 text-sm text-muted">No reports yet.</p>
        )}
      </section>
      <section id="contacts" className="mt-6 rounded-lg border border-line bg-white p-5">
        <h2 className="font-bold text-ink">Contacts</h2>
        {contacts.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-[#faf7f2] text-muted">
                <tr>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Message</th>
                  <th className="p-3">Kind</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Created</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact.id} className="border-t border-line align-top">
                    <td className="p-3 font-medium">{contact.subject}</td>
                    <td className="max-w-md whitespace-pre-wrap p-3 text-muted">{contact.message}</td>
                    <td className="p-3">{formatContactKind(contact.kind)}</td>
                    <td className="p-3">
                      <a href={`mailto:${contact.email}`} className="font-medium text-bay underline">
                        {contact.email}
                      </a>
                      {contact.userId && <p className="mt-1 font-mono text-xs text-muted">{contact.userId.slice(0, 8)}</p>}
                    </td>
                    <td className="p-3">
                      <span className="rounded-full bg-[#fff5ea] px-3 py-1 font-semibold">{formatReportStatus(contact.status)}</span>
                    </td>
                    <td className="p-3 text-muted">{contact.createdAt}</td>
                    <td className="p-3">
                      <form action={updateContactStatusAction} className="flex gap-2">
                        <input type="hidden" name="contactId" value={contact.id} />
                        <select name="status" defaultValue={contact.status} className="h-9 rounded-md border border-line bg-white px-2">
                          <option value="open">Open</option>
                          <option value="in_review">In review</option>
                          <option value="resolved">Resolved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        <button className="h-9 rounded-md border border-line px-3 font-semibold">Update</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 rounded-md bg-[#faf7f2] p-4 text-sm text-muted">No contacts yet.</p>
        )}
      </section>
      <section id="reviews" className="mt-6 rounded-lg border border-line bg-white p-5">
        <h2 className="font-bold text-ink">Reviews</h2>
        {reviews.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-[#faf7f2] text-muted">
                <tr>
                  <th className="p-3">Store</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3">Review</th>
                  <th className="p-3">Reports</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Created</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review.id} className="border-t border-line align-top">
                    <td className="p-3 font-medium">{review.storeName}</td>
                    <td className="p-3">{review.rating}</td>
                    <td className="max-w-sm p-3 text-muted">{review.body || "No body"}</td>
                    <td className="p-3">{review.reportCount}</td>
                    <td className="p-3">
                      <span className={review.isHidden ? "rounded-full bg-[#fff5ea] px-3 py-1 font-semibold text-coral" : "rounded-full bg-[#eef7f4] px-3 py-1 font-semibold text-bay"}>{review.isHidden ? "Hidden" : "Visible"}</span>
                    </td>
                    <td className="p-3 text-muted">{review.createdAt}</td>
                    <td className="p-3">
                      <form action={updateReviewVisibilityAction}>
                        <input type="hidden" name="reviewId" value={review.id} />
                        <input type="hidden" name="isHidden" value={review.isHidden ? "false" : "true"} />
                        <input type="hidden" name="returnTo" value="reviews" />
                        <button className="h-9 rounded-md border border-line px-3 font-semibold">{review.isHidden ? "Restore" : "Hide"}</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 rounded-md bg-[#faf7f2] p-4 text-sm text-muted">No reviews yet.</p>
        )}
      </section>
    </main>
  );
}

function getAdminErrorMessage(error: string) {
  const messages: Record<string, string> = {
    missing_store_fields: "Name, category, prefecture, address, latitude, and longitude are required.",
    invalid_store_taxonomy: "Choose a valid category, prefecture, and brand.",
    store_slug_exists: "A store with this slug already exists.",
    missing_store_photo: "Choose a store and image file.",
    invalid_store_photo_type: "Upload a JPEG, PNG, or WebP image.",
    store_photo_too_large: "Store photos must be 5 MB or less.",
    store_not_found: "Store was not found.",
    store_photo_upload_failed: "Photo upload failed. Check the Supabase Storage bucket policy.",
    store_photo_not_found: "Store photo was not found.",
    store_photo_delete_failed: "Store photo deletion failed. Check the Supabase Storage bucket policy.",
    store_archived_cannot_publish: "Restore the store before publishing it.",
    missing_taxonomy_fields: "Name and slug are required.",
    taxonomy_slug_exists: "A taxonomy item with this slug already exists.",
    taxonomy_not_found: "Taxonomy item was not found.",
    taxonomy_in_use: "This taxonomy item is linked to stores or requests and cannot be deleted.",
    invalid_taxonomy_parent: "Choose a valid parent taxonomy item.",
    invalid_contact_status: "Choose a valid contact status.",
    invalid_store_request_approval: "Slug, latitude, and longitude are required to approve a store request.",
    store_request_not_found: "Store request was not found or can no longer be changed.",
    store_request_slug_exists: "A store with this slug already exists.",
    invalid_report_status: "Choose a valid report status.",
    review_not_found: "Review was not found."
  };

  return messages[error] ?? "Admin action failed.";
}

function formatReportReason(reason: string) {
  const labels: Record<string, string> = {
    incorrect_info: "Incorrect info",
    spam: "Spam",
    abuse: "Abuse",
    duplicate: "Duplicate",
    other: "Other"
  };

  return labels[reason] ?? reason;
}

function formatReportStatus(status: string) {
  const labels: Record<string, string> = {
    open: "Open",
    in_review: "In review",
    resolved: "Resolved",
    rejected: "Rejected"
  };

  return labels[status] ?? status;
}

function formatContactKind(kind: string) {
  const labels: Record<string, string> = {
    general: "General",
    store_correction: "Store correction",
    deletion_request: "Deletion request",
    moderation: "Moderation",
    partnership: "Partnership"
  };

  return labels[kind] ?? kind;
}

function formatStoreRequestStatus(status: string) {
  const labels: Record<string, string> = {
    open: "Open",
    approved: "Approved",
    rejected: "Rejected"
  };

  return labels[status] ?? status;
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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

function AdminInput({
  label,
  name,
  required,
  type = "text",
  step,
  defaultValue
}: {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  step?: string;
  defaultValue?: string;
}) {
  return (
    <label className="space-y-1">
      <span className="text-sm font-semibold">{label}</span>
      <input name={name} required={required} type={type} step={step} defaultValue={defaultValue} className="h-11 w-full rounded-md border border-line bg-white px-3" />
    </label>
  );
}

function Checkbox({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex h-11 items-center gap-2">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} />
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

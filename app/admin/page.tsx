import type { Metadata } from "next";
import { areas, brands, categories, stores } from "@/lib/data";

export const metadata: Metadata = {
  title: "Admin"
};

export default function AdminPage() {
  const reports = [
    { id: "report-1", review: "review-2", reason: "Possible outdated information", status: "Open" },
    { id: "report-2", review: "review-3", reason: "Duplicate review", status: "In review" }
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-ink">Admin</h1>
      <p className="mt-2 text-muted">MVP control surface for store, taxonomy, review, report, and user moderation workflows.</p>
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

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-line bg-white p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
    </div>
  );
}

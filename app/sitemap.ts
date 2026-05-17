import type { MetadataRoute } from "next";
import { getLocations, getBrands, getCategories, getStores } from "@/lib/db";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [locations, brands, categories, stores] = await Promise.all([getLocations(), getBrands(), getCategories(), getStores()]);
  const staticRoutes = ["", "/search", "/store-request", "/terms", "/privacy", "/contact"].map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date()
  }));

  const storeRoutes = stores.map((store) => ({
    url: absoluteUrl(`/stores/${store.slug}`),
    lastModified: new Date()
  }));

  const taxonomyRoutes = [
    ...brands.map((brand) => `/brands/${brand.slug}`),
    ...locations.map((location) => `/areas/${location.slug}`),
    ...categories.map((category) => `/categories/${category.slug}`)
  ].map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date()
  }));

  return [...staticRoutes, ...storeRoutes, ...taxonomyRoutes];
}

import type { MetadataRoute } from "next";
import { getAreas, getBrands, getCategories, getStores } from "@/lib/db";

const baseUrl = "https://kumustahub.example.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [areas, brands, categories, stores] = await Promise.all([getAreas(), getBrands(), getCategories(), getStores()]);
  const staticRoutes = ["", "/search", "/store-request", "/terms", "/privacy", "/contact"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date()
  }));

  const storeRoutes = stores.map((store) => ({
    url: `${baseUrl}/stores/${store.slug}`,
    lastModified: new Date()
  }));

  const taxonomyRoutes = [
    ...brands.map((brand) => `/brands/${brand.slug}`),
    ...areas.map((area) => `/areas/${area.slug}`),
    ...categories.map((category) => `/categories/${category.slug}`)
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date()
  }));

  return [...staticRoutes, ...storeRoutes, ...taxonomyRoutes];
}

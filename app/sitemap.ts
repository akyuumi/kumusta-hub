import type { MetadataRoute } from "next";
import { areas, brands, categories, stores } from "@/lib/data";

const baseUrl = "https://kumustahub.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
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

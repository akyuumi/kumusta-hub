import type { Area, Brand, Category, Store, StoreSearchParams } from "@/lib/types";

export const categories: Category[] = [
  { id: "cat-restaurant", slug: "filipino-restaurant", nameJa: "フィリピン料理", nameEn: "Filipino Restaurant" },
  { id: "cat-grocery", slug: "filipino-grocery", nameJa: "フィリピン食材店", nameEn: "Filipino Grocery" },
  { id: "cat-remittance", slug: "remittance-service", nameJa: "送金サービス", nameEn: "Remittance Service" },
  { id: "cat-delivery", slug: "international-delivery-service", nameJa: "国際配送", nameEn: "International Delivery Service" }
];

export const areas: Area[] = [
  { id: "area-ikebukuro", slug: "ikebukuro", prefecture: "Tokyo", nameJa: "池袋", nameEn: "Ikebukuro" },
  { id: "area-kawasaki", slug: "kawasaki", prefecture: "Kanagawa", nameJa: "川崎", nameEn: "Kawasaki" },
  { id: "area-okubo", slug: "shinjuku-okubo", prefecture: "Tokyo", nameJa: "新宿・大久保", nameEn: "Shinjuku / Okubo" },
  { id: "area-yokohama", slug: "yokohama", prefecture: "Kanagawa", nameJa: "横浜", nameEn: "Yokohama" },
  { id: "area-namba", slug: "osaka-namba", prefecture: "Osaka", nameJa: "大阪なんば", nameEn: "Osaka Namba" }
];

export const brands: Brand[] = [
  {
    id: "brand-bayanihan",
    slug: "bayanihan-kitchen",
    nameJa: "バヤニハンキッチン",
    nameEn: "Bayanihan Kitchen",
    description: "Home-style Filipino meals for workers, families, and weekend meetups."
  },
  {
    id: "brand-sari-sari",
    slug: "sari-sari-mart",
    nameJa: "サリサリマート",
    nameEn: "Sari-Sari Mart",
    description: "Groceries, snacks, frozen goods, and community essentials."
  },
  {
    id: "brand-padala",
    slug: "padala-link",
    nameJa: "パダラリンク",
    nameEn: "Padala Link",
    description: "Remittance and parcel support for Filipinos living in Japan."
  }
];

export const stores: Store[] = [
  {
    id: "store-1",
    slug: "bayanihan-kitchen-ikebukuro",
    brandSlug: "bayanihan-kitchen",
    categorySlug: "filipino-restaurant",
    areaSlug: "ikebukuro",
    name: "Bayanihan Kitchen Ikebukuro",
    description: "A casual spot near Ikebukuro with adobo, sisig, sinigang, and weekend boodle fight platters.",
    address: "Tokyo, Toshima City, Ikebukuro 2-12-8",
    lat: 35.7306,
    lng: 139.7112,
    phone: "03-0000-1122",
    websiteUrl: "https://example.com/bayanihan",
    facebookUrl: "https://facebook.com/example",
    openingHours: "Mon-Sun 11:00-22:00",
    averageRating: 4.6,
    reviewCount: 38,
    tagalogSupport: true,
    gcashSupport: true,
    filipinoProducts: false,
    remittanceSupport: false,
    priceRange: "¥¥",
    featuredMenu: ["Pork Sisig", "Chicken Adobo", "Halo-Halo"],
    photoUrl: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=80",
    photos: [
      {
        id: "store-photo-1",
        imageUrl: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=80",
        altText: "Bayanihan Kitchen Ikebukuro",
        sortOrder: 0,
        isPrimary: true
      }
    ],
    isPublished: true,
    reviews: [
      {
        id: "review-1",
        authorName: "Maria S.",
        rating: 5,
        body: "The sisig tasted close to home. Staff helped us in Tagalog and Japanese.",
        helpfulCount: 12,
        createdAt: "2026-04-14"
      },
      {
        id: "review-2",
        authorName: "Jun P.",
        rating: 4,
        body: "Good portions and friendly service. Gets busy after church on Sundays.",
        helpfulCount: 7,
        createdAt: "2026-03-28"
      }
    ]
  },
  {
    id: "store-2",
    slug: "sari-sari-mart-kawasaki",
    brandSlug: "sari-sari-mart",
    categorySlug: "filipino-grocery",
    areaSlug: "kawasaki",
    name: "Sari-Sari Mart Kawasaki",
    description: "Filipino pantry staples, frozen seafood, sauces, snacks, and prepaid mobile cards.",
    address: "Kanagawa, Kawasaki City, Kawasaki-ku 7-3",
    lat: 35.5308,
    lng: 139.703,
    phone: "044-000-2211",
    websiteUrl: "https://example.com/sari-sari",
    facebookUrl: "https://facebook.com/example",
    openingHours: "Tue-Sun 10:00-20:00",
    averageRating: 4.4,
    reviewCount: 24,
    tagalogSupport: true,
    gcashSupport: false,
    filipinoProducts: true,
    remittanceSupport: false,
    priceRange: "¥",
    featuredMenu: ["Lucky Me", "Datu Puti", "Frozen Bangus"],
    photoUrl: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80",
    photos: [
      {
        id: "store-photo-2",
        imageUrl: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80",
        altText: "Sari-Sari Mart Kawasaki",
        sortOrder: 0,
        isPrimary: true
      }
    ],
    isPublished: true,
    reviews: [
      {
        id: "review-3",
        authorName: "Grace A.",
        rating: 4,
        body: "Small shop but has the essentials. Good frozen section.",
        helpfulCount: 5,
        createdAt: "2026-04-01"
      }
    ]
  },
  {
    id: "store-3",
    slug: "padala-link-yokohama",
    brandSlug: "padala-link",
    categorySlug: "remittance-service",
    areaSlug: "yokohama",
    name: "Padala Link Yokohama",
    description: "Remittance counter with parcel advice and English support for first-time users.",
    address: "Kanagawa, Yokohama City, Naka-ku 1-9-4",
    lat: 35.4437,
    lng: 139.638,
    phone: "045-000-3344",
    websiteUrl: "https://example.com/padala",
    facebookUrl: "https://facebook.com/example",
    openingHours: "Mon-Sat 10:30-19:00",
    averageRating: 4.1,
    reviewCount: 17,
    tagalogSupport: true,
    gcashSupport: true,
    filipinoProducts: false,
    remittanceSupport: true,
    priceRange: "Service fee varies",
    featuredMenu: ["Bank transfer", "Cash pickup", "Parcel consultation"],
    photoUrl: "https://images.unsplash.com/photo-1560472355-536de3962603?auto=format&fit=crop&w=1200&q=80",
    photos: [
      {
        id: "store-photo-3",
        imageUrl: "https://images.unsplash.com/photo-1560472355-536de3962603?auto=format&fit=crop&w=1200&q=80",
        altText: "Padala Link Yokohama",
        sortOrder: 0,
        isPrimary: true
      }
    ],
    isPublished: true,
    reviews: []
  },
  {
    id: "store-4",
    slug: "bayanihan-kitchen-namba",
    brandSlug: "bayanihan-kitchen",
    categorySlug: "filipino-restaurant",
    areaSlug: "osaka-namba",
    name: "Bayanihan Kitchen Namba",
    description: "Late-night Filipino comfort food in Namba with karaoke-friendly group seating.",
    address: "Osaka, Chuo Ward, Namba 4-2-6",
    lat: 34.6649,
    lng: 135.501,
    phone: "06-0000-4455",
    websiteUrl: "https://example.com/bayanihan-namba",
    facebookUrl: "https://facebook.com/example",
    openingHours: "Wed-Mon 12:00-23:30",
    averageRating: 4.7,
    reviewCount: 42,
    tagalogSupport: true,
    gcashSupport: false,
    filipinoProducts: false,
    remittanceSupport: false,
    priceRange: "¥¥",
    featuredMenu: ["Lechon Kawali", "Kare-Kare", "Ube Cake"],
    photoUrl: "https://images.unsplash.com/photo-1569058242567-93de6f36f8eb?auto=format&fit=crop&w=1200&q=80",
    photos: [
      {
        id: "store-photo-4",
        imageUrl: "https://images.unsplash.com/photo-1569058242567-93de6f36f8eb?auto=format&fit=crop&w=1200&q=80",
        altText: "Bayanihan Kitchen Namba",
        sortOrder: 0,
        isPrimary: true
      }
    ],
    isPublished: true,
    reviews: []
  }
];

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getArea(slug: string) {
  return areas.find((area) => area.slug === slug);
}

export function getBrand(slug: string) {
  return brands.find((brand) => brand.slug === slug);
}

export function getStore(slug: string) {
  return stores.find((store) => store.slug === slug && store.isPublished);
}

export function searchStores(params: StoreSearchParams) {
  const query = (params.q ?? "").trim().toLowerCase();
  const minRating = Number(params.rating || 0);

  return stores.filter((store) => {
    if (!store.isPublished) return false;
    if (params.area && store.areaSlug !== params.area) return false;
    if (params.category && store.categorySlug !== params.category) return false;
    if (minRating && store.averageRating < minRating) return false;
    if (params.tagalog === "true" && !store.tagalogSupport) return false;
    if (!query) return true;

    const haystack = [
      store.name,
      store.description,
      store.address,
      getArea(store.areaSlug)?.nameEn,
      getArea(store.areaSlug)?.nameJa,
      getCategory(store.categorySlug)?.nameEn,
      getCategory(store.categorySlug)?.nameJa,
      ...store.featuredMenu
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

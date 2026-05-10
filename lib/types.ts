export type Locale = "ja" | "en";

export type Category = {
  id: string;
  slug: string;
  nameJa: string;
  nameEn: string;
};

export type Area = {
  id: string;
  slug: string;
  prefecture: string;
  nameJa: string;
  nameEn: string;
};

export type Brand = {
  id: string;
  slug: string;
  nameJa: string;
  nameEn: string;
  description: string;
};

export type Review = {
  id: string;
  authorName: string;
  rating: number;
  body: string;
  helpfulCount: number;
  createdAt: string;
};

export type Store = {
  id: string;
  slug: string;
  brandSlug: string;
  categorySlug: string;
  areaSlug: string;
  name: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  websiteUrl: string;
  facebookUrl: string;
  openingHours: string;
  averageRating: number;
  reviewCount: number;
  tagalogSupport: boolean;
  gcashSupport: boolean;
  filipinoProducts: boolean;
  remittanceSupport: boolean;
  priceRange: string;
  featuredMenu: string[];
  photoUrl: string;
  photos: StorePhoto[];
  isPublished: boolean;
  reviews: Review[];
};

export type StorePhoto = {
  id: string;
  imageUrl: string;
  altText: string;
  sortOrder: number;
  isPrimary: boolean;
};

export type StoreSearchParams = {
  q?: string;
  area?: string;
  category?: string;
  rating?: string;
  tagalog?: string;
};

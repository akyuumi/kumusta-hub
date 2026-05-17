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
  photos: ReviewPhoto[];
  hasReported: boolean;
};

export type ReviewPhoto = {
  id: string;
  imageUrl: string;
};

export type Store = {
  id: string;
  slug: string;
  brandId?: string;
  brandSlug: string;
  categoryId?: string;
  categorySlug: string;
  areaId?: string;
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

export type AdminReport = {
  id: string;
  reason: string;
  status: string;
  createdAt: string;
  reviewId: string;
  reviewBody: string;
  reviewRating: number;
  reviewIsHidden: boolean;
  storeName: string;
  storeSlug: string;
  reporterId: string;
};

export type AdminReview = {
  id: string;
  rating: number;
  body: string;
  isHidden: boolean;
  createdAt: string;
  storeName: string;
  storeSlug: string;
  userId: string;
  reportCount: number;
};

export type AdminStoreRequest = {
  id: string;
  storeName: string;
  address: string;
  categoryId: string;
  categoryName: string;
  areaId: string;
  areaName: string;
  url: string;
  notes: string;
  status: string;
  rejectionReason: string;
  approvedStoreId: string;
  requesterId: string;
  createdAt: string;
};

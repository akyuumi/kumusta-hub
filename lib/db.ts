import type { Prisma } from "@prisma/client";
import { cache } from "react";
import {
  brands as fallbackBrands,
  categories as fallbackCategories,
  getBrand as getFallbackBrand,
  getCategory as getFallbackCategory,
  getLocation as getFallbackLocation,
  getStore as getFallbackStore,
  locations as fallbackLocations,
  searchStores as searchFallbackStores,
  stores as fallbackStores
} from "@/lib/data";
import { prisma } from "@/lib/prisma";
import type { AdminContact, AdminReport, AdminReview, AdminStoreRequest, Brand, Category, Location, Prefecture, Store, StoreSearchParams } from "@/lib/types";

const storeInclude = {
  reviews: {
    where: { isHidden: false },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      photos: true
    }
  },
  brand: true,
  category: true,
  area: true,
  photos: {
    orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
    take: 8
  }
} satisfies Prisma.StoreInclude;

const storeListInclude = {
  brand: true,
  category: true,
  area: true,
  photos: {
    orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
    take: 1
  }
} satisfies Prisma.StoreInclude;

type StoreWithRelations = Prisma.StoreGetPayload<{ include: typeof storeInclude }>;
type StoreListWithRelations = Prisma.StoreGetPayload<{ include: typeof storeListInclude }>;

function canUseDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

function getReportStatusRank(status: string) {
  const rank: Record<string, number> = {
    open: 0,
    in_review: 1,
    resolved: 2,
    rejected: 3
  };

  return rank[status] ?? 4;
}

function mapCategory(category: { id: string; slug: string; nameJa: string; nameEn: string }): Category {
  return {
    id: category.id,
    slug: category.slug,
    nameJa: category.nameJa,
    nameEn: category.nameEn
  };
}

function mapLocation(location: { id: string; prefectureId?: string; slug: string; nameJa: string; nameEn: string; prefecture?: { nameEn: string } | null }): Location {
  return {
    id: location.id,
    prefectureId: location.prefectureId,
    slug: location.slug,
    prefecture: location.prefecture?.nameEn ?? "Japan",
    nameJa: location.nameJa,
    nameEn: location.nameEn
  };
}

function mapPrefecture(prefecture: { id: string; slug: string; nameJa: string; nameEn: string }): Prefecture {
  return {
    id: prefecture.id,
    slug: prefecture.slug,
    nameJa: prefecture.nameJa,
    nameEn: prefecture.nameEn
  };
}

function mapBrand(brand: { id: string; slug: string; nameJa: string; nameEn: string; description: string | null }): Brand {
  return {
    id: brand.id,
    slug: brand.slug,
    nameJa: brand.nameJa,
    nameEn: brand.nameEn,
    description: brand.description ?? ""
  };
}

function splitFeaturedMenu(value: string | null) {
  return value
    ? value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
}

function stringifyOpeningHours(value: Prisma.JsonValue | null) {
  if (!value) return "";
  return typeof value === "string" ? value : JSON.stringify(value);
}

function mapStore(store: StoreWithRelations): Store {
  return {
    id: store.id,
    slug: store.slug,
    brandId: store.brandId ?? "",
    brandSlug: store.brand?.slug ?? "",
    categoryId: store.categoryId,
    categorySlug: store.category.slug,
    locationId: store.areaId,
    locationSlug: store.area.slug,
    name: store.name,
    description: store.description ?? "",
    address: store.address,
    lat: Number(store.lat),
    lng: Number(store.lng),
    phone: store.phone ?? "",
    websiteUrl: store.websiteUrl ?? "",
    facebookUrl: store.facebookUrl ?? "",
    openingHours: stringifyOpeningHours(store.openingHours),
    averageRating: Number(store.averageRating),
    reviewCount: store.reviewCount,
    tagalogSupport: store.tagalogSupport,
    gcashSupport: store.gcashSupport,
    filipinoProducts: store.filipinoProducts,
    remittanceSupport: store.remittanceSupport,
    priceRange: store.priceRange ?? "",
    featuredMenu: splitFeaturedMenu(store.featuredMenu),
    photoUrl: store.photos[0]?.imageUrl ?? store.photoUrl ?? "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=80",
    photos: store.photos.map((photo) => ({
      id: photo.id,
      imageUrl: photo.imageUrl,
      storagePath: photo.storagePath ?? "",
      altText: photo.altText ?? store.name,
      sortOrder: photo.sortOrder,
      isPrimary: photo.isPrimary
    })),
    isPublished: store.isPublished,
    archivedAt: store.archivedAt?.toISOString().slice(0, 10) ?? "",
    reviews: store.reviews.map((review) => ({
      id: review.id,
      authorName: "Community member",
      rating: review.rating,
      body: review.body ?? "",
      helpfulCount: review.helpfulCount,
      createdAt: review.createdAt.toISOString().slice(0, 10),
      photos: review.photos.map((photo) => ({
        id: photo.id,
        imageUrl: photo.imageUrl
      })),
      hasReported: false
    }))
  };
}

function mapStoreListItem(store: StoreListWithRelations): Store {
  const primaryPhoto = store.photos[0];

  return {
    id: store.id,
    slug: store.slug,
    brandId: store.brandId ?? "",
    brandSlug: store.brand?.slug ?? "",
    categoryId: store.categoryId,
    categorySlug: store.category.slug,
    locationId: store.areaId,
    locationSlug: store.area.slug,
    name: store.name,
    description: store.description ?? "",
    address: store.address,
    lat: Number(store.lat),
    lng: Number(store.lng),
    phone: store.phone ?? "",
    websiteUrl: store.websiteUrl ?? "",
    facebookUrl: store.facebookUrl ?? "",
    openingHours: stringifyOpeningHours(store.openingHours),
    averageRating: Number(store.averageRating),
    reviewCount: store.reviewCount,
    tagalogSupport: store.tagalogSupport,
    gcashSupport: store.gcashSupport,
    filipinoProducts: store.filipinoProducts,
    remittanceSupport: store.remittanceSupport,
    priceRange: store.priceRange ?? "",
    featuredMenu: splitFeaturedMenu(store.featuredMenu),
    photoUrl: primaryPhoto?.imageUrl ?? store.photoUrl ?? "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=80",
    photos: primaryPhoto
      ? [
          {
            id: primaryPhoto.id,
            imageUrl: primaryPhoto.imageUrl,
            storagePath: primaryPhoto.storagePath ?? "",
            altText: primaryPhoto.altText ?? store.name,
            sortOrder: primaryPhoto.sortOrder,
            isPrimary: primaryPhoto.isPrimary
          }
        ]
      : [],
    isPublished: store.isPublished,
    archivedAt: store.archivedAt?.toISOString().slice(0, 10) ?? "",
    reviews: []
  };
}

export async function getCategories(): Promise<Category[]> {
  if (!canUseDatabase()) return fallbackCategories;

  try {
    const categories = await prisma.category.findMany({ orderBy: { nameEn: "asc" } });
    return categories.map(mapCategory);
  } catch {
    return fallbackCategories;
  }
}

export async function getLocations(): Promise<Location[]> {
  if (!canUseDatabase()) return fallbackLocations;

  try {
    const locations = await prisma.area.findMany({
      include: { prefecture: true },
      orderBy: { nameEn: "asc" }
    });
    return locations.map(mapLocation);
  } catch {
    return fallbackLocations;
  }
}

export async function getPrefectures(): Promise<Prefecture[]> {
  if (!canUseDatabase()) return [];

  try {
    const prefectures = await prisma.prefecture.findMany({ orderBy: { nameEn: "asc" } });
    return prefectures.map(mapPrefecture);
  } catch {
    return [];
  }
}

export async function getBrands(): Promise<Brand[]> {
  if (!canUseDatabase()) return fallbackBrands;

  try {
    const brands = await prisma.brand.findMany({ orderBy: { nameEn: "asc" } });
    return brands.map(mapBrand);
  } catch {
    return fallbackBrands;
  }
}

export async function getStores(): Promise<Store[]> {
  if (!canUseDatabase()) return fallbackStores;

  try {
    const stores = await prisma.store.findMany({
      where: { isPublished: true, archivedAt: null },
      include: storeListInclude,
      orderBy: [{ averageRating: "desc" }, { name: "asc" }]
    });
    return stores.map((store) => mapStoreListItem(store));
  } catch {
    return fallbackStores;
  }
}

export async function getAdminStores(): Promise<Store[]> {
  if (!canUseDatabase()) return fallbackStores;

  try {
    const stores = await prisma.store.findMany({
      include: storeInclude,
      orderBy: [{ archivedAt: "asc" }, { isPublished: "desc" }, { name: "asc" }]
    });
    return stores.map((store) => mapStore(store));
  } catch {
    return fallbackStores;
  }
}

export async function getFavoriteStores(userId: string): Promise<Store[]> {
  if (!canUseDatabase()) return [];

  try {
    const favorites = await prisma.favorite.findMany({
      where: {
        userId,
        store: {
          isPublished: true,
          archivedAt: null
        }
      },
      include: {
        store: {
          include: storeListInclude
        }
      },
      orderBy: {
        id: "desc"
      }
    });

    return favorites.map((favorite) => mapStoreListItem(favorite.store));
  } catch {
    return [];
  }
}

export async function getAdminReports(): Promise<AdminReport[]> {
  if (!canUseDatabase()) return [];

  try {
    const reports = await prisma.report.findMany({
      include: {
        review: {
          select: {
            id: true,
            body: true,
            rating: true,
            isHidden: true,
            _count: {
              select: {
                reports: true
              }
            },
            store: {
              select: {
                name: true,
                slug: true
              }
            }
          }
        }
      },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      take: 50
    });

    return reports
      .map((report) => ({
        id: report.id,
        reason: report.reason,
        status: report.status,
        createdAt: report.createdAt.toISOString().slice(0, 10),
        createdAtTime: report.createdAt.getTime(),
        reviewId: report.review.id,
        reviewBody: report.review.body ?? "",
        reviewRating: report.review.rating,
        reviewIsHidden: report.review.isHidden,
        reviewReportCount: report.review._count.reports,
        storeName: report.review.store.name,
        storeSlug: report.review.store.slug,
        reporterId: report.userId
      }))
      .sort((a, b) => {
        const statusRank = getReportStatusRank(a.status) - getReportStatusRank(b.status);
        if (statusRank !== 0) return statusRank;
        const reportCountRank = b.reviewReportCount - a.reviewReportCount;
        if (reportCountRank !== 0) return reportCountRank;
        return b.createdAtTime - a.createdAtTime;
      })
      .map((report) => ({
        id: report.id,
        reason: report.reason,
        status: report.status,
        createdAt: report.createdAt,
        reviewId: report.reviewId,
        reviewBody: report.reviewBody,
        reviewRating: report.reviewRating,
        reviewIsHidden: report.reviewIsHidden,
        reviewReportCount: report.reviewReportCount,
        storeName: report.storeName,
        storeSlug: report.storeSlug,
        reporterId: report.reporterId
      }));
  } catch {
    return [];
  }
}

export async function getAdminReviews(): Promise<AdminReview[]> {
  if (!canUseDatabase()) return [];

  try {
    const reviews = await prisma.review.findMany({
      include: {
        store: {
          select: {
            name: true,
            slug: true
          }
        },
        _count: {
          select: {
            reports: true
          }
        }
      },
      orderBy: [{ isHidden: "asc" }, { reports: { _count: "desc" } }, { createdAt: "desc" }],
      take: 100
    });

    return reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      body: review.body ?? "",
      isHidden: review.isHidden,
      createdAt: review.createdAt.toISOString().slice(0, 10),
      storeName: review.store.name,
      storeSlug: review.store.slug,
      userId: review.userId,
      reportCount: review._count.reports
    }));
  } catch {
    return [];
  }
}

export async function getAdminStoreRequests(): Promise<AdminStoreRequest[]> {
  if (!canUseDatabase()) return [];

  try {
    const requests = await prisma.storeRequest.findMany({
      include: {
        category: {
          select: {
            nameEn: true
          }
        },
        area: {
          select: {
            nameEn: true
          }
        }
      },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      take: 100
    });

    return requests.map((request) => ({
      id: request.id,
      storeName: request.storeName,
      address: request.address,
      categoryId: request.categoryId,
      categoryName: request.category.nameEn,
      locationId: request.areaId,
      locationName: request.area.nameEn,
      url: request.url ?? "",
      notes: request.notes ?? "",
      status: request.status,
      rejectionReason: request.rejectionReason ?? "",
      approvedStoreId: request.approvedStoreId ?? "",
      requesterId: request.userId,
      createdAt: request.createdAt.toISOString().slice(0, 10)
    }));
  } catch {
    return [];
  }
}

export async function getAdminContacts(): Promise<AdminContact[]> {
  if (!canUseDatabase()) return [];

  try {
    const contacts = await prisma.contact.findMany({
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      take: 100
    });

    return contacts.map((contact) => ({
      id: contact.id,
      userId: contact.userId ?? "",
      email: contact.email,
      subject: contact.subject,
      message: contact.message,
      kind: contact.kind,
      status: contact.status,
      createdAt: contact.createdAt.toISOString().slice(0, 10)
    }));
  } catch {
    return [];
  }
}

export async function isFavoriteStore(userId: string, storeId: string) {
  if (!canUseDatabase()) return false;

  try {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId
        }
      },
      select: {
        id: true
      }
    });

    return Boolean(favorite);
  } catch {
    return false;
  }
}

export async function searchStores(params: StoreSearchParams): Promise<Store[]> {
  if (!canUseDatabase()) return searchFallbackStores(params);

  try {
    const query = (params.q ?? "").trim();
    const minRating = Number(params.rating || 0);

    const stores = await prisma.store.findMany({
      where: {
        isPublished: true,
        archivedAt: null,
        ...((params.location ?? params.area) ? { area: { slug: params.location ?? params.area } } : {}),
        ...(params.category ? { category: { slug: params.category } } : {}),
        ...(params.tagalog === "true" ? { tagalogSupport: true } : {}),
        ...(minRating ? { averageRating: { gte: minRating } } : {}),
        ...(query
          ? {
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
                { address: { contains: query, mode: "insensitive" } },
                { searchText: { contains: query, mode: "insensitive" } }
              ]
            }
          : {})
      },
      include: storeListInclude,
      orderBy: [{ averageRating: "desc" }, { name: "asc" }]
    });

    return stores.map((store) => mapStoreListItem(store));
  } catch {
    return searchFallbackStores(params);
  }
}

export const getStore = cache(async function getStore(slug: string): Promise<Store | undefined> {
  if (!canUseDatabase()) return getFallbackStore(slug);

  try {
    const store = await prisma.store.findFirst({
      where: { slug, isPublished: true, archivedAt: null },
      include: storeInclude
    });
    return store ? mapStore(store) : undefined;
  } catch {
    return getFallbackStore(slug);
  }
});

export const getStoreForUser = cache(async function getStoreForUser(slug: string, userId?: string): Promise<Store | undefined> {
  const store = await getStore(slug);
  if (!store || !userId || !canUseDatabase()) return store;

  try {
    const reviewIds = store.reviews.map((review) => review.id);
    if (reviewIds.length === 0) return store;

    const reports = await prisma.report.findMany({
      where: {
        userId,
        reviewId: {
          in: reviewIds
        }
      },
      select: {
        reviewId: true
      }
    });

    const reportedReviewIds = new Set(reports.map((report) => report.reviewId));

    return {
      ...store,
      reviews: store.reviews.map((review) => ({
        ...review,
        hasReported: reportedReviewIds.has(review.id)
      }))
    };
  } catch {
    return store;
  }
});

export async function getCategory(slug: string): Promise<Category | undefined> {
  if (!canUseDatabase()) return getFallbackCategory(slug);

  try {
    const category = await prisma.category.findUnique({ where: { slug } });
    return category ? mapCategory(category) : undefined;
  } catch {
    return getFallbackCategory(slug);
  }
}

export async function getLocation(slug: string): Promise<Location | undefined> {
  if (!canUseDatabase()) return getFallbackLocation(slug);

  try {
    const location = await prisma.area.findUnique({
      where: { slug },
      include: { prefecture: true }
    });
    return location ? mapLocation(location) : undefined;
  } catch {
    return getFallbackLocation(slug);
  }
}

export async function getBrand(slug: string): Promise<Brand | undefined> {
  if (!canUseDatabase()) return getFallbackBrand(slug);

  try {
    const brand = await prisma.brand.findUnique({ where: { slug } });
    return brand ? mapBrand(brand) : undefined;
  } catch {
    return getFallbackBrand(slug);
  }
}

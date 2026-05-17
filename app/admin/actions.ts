"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

const STORE_PHOTOS_BUCKET = "store-photos";
const MAX_STORE_PHOTO_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function createStoreAction(formData: FormData) {
  const user = await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? name));
  const description = emptyToNull(formData.get("description"));
  const address = String(formData.get("address") ?? "").trim();
  const lat = Number(formData.get("lat"));
  const lng = Number(formData.get("lng"));
  const categoryId = String(formData.get("categoryId") ?? "");
  const areaId = String(formData.get("areaId") ?? "");
  const brandId = emptyToNull(formData.get("brandId"));
  const phone = emptyToNull(formData.get("phone"));
  const websiteUrl = emptyToNull(formData.get("websiteUrl"));
  const facebookUrl = emptyToNull(formData.get("facebookUrl"));
  const openingHours = emptyToNull(formData.get("openingHours"));
  const priceRange = emptyToNull(formData.get("priceRange"));
  const featuredMenu = emptyToNull(formData.get("featuredMenu"));
  const isPublished = formData.get("isPublished") === "on";
  const tagalogSupport = formData.get("tagalogSupport") === "on";
  const gcashSupport = formData.get("gcashSupport") === "on";
  const filipinoProducts = formData.get("filipinoProducts") === "on";
  const remittanceSupport = formData.get("remittanceSupport") === "on";
  const photo = formData.get("photo");
  const altText = String(formData.get("altText") ?? "").trim();

  if (!name || !slug || !address || !categoryId || !areaId || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    redirect("/admin?error=missing_store_fields#add-store");
  }

  if (photo instanceof File && photo.size > 0) {
    validateStorePhoto(photo);
  }

  const [category, area, brand, existingStore] = await Promise.all([
    prisma.category.findUnique({ where: { id: categoryId }, select: { nameEn: true } }),
    prisma.area.findUnique({ where: { id: areaId }, select: { nameEn: true } }),
    brandId ? prisma.brand.findUnique({ where: { id: brandId }, select: { nameEn: true } }) : null,
    prisma.store.findUnique({ where: { slug }, select: { id: true } })
  ]);

  if (!category || !area || (brandId && !brand)) {
    redirect("/admin?error=invalid_store_taxonomy#add-store");
  }

  if (existingStore) {
    redirect("/admin?error=store_slug_exists#add-store");
  }

  const photoUpload = photo instanceof File && photo.size > 0 ? await uploadStorePhotoFile({ file: photo, slug }) : null;
  const searchText = [name, description, address, featuredMenu, brand?.nameEn, category.nameEn, area.nameEn].filter(Boolean).join(" ");

  const store = await prisma.store.create({
    data: {
      slug,
      brandId,
      categoryId,
      areaId,
      name,
      description,
      address,
      lat,
      lng,
      phone,
      websiteUrl,
      facebookUrl,
      openingHours: openingHours ?? undefined,
      tagalogSupport,
      gcashSupport,
      filipinoProducts,
      remittanceSupport,
      priceRange,
      featuredMenu,
      photoUrl: photoUpload?.publicUrl ?? null,
      isPublished,
      searchText,
      photos: photoUpload
        ? {
            create: {
              imageUrl: photoUpload.publicUrl,
              storagePath: photoUpload.storagePath,
              altText: altText || name,
              sortOrder: 0,
              isPrimary: true,
              uploadedBy: user.id
            }
          }
        : undefined
    },
    select: {
      slug: true
    }
  });

  revalidatePath("/admin");
  revalidatePath("/search");
  revalidatePath(`/stores/${store.slug}`);
  redirect("/admin?status=store_created#store-management");
}

export async function uploadStorePhotoAction(formData: FormData) {
  const user = await requireAdmin();
  const storeId = String(formData.get("storeId") ?? "");
  const altText = String(formData.get("altText") ?? "").trim();
  const isPrimary = formData.get("isPrimary") === "on";
  const file = formData.get("photo");

  if (!storeId || !(file instanceof File) || file.size === 0) {
    redirect("/admin?error=missing_store_photo");
  }

  validateStorePhoto(file);

  const store = await prisma.store.findUnique({
    where: { id: storeId },
    select: {
      id: true,
      slug: true,
      name: true
    }
  });

  if (!store) {
    redirect("/admin?error=store_not_found");
  }

  const { publicUrl, storagePath } = await uploadStorePhotoFile({ file, slug: store.slug });

  await prisma.$transaction(async (tx) => {
    if (isPrimary) {
      await tx.storePhoto.updateMany({
        where: { storeId: store.id },
        data: { isPrimary: false }
      });
    }

    const lastPhoto = await tx.storePhoto.findFirst({
      where: { storeId: store.id },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true }
    });

    await tx.storePhoto.create({
      data: {
        storeId: store.id,
        imageUrl: publicUrl,
        storagePath,
        altText: altText || store.name,
        sortOrder: (lastPhoto?.sortOrder ?? -1) + 1,
        isPrimary,
        uploadedBy: user.id
      }
    });
  });

  revalidatePath("/admin");
  revalidatePath(`/stores/${store.slug}`);
  revalidatePath("/search");
  redirect("/admin?status=store_photo_uploaded");
}

export async function updateStorePhotoPrimaryAction(formData: FormData) {
  await requireAdmin();
  const photoId = String(formData.get("photoId") ?? "");

  if (!photoId) {
    redirect("/admin?error=store_photo_not_found#store-photos");
  }

  const photo = await prisma.storePhoto.findUnique({
    where: { id: photoId },
    select: {
      id: true,
      storeId: true,
      imageUrl: true,
      store: {
        select: {
          slug: true
        }
      }
    }
  });

  if (!photo) {
    redirect("/admin?error=store_photo_not_found#store-photos");
  }

  await prisma.$transaction(async (tx) => {
    await tx.storePhoto.updateMany({
      where: { storeId: photo.storeId },
      data: { isPrimary: false }
    });

    await tx.storePhoto.update({
      where: { id: photo.id },
      data: { isPrimary: true }
    });

    await tx.store.update({
      where: { id: photo.storeId },
      data: { photoUrl: photo.imageUrl }
    });
  });

  revalidatePath("/admin");
  revalidatePath("/search");
  revalidatePath(`/stores/${photo.store.slug}`);
  redirect("/admin?status=store_photo_primary_updated#store-photos");
}

export async function deleteStorePhotoAction(formData: FormData) {
  await requireAdmin();
  const photoId = String(formData.get("photoId") ?? "");

  if (!photoId) {
    redirect("/admin?error=store_photo_not_found#store-photos");
  }

  const photo = await prisma.storePhoto.findUnique({
    where: { id: photoId },
    select: {
      id: true,
      storeId: true,
      storagePath: true,
      store: {
        select: {
          slug: true
        }
      }
    }
  });

  if (!photo) {
    redirect("/admin?error=store_photo_not_found#store-photos");
  }

  if (photo.storagePath) {
    const supabase = await createClient();
    const { error } = await supabase.storage.from(STORE_PHOTOS_BUCKET).remove([photo.storagePath]);

    if (error) {
      redirect("/admin?error=store_photo_delete_failed#store-photos");
    }
  }

  const nextPhoto = await prisma.$transaction(async (tx) => {
    await tx.storePhoto.delete({
      where: { id: photo.id }
    });

    const remainingPrimary = await tx.storePhoto.findFirst({
      where: { storeId: photo.storeId, isPrimary: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: { id: true, imageUrl: true }
    });

    const fallbackPhoto =
      remainingPrimary ??
      (await tx.storePhoto.findFirst({
        where: { storeId: photo.storeId },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        select: { id: true, imageUrl: true }
      }));

    if (fallbackPhoto && !remainingPrimary) {
      await tx.storePhoto.update({
        where: { id: fallbackPhoto.id },
        data: { isPrimary: true }
      });
    }

    await tx.store.update({
      where: { id: photo.storeId },
      data: { photoUrl: fallbackPhoto?.imageUrl ?? null }
    });

    return fallbackPhoto;
  });

  revalidatePath("/admin");
  revalidatePath("/search");
  revalidatePath(`/stores/${photo.store.slug}`);
  if (nextPhoto) {
    revalidatePath(`/stores/${photo.store.slug}`);
  }
  redirect("/admin?status=store_photo_deleted#store-photos");
}

export async function updateStoreAction(formData: FormData) {
  await requireAdmin();
  const storeId = String(formData.get("storeId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? name));
  const description = emptyToNull(formData.get("description"));
  const address = String(formData.get("address") ?? "").trim();
  const lat = Number(formData.get("lat"));
  const lng = Number(formData.get("lng"));
  const categoryId = String(formData.get("categoryId") ?? "");
  const areaId = String(formData.get("areaId") ?? "");
  const brandId = emptyToNull(formData.get("brandId"));
  const phone = emptyToNull(formData.get("phone"));
  const websiteUrl = emptyToNull(formData.get("websiteUrl"));
  const facebookUrl = emptyToNull(formData.get("facebookUrl"));
  const openingHours = emptyToNull(formData.get("openingHours"));
  const priceRange = emptyToNull(formData.get("priceRange"));
  const featuredMenu = emptyToNull(formData.get("featuredMenu"));
  const isPublished = formData.get("isPublished") === "on";
  const tagalogSupport = formData.get("tagalogSupport") === "on";
  const gcashSupport = formData.get("gcashSupport") === "on";
  const filipinoProducts = formData.get("filipinoProducts") === "on";
  const remittanceSupport = formData.get("remittanceSupport") === "on";

  if (!storeId || !name || !slug || !address || !categoryId || !areaId || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    redirect("/admin?error=missing_store_fields#store-management");
  }

  const [store, category, area, brand, slugOwner] = await Promise.all([
    prisma.store.findUnique({ where: { id: storeId }, select: { id: true, slug: true } }),
    prisma.category.findUnique({ where: { id: categoryId }, select: { nameEn: true } }),
    prisma.area.findUnique({ where: { id: areaId }, select: { nameEn: true } }),
    brandId ? prisma.brand.findUnique({ where: { id: brandId }, select: { nameEn: true } }) : null,
    prisma.store.findUnique({ where: { slug }, select: { id: true } })
  ]);

  if (!store) {
    redirect("/admin?error=store_not_found#store-management");
  }

  if (!category || !area || (brandId && !brand)) {
    redirect("/admin?error=invalid_store_taxonomy#store-management");
  }

  if (slugOwner && slugOwner.id !== store.id) {
    redirect("/admin?error=store_slug_exists#store-management");
  }

  const searchText = [name, description, address, featuredMenu, brand?.nameEn, category.nameEn, area.nameEn].filter(Boolean).join(" ");

  await prisma.store.update({
    where: { id: store.id },
    data: {
      slug,
      brandId,
      categoryId,
      areaId,
      name,
      description,
      address,
      lat,
      lng,
      phone,
      websiteUrl,
      facebookUrl,
      openingHours: openingHours ?? undefined,
      tagalogSupport,
      gcashSupport,
      filipinoProducts,
      remittanceSupport,
      priceRange,
      featuredMenu,
      isPublished,
      searchText
    }
  });

  revalidatePath("/admin");
  revalidatePath("/search");
  revalidatePath(`/stores/${store.slug}`);
  revalidatePath(`/stores/${slug}`);
  redirect("/admin?status=store_updated#store-management");
}

export async function updateStorePublicationAction(formData: FormData) {
  await requireAdmin();
  const storeId = String(formData.get("storeId") ?? "");
  const isPublished = formData.get("isPublished") === "true";

  if (!storeId) {
    redirect("/admin?error=store_not_found#store-management");
  }

  const store = await prisma.store.update({
    where: { id: storeId },
    data: { isPublished },
    select: { slug: true }
  });

  revalidatePath("/admin");
  revalidatePath("/search");
  revalidatePath(`/stores/${store.slug}`);
  redirect("/admin?status=store_visibility_updated#store-management");
}

export async function approveStoreRequestAction(formData: FormData) {
  await requireAdmin();
  const requestId = String(formData.get("requestId") ?? "");
  const slug = slugify(String(formData.get("slug") ?? ""));
  const description = emptyToNull(formData.get("description"));
  const lat = Number(formData.get("lat"));
  const lng = Number(formData.get("lng"));
  const isPublished = formData.get("isPublished") === "on";

  if (!requestId || !slug || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    redirect("/admin?error=invalid_store_request_approval#store-requests");
  }

  const request = await prisma.storeRequest.findUnique({
    where: { id: requestId },
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
    }
  });

  if (!request || request.status === "approved") {
    redirect("/admin?error=store_request_not_found#store-requests");
  }

  const existingStore = await prisma.store.findUnique({
    where: { slug },
    select: { id: true }
  });

  if (existingStore) {
    redirect("/admin?error=store_request_slug_exists#store-requests");
  }

  const store = await prisma.$transaction(async (tx) => {
    const createdStore = await tx.store.create({
      data: {
        slug,
        categoryId: request.categoryId,
        areaId: request.areaId,
        name: request.storeName,
        description,
        address: request.address,
        lat,
        lng,
        websiteUrl: request.url,
        isPublished,
        searchText: [request.storeName, description, request.address, request.notes, request.url, request.category.nameEn, request.area.nameEn].filter(Boolean).join(" ")
      },
      select: {
        id: true,
        slug: true
      }
    });

    await tx.storeRequest.update({
      where: { id: request.id },
      data: {
        status: "approved",
        approvedStoreId: createdStore.id,
        rejectionReason: null
      }
    });

    return createdStore;
  });

  revalidatePath("/admin");
  revalidatePath("/search");
  revalidatePath(`/stores/${store.slug}`);
  redirect("/admin?status=store_request_approved#store-requests");
}

export async function rejectStoreRequestAction(formData: FormData) {
  await requireAdmin();
  const requestId = String(formData.get("requestId") ?? "");
  const rejectionReason = emptyToNull(formData.get("rejectionReason"));

  if (!requestId) {
    redirect("/admin?error=store_request_not_found#store-requests");
  }

  const request = await prisma.storeRequest.findUnique({
    where: { id: requestId },
    select: {
      id: true,
      status: true
    }
  });

  if (!request || request.status === "approved") {
    redirect("/admin?error=store_request_not_found#store-requests");
  }

  await prisma.storeRequest.update({
    where: { id: request.id },
    data: {
      status: "rejected",
      rejectionReason,
      approvedStoreId: null
    }
  });

  revalidatePath("/admin");
  redirect("/admin?status=store_request_rejected#store-requests");
}

export async function updateReportStatusAction(formData: FormData) {
  await requireAdmin();
  const reportId = String(formData.get("reportId") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!reportId || !isValidReportStatus(status)) {
    redirect("/admin?error=invalid_report_status#reports");
  }

  await prisma.report.update({
    where: {
      id: reportId
    },
    data: {
      status
    }
  });

  revalidatePath("/admin");
  redirect("/admin?status=report_updated#reports");
}

export async function updateReviewVisibilityAction(formData: FormData) {
  await requireAdmin();
  const reviewId = String(formData.get("reviewId") ?? "");
  const isHidden = formData.get("isHidden") === "true";
  const returnTo = String(formData.get("returnTo") ?? "reviews");

  if (!reviewId) {
    redirect("/admin?error=review_not_found#reviews");
  }

  const review = await prisma.review.update({
    where: {
      id: reviewId
    },
    data: {
      isHidden
    },
    select: {
      storeId: true,
      store: {
        select: {
          slug: true
        }
      }
    }
  });

  await refreshStoreReviewStats(review.storeId);

  revalidatePath("/admin");
  revalidatePath("/search");
  revalidatePath(`/stores/${review.store.slug}`);
  redirect(`/admin?status=review_visibility_updated#${returnTo === "reports" ? "reports" : "reviews"}`);
}

async function uploadStorePhotoFile({ file, slug }: { file: File; slug: string }) {
  const supabase = await createClient();
  await supabase.storage.createBucket(STORE_PHOTOS_BUCKET, {
    public: true,
    fileSizeLimit: `${MAX_STORE_PHOTO_SIZE}`,
    allowedMimeTypes: [...ALLOWED_IMAGE_TYPES]
  });

  const extension = getImageExtension(file);
  const storagePath = `${slug}/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage.from(STORE_PHOTOS_BUCKET).upload(storagePath, file, {
    contentType: file.type,
    upsert: false
  });

  if (uploadError) {
    redirect("/admin?error=store_photo_upload_failed");
  }

  const {
    data: { publicUrl }
  } = supabase.storage.from(STORE_PHOTOS_BUCKET).getPublicUrl(storagePath);

  return { publicUrl, storagePath };
}

function validateStorePhoto(file: File) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    redirect("/admin?error=invalid_store_photo_type");
  }

  if (file.size > MAX_STORE_PHOTO_SIZE) {
    redirect("/admin?error=store_photo_too_large");
  }
}

function getImageExtension(file: File) {
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

function emptyToNull(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text || null;
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isValidReportStatus(status: string) {
  return ["open", "in_review", "resolved", "rejected"].includes(status);
}

async function refreshStoreReviewStats(storeId: string) {
  const aggregate = await prisma.review.aggregate({
    where: {
      storeId,
      isHidden: false
    },
    _avg: {
      rating: true
    },
    _count: {
      _all: true
    }
  });

  await prisma.store.update({
    where: {
      id: storeId
    },
    data: {
      averageRating: aggregate._avg.rating ?? 0,
      reviewCount: aggregate._count._all
    }
  });
}

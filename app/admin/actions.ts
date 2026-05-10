"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

const STORE_PHOTOS_BUCKET = "store-photos";
const MAX_STORE_PHOTO_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function uploadStorePhotoAction(formData: FormData) {
  const user = await requireAdmin();
  const storeId = String(formData.get("storeId") ?? "");
  const altText = String(formData.get("altText") ?? "").trim();
  const isPrimary = formData.get("isPrimary") === "on";
  const file = formData.get("photo");

  if (!storeId || !(file instanceof File) || file.size === 0) {
    redirect("/admin?error=missing_store_photo");
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    redirect("/admin?error=invalid_store_photo_type");
  }

  if (file.size > MAX_STORE_PHOTO_SIZE) {
    redirect("/admin?error=store_photo_too_large");
  }

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

  const supabase = await createClient();
  await supabase.storage.createBucket(STORE_PHOTOS_BUCKET, {
    public: true,
    fileSizeLimit: `${MAX_STORE_PHOTO_SIZE}`,
    allowedMimeTypes: [...ALLOWED_IMAGE_TYPES]
  });

  const extension = getImageExtension(file);
  const storagePath = `${store.slug}/${crypto.randomUUID()}.${extension}`;
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

function getImageExtension(file: File) {
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

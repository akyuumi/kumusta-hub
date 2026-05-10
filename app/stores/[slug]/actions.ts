"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

const REVIEW_PHOTOS_BUCKET = "review-photos";
const MAX_REVIEW_PHOTO_COUNT = 3;
const MAX_REVIEW_PHOTO_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function createReviewAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const rating = Number(formData.get("rating"));
  const body = String(formData.get("body") ?? "").trim();
  const photos = formData
    .getAll("photos")
    .filter((photo): photo is File => photo instanceof File && photo.size > 0);

  if (!slug) {
    redirect("/search");
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    redirect(`/stores/${slug}?error=invalid_rating#reviews`);
  }

  if (body.length > 2000) {
    redirect(`/stores/${slug}?error=review_too_long#reviews`);
  }

  if (photos.length > MAX_REVIEW_PHOTO_COUNT) {
    redirect(`/stores/${slug}?error=too_many_review_photos#reviews`);
  }

  if (photos.some((photo) => !ALLOWED_IMAGE_TYPES.has(photo.type))) {
    redirect(`/stores/${slug}?error=invalid_review_photo_type#reviews`);
  }

  if (photos.some((photo) => photo.size > MAX_REVIEW_PHOTO_SIZE)) {
    redirect(`/stores/${slug}?error=review_photo_too_large#reviews`);
  }

  const user = await requireUser(`/stores/${slug}`);

  const store = await prisma.store.findFirst({
    where: {
      slug,
      isPublished: true
    },
    select: {
      id: true
    }
  });

  if (!store) {
    redirect("/search");
  }

  const uploadedPhotos = photos.length > 0 ? await uploadReviewPhotos({ files: photos, slug, userId: user.id }) : [];

  await prisma.$transaction(async (tx) => {
    await tx.review.create({
      data: {
        userId: user.id,
        storeId: store.id,
        rating,
        body: body || null,
        photos: {
          create: uploadedPhotos.map((photo) => ({
            imageUrl: photo.publicUrl
          }))
        }
      }
    });

    const aggregate = await tx.review.aggregate({
      where: {
        storeId: store.id,
        isHidden: false
      },
      _avg: {
        rating: true
      },
      _count: {
        _all: true
      }
    });

    await tx.store.update({
      where: {
        id: store.id
      },
      data: {
        averageRating: aggregate._avg.rating ?? 0,
        reviewCount: aggregate._count._all
      }
    });
  });

  revalidatePath(`/stores/${slug}`);
  revalidatePath("/search");
  redirect(`/stores/${slug}#reviews`);
}

async function uploadReviewPhotos({ files, slug, userId }: { files: File[]; slug: string; userId: string }) {
  const supabase = await createClient();

  return Promise.all(
    files.map(async (file) => {
      const extension = getImageExtension(file);
      const storagePath = `${slug}/${userId}/${crypto.randomUUID()}.${extension}`;
      const { error } = await supabase.storage.from(REVIEW_PHOTOS_BUCKET).upload(storagePath, file, {
        contentType: file.type,
        upsert: false
      });

      if (error) {
        redirect(`/stores/${slug}?error=review_photo_upload_failed#reviews`);
      }

      const {
        data: { publicUrl }
      } = supabase.storage.from(REVIEW_PHOTOS_BUCKET).getPublicUrl(storagePath);

      return { publicUrl };
    })
  );
}

function getImageExtension(file: File) {
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

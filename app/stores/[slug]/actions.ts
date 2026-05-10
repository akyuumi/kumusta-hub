"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function createReviewAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const rating = Number(formData.get("rating"));
  const body = String(formData.get("body") ?? "").trim();

  if (!slug) {
    redirect("/search");
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    redirect(`/stores/${slug}?error=invalid_rating#reviews`);
  }

  if (body.length > 2000) {
    redirect(`/stores/${slug}?error=review_too_long#reviews`);
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

  await prisma.$transaction(async (tx) => {
    await tx.review.create({
      data: {
        userId: user.id,
        storeId: store.id,
        rating,
        body: body || null
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

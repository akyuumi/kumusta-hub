"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { consumeUserRateLimit } from "@/lib/rate-limit";

export async function createStoreRequestAction(formData: FormData) {
  const user = await requireUser("/store-request");
  const storeName = String(formData.get("storeName") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "");
  const areaId = String(formData.get("areaId") ?? "");
  const url = emptyToNull(formData.get("url"));
  const notes = emptyToNull(formData.get("notes"));

  if (!storeName || !address || !categoryId || !areaId) {
    redirect("/store-request?error=missing_fields");
  }

  const canCreateRequest = await consumeUserRateLimit({
    userId: user.id,
    action: "store_request:create",
    limit: 3,
    windowSeconds: 24 * 60 * 60
  });

  if (!canCreateRequest) {
    redirect("/store-request?error=store_request_rate_limited");
  }

  const [category, area] = await Promise.all([
    prisma.category.findUnique({ where: { id: categoryId }, select: { id: true } }),
    prisma.area.findUnique({ where: { id: areaId }, select: { id: true } })
  ]);

  if (!category || !area) {
    redirect("/store-request?error=invalid_taxonomy");
  }

  await prisma.storeRequest.create({
    data: {
      userId: user.id,
      storeName,
      address,
      categoryId,
      areaId,
      url,
      notes
    }
  });

  revalidatePath("/admin");
  redirect("/store-request?status=submitted");
}

function emptyToNull(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text || null;
}

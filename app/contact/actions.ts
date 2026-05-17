"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MAX_CONTACT_MESSAGE_LENGTH = 4000;

export async function createContactAction(formData: FormData) {
  const user = await getCurrentUser();
  const email = String(formData.get("email") ?? user?.email ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const kind = String(formData.get("kind") ?? "general").trim();

  if (!email || !subject || !message || !isValidContactKind(kind)) {
    redirect("/contact?error=missing_fields");
  }

  if (!email.includes("@")) {
    redirect("/contact?error=invalid_email");
  }

  if (message.length > MAX_CONTACT_MESSAGE_LENGTH) {
    redirect("/contact?error=message_too_long");
  }

  await prisma.contact.create({
    data: {
      userId: user?.id ?? null,
      email,
      subject,
      message,
      kind
    }
  });

  redirect("/contact?status=submitted");
}

function isValidContactKind(kind: string) {
  return ["general", "store_correction", "deletion_request", "moderation", "partnership"].includes(kind);
}

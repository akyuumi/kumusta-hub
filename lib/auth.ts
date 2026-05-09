import { redirect } from "next/navigation";
import { isAdminUser } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
}

export async function requireUser(next = "/mypage") {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireUser("/admin");
  if (!isAdminUser(user)) {
    redirect("/mypage?error=admin_required");
  }
  return user;
}

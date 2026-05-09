import type { User } from "@supabase/supabase-js";

export function getAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminUser(user: User | null) {
  const email = user?.email?.toLowerCase();
  return Boolean(email && getAdminEmails().includes(email));
}

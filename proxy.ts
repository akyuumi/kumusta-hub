import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getAdminEmails } from "@/lib/admin";
import { isLocale, localeCookieName } from "@/lib/i18n";
import type { SupabaseCookie } from "@/lib/supabase/cookies";

const protectedPrefixes = ["/mypage", "/store-request"];
const authPrefixes = ["/login"];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request
  });
  const requestedLocale = request.nextUrl.searchParams.get("lang");

  if (isLocale(requestedLocale)) {
    request.cookies.set(localeCookieName, requestedLocale);
    response.cookies.set(localeCookieName, requestedLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax"
    });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: SupabaseCookie[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      }
    }
  });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isProtected = protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  if ((isProtected || isAdmin) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isAdmin) {
    const adminEmails = getAdminEmails();
    const email = user?.email?.toLowerCase();

    if (!email || !adminEmails.includes(email)) {
      const url = request.nextUrl.clone();
      url.pathname = "/mypage";
      url.searchParams.set("error", "admin_required");
      return NextResponse.redirect(url);
    }
  }

  if (user && authPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    const url = request.nextUrl.clone();
    url.pathname = "/mypage";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"]
};

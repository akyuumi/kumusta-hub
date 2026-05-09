import { NextResponse, type NextRequest } from "next/server";
import type { Provider } from "@supabase/supabase-js";
import { normalizeRedirectPath } from "@/lib/redirect";
import { createClient } from "@/lib/supabase/server";

const providers = new Set<Provider>(["google", "facebook"]);

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const provider = String(formData.get("provider") ?? "") as Provider;
  const next = normalizeRedirectPath(String(formData.get("next") ?? "/mypage"));

  if (!providers.has(provider)) {
    return NextResponse.redirect(new URL("/login?error=unsupported_provider", request.url));
  }

  const supabase = await createClient();
  const origin = request.nextUrl.origin;
  const callbackUrl = new URL("/auth/callback", origin);
  callbackUrl.searchParams.set("next", next);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: callbackUrl.toString()
    }
  });

  if (error || !data.url) {
    return NextResponse.redirect(new URL("/login?error=oauth_start_failed", request.url));
  }

  return NextResponse.redirect(data.url);
}

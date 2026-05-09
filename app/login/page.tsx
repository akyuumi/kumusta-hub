import type { Metadata } from "next";
import Link from "next/link";
import { Facebook, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to post reviews, save stores, and submit new store requests."
};

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{
    next?: string;
    error?: string;
  }>;
}) {
  const params = await searchParams;
  const next = params.next ?? "/mypage";
  const googleHref = `/auth/sign-in?provider=google&next=${encodeURIComponent(next)}`;
  const facebookHref = `/auth/sign-in?provider=facebook&next=${encodeURIComponent(next)}`;

  return (
    <main className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-5xl place-items-center px-4 py-10 sm:px-6">
      <section className="w-full max-w-md rounded-lg border border-line bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-ink">Login</h1>
        <p className="mt-2 text-sm leading-6 text-muted">Login to post reviews, save stores, report reviews, and submit store requests.</p>
        {params.error && <p className="mt-4 rounded-md bg-[#fff5ea] p-3 text-sm font-medium text-coral">Authentication failed. Check the provider settings and try again.</p>}
        <div className="mt-6 space-y-3">
          <Link href={googleHref} className="flex h-12 w-full items-center justify-center gap-3 rounded-md border border-line font-semibold hover:border-bay">
            <Mail size={18} />
            Continue with Google
          </Link>
          <Link href={facebookHref} className="flex h-12 w-full items-center justify-center gap-3 rounded-md bg-[#1877f2] font-semibold text-white">
            <Facebook size={18} />
            Continue with Facebook
          </Link>
        </div>
      </section>
    </main>
  );
}

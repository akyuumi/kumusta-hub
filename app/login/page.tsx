import type { Metadata } from "next";
import { Facebook, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to post reviews, save stores, and submit new store requests."
};

export default function LoginPage() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-5xl place-items-center px-4 py-10 sm:px-6">
      <section className="w-full max-w-md rounded-lg border border-line bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-ink">Login</h1>
        <p className="mt-2 text-sm leading-6 text-muted">MVP auth entry point for Supabase OAuth. Connect Google and Facebook providers in Supabase to activate these actions.</p>
        <div className="mt-6 space-y-3">
          <button className="flex h-12 w-full items-center justify-center gap-3 rounded-md border border-line font-semibold hover:border-bay">
            <Mail size={18} />
            Continue with Google
          </button>
          <button className="flex h-12 w-full items-center justify-center gap-3 rounded-md bg-[#1877f2] font-semibold text-white">
            <Facebook size={18} />
            Continue with Facebook
          </button>
        </div>
      </section>
    </main>
  );
}

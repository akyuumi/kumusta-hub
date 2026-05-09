import type { Metadata } from "next";
import Link from "next/link";
import { Globe2, Menu, Search, UserRound } from "lucide-react";
import { AuthNav } from "@/components/AuthNav";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "KumustaHub | Filipino stores in Japan",
    template: "%s | KumustaHub"
  },
  description: "Search and review Filipino restaurants, groceries, remittance, and delivery services in Japan.",
  metadataBase: new URL("https://kumustahub.example.com"),
  openGraph: {
    title: "KumustaHub",
    description: "Find Filipino community stores across Japan.",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold text-ink">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-coral text-white">K</span>
              <span>KumustaHub</span>
            </Link>
            <div className="hidden items-center gap-2 md:flex">
              <AuthNav />
              <Link className="rounded-md border border-line p-2 text-muted hover:text-ink" href="/admin" aria-label="Admin">
                <Menu size={18} />
              </Link>
            </div>
            <div className="flex items-center gap-2 md:hidden">
              <Link className="rounded-md border border-line p-2" href="/search" aria-label="Search">
                <Search size={18} />
              </Link>
              <Link className="rounded-md border border-line p-2" href="/login" aria-label="Login">
                <UserRound size={18} />
              </Link>
            </div>
          </div>
        </header>
        {children}
        <footer className="border-t border-line bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto]">
            <div>
              <div className="mb-2 flex items-center gap-2 font-bold">
                <Globe2 size={18} />
                KumustaHub
              </div>
              <p className="max-w-xl text-sm leading-6 text-muted">
                Filipino community store discovery for restaurants, groceries, remittance, and delivery services in Japan.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted">
              <Link href="/terms">Terms</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Globe2, Menu, Search, UserRound } from "lucide-react";
import { AuthNav } from "@/components/AuthNav";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { getDictionary, getLocale } from "@/lib/i18n";
import { absoluteUrl, siteUrl } from "@/lib/site";
import "leaflet/dist/leaflet.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "KumustaHub | Filipino stores in Japan",
    template: "%s | KumustaHub"
  },
  description: "Search and review Filipino restaurants, groceries, remittance, and delivery services in Japan.",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: absoluteUrl("/")
  },
  openGraph: {
    title: "KumustaHub",
    description: "Find Filipino community stores across Japan.",
    url: absoluteUrl("/"),
    siteName: "KumustaHub",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "KumustaHub",
    description: "Find Filipino community stores across Japan."
  }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <html lang={locale}>
      <body>
        <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold text-ink">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-coral text-white">K</span>
              <span>KumustaHub</span>
            </Link>
            <div className="hidden items-center gap-2 md:flex">
              <AuthNav labels={dict.nav} />
              <LocaleSwitcher locale={locale} labels={dict.locale} />
              <Link className="rounded-md border border-line p-2 text-muted hover:text-ink" href="/admin" aria-label={dict.nav.admin}>
                <Menu size={18} />
              </Link>
            </div>
            <div className="flex items-center gap-2 md:hidden">
              <LocaleSwitcher locale={locale} labels={dict.locale} />
              <Link className="rounded-md border border-line p-2" href="/search" aria-label={dict.nav.search}>
                <Search size={18} />
              </Link>
              <Link className="rounded-md border border-line p-2" href="/login" aria-label={dict.nav.login}>
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
              <p className="max-w-xl text-sm leading-6 text-muted">{dict.footer.description}</p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted">
              <Link href="/terms">{dict.footer.terms}</Link>
              <Link href="/privacy">{dict.footer.privacy}</Link>
              <Link href="/contact">{dict.footer.contact}</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

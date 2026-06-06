import type { ReactNode } from "react";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-ink">Privacy Policy</h1>
      <p className="mt-3 text-sm text-muted">Last updated: May 18, 2026</p>
      <PolicySection title="1. Information We Collect">
        KumustaHub collects account information provided through Supabase Auth, including authentication identifiers and email addresses. The service also stores reviews, ratings, photos, favorites, reports, store requests, contact messages, and operational
        metadata needed to run the service.
      </PolicySection>
      <PolicySection title="2. How We Use Information">
        Information is used to provide login, store discovery, reviews, favorites, reports, store requests, moderation, inquiry handling, abuse prevention, security, and service improvement.
      </PolicySection>
      <PolicySection title="3. Photos and Public Content">
        Reviews, ratings, uploaded photos, store requests approved as listings, and related public content may be displayed to other users. Contact messages and moderation reports are handled as operational records and are not displayed publicly.
      </PolicySection>
      <PolicySection title="4. Service Providers">
        KumustaHub uses Supabase for authentication, database, and storage, and Vercel for hosting. These providers process data as part of operating the application.
      </PolicySection>
      <PolicySection title="5. Retention and Deletion">
        Operational records are retained as needed for service operation, moderation, safety, abuse prevention, and legal or business requirements. Users may submit deletion or correction requests through the contact page.
      </PolicySection>
      <PolicySection title="6. Security">
        Access to administrative features is restricted by authentication and an admin allowlist. No internet service can guarantee perfect security, but KumustaHub uses reasonable safeguards aligned with the current MVP architecture.
      </PolicySection>
      <PolicySection title="7. Contact">
        KumustaHub is operated by the KumustaHub operations team. For privacy questions, deletion requests, correction requests, or concerns about submitted content, use the contact form at /contact.
      </PolicySection>
    </main>
  );
}

function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-7">
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      <p className="mt-2 leading-7 text-muted">{children}</p>
    </section>
  );
}

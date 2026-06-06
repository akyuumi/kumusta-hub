import type { ReactNode } from "react";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-ink">Terms of Service</h1>
      <p className="mt-3 text-sm text-muted">Last updated: May 18, 2026</p>
      <PolicySection title="1. Service">
        KumustaHub provides a community directory and review service for Filipino-related restaurants, groceries, remittance services, and delivery services in Japan. Store information, reviews, photos, and links may be submitted by users or managed by
        the operations team.
      </PolicySection>
      <PolicySection title="2. Accounts and User Content">
        Users are responsible for content they submit, including reviews, photos, reports, store requests, and contact messages. Users must not submit unlawful, abusive, discriminatory, defamatory, misleading, infringing, spam, or privacy-invasive content.
      </PolicySection>
      <PolicySection title="3. Reviews and Moderation">
        KumustaHub may hide, edit operational metadata for, or remove content when it appears to violate these terms, third-party rights, safety expectations, or service integrity. Reviews should reflect genuine experiences and should not be paid,
        fabricated, or posted to manipulate ratings.
      </PolicySection>
      <PolicySection title="4. Store Information">
        Store listings may contain errors or outdated information. Users should confirm critical details directly with the store. Store owners or representatives may request corrections or removal review through the contact page.
      </PolicySection>
      <PolicySection title="5. Photos and Rights">
        By uploading photos, users confirm they have the necessary rights and permissions to share them. KumustaHub may display uploaded photos in store pages, search results, and related service surfaces.
      </PolicySection>
      <PolicySection title="6. Deletion and Correction Requests">
        Requests for deletion, correction, copyright concerns, privacy concerns, or moderation review should be submitted through the contact page. The operations team will review requests based on available information and service safety requirements.
      </PolicySection>
      <PolicySection title="7. Disclaimer">
        The service is provided as available. KumustaHub does not guarantee uninterrupted availability, complete accuracy of store information, or suitability of any listed store or service.
      </PolicySection>
      <PolicySection title="8. Contact">
        KumustaHub is operated by the KumustaHub operations team. For questions about these terms, store corrections, deletion requests, or moderation concerns, use the contact form at /contact.
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

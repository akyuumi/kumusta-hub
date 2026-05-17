import { getCurrentUser } from "@/lib/auth";
import { createContactAction } from "./actions";

export default async function ContactPage({
  searchParams
}: {
  searchParams: Promise<{
    error?: string;
    status?: string;
  }>;
}) {
  const [user, params] = await Promise.all([getCurrentUser(), searchParams]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-ink">Contact</h1>
      <p className="mt-4 leading-7 text-muted">For store corrections, deletion requests, partnership inquiries, or moderation issues, contact the KumustaHub operations team.</p>
      {params.status === "submitted" && <p className="mt-4 rounded-md bg-[#eef7f4] p-3 text-sm font-medium text-bay">Your message has been submitted.</p>}
      {params.error && <p className="mt-4 rounded-md bg-[#fff5ea] p-3 text-sm font-medium text-coral">{getContactErrorMessage(params.error)}</p>}
      <form action={createContactAction} className="mt-6 space-y-4 rounded-lg border border-line bg-white p-5">
        <label className="block space-y-1">
          <span className="text-sm font-semibold">Email</span>
          <input name="email" required type="email" defaultValue={user?.email ?? ""} className="h-11 w-full rounded-md border border-line px-3" placeholder="you@example.com" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-semibold">Type</span>
          <select name="kind" defaultValue="general" className="h-11 w-full rounded-md border border-line bg-white px-3">
            <option value="general">General inquiry</option>
            <option value="store_correction">Store correction</option>
            <option value="deletion_request">Deletion request</option>
            <option value="moderation">Moderation issue</option>
            <option value="partnership">Partnership</option>
          </select>
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-semibold">Subject</span>
          <input name="subject" required className="h-11 w-full rounded-md border border-line px-3" placeholder="How can we help?" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-semibold">Message</span>
          <textarea name="message" required className="w-full rounded-md border border-line p-3" rows={6} maxLength={4000} placeholder="Include URLs, store names, or details needed for deletion or correction requests." />
        </label>
        <button className="h-11 rounded-md bg-coral px-5 font-semibold text-white">Send</button>
      </form>
    </main>
  );
}

function getContactErrorMessage(error: string) {
  const messages: Record<string, string> = {
    missing_fields: "Email, type, subject, and message are required.",
    invalid_email: "Enter a valid email address.",
    message_too_long: "Message must be 4,000 characters or less."
  };

  return messages[error] ?? "Contact submission failed.";
}

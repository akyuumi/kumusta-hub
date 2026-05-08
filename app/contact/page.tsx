export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-ink">Contact</h1>
      <p className="mt-4 leading-7 text-muted">For store corrections, deletion requests, partnership inquiries, or moderation issues, contact the KumustaHub operations team.</p>
      <form className="mt-6 space-y-4 rounded-lg border border-line bg-white p-5">
        <input className="h-11 w-full rounded-md border border-line px-3" placeholder="Email" />
        <textarea className="w-full rounded-md border border-line p-3" rows={5} placeholder="Message" />
        <button type="button" className="h-11 rounded-md bg-coral px-5 font-semibold text-white">Send</button>
      </form>
    </main>
  );
}

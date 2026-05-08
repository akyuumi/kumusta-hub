export default function TermsPage() {
  return <PolicyPage title="Terms of Service" body="KumustaHub MVP provides community store discovery and review features. Users are responsible for submitted content and must not post abusive, false, or infringing material." />;
}

function PolicyPage({ title, body }: { title: string; body: string }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-ink">{title}</h1>
      <p className="mt-4 leading-7 text-muted">{body}</p>
    </main>
  );
}

import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl glass-card p-8 sm:p-12">
        <Link href="/" className="text-sm font-semibold text-sky-700 hover:text-sky-800 mb-8 inline-block">
          ← Back to Plumbflow
        </Link>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Terms of Service</h1>
        <p className="text-slate-500 mb-8">Last updated: 23 October 2026</p>

        <div className="space-y-6 text-slate-700">
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">1. Acceptance of Terms</h2>
            <p>By accessing or using Plumbflow, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">2. Description of Service</h2>
            <p>Plumbflow provides a multi-tenant booking platform for plumbing businesses. We do not provide plumbing services directly.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">3. Subscriptions and Billing</h2>
            <p>Some parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis (such as monthly).</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">4. Termination</h2>
            <p>We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
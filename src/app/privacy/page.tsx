import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl glass-card p-8 sm:p-12">
        <Link href="/" className="text-sm font-semibold text-sky-700 hover:text-sky-800 mb-8 inline-block">
          ← Back to Plumbflow
        </Link>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-slate-500 mb-8">Last updated: 23 October 2026</p>

        <div className="space-y-6 text-slate-700">
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create or modify your account, request services, contact customer support, or otherwise communicate with us. This information may include: name, email address, phone number, and business details.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">2. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, such as to facilitate bookings, send related information including confirmations and invoices, and provide customer support.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">3. Data Security</h2>
            <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">4. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at support@plumbflow.co.uk.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id: session.user.tenantId },
  });

  return (
    <main className="pb-20">
      <section className="mx-auto mt-6 max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* WELCOME HEADER */}
        <div className="glass-card p-6 sm:p-10 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="label-pill mb-3 inline-flex">Dashboard</p>
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Welcome back, {session.user.name}
            </h1>
            <p className="mt-2 text-lg text-slate-700">
              {tenant?.businessName}
            </p>
          </div>
          <Link 
            href={`/b/${tenant?.slug}`} 
            target="_blank"
            className="cta-secondary whitespace-nowrap text-center"
          >
            View Live Page ↗
          </Link>
        </div>

        {/* ONBOARDING BANNER */}
        {tenant?.phone === "00000000000" && (
          <div className="glass-card p-6 mb-6 border border-sky-200 bg-sky-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Complete your setup</h3>
              <p className="mt-1 text-slate-700 text-sm">
                Add your phone number and services to start accepting bookings.
              </p>
            </div>
            <Link 
              href="/app/onboarding" 
              className="cta-primary whitespace-nowrap"
            >
              Complete Setup
            </Link>
          </div>
        )}

        {/* BOOKINGS SECTION */}
        <div className="glass-card p-6 sm:p-8">
          <h2 className="section-title">Incoming Bookings</h2>
          
          <div className="mt-8 text-center py-12">
            <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No bookings yet</h3>
            <p className="mt-2 text-sm text-slate-700 max-w-md mx-auto">
              Start by sharing your booking link with customers. Your first job can land today.
            </p>
          </div>
        </div>

      </section>
    </main>
  );
}
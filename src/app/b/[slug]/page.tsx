import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PublicBookingForm from "./booking-form";

export default async function PublicBookingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Await params (Next.js 15 requirement)
  const { slug } = await params;

  const tenant = await prisma.tenant.findUnique({
    where: { slug },
    include: {
      services: {
        where: { active: true },
      },
    },
  });

  if (!tenant) {
    notFound();
  }

  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8">
        
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            {tenant.businessName}
          </h1>
          <p className="mt-2 text-slate-700">
            Book a service online in under 60 seconds.
          </p>
        </div>

        <div className="glass-card p-6 sm:p-8">
          <PublicBookingForm tenant={tenant} />
        </div>

      </div>
    </main>
  );
}
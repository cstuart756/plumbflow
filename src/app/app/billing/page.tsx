import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createCheckoutSessionAction } from "@/lib/stripe-actions";

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const tenant = await prisma.tenant.findUnique({
    where: { id: session.user.tenantId },
  });

  const isTrialing = tenant?.subscriptionStatus === "trialing";
  const isActive = tenant?.subscriptionStatus === "active";

  return (
    <main className="pb-20">
      <section className="mx-auto mt-6 max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-8 sm:p-12 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Plumbflow Pro</h1>
          
          <p className="text-slate-700 mb-8">
            £19 / month. Cancel anytime.
          </p>

          {isActive ? (
            <div className="bg-green-50 text-green-700 p-4 rounded-lg inline-block font-semibold">
              ✅ Your subscription is active.
            </div>
          ) : isTrialing ? (
            <div className="space-y-6">
              <div className="bg-sky-50 text-sky-700 p-4 rounded-lg inline-block font-semibold">
                🎉 You are on a free trial.
              </div>
              <p className="text-slate-600">
                Your trial ends on {tenant?.trialEndsAt ? new Date(tenant.trialEndsAt).toLocaleDateString() : 'soon'}. Add a payment method to keep your booking page online.
              </p>
              <form action={createCheckoutSessionAction}>
                <button type="submit" className="cta-primary w-full max-w-xs">
                  Add Payment Method
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-red-50 text-red-700 p-4 rounded-lg inline-block font-semibold">
                ⚠️ Payment required
              </div>
              <form action={createCheckoutSessionAction}>
                <button type="submit" className="cta-primary w-full max-w-xs">
                  Subscribe Now
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
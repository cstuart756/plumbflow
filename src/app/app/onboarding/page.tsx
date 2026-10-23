import { completeOnboardingAction } from "@/lib/onboarding-actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <main className="flex min-h-screen items-center justify-center pb-20 pt-10">
      <div className="mx-auto w-full max-w-lg px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-8 sm:p-10">
          
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900">Complete your profile</h1>
            <p className="mt-2 text-slate-700">Let&apos;s get your booking page ready.</p>
          </div>

          <form className="space-y-6" action={completeOnboardingAction}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Business Phone</label>
              <input 
                name="phone" 
                type="tel" 
                required 
                className="block w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500" 
                placeholder="e.g. 07700 900123" 
              />
            </div>

            <div className="pt-6 border-t border-slate-200/60">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Your Services</label>
              <p className="text-xs text-slate-500 mb-4">Add at least one service you offer.</p>
              
              <div className="space-y-3">
                <input 
                  name="service1" 
                  type="text" 
                  required 
                  className="block w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500" 
                  placeholder="e.g. Drain Cleaning" 
                />
                <input 
                  name="service2" 
                  type="text" 
                  className="block w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500" 
                  placeholder="e.g. Leak Repair (Optional)" 
                />
                <input 
                  name="service3" 
                  type="text" 
                  className="block w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500" 
                  placeholder="e.g. Installation (Optional)" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="cta-primary w-full mt-4"
            >
              Save and Continue
            </button>
          </form>
          
        </div>
      </div>
    </main>
  );
}
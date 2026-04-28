"use client";

import { useEffect, useState } from "react";
import BookingAnimation from "@/components/BookingAnimation";
import DemoGate from "@/components/DemoGate";
import { track, identifyUser } from "@/lib/analytics";

const features = [
  { title: "Automated Booking", body: "Customers book online in under 60 seconds.", icon: "AB" },
  { title: "Reduce Missed Calls", body: "Capture jobs while you are on-site and busy.", icon: "MC" },
  { title: "24/7 Availability", body: "Accept bookings day and night without extra staff.", icon: "24" },
  { title: "Customer Self-Service", body: "Reschedule, confirm, and update details anytime.", icon: "SS" },
];

const mockAppointments = [
  { service: "Boiler Repair", time: "10:00 AM", customer: "M. Hughes", status: "Confirmed" },
  { service: "Drain Unblock", time: "11:45 AM", customer: "L. Carter", status: "On route" },
  { service: "Leak Inspection", time: "2:30 PM", customer: "J. Patel", status: "Pending" },
];

const testimonials = [
  {
    initials: "RT",
    name: "Ryan T.",
    quote: "We used to lose at least 4 calls a day. Now the calendar fills itself.",
  },
  {
    initials: "AM",
    name: "Aimee M.",
    quote: "The SMS reminders cut no-shows almost immediately.",
  },
  {
    initials: "DH",
    name: "Darren H.",
    quote: "My team checks jobs on mobile before arriving at site. Huge time saver.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "$29",
    cadence: "/month",
    points: ["Up to 100 bookings", "Email confirmations", "Basic calendar sync"],
    recommended: false,
  },
  {
    name: "Pro",
    price: "$79",
    cadence: "/month",
    points: ["Up to 500 bookings", "SMS reminders", "Team notifications"],
    recommended: true,
  },
  {
    name: "Business",
    price: "$149",
    cadence: "/month",
    points: ["Unlimited bookings", "Priority support", "Advanced automations"],
    recommended: false,
  },
];

const logos = ["Northline Plumbing", "PipeRight", "RapidFlow", "City Drain Co."];

export default function Home() {
  const [demoUnlocked, setDemoUnlocked] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Check if user came from demo link or has already unlocked
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const demoParam = params.get("demo") === "true";
      const savedEmail = localStorage.getItem("demo_email");

      setIsDemoMode(demoParam || !!savedEmail);
      setDemoUnlocked(!!savedEmail);
    }

    track("hero_view");
  }, []);

  // Show demo gate if in demo mode but not unlocked
  if (isDemoMode && !demoUnlocked) {
    return (
      <main className="flex min-h-screen items-center justify-center pb-20">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
              Demo Experience
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-700">
              See how plumbers use Plumbflow to stop missing calls and fill their
              calendar automatically.
            </p>
          </div>
          <DemoGate onUnlock={() => setDemoUnlocked(true)} />
        </div>
      </main>
    );
  }

  const handleCtaClick = (location: string) => {
    track("cta_click", { location });
  };

  const handleDemoClick = () => {
    track("cta_demo_click", { location: "hero" });
    window.location.href = "/?demo=true";
  };

  const handlePricingClick = (plan: string) => {
    track("pricing_selected", { plan });
  };

  return (
    <main className="pb-20">
      <section className="hero-shell mx-auto mt-6 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="hero-grid section-reveal rounded-3xl p-6 sm:p-10 lg:p-12">
          <div>
            <p className="label-pill mb-4 inline-flex">Built for real plumbing teams</p>
            <h1 className="text-4xl font-bold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
              The booking system that keeps plumbers fully booked.
            </h1>
            <p className="mt-5 max-w-2xl text-base text-slate-700 sm:text-lg">
              Replace missed calls with an always-on booking flow, automatic reminders, and a field-ready dashboard your team can use on the go.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                className="cta-primary"
                href="#booking-flow"
                onClick={() => handleCtaClick("hero")}
              >
                View booking flow
              </a>
              <button
                onClick={handleDemoClick}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-slate-800 px-6 py-3 font-semibold text-white shadow-md hover:bg-slate-900"
              >
                Try Demo
              </button>
              <a
                className="cta-secondary"
                href="#pricing"
                onClick={() => handleCtaClick("hero-secondary")}
              >
                See pricing
              </a>
            </div>
            <p className="mt-4 text-sm text-slate-600">No contracts. Setup in one afternoon.</p>
          </div>
          <div className="hero-media">
            <img
              src="/images/plumbflowhero.png"
              alt="Plumbflow hero mockup"
              className="h-full w-full rounded-2xl object-cover"
            />
            <div className="pulse-card">
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">Live update</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">New booking: Boiler Repair - 10:00 AM</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          <article className="glass-card p-6">
            <h2 className="text-xl font-semibold text-slate-900">Problem</h2>
            <p className="mt-3 text-slate-700">
              Most small plumbing teams still depend on calls and manual diaries, so missed jobs and double-booking are common.
            </p>
          </article>
          <article className="glass-card p-6">
            <h2 className="text-xl font-semibold text-slate-900">Solution</h2>
            <p className="mt-3 text-slate-700">
              Plumbflow centralizes bookings, confirms jobs automatically, and notifies the right plumber instantly.
            </p>
          </article>
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="section-title">Feature Illustration Set</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article key={feature.title} className="glass-card card-choreo p-5">
              <div className="icon-chip">{feature.icon}</div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-700">{feature.body}</p>
            </article>
          ))}
        </div>
        <div className="mt-5 overflow-hidden rounded-2xl border border-white/70">
          <img src="/images/plubflowicons.png" alt="Feature icon collection" className="w-full object-cover" />
        </div>
      </section>

      <section id="dashboard" className="mx-auto mt-14 max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="section-title">Dashboard view (appointments + calendar)</h2>
        <div className="mt-5 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          <article className="glass-card p-6">
            <p className="text-sm font-medium text-slate-500">Today&apos;s appointments</p>
            <ul className="mt-4 space-y-3">
              {mockAppointments.map((appt) => (
                <li key={`${appt.customer}-${appt.time}`} className="rounded-xl border border-slate-200 bg-white/80 p-3">
                  <p className="font-semibold text-slate-900">{appt.service} - {appt.time}</p>
                  <p className="text-sm text-slate-600">{appt.customer}</p>
                  <span className="status-pill mt-2 inline-flex">{appt.status}</span>
                </li>
              ))}
            </ul>
          </article>
          <article className="glass-card p-6">
            <p className="text-sm font-medium text-slate-500">Calendar snapshot</p>
            <div className="mt-4 grid grid-cols-7 gap-2 text-center text-sm">
              {["M", "T", "W", "T", "F", "S", "S"].map((d) => (
                <span key={d} className="font-semibold text-slate-500">{d}</span>
              ))}
              {Array.from({ length: 21 }, (_, i) => i + 1).map((day) => (
                <span
                  key={day}
                  className={day === 14 || day === 18 ? "calendar-hit" : "calendar-cell"}
                >
                  {day}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-600">Highlighted days indicate confirmed visits.</p>
          </article>
        </div>
        <div className="mt-5 overflow-hidden rounded-2xl border border-white/70">
          <img src="/images/plumbflowdashboardview.png" alt="Dashboard interface mockup" className="w-full object-cover" />
        </div>
      </section>

      <section id="booking-flow" className="mx-auto mt-14 max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="section-title">Booking flow (customer side)</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <article className="glass-card p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">Step 1</p>
            <h3 className="mt-2 text-lg font-semibold">Choose service and time</h3>
            <p className="mt-2 text-sm text-slate-700">Customer selects Boiler Repair and picks 10:00 AM.</p>
          </article>
          <article className="glass-card p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">Step 2</p>
            <h3 className="mt-2 text-lg font-semibold">Confirm details</h3>
            <p className="mt-2 text-sm text-slate-700">Address, access notes, and contact details are captured once.</p>
          </article>
          <article className="glass-card p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">Step 3</p>
            <h3 className="mt-2 text-lg font-semibold">Receive confirmation</h3>
            <p className="mt-2 text-sm text-slate-700">Email and SMS sent instantly with booking reference.</p>
          </article>
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="section-title">Mobile view (critical for on-the-go teams)</h2>
        <div className="mt-5 grid items-center gap-6 lg:grid-cols-[1fr_1.1fr]">
          <article className="phone-shell mx-auto max-w-[290px]">
            <div className="phone-notch" />
            <div className="phone-screen">
              <p className="text-xs text-slate-500">Today</p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">3 jobs scheduled</h3>
              <div className="mt-4 space-y-3">
                <div className="phone-job">
                  <p className="font-semibold">Boiler Repair</p>
                  <p className="text-sm text-slate-600">10:00 AM - High Street</p>
                </div>
                <div className="phone-job">
                  <p className="font-semibold">Drain Unblock</p>
                  <p className="text-sm text-slate-600">11:45 AM - Oak Lane</p>
                </div>
                <div className="phone-job">
                  <p className="font-semibold">Leak Inspection</p>
                  <p className="text-sm text-slate-600">2:30 PM - River View</p>
                </div>
              </div>
            </div>
          </article>
          <img src="/images/plumbflowhero.png" alt="Mobile and desktop UI previews" className="rounded-2xl border border-white/70" />
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="section-title">How it works</h2>
        <BookingAnimation />
        <div className="mt-5 overflow-hidden rounded-2xl border border-white/70">
          <img src="/images/plumbflowexplainergraphic.png" alt="How Plumbflow works graphic" className="w-full object-cover" />
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="section-title">Social proof</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.name} className="glass-card p-5">
              <div className="flex items-center gap-3">
                <div className="avatar-chip">{item.initials}</div>
                <div>
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p className="text-sm text-amber-500">★★★★★</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-700">{item.quote}</p>
            </article>
          ))}
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {logos.map((logo) => (
            <div key={logo} className="glass-card px-4 py-3 text-center text-sm font-semibold text-slate-700">
              {logo}
            </div>
          ))}
        </div>
        <div className="mt-5 overflow-hidden rounded-2xl border border-white/70">
          <img src="/images/plumbflowtestimonials.png" alt="Customer testimonials visual" className="w-full object-cover" />
        </div>
      </section>

      <section id="pricing" className="mx-auto mt-14 max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="section-title">Pricing table</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={plan.recommended ? "price-card recommended" : "price-card"}
              onClick={() => handlePricingClick(plan.name)}
              style={{ cursor: "pointer" }}
            >
              {plan.recommended ? <span className="label-pill">Recommended</span> : null}
              <h3 className="mt-4 text-xl font-semibold text-slate-900">{plan.name}</h3>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {plan.price}
                <span className="text-sm font-medium text-slate-500">{plan.cadence}</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                {plan.points.map((point) => (
                  <li key={point}>• {point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="mt-5 overflow-hidden rounded-2xl border border-white/70">
          <img src="/images/plumbflowpricingtable.png" alt="Pricing table design preview" className="w-full object-cover" />
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="section-title">Empty states and micro UX</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <article className="glass-card p-6">
            <h3 className="text-lg font-semibold text-slate-900">No bookings yet</h3>
            <p className="mt-2 text-sm text-slate-700">Start by sharing your booking link. Your first job can land today.</p>
          </article>
          <article className="glass-card p-6">
            <h3 className="text-lg font-semibold text-slate-900">No customers yet</h3>
            <p className="mt-2 text-sm text-slate-700">Import contacts or send follow-up reminders after each completed job.</p>
          </article>
        </div>
        <div className="mt-5 overflow-hidden rounded-2xl border border-white/70">
          <img src="/images/plumbflowemptystates.png" alt="Empty state UX examples" className="w-full object-cover" />
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="section-title">Notifications and automation visuals</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <article className="glass-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">SMS</p>
            <p className="mt-2 rounded-xl bg-sky-50 p-3 text-sm text-slate-700">"Booking confirmed for Boiler Repair at 10:00 AM."</p>
          </article>
          <article className="glass-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</p>
            <p className="mt-2 rounded-xl bg-emerald-50 p-3 text-sm text-slate-700">"Your appointment is scheduled. Tap to manage details."</p>
          </article>
          <article className="glass-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Calendar sync</p>
            <p className="mt-2 rounded-xl bg-violet-50 p-3 text-sm text-slate-700">"Event created: Leak Inspection - 2:30 PM."</p>
          </article>
        </div>
        <div className="mt-5 overflow-hidden rounded-2xl border border-white/70">
          <img src="/images/plumbflownotifications.png" alt="Notifications and automation mockups" className="w-full object-cover" />
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="section-title">Logo variants</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article className="glass-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Full logo</p>
            <div className="mt-3 flex items-center gap-2">
              <img src="/images/plumbflowfavicon.png" alt="Plumbflow icon" className="h-8 w-8" />
              <span className="text-lg font-bold text-slate-900">Plumbflow</span>
            </div>
          </article>
          <article className="glass-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Icon only</p>
            <img src="/images/plumbflowfavicon.png" alt="Plumbflow icon-only mark" className="mt-3 h-10 w-10" />
          </article>
          <article className="glass-card bg-slate-900 p-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">Dark mode version</p>
            <div className="mt-3 flex items-center gap-2">
              <img src="/images/plumbflowfavicon.png" alt="Plumbflow dark mode mark" className="h-8 w-8 rounded" />
              <span className="text-lg font-bold text-white">Plumbflow</span>
            </div>
          </article>
          <article className="glass-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Monochrome</p>
            <div className="mt-3 rounded-lg bg-slate-100 p-3 text-center text-lg font-bold text-slate-700">PF</div>
          </article>
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-7 text-center sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Final CTA</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">Start booking more plumbing jobs this week.</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-700">Launch the full flow now and adapt pricing, plans, and automations as your team grows.</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="/account/register"
              className="cta-primary"
              onClick={() => handleCtaClick("cta-final")}
            >
              Create account
            </a>
            <a
              href="/admin/login"
              className="cta-secondary"
              onClick={() => handleCtaClick("cta-admin")}
            >
              Open admin demo
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}


"use client";

import { useState } from "react";
import { createBookingAction } from "@/lib/booking-actions";

export default function PublicBookingForm({ tenant }: { tenant: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);

    // Automatically append the tenantId to the form data
    formData.append("tenantId", tenant.id);

    const res = await createBookingAction(formData);

    if (res.error) {
      setError(res.error);
      setIsLoading(false);
    } else {
      setSuccess(true);
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2>
        <p className="text-slate-700">
          We have sent a confirmation to your email. {tenant.businessName} will be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Service</label>
          <select name="serviceId" required className="block w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white">
            <option value="">Select a service...</option>
            {tenant.services.map((service: any) => (
              <option key={service.id} value={service.id}>{service.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Date</label>
            <input name="date" type="date" required className="block w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Time</label>
            <input name="time" type="time" required className="block w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Your Name</label>
          <input name="name" type="text" required className="block w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500" placeholder="John Smith" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
          <input name="email" type="email" required className="block w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500" placeholder="john@example.com" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Phone</label>
          <input name="phone" type="tel" required className="block w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500" placeholder="07700 900123" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Notes (Optional)</label>
          <textarea name="notes" rows={3} className="block w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500" placeholder="Any specific details about the job..." />
        </div>
      </div>

      <button type="submit" disabled={isLoading} className="cta-primary w-full mt-6">
        {isLoading ? "Booking..." : "Confirm Booking"}
      </button>
    </form>
  );
}
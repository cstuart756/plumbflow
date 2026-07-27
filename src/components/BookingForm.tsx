"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

export default function BookingForm() {
  const { register, handleSubmit, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Booking submission failed");
      }

      if (payload?.checkoutUrl) {
        window.location.href = payload.checkoutUrl;
        return;
      }

      reset();
      alert(payload?.message || "Booking submitted!");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Booking submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <input {...register("name")} placeholder="Name" className="input" />
        <input {...register("email")} placeholder="Email" className="input" />
        <input {...register("phone")} placeholder="Phone" className="input" />
        <select {...register("service")} className="input">
          <option>Drain Cleaning</option>
          <option>Leak Repair</option>
          <option>Installation</option>
        </select>
        <input type="date" {...register("date")} className="input" />
        <input type="time" {...register("time")} className="input" />
      </div>

      <textarea {...register("notes")} placeholder="Notes (optional)" className="input min-h-28 w-full" />

      {errorMessage ? <p className="text-sm font-medium text-red-600">{errorMessage}</p> : null}

      <button className="rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white disabled:opacity-60" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Redirecting..." : "Book Now"}
      </button>
    </form>
  );
}

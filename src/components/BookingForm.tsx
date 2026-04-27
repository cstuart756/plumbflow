"use client";

import { useForm } from "react-hook-form";

export default function BookingForm() {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    await fetch("/api/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    });

    alert("Booking submitted!");
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register("name")} placeholder="Name" className="input" />
      <input {...register("email")} placeholder="Email" className="input" />
      <input {...register("phone")} placeholder="Phone" className="input" />

      <select {...register("service")} className="input">
        <option>Drain Cleaning</option>
        <option>Leak Repair</option>
        <option>Installation</option>
      </select>

      <input type="datetime-local" {...register("date")} className="input" />

      <button className="bg-blue-500 text-white p-2 rounded">
        Book Now
      </button>
    </form>
  );
}

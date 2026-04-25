"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const heroText = "Fast, Reliable Plumbing When You Need It Most";
  const heroSubtext = "Book trusted local plumbers in minutes. Emergency or scheduled.";
  const heroCta = "Book Now";
  // Example plumbing services data
  const services = [
    { name: "Leak Repair", description: "Fix leaking pipes, faucets, and toilets." },
    { name: "Drain Cleaning", description: "Clear clogged drains and pipes." },
    { name: "Water Heater Installation", description: "Install or replace water heaters." },
    { name: "Emergency Plumbing", description: "24/7 emergency plumbing services." },
    { name: "Pipe Replacement", description: "Replace old or damaged pipes." },
    { name: "Bathroom Remodeling", description: "Upgrade and remodel your bathroom plumbing." },
  ];

  // Reviews system (localStorage for demo)
  type Review = { name: string; rating: string; comment: string; date: string };
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewForm, setReviewForm] = useState({ name: "", rating: "5", comment: "" });
  const [reviewSuccess, setReviewSuccess] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("plumbflow_reviews");
      if (stored) setReviews(JSON.parse(stored));
    }
  }, []);

  const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });
  };

  const handleReviewSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newReview: Review = { ...reviewForm, date: new Date().toISOString() };
    const updated = [newReview, ...reviews];
    setReviews(updated);
    setReviewForm({ name: "", rating: "5", comment: "" });
    setReviewSuccess("Thank you for your review!");
    if (typeof window !== "undefined") {
      localStorage.setItem("plumbflow_reviews", JSON.stringify(updated));
    }
    setTimeout(() => setReviewSuccess(""), 2000);
  };

  return (
    <main className="min-h-screen bg-blue-50 dark:bg-dark font-sans">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <section className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold mb-4 text-primary" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>{heroText}</h1>
          <p className="text-lg mb-6 text-blue-900 dark:text-blue-200">{heroSubtext}</p>
          <a href="#booking" className="inline-block px-8 py-3 bg-accent text-white font-semibold rounded-lg shadow hover:bg-green-600 transition">{heroCta}</a>
        </section>
        <h1 className="text-4xl font-bold mb-8 text-blue-900 dark:text-blue-200">Our Plumbing Services</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl mb-16">
          {services.map((service) => (
            <div key={service.name} className="rounded-lg shadow-md bg-white dark:bg-zinc-900 p-6 border border-zinc-200 dark:border-zinc-800">
              <h2 className="text-2xl font-semibold mb-2 text-blue-800 dark:text-blue-100">{service.name}</h2>
              <p className="text-zinc-700 dark:text-zinc-300">{service.description}</p>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-lg shadow-md p-8 border border-zinc-200 dark:border-zinc-800 mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800 dark:text-blue-100">Contact Us</h2>
          <form className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className="p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows={4}
              className="p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              required
            />
            <button
              type="submit"
              className="mt-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Appointment Booking Form */}
        <div className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-lg shadow-md p-8 border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800 dark:text-blue-100">Book an Appointment</h2>
          <form className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className="p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Your Phone Number"
              className="p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              required
            />
            <input
              type="date"
              name="date"
              className="p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              required
            />
            <input
              type="time"
              name="time"
              className="p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              required
            />
            <select
              name="service"
              className="p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              required
            >
              <option value="">Select Service</option>
              {services.map((service) => (
                <option key={service.name} value={service.name}>{service.name}</option>
              ))}
            </select>
            <button
              type="submit"
              className="mt-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-6 rounded"
            >
              Book Appointment
            </button>
          </form>
          <div className="mt-6">
            <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-2">Test payments enabled. No real charges will be made.</p>
            <button
              type="button"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded"
              onClick={() => alert('Stripe test payment flow placeholder. Connect Stripe API for real payments.')}
            >
              Pay with Stripe (Test Mode)
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

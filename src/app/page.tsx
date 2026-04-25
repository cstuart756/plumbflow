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

  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    service: "",
  });
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingMessage, setBookingMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [lastBookingId, setLastBookingId] = useState<string | null>(null);

  const [manageLookup, setManageLookup] = useState({ bookingId: "", email: "" });
  const [manageLoading, setManageLoading] = useState(false);
  const [manageMessage, setManageMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [managedBooking, setManagedBooking] = useState<null | {
    id: string;
    name: string;
    email: string;
    phone: string;
    service: string;
    date: string;
    time: string;
    notes: string | null;
    status: string;
  }>(null);
  const [manageEdit, setManageEdit] = useState({ name: "", phone: "", service: "", date: "", time: "", notes: "" });

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

  const handleBookingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
  };

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBookingMessage(null);
    setBookingSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingForm),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setBookingMessage({ type: "error", text: data?.error ?? "Booking failed" });
        return;
      }

      setBookingForm({ name: "", email: "", phone: "", date: "", time: "", service: "" });
      const bookingId = String(data?.bookingId ?? "");
      setLastBookingId(bookingId || null);
      setBookingMessage({ type: "success", text: "Booking received — we’ll be in touch shortly." });
    } finally {
      setBookingSubmitting(false);
    }
  };

  const handleManageLookup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setManageMessage(null);
    setManageLoading(true);
    setManagedBooking(null);
    try {
      const id = manageLookup.bookingId.trim();
      const email = manageLookup.email.trim();
      const res = await fetch(`/api/bookings/${encodeURIComponent(id)}?email=${encodeURIComponent(email)}`, {
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setManageMessage({ type: "error", text: data?.error ?? "Booking not found" });
        return;
      }
      setManagedBooking(data.booking);
      setManageEdit({
        name: data.booking.name,
        phone: data.booking.phone,
        service: data.booking.service,
        date: data.booking.date,
        time: data.booking.time,
        notes: data.booking.notes ?? "",
      });
      setManageMessage({ type: "success", text: "Booking loaded." });
    } finally {
      setManageLoading(false);
    }
  };

  const handleManageSave = async () => {
    if (!managedBooking) return;
    setManageMessage(null);
    setManageLoading(true);
    try {
      const res = await fetch(`/api/bookings/${encodeURIComponent(managedBooking.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: manageLookup.email,
          name: manageEdit.name,
          phone: manageEdit.phone,
          service: manageEdit.service,
          date: manageEdit.date,
          time: manageEdit.time,
          notes: manageEdit.notes,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setManageMessage({ type: "error", text: data?.error ?? "Update failed" });
        return;
      }
      setManagedBooking(data.booking);
      setManageMessage({ type: "success", text: "Booking updated." });
    } finally {
      setManageLoading(false);
    }
  };

  const handleManageCancel = async () => {
    if (!managedBooking) return;
    const ok = window.confirm("Cancel this booking? This cannot be undone.");
    if (!ok) return;
    setManageMessage(null);
    setManageLoading(true);
    try {
      const res = await fetch(`/api/bookings/${encodeURIComponent(managedBooking.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: manageLookup.email, cancel: true }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setManageMessage({ type: "error", text: data?.error ?? "Cancel failed" });
        return;
      }
      setManagedBooking(data.booking);
      setManageMessage({ type: "success", text: "Booking canceled." });
    } finally {
      setManageLoading(false);
    }
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
        <div id="booking" className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-lg shadow-md p-8 border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800 dark:text-blue-100">Book an Appointment</h2>
          <form className="flex flex-col gap-4" onSubmit={handleBookingSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={bookingForm.name}
              onChange={handleBookingChange}
              className="p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={bookingForm.email}
              onChange={handleBookingChange}
              className="p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Your Phone Number"
              value={bookingForm.phone}
              onChange={handleBookingChange}
              className="p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              required
            />
            <input
              type="date"
              name="date"
              value={bookingForm.date}
              onChange={handleBookingChange}
              className="p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              required
            />
            <input
              type="time"
              name="time"
              value={bookingForm.time}
              onChange={handleBookingChange}
              className="p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              required
            />
            <select
              name="service"
              value={bookingForm.service}
              onChange={handleBookingChange}
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
              className="mt-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-6 rounded disabled:opacity-60"
              disabled={bookingSubmitting}
            >
              {bookingSubmitting ? "Booking..." : "Book Appointment"}
            </button>

            {bookingMessage?.type === "success" && lastBookingId ? (
              <div className="text-sm border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 rounded p-3">
                <div className="text-green-700 dark:text-green-300">{bookingMessage.text}</div>
                <div className="mt-2 text-zinc-700 dark:text-zinc-300">
                  Save this booking ID to manage or cancel later:
                  <div className="mt-1">
                    <span className="font-mono px-2 py-1 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700">
                      {lastBookingId}
                    </span>
                  </div>
                </div>
              </div>
            ) : bookingMessage ? (
              <div className="text-red-700 dark:text-red-300 text-sm">{bookingMessage.text}</div>
            ) : null}
          </form>
        </div>

        <div className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-lg shadow-md p-8 border border-zinc-200 dark:border-zinc-800 mt-12">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800 dark:text-blue-100">Manage Your Booking</h2>
          <form className="flex flex-col gap-4" onSubmit={handleManageLookup}>
            <input
              type="text"
              name="bookingId"
              placeholder="Booking ID"
              value={manageLookup.bookingId}
              onChange={(e) => setManageLookup({ ...manageLookup, bookingId: e.target.value })}
              className="p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email used for booking"
              value={manageLookup.email}
              onChange={(e) => setManageLookup({ ...manageLookup, email: e.target.value })}
              className="p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              required
            />
            <button
              type="submit"
              className="mt-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded disabled:opacity-60"
              disabled={manageLoading}
            >
              {manageLoading ? "Loading..." : "Load Booking"}
            </button>
          </form>

          {manageMessage && (
            <div
              className={
                manageMessage.type === "success"
                  ? "mt-4 text-green-700 dark:text-green-300 text-sm"
                  : "mt-4 text-red-700 dark:text-red-300 text-sm"
              }
            >
              {manageMessage.text}
            </div>
          )}

          {managedBooking && (
            <div className="mt-6">
              <div className="text-sm text-zinc-700 dark:text-zinc-300 mb-4">
                Status: <span className="font-semibold">{managedBooking.status}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={manageEdit.name}
                  onChange={(e) => setManageEdit({ ...manageEdit, name: e.target.value })}
                  className="p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  placeholder="Name"
                />
                <input
                  type="tel"
                  value={manageEdit.phone}
                  onChange={(e) => setManageEdit({ ...manageEdit, phone: e.target.value })}
                  className="p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  placeholder="Phone"
                />
                <select
                  value={manageEdit.service}
                  onChange={(e) => setManageEdit({ ...manageEdit, service: e.target.value })}
                  className="p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                >
                  {services.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={manageEdit.date}
                  onChange={(e) => setManageEdit({ ...manageEdit, date: e.target.value })}
                  className="p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                />
                <input
                  type="time"
                  value={manageEdit.time}
                  onChange={(e) => setManageEdit({ ...manageEdit, time: e.target.value })}
                  className="p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                />
              </div>
              <textarea
                className="mt-4 w-full p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                rows={3}
                value={manageEdit.notes}
                onChange={(e) => setManageEdit({ ...manageEdit, notes: e.target.value })}
                placeholder="Notes (optional)"
              />
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleManageSave}
                  className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-6 rounded disabled:opacity-60"
                  disabled={manageLoading}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleManageCancel}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded disabled:opacity-60"
                  disabled={manageLoading || managedBooking.status === "CANCELED"}
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

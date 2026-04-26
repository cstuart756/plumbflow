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
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    if (!payment) return;

    const cleaned = `${window.location.pathname}${window.location.hash}`;
    window.history.replaceState({}, "", cleaned);
  }, []);

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
      const res = await fetch("/api/checkout", {
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
      setBookingMessage({ type: "success", text: "Redirecting to secure payment..." });

      const url = String(data?.checkoutUrl ?? "");
      if (url) {
        window.location.assign(url);
      }
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

  const panelClass =
    "glass-card w-full max-w-xl rounded-2xl p-8 lg:p-10";
  const inputClass =
    "w-full rounded-xl border bg-white/85 dark:bg-slate-900/70 px-4 py-3 text-zinc-900 dark:text-zinc-100";
  const primaryButtonClass =
    "mt-2 rounded-xl bg-[var(--brand)] px-6 py-3 font-semibold text-white hover:bg-[var(--brand-strong)] disabled:opacity-60";

  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const redirectPayment = searchParams?.get("payment");
  const redirectBookingId = searchParams?.get("bookingId");
  const resolvedBookingId = lastBookingId ?? redirectBookingId;
  const resolvedBookingMessage =
    bookingMessage ??
    (redirectPayment === "success"
      ? { type: "success", text: "Payment successful - your booking is confirmed." as const }
      : redirectPayment === "cancel"
        ? {
            type: "error",
            text: "Payment canceled - your booking is not confirmed until payment is completed." as const,
          }
        : null);

  return (
    <main className="min-h-screen font-sans">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
        <section className="mb-12 text-center sm:mb-14">
          <span className="mb-5 inline-flex rounded-full border border-sky-200 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sky-700 dark:border-sky-800 dark:bg-slate-900/70 dark:text-sky-300">
            Licensed Local Pros | Same-Day Availability
          </span>
          <h1 className="mb-4 text-4xl font-extrabold leading-tight text-slate-900 dark:text-slate-100 sm:text-5xl lg:text-6xl">{heroText}</h1>
          <p className="mx-auto mb-7 max-w-2xl text-base text-slate-700 dark:text-slate-300 sm:text-lg">{heroSubtext}</p>
          <a href="#booking" className="inline-block rounded-xl bg-[var(--accent)] px-8 py-3 font-semibold text-white shadow-lg shadow-emerald-900/20 hover:translate-y-[-1px] hover:brightness-95">{heroCta}</a>
        </section>
        <h2 className="mb-8 text-3xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl">Our Plumbing Services</h2>
        <div className="mb-16 grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          {services.map((service) => (
            <div key={service.name} className="glass-card rounded-2xl p-6 hover:translate-y-[-2px]">
              <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-slate-100">{service.name}</h3>
              <p className="text-zinc-700 dark:text-zinc-300">{service.description}</p>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className={`${panelClass} mb-12`}>
          <h2 className="mb-4 text-2xl font-semibold text-slate-900 dark:text-slate-100">Contact Us</h2>
          <form className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className={inputClass}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className={inputClass}
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows={4}
              className={inputClass}
              required
            />
            <button
              type="submit"
              className={primaryButtonClass}
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Appointment Booking Form */}
        <div id="booking" className={panelClass}>
          <h2 className="mb-4 text-2xl font-semibold text-slate-900 dark:text-slate-100">Book an Appointment</h2>
          <form className="flex flex-col gap-4" onSubmit={handleBookingSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={bookingForm.name}
              onChange={handleBookingChange}
              className={inputClass}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={bookingForm.email}
              onChange={handleBookingChange}
              className={inputClass}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Your Phone Number"
              value={bookingForm.phone}
              onChange={handleBookingChange}
              className={inputClass}
              required
            />
            <input
              type="date"
              name="date"
              value={bookingForm.date}
              onChange={handleBookingChange}
              className={inputClass}
              required
            />
            <input
              type="time"
              name="time"
              value={bookingForm.time}
              onChange={handleBookingChange}
              className={inputClass}
              required
            />
            <select
              name="service"
              value={bookingForm.service}
              onChange={handleBookingChange}
              className={inputClass}
              required
            >
              <option value="">Select Service</option>
              {services.map((service) => (
                <option key={service.name} value={service.name}>{service.name}</option>
              ))}
            </select>
            <button
              type="submit"
              className="mt-2 rounded-xl bg-[var(--accent)] px-6 py-3 font-semibold text-white hover:brightness-95 disabled:opacity-60"
              disabled={bookingSubmitting}
            >
              {bookingSubmitting ? "Booking..." : "Book Appointment"}
            </button>

            {resolvedBookingMessage && resolvedBookingId ? (
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm dark:border-zinc-700 dark:bg-zinc-800/80">
                <div
                  className={
                    resolvedBookingMessage.type === "success"
                      ? "text-green-700 dark:text-green-300"
                      : "text-red-700 dark:text-red-300"
                  }
                >
                  {resolvedBookingMessage.text}
                </div>
                <div className="mt-2 text-zinc-700 dark:text-zinc-300">
                  Save this booking ID to manage or cancel later:
                  <div className="mt-1">
                    <span className="rounded-md border border-zinc-200 bg-white px-2 py-1 font-mono dark:border-zinc-700 dark:bg-zinc-900">
                      {resolvedBookingId}
                    </span>
                  </div>
                </div>
              </div>
            ) : resolvedBookingMessage ? (
              <div
                className={
                  resolvedBookingMessage.type === "success"
                    ? "text-green-700 dark:text-green-300 text-sm"
                    : "text-red-700 dark:text-red-300 text-sm"
                }
              >
                {resolvedBookingMessage.text}
              </div>
            ) : null}
          </form>
        </div>

        <div className={`${panelClass} mt-12`}>
          <h2 className="mb-4 text-2xl font-semibold text-slate-900 dark:text-slate-100">Manage Your Booking</h2>
          <form className="flex flex-col gap-4" onSubmit={handleManageLookup}>
            <input
              type="text"
              name="bookingId"
              placeholder="Booking ID"
              value={manageLookup.bookingId}
              onChange={(e) => setManageLookup({ ...manageLookup, bookingId: e.target.value })}
              className={inputClass}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email used for booking"
              value={manageLookup.email}
              onChange={(e) => setManageLookup({ ...manageLookup, email: e.target.value })}
              className={inputClass}
              required
            />
            <button
              type="submit"
              className={primaryButtonClass}
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
                  className={inputClass}
                  placeholder="Name"
                />
                <input
                  type="tel"
                  value={manageEdit.phone}
                  onChange={(e) => setManageEdit({ ...manageEdit, phone: e.target.value })}
                  className={inputClass}
                  placeholder="Phone"
                />
                <select
                  value={manageEdit.service}
                  onChange={(e) => setManageEdit({ ...manageEdit, service: e.target.value })}
                  className={inputClass}
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
                  className={inputClass}
                />
                <input
                  type="time"
                  value={manageEdit.time}
                  onChange={(e) => setManageEdit({ ...manageEdit, time: e.target.value })}
                  className={inputClass}
                />
              </div>
              <textarea
                className={`${inputClass} mt-4`}
                rows={3}
                value={manageEdit.notes}
                onChange={(e) => setManageEdit({ ...manageEdit, notes: e.target.value })}
                placeholder="Notes (optional)"
              />
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleManageSave}
                  className="rounded-xl bg-[var(--accent)] px-6 py-3 font-semibold text-white hover:brightness-95 disabled:opacity-60"
                  disabled={manageLoading}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleManageCancel}
                  className="rounded-xl bg-[var(--danger)] px-6 py-3 font-semibold text-white hover:brightness-95 disabled:opacity-60"
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


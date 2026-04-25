"use client";

import { useMemo, useState } from "react";

type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELED";

type Booking = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  notes: string | null;
  status: BookingStatus;
};

const SERVICES = [
  "Leak Repair",
  "Drain Cleaning",
  "Water Heater Installation",
  "Emergency Plumbing",
  "Pipe Replacement",
  "Bathroom Remodeling",
];

const STATUSES: BookingStatus[] = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELED"];

export function AdminBookingsClient(props: { initialBookings: Booking[] }) {
  const [bookings, setBookings] = useState<Booking[]>(props.initialBookings);
  const [loading, setLoading] = useState(false);
  const [rowBusyId, setRowBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const emptyForm = useMemo(
    () => ({
      id: null as string | null,
      name: "",
      email: "",
      phone: "",
      service: "",
      date: "",
      time: "",
      notes: "",
      status: "PENDING" as BookingStatus,
    }),
    []
  );

  const [form, setForm] = useState(emptyForm);

  const refresh = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/bookings", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ type: "error", text: data?.error ?? "Failed to load bookings" });
        return;
      }
      setBookings(data.bookings ?? []);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (b: Booking) => {
    setMessage(null);
    setForm({
      id: b.id,
      name: b.name,
      email: b.email,
      phone: b.phone,
      service: b.service,
      date: b.date,
      time: b.time,
      notes: b.notes ?? "",
      status: b.status,
    });
  };

  const cancelEdit = () => setForm(emptyForm);

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      service: form.service,
      date: form.date,
      time: form.time,
      notes: form.notes || null,
      status: form.status,
    };

    if (!form.id) {
      setRowBusyId("__new__");
      try {
        const res = await fetch("/api/admin/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setMessage({ type: "error", text: data?.error ?? "Failed to create booking" });
          return;
        }
        setBookings((prev) => [data.booking, ...prev]);
        setForm(emptyForm);
        setMessage({ type: "success", text: "Booking created." });
      } finally {
        setRowBusyId(null);
      }
      return;
    }

    setRowBusyId(form.id);
    try {
      const res = await fetch(`/api/admin/bookings/${form.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ type: "error", text: data?.error ?? "Failed to update booking" });
        return;
      }
      setBookings((prev) => prev.map((b) => (b.id === form.id ? data.booking : b)));
      setForm(emptyForm);
      setMessage({ type: "success", text: "Booking updated." });
    } finally {
      setRowBusyId(null);
    }
  };

  const updateStatus = async (id: string, status: BookingStatus) => {
    setRowBusyId(id);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ type: "error", text: data?.error ?? "Failed to update status" });
        return;
      }
      setBookings((prev) => prev.map((b) => (b.id === id ? data.booking : b)));
    } finally {
      setRowBusyId(null);
    }
  };

  const deleteBooking = async (id: string) => {
    const ok = window.confirm("Delete this booking? This cannot be undone.");
    if (!ok) return;

    setRowBusyId(id);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ type: "error", text: data?.error ?? "Failed to delete booking" });
        return;
      }
      setBookings((prev) => prev.filter((b) => b.id !== id));
      if (form.id === id) setForm(emptyForm);
    } finally {
      setRowBusyId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={refresh}
          className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
        <div className="text-sm text-zinc-600 dark:text-zinc-300">Showing {bookings.length} bookings</div>
      </div>

      {message && (
        <div
          className={
            message.type === "success"
              ? "mb-6 text-green-700 dark:text-green-300"
              : "mb-6 text-red-700 dark:text-red-300"
          }
        >
          {message.text}
        </div>
      )}

      <div className="mb-10 max-w-2xl bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-semibold mb-4 text-blue-800 dark:text-blue-100">
          {form.id ? "Edit Booking" : "Add Booking"}
        </h2>
        <form className="flex flex-col gap-4" onSubmit={submitForm}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              required
            />
            <select
              name="service"
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
              className="p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              required
            >
              <option value="">Select Service</option>
              {SERVICES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              required
            />
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              required
            />
            <select
              name="status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as BookingStatus })}
              className="p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              required
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <textarea
            name="notes"
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={3}
            className="p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-6 rounded disabled:opacity-60"
              disabled={rowBusyId === "__new__" || (form.id ? rowBusyId === form.id : false)}
            >
              {form.id ? "Save Changes" : "Create Booking"}
            </button>

            {form.id && (
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-6 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {bookings.length === 0 ? (
        <div className="max-w-2xl bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200">
          No bookings yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-zinc-900 rounded shadow-md">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Created</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Phone</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Time</th>
                <th className="px-4 py-2 border">Service</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className={rowBusyId === b.id ? "opacity-70" : ""}>
                  <td className="px-4 py-2 border whitespace-nowrap">{new Date(b.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-2 border">{b.name}</td>
                  <td className="px-4 py-2 border">{b.email}</td>
                  <td className="px-4 py-2 border">{b.phone}</td>
                  <td className="px-4 py-2 border whitespace-nowrap">{b.date}</td>
                  <td className="px-4 py-2 border whitespace-nowrap">{b.time}</td>
                  <td className="px-4 py-2 border">{b.service}</td>
                  <td className="px-4 py-2 border whitespace-nowrap">
                    <select
                      value={b.status}
                      onChange={(e) => updateStatus(b.id, e.target.value as BookingStatus)}
                      className="p-2 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                      disabled={rowBusyId === b.id}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 border whitespace-nowrap">
                    <button
                      type="button"
                      className="mr-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-60"
                      onClick={() => startEdit(b)}
                      disabled={rowBusyId === b.id}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded disabled:opacity-60"
                      onClick={() => deleteBooking(b.id)}
                      disabled={rowBusyId === b.id}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

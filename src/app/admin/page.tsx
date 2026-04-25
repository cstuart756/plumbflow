import { useMemo } from "react";
  // Availability Calendar (current month)
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const bookedDates = useMemo(() => bookings.map(b => b.date), [bookings]);
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
    return {
      day: i + 1,
      dateStr,
      booked: bookedDates.includes(dateStr),
    };
  });
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const initialBookings = [
  {
    id: 1,
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "555-1234",
    date: "2026-04-22",
    time: "10:00",
    service: "Leak Repair",
  },
  {
    id: 2,
    name: "John Smith",
    email: "john@example.com",
    phone: "555-5678",
    date: "2026-04-23",
    time: "14:30",
    service: "Drain Cleaning",
  },
];

const services = [
  "Leak Repair",
  "Drain Cleaning",
  "Water Heater Installation",
  "Emergency Plumbing",
  "Pipe Replacement",
  "Bathroom Remodeling",
];


  const [bookings, setBookings] = useState(initialBookings);
  const [form, setForm] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    service: "",
  });
  const [editingId, setEditingId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedIn = localStorage.getItem("admin_logged_in");
      if (loggedIn !== "true") {
        router.replace("/admin/login");
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in");
    router.replace("/admin/login");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setBookings((prev) =>
        prev.map((b) => (b.id === editingId ? { ...form, id: editingId } : b))
      );
      setEditingId(null);
    } else {
      setBookings((prev) => [
        ...prev,
        { ...form, id: Date.now() },
      ]);
    }
    setForm({ id: null, name: "", email: "", phone: "", date: "", time: "", service: "" });
  };

  const handleEdit = (booking) => {
    setForm(booking);
    setEditingId(booking.id);
  };

  const handleDelete = (id) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    if (editingId === id) {
      setForm({ id: null, name: "", email: "", phone: "", date: "", time: "", service: "" });
      setEditingId(null);
    }
  };

  // Dashboard analytics
  const totalBookings = bookings.length;
  const bookingsPerService = services.map((service) => ({
    service,
    count: bookings.filter((b) => b.service === service).length,
  }));

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-200">Admin: Manage Bookings</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded"
        >
          Logout
        </button>
      </div>

      {/* Dashboard Analytics */}
      <div className="mb-8 max-w-2xl bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-semibold mb-4 text-blue-800 dark:text-blue-100">Dashboard Analytics</h2>
        <div className="mb-2 text-lg">Total Bookings: <span className="font-bold">{totalBookings}</span></div>
        <div>
          <h3 className="font-semibold mb-2">Bookings per Service:</h3>
          <ul className="list-disc ml-6">
            {bookingsPerService.map(({ service, count }) => (
              <li key={service}>{service}: <span className="font-bold">{count}</span></li>
            ))}
          </ul>
        </div>
      </div>

      {/* Availability Calendar */}
      <div className="mb-8 max-w-2xl bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-semibold mb-4 text-blue-800 dark:text-blue-100">Availability Calendar (Current Month)</h2>
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map(({ day, dateStr, booked }) => (
            <div
              key={dateStr}
              className={`flex flex-col items-center justify-center h-12 w-12 rounded border text-sm font-medium ${booked ? "bg-red-200 dark:bg-red-700 text-red-900 dark:text-red-100 border-red-400" : "bg-green-100 dark:bg-green-800 text-green-900 dark:text-green-100 border-green-400"}`}
              title={dateStr + (booked ? " (Booked)" : " (Available)")}
            >
              {day}
            </div>
          ))}
        </div>
        <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-300">
          <span className="inline-block h-3 w-3 rounded bg-red-200 dark:bg-red-700 mr-1 align-middle"></span> Booked
          <span className="inline-block h-3 w-3 rounded bg-green-100 dark:bg-green-800 ml-4 mr-1 align-middle"></span> Available
        </div>
      </div>

      {/* Booking Form */}
      <div className="mb-8 max-w-xl bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-semibold mb-4 text-blue-800 dark:text-blue-100">{editingId ? "Edit Booking" : "Add Booking"}</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            required
          />
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            required
          />
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            className="p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            required
          />
          <select
            name="service"
            value={form.service}
            onChange={handleChange}
            className="p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            required
          >
            <option value="">Select Service</option>
            {services.map((service) => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
          <button
            type="submit"
            className="mt-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-6 rounded"
          >
            {editingId ? "Update Booking" : "Add Booking"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => { setForm({ id: null, name: "", email: "", phone: "", date: "", time: "", service: "" }); setEditingId(null); }}
              className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-6 rounded"
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-zinc-900 rounded shadow-md">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Time</th>
              <th className="px-4 py-2 border">Service</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="px-4 py-2 border">{booking.name}</td>
                <td className="px-4 py-2 border">{booking.email}</td>
                <td className="px-4 py-2 border">{booking.phone}</td>
                <td className="px-4 py-2 border">{booking.date}</td>
                <td className="px-4 py-2 border">{booking.time}</td>
                <td className="px-4 py-2 border">{booking.service}</td>
                <td className="px-4 py-2 border">
                  <button
                    className="mr-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                    onClick={() => handleEdit(booking)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                    onClick={() => handleDelete(booking.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

interface CustomerBooking {
  id: string;
  service: string;
  date: string;
  time: string;
  status: string;
}

interface CustomerInvoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  status: string;
  paidAt?: string;
}

export default function CustomerPortal() {
  const [bookings, setBookings] = useState<CustomerBooking[]>([]);
  const [invoices, setInvoices] = useState<CustomerInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomerData() {
      try {
        // Fetch customer bookings
        const bookingsRes = await fetch("/api/customer/bookings");
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData);

        // Fetch customer invoices
        const invoicesRes = await fetch("/api/customer/invoices");
        const invoicesData = await invoicesRes.json();
        setInvoices(invoicesData);
      } catch (error) {
        console.error("Failed to fetch customer data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCustomerData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading your account...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">My Account</h1>

        {/* Upcoming Bookings */}
        <section className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Upcoming Bookings</h2>
          {bookings.length === 0 ? (
            <p className="text-slate-600">No upcoming bookings. Schedule one now!</p>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="border rounded-lg p-4 hover:bg-slate-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{booking.service}</h3>
                      <p className="text-slate-600">
                        {booking.date} at {booking.time}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === "CONFIRMED"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Invoices & Payment History */}
        <section className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Invoices & Payments</h2>
          {invoices.length === 0 ? (
            <p className="text-slate-600">No invoices yet.</p>
          ) : (
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2 font-semibold">Invoice #</th>
                  <th className="text-left py-2 font-semibold">Amount</th>
                  <th className="text-left py-2 font-semibold">Due Date</th>
                  <th className="text-left py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b hover:bg-slate-50">
                    <td className="py-3">{invoice.invoiceNumber}</td>
                    <td className="py-3">${(invoice.amount / 100).toFixed(2)}</td>
                    <td className="py-3">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          invoice.status === "PAID"
                            ? "bg-green-100 text-green-800"
                            : invoice.status === "OVERDUE"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Subscription Info */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Subscription</h2>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-600">Current Plan</p>
              <p className="text-2xl font-bold">Pro</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Upgrade Plan
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

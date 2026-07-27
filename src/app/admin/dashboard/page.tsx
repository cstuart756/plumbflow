"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface DashboardMetrics {
  leads: { total: number; hot: number };
  bookings: number;
  revenue: number;
}

interface Lead {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  status: string;
  quality: string;
  funnelScore: number;
  lastInteractionAt: string;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        // Fetch metrics
        const metricsRes = await fetch("/api/admin/dashboard?action=metrics");
        const metricsData = await metricsRes.json();
        setMetrics(metricsData);

        // Fetch leads
        const leadsRes = await fetch("/api/admin/dashboard?action=leads");
        const leadsData = await leadsRes.json();
        setLeads(leadsData);
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Admin</p>
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin" className="rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white">
              Bookings Manager
            </Link>
            <Link href="/admin/login" className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-900">
              Login
            </Link>
          </div>
        </div>

        {/* Metrics Overview */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-slate-600">Total Leads</div>
              <div className="text-3xl font-bold">{metrics.leads.total}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-slate-600">Hot Leads</div>
              <div className="text-3xl font-bold text-red-600">{metrics.leads.hot}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-slate-600">Confirmed Bookings</div>
              <div className="text-3xl font-bold">{metrics.bookings}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-slate-600">Revenue</div>
              <div className="text-3xl font-bold">${(metrics.revenue / 100).toFixed(2)}</div>
            </div>
          </div>
        )}

        {/* Leads Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">Top Leads by Score</h2>
          </div>
          {leads.length === 0 ? (
            <div className="p-6 text-sm text-slate-600">No leads yet. Capture a demo or booking to populate this table.</div>
          ) : null}
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Quality</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Score</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Last Interaction</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-t hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm">{lead.email}</td>
                  <td className="px-6 py-4 text-sm">{lead.firstName} {lead.lastName}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        lead.quality === "HOT"
                          ? "bg-red-100 text-red-800"
                          : lead.quality === "WARM"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {lead.quality}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold">{lead.funnelScore}</td>
                  <td className="px-6 py-4 text-sm">{lead.status}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(lead.lastInteractionAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { track, identifyUser } from "@/lib/analytics";

interface DemoGateProps {
  onUnlock: () => void;
}

export default function DemoGate({ onUnlock }: DemoGateProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      // Store email locally
      if (typeof window !== "undefined") {
        localStorage.setItem("demo_email", email);
      }

      // Identify in PostHog
      identifyUser(email);
      track("demo_email_captured", { email });

      // Send to backend
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error("Failed to capture email");
      }

      // Unlock demo
      onUnlock();
    } catch (err) {
      console.error("Demo gate error:", err);
      setError("Failed to continue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm rounded-2xl border border-white/70 bg-gradient-to-b from-white to-slate-50 p-8 text-center shadow-lg">
      <h2 className="text-2xl font-bold text-slate-900">Try the Demo</h2>
      <p className="mt-2 text-sm text-slate-600">
        See how Plumbflow works with real booking data.
      </p>

      <form className="mt-6 flex flex-col gap-3" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          required
          disabled={loading}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Unlocking..." : "Continue to Demo"}
        </button>
      </form>

      <p className="mt-4 text-xs text-slate-500">
        We'll send you a summary of the demo experience.
      </p>
    </div>
  );
}

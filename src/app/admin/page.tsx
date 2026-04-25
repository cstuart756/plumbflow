import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdminCookieName, verifyAdminCookieValue } from "@/lib/adminAuth";

export const runtime = "nodejs";

export default async function AdminPage() {
  const cookieValue = cookies().get(getAdminCookieName())?.value;
  if (!verifyAdminCookieValue(cookieValue)) {
    redirect("/admin/login");
  }

  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-200">Admin: Bookings</h1>
        <form action="/api/admin/logout" method="post">
          <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded" type="submit">
            Logout
          </button>
        </form>
      </div>

      <div className="mb-6 max-w-2xl bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-800">
        <div className="text-lg">
          Total Bookings: <span className="font-bold">{bookings.length}</span>
        </div>
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
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td className="px-4 py-2 border whitespace-nowrap">
                    {new Date(b.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border">{b.name}</td>
                  <td className="px-4 py-2 border">{b.email}</td>
                  <td className="px-4 py-2 border">{b.phone}</td>
                  <td className="px-4 py-2 border whitespace-nowrap">{b.date}</td>
                  <td className="px-4 py-2 border whitespace-nowrap">{b.time}</td>
                  <td className="px-4 py-2 border">{b.service}</td>
                  <td className="px-4 py-2 border whitespace-nowrap">{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

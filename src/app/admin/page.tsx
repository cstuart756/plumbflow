import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdminCookieName, verifyAdminCookieValue } from "@/lib/adminAuth";
import { AdminBookingsClient } from "@/app/admin/AdminBookingsClient";

export const runtime = "nodejs";

export default async function AdminPage() {
  const cookieValue = cookies().get(getAdminCookieName())?.value;
  if (!verifyAdminCookieValue(cookieValue)) {
    redirect("/admin/login");
  }

  let bookings: any[] = [];
  try {
    const rows = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: 500,
    });
    bookings = rows.map((b) => ({
      ...b,
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
    }));
  } catch {
    bookings = [];
  }

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

      <AdminBookingsClient initialBookings={bookings} />
    </main>
  );
}

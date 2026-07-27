/**
 * Customer Portal API Routes
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// GET /api/customer/bookings
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const path = url.pathname;

    if (path.includes("/api/customer/bookings")) {
      // TODO: Get current user ID from session/auth
      const userId = "user_123"; // Placeholder

      const bookings = await prisma.booking.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        select: {
          id: true,
          service: true,
          date: true,
          time: true,
          status: true,
        },
      });

      return NextResponse.json(bookings);
    }

    if (path.includes("/api/customer/invoices")) {
      const userId = "user_123"; // Placeholder

      const invoices = await prisma.invoice.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json(invoices);
    }

    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (error) {
    console.error("[CUSTOMER] Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

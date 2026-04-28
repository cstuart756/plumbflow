/**
 * Admin Dashboard API for managing leads, bookings, and funnel metrics
 */

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const runtime = "nodejs";

/**
 * GET /api/admin/dashboard
 * Fetch dashboard metrics: leads, bookings, funnel overview
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    if (action === "metrics") {
      // Overall metrics
      const [leadCount, hotLeads, bookings, revenue] = await Promise.all([
        prisma.lead.count(),
        prisma.lead.count({ where: { quality: "HOT" } }),
        prisma.booking.count({ where: { status: "CONFIRMED" } }),
        prisma.booking.aggregate({
          _sum: { amount: true },
          where: { status: "CONFIRMED", paid: true },
        }),
      ]);

      return NextResponse.json({
        leads: {
          total: leadCount,
          hot: hotLeads,
        },
        bookings: bookings,
        revenue: revenue._sum.amount || 0,
      });
    }

    if (action === "leads") {
      const leads = await prisma.lead.findMany({
        take: 50,
        orderBy: { funnelScore: "desc" },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          status: true,
          quality: true,
          funnelScore: true,
          lastInteractionAt: true,
          demoAccessedAt: true,
          bookingCompletedAt: true,
        },
      });

      return NextResponse.json(leads);
    }

    if (action === "funnel") {
      const funnel = await prisma.funnelMetric.groupBy({
        by: ["step"],
        _count: true,
        where: {
          date: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      });

      return NextResponse.json(funnel);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("[ADMIN] Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

/**
 * POST /api/admin/leads/:id/action
 * Update lead status or resend email
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { leadId, action } = body;

    if (!leadId || !action) {
      return NextResponse.json({ error: "Missing leadId or action" }, { status: 400 });
    }

    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    if (action === "update_quality") {
      const { quality } = body;
      await prisma.lead.update({
        where: { id: leadId },
        data: { quality },
      });
      return NextResponse.json({ ok: true, message: `Lead updated to ${quality}` });
    }

    if (action === "resend_email") {
      // TODO: Call email service to resend
      console.log(`[ADMIN] Resending email to ${lead.email}`);
      return NextResponse.json({ ok: true, message: "Email resend queued" });
    }

    if (action === "add_note") {
      const { note } = body;
      // TODO: Store note in database
      console.log(`[ADMIN] Note added to lead: ${note}`);
      return NextResponse.json({ ok: true, message: "Note added" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("[ADMIN] Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

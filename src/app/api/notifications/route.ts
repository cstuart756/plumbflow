/**
 * Real-time Notifications API
 * Sends WebSocket notifications to connected clients
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/**
 * GET /api/notifications - Get user notifications
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("[NOTIFICATIONS] Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

/**
 * POST /api/notifications - Create new notification
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, type, title, message, relatedId } = body;

    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        relatedId,
      },
    });

    // TODO: Send WebSocket push to connected clients
    console.log(`[NOTIFICATIONS] New notification for ${userId}: ${title}`);

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error("[NOTIFICATIONS] Error creating notification:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

/**
 * PATCH /api/notifications/:id - Mark as read
 */
export async function PATCH(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    const notification = await prisma.notification.update({
      where: { id },
      data: {
        read: true,
        readAt: new Date(),
      },
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.error("[NOTIFICATIONS] Error updating notification:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

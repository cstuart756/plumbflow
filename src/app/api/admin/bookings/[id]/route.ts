import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthed } from "@/lib/adminGuard";

export const runtime = "nodejs";

const ALLOWED_STATUSES = new Set(["PENDING", "CONFIRMED", "COMPLETED", "CANCELED"]);

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const data: Record<string, any> = {};

  if (body?.name !== undefined) data.name = String(body.name).trim();
  if (body?.email !== undefined) data.email = String(body.email).trim();
  if (body?.phone !== undefined) data.phone = String(body.phone).trim();
  if (body?.service !== undefined) data.service = String(body.service).trim();
  if (body?.date !== undefined) data.date = String(body.date).trim();
  if (body?.time !== undefined) data.time = String(body.time).trim();
  if (body?.notes !== undefined) data.notes = body.notes ? String(body.notes).trim() : null;
  if (body?.status !== undefined) {
    const status = String(body.status).trim();
    if (!ALLOWED_STATUSES.has(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    data.status = status;
  }

  if (data.email && !isValidEmail(data.email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  for (const requiredKey of ["name", "email", "phone", "service", "date", "time"]) {
    if (requiredKey in data && !data[requiredKey]) {
      return NextResponse.json({ error: `Missing ${requiredKey}` }, { status: 400 });
    }
  }

  try {
    const booking = await prisma.booking.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      ok: true,
      booking: {
        ...booking,
        createdAt: booking.createdAt.toISOString(),
        updatedAt: booking.updatedAt.toISOString(),
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    await prisma.booking.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
  }
}

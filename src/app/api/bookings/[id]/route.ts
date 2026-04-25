import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeEmail(value: string | null): string {
  return String(value ?? "").trim().toLowerCase();
}

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const url = new URL(req.url);
  const email = normalizeEmail(url.searchParams.get("email"));

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (booking.email.trim().toLowerCase() !== email) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    booking: {
      ...booking,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    },
  });
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = normalizeEmail(body?.email ?? null);
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (booking.email.trim().toLowerCase() !== email) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (booking.status === "CANCELED" || booking.status === "COMPLETED") {
    return NextResponse.json({ error: "This booking can no longer be changed" }, { status: 400 });
  }

  const updates: Record<string, any> = {};

  if (body?.name !== undefined) updates.name = String(body.name).trim();
  if (body?.phone !== undefined) updates.phone = String(body.phone).trim();
  if (body?.service !== undefined) updates.service = String(body.service).trim();
  if (body?.date !== undefined) updates.date = String(body.date).trim();
  if (body?.time !== undefined) updates.time = String(body.time).trim();
  if (body?.notes !== undefined) updates.notes = body.notes ? String(body.notes).trim() : null;

  if (body?.cancel === true) {
    updates.status = "CANCELED";
  }

  for (const requiredKey of ["name", "phone", "service", "date", "time"]) {
    if (requiredKey in updates && !updates[requiredKey]) {
      return NextResponse.json({ error: `Missing ${requiredKey}` }, { status: 400 });
    }
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: updates,
  });

  return NextResponse.json({
    ok: true,
    booking: {
      ...updated,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    },
  });
}

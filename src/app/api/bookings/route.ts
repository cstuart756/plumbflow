import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim();
  const phone = String(body?.phone ?? "").trim();
  const service = String(body?.service ?? "").trim();
  const date = String(body?.date ?? "").trim();
  const time = String(body?.time ?? "").trim();
  const notes = body?.notes ? String(body.notes).trim() : null;

  if (!name || !email || !phone || !service || !date || !time) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const booking = await prisma.booking.create({
    data: {
      name,
      email,
      phone,
      service,
      date,
      time,
      notes,
    },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, bookingId: booking.id });
}

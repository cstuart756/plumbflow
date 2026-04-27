import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const booking = await prisma.booking.create({
    data: {
      name: body.name,
      email: body.email,
      phone: body.phone,
      service: body.service,
      date: new Date(body.date),
    },
  });

  return NextResponse.json(booking);
}

export async function GET() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(bookings);
}

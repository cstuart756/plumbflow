import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  const priceId = process.env.STRIPE_BOOKING_PRICE_ID;
  if (!priceId) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 });
  }

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

  const origin = new URL(req.url).origin;

  const booking = await prisma.booking.create({
    data: {
      name,
      email,
      phone,
      service,
      date,
      time,
      notes,
      status: "PENDING",
      paid: false,
    },
    select: { id: true },
  });

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/?payment=success&bookingId=${encodeURIComponent(booking.id)}`,
    cancel_url: `${origin}/?payment=cancel&bookingId=${encodeURIComponent(booking.id)}`,
    customer_email: email,
    metadata: {
      bookingId: booking.id,
    },
  });

  if (!session.url) {
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }

  await prisma.booking.update({
    where: { id: booking.id },
    data: {
      stripeCheckoutSessionId: session.id,
    },
  });

  return NextResponse.json({
    ok: true,
    bookingId: booking.id,
    checkoutUrl: session.url,
  });
}

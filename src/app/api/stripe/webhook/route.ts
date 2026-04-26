import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { sendBookingConfirmationEmail } from "@/utils/email";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook not configured" }, { status: 500 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  const rawBody = await req.text();

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;

    if (bookingId) {
      const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;

      const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
      if (booking) {
        const shouldSendConfirmation = !booking.paid;

        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            paid: true,
            stripeCheckoutSessionId: session.id,
            stripePaymentIntentId: paymentIntentId ?? null,
            ...(booking.status === "PENDING" ? { status: "CONFIRMED" } : {}),
          },
        });

        if (shouldSendConfirmation) {
          await sendBookingConfirmationEmail({
            name: booking.name,
            email: booking.email,
            date: booking.date,
            time: booking.time,
            service: booking.service,
          });
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}

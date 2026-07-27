import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { sendBookingConfirmationEmail } from "@/utils/email";
import { sendSMSReminder } from "@/utils/sms";
import { getCRMClient } from "@/lib/crm";
import { getLeadQuality, scoreLeadQuality } from "@/lib/leadScoring";

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
      const { prisma } = await import("@/lib/prisma");
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

        const leadScore = scoreLeadQuality({
          emailDomain: booking.email.split("@")[1],
          attemptedBooking: true,
          completedBooking: true,
          funnelProgress: "booking_completed",
          lastInteractionDaysAgo: 0,
        });

        await prisma.lead.upsert({
          where: { email: booking.email },
          create: {
            email: booking.email,
            firstName: booking.name.split(" ")[0] || undefined,
            lastName: booking.name.split(" ").slice(1).join(" ") || undefined,
            phone: booking.phone || undefined,
            status: "BOOKING_COMPLETED",
            quality: getLeadQuality(leadScore.total),
            funnelScore: leadScore.total,
            bookingStartedAt: new Date(booking.createdAt),
            bookingCompletedAt: new Date(),
            lastInteractionAt: new Date(),
          },
          update: {
            firstName: booking.name.split(" ")[0] || undefined,
            lastName: booking.name.split(" ").slice(1).join(" ") || undefined,
            phone: booking.phone || undefined,
            status: "BOOKING_COMPLETED",
            quality: getLeadQuality(leadScore.total),
            funnelScore: leadScore.total,
            bookingStartedAt: new Date(booking.createdAt),
            bookingCompletedAt: new Date(),
            lastInteractionAt: new Date(),
          },
        });

        const crm = getCRMClient();
        const crmResult = await crm.createContact({
          email: booking.email,
          firstName: booking.name.split(" ")[0] || undefined,
          lastName: booking.name.split(" ").slice(1).join(" ") || undefined,
          phone: booking.phone || undefined,
          properties: {
            booking_id: booking.id,
            booking_status: "completed",
            booking_service: booking.service,
            booking_date: booking.date,
            booking_time: booking.time,
          },
        });

        if (crmResult.success) {
          console.log(`[CRM] Lead synced: ${crmResult.id}`);
        }

        if (shouldSendConfirmation) {
          await sendBookingConfirmationEmail({
            name: booking.name,
            email: booking.email,
            date: booking.date,
            time: booking.time,
            service: booking.service,
          });

          await sendSMSReminder({
            to: booking.phone,
            message: `Plumbflow: your booking for ${booking.service} on ${booking.date} at ${booking.time} is confirmed.`,
          });
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}

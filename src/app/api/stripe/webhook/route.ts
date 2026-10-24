import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

// Removed apiVersion to prevent deployment type mismatches
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Retrieve the tenantId from the metadata we passed in the checkout session
    const tenantId = session.metadata?.tenantId;

    if (tenantId) {
      await prisma.tenant.update({
        where: { id: tenantId },
        data: {
          subscriptionStatus: "active",
          stripeCustomerId: session.customer as string,
        },
      });
      console.log(`✅ Tenant ${tenantId} subscription activated.`);
    }
  }

  // Handle other events (like subscription updated/canceled)
  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;
    
    // Find the tenant by stripeCustomerId
    const tenant = await prisma.tenant.findUnique({
      where: { stripeCustomerId: customerId },
    });

    if (tenant) {
      // Map Stripe status to our status
      let status = "trialing";
      if (subscription.status === "active") status = "active";
      if (subscription.status === "past_due") status = "past_due";
      if (subscription.status === "canceled") status = "canceled";

      await prisma.tenant.update({
        where: { id: tenant.id },
        data: { subscriptionStatus: status },
      });
      console.log(`🔄 Tenant ${tenant.id} subscription status updated to ${status}.`);
    }
  }

  return NextResponse.json({ received: true });
}
"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Stripe from "stripe";
import { redirect } from "next/navigation";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

export async function createCheckoutSessionAction() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const tenant = await prisma.tenant.findUnique({
    where: { id: session.user.tenantId },
  });

  if (!tenant) throw new Error("Tenant not found");

  let customerId = tenant.stripeCustomerId;

  // 1. Create a Stripe Customer if they don't have one
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: tenant.email,
      name: tenant.businessName,
      metadata: { tenantId: tenant.id },
    });
    customerId = customer.id;

    await prisma.tenant.update({
      where: { id: tenant.id },
      data: { stripeCustomerId: customerId },
    });
  }

  // 2. Create a Checkout Session for the £19/mo subscription
  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: process.env.STRIPE_BOOKING_PRICE_ID,
        quantity: 1,
      },
    ],
    subscription_data: {
      trial_period_days: 14, // 14-day free trial
    },
    success_url: `${process.env.NEXTAUTH_URL}/app/billing?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/app/billing?canceled=true`,
    metadata: { tenantId: tenant.id },
  });

  if (checkoutSession.url) {
    redirect(checkoutSession.url);
  }
}
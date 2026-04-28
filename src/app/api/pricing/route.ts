/**
 * Pricing Plans Management API
 * Handles creating, updating pricing tiers
 */

import { NextResponse } from "next/server";
import { PrismaClient, PlanTier } from "@prisma/client";

const prisma = new PrismaClient();

export const runtime = "nodejs";

// Default pricing tiers
const DEFAULT_PLANS = [
  {
    tier: "BASIC" as PlanTier,
    name: "Basic",
    description: "Perfect for getting started",
    monthlyPrice: 4999, // $49.99
    annualPrice: 49999, // $499.99 (10% discount)
    features: ["Up to 50 bookings/month", "Email support", "Basic reporting"],
    maxBookings: 50,
    priority: false,
  },
  {
    tier: "PRO" as PlanTier,
    name: "Pro",
    description: "For growing plumbing businesses",
    monthlyPrice: 9999, // $99.99
    annualPrice: 99999, // $999.99 (10% discount)
    features: [
      "Unlimited bookings",
      "Priority email support",
      "Advanced reporting",
      "Custom branding",
      "API access",
    ],
    maxBookings: null,
    priority: true,
  },
  {
    tier: "PREMIUM" as PlanTier,
    name: "Premium",
    description: "For enterprise teams",
    monthlyPrice: 29999, // $299.99
    annualPrice: 299999, // $2999.99 (10% discount)
    features: [
      "Unlimited bookings",
      "24/7 phone support",
      "Custom integrations",
      "Dedicated account manager",
      "White-label option",
      "Analytics dashboard",
    ],
    maxBookings: null,
    priority: true,
  },
];

/**
 * GET /api/pricing - Get all pricing plans
 */
export async function GET() {
  try {
    let plans = await prisma.pricingPlan.findMany({
      where: { isActive: true },
      orderBy: { monthlyPrice: "asc" },
    });

    // Initialize default plans if none exist
    if (plans.length === 0) {
      for (const plan of DEFAULT_PLANS) {
        await prisma.pricingPlan.create({ data: plan });
      }
      plans = await prisma.pricingPlan.findMany({ where: { isActive: true } });
    }

    return NextResponse.json(plans);
  } catch (error) {
    console.error("[PRICING] Error fetching plans:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

/**
 * POST /api/pricing - Create or update pricing plan
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tier, name, description, monthlyPrice, features, maxBookings } = body;

    const plan = await prisma.pricingPlan.upsert({
      where: { tier },
      create: {
        tier,
        name,
        description,
        monthlyPrice,
        features,
        maxBookings,
      },
      update: {
        name,
        description,
        monthlyPrice,
        features,
        maxBookings,
      },
    });

    return NextResponse.json(plan);
  } catch (error) {
    console.error("[PRICING] Error updating plan:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

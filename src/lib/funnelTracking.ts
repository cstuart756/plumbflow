/**
 * PostHog Funnel Tracking
 * Tracks the conversion funnel: Demo Email → Demo Access → Booking Started → Booking Completed
 */

import posthog from "@/lib/posthog";

export interface FunnelStep {
  step: "demo_email_captured" | "demo_accessed" | "booking_started" | "booking_completed" | "pricing_viewed";
  userId?: string;
  email?: string;
  properties?: Record<string, any>;
}

/**
 * Track a funnel step in PostHog
 * This allows you to build funnels in PostHog dashboard to see conversion rates
 */
export function trackFunnelStep(step: FunnelStep) {
  if (typeof window === "undefined") return;

  const eventMap = {
    demo_email_captured: "demo_email_captured",
    demo_accessed: "demo_accessed",
    booking_started: "booking_started",
    booking_completed: "booking_completed",
    pricing_viewed: "pricing_viewed",
  };

  posthog.capture(eventMap[step.step], {
    ...step.properties,
    funnel_step: step.step,
    timestamp: new Date().toISOString(),
  });

  console.log(`[FUNNEL] ${step.step}`, step.properties);
}

/**
 * PostHog Funnel Setup Instructions
 * To track the full demo → booking conversion funnel:
 *
 * 1. Go to PostHog Dashboard → Funnels
 * 2. Click "New Funnel"
 * 3. Add steps in order:
 *    - Step 1: demo_email_captured
 *    - Step 2: demo_accessed
 *    - Step 3: booking_started
 *    - Step 4: booking_completed
 * 4. Set time window: 30 days
 * 5. Break down by: initial utm_source (to see which traffic source converts best)
 * 6. Save as "Demo to Booking Conversion"
 *
 * Expected funnel:
 * - demo_email_captured: 100% (baseline)
 * - demo_accessed: 60-70% (not all users follow link)
 * - booking_started: 25-35% (not all demo users book)
 * - booking_completed: 15-20% (some abandon during checkout)
 *
 * Optimize high-drop-off points:
 * - If demo_accessed is low: improve email CTA/urgency
 * - If booking_started is low: demo UX might be confusing
 * - If booking_completed is low: checkout flow has friction
 */

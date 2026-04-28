import posthog from "@/lib/posthog";

export type AnalyticsEvent =
  | "cta_click"
  | "cta_demo_click"
  | "demo_email_captured"
  | "pricing_click"
  | "booking_started"
  | "booking_completed"
  | "booking_view"
  | "feature_view"
  | "hero_view"
  | "pricing_viewed"
  | "pricing_selected";

interface AnalyticsProps {
  [key: string]: string | number | boolean | undefined;
}

export function track(event: AnalyticsEvent, props: AnalyticsProps = {}) {
  // Log to console in dev
  if (typeof window !== "undefined") {
    console.log(`[ANALYTICS] ${event}`, props);
  }

  // Send to PostHog
  if (typeof window !== "undefined") {
    posthog.capture(event, props);
  }
}

export function identifyUser(email: string, traits?: Record<string, any>) {
  if (typeof window !== "undefined") {
    posthog.identify(email, traits);
  }
}

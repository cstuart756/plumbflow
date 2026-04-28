export type AnalyticsEvent =
  | "cta_click"
  | "pricing_click"
  | "booking_started"
  | "booking_completed"
  | "booking_view"
  | "feature_view"
  | "hero_view";

interface AnalyticsProps {
  [key: string]: string | number | boolean | undefined;
}

export function track(event: AnalyticsEvent, props: AnalyticsProps = {}) {
  // Log to console in dev
  if (typeof window !== "undefined") {
    console.log(`[ANALYTICS] ${event}`, props);
  }

  // Send to API
  if (typeof window !== "undefined") {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event,
        props,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      }),
    }).catch(() => {
      // silently fail if analytics endpoint is not available
    });
  }
}

import posthog from "posthog-js";

export function initPosthog() {
  if (typeof window === "undefined") return;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) {
    console.warn("[PostHog] NEXT_PUBLIC_POSTHOG_KEY not set. Analytics disabled.");
    return;
  }

  posthog.init(key, {
    api_host: "https://app.posthog.com",
    capture_pageview: true,
    session_recording: {
      maskAllInputs: true,
      maskTextInputs: true,
    },
  });
}

export default posthog;

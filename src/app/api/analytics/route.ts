import { NextResponse } from "next/server";

export const runtime = "nodejs";

interface AnalyticsBody {
  event: string;
  props: Record<string, any>;
  timestamp: string;
  userAgent: string;
  url: string;
}

export async function POST(req: Request) {
  let body: AnalyticsBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { event, props, timestamp, userAgent, url } = body;

  if (!event) {
    return NextResponse.json({ error: "Missing event" }, { status: 400 });
  }

  // Log to console (in production, send to PostHog, Segment, or a data warehouse)
  console.log("[ANALYTICS_LOG]", {
    event,
    props,
    timestamp,
    userAgent: userAgent.substring(0, 100),
    url,
  });

  // TODO: Send to external analytics provider (PostHog, Segment, or custom DB)

  return NextResponse.json({ ok: true });
}

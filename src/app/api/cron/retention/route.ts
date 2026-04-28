import { NextResponse } from "next/server";
import { sendRetentionEmails, sendSlackRetentionAlert } from "@/lib/retentionAlerts";

export const runtime = "nodejs";

/**
 * Cron endpoint for retention alerts
 * Call daily to check for inactive users and send retention emails
 *
 * Usage:
 * - Vercel Crons: Set in vercel.json with schedule "0 9 * * *"
 * - External cron: POST to https://yoursite.com/api/cron/retention daily
 * - Manually: curl https://yoursite.com/api/cron/retention
 */
export async function POST(req: Request) {
  // Optional: Verify cron secret for security
  const cronSecret = req.headers.get("x-cron-secret");
  if (cronSecret !== process.env.CRON_SECRET) {
    console.warn("[CRON] Invalid cron secret");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("[CRON] Starting retention check");

    // Send emails to inactive users
    await sendRetentionEmails();

    // Send Slack alert
    await sendSlackRetentionAlert();

    return NextResponse.json({ ok: true, message: "Retention check completed" });
  } catch (error) {
    console.error("[CRON] Retention check failed:", error);
    return NextResponse.json(
      { error: "Retention check failed", details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({ ok: true, service: "retention-alerts" });
}

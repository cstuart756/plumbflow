/**
 * Retention Alert System
 * Monitors user activity and sends alerts for inactive users
 * Can be run as a scheduled cron job
 */

import { getEmailService } from "@/lib/emailService";

interface InactiveUser {
  email: string;
  lastActivity: Date;
  daysSinceActivity: number;
}

/**
 * Check for inactive users (example implementation)
 * In production, this would query your database for users
 * who haven't taken an action in X days
 */
export async function checkInactiveUsers(): Promise<InactiveUser[]> {
  // TODO: Query your database for users who:
  // - Created demo lead 7+ days ago
  // - Haven't started a booking
  // - Haven't completed any action
  //
  // Example Prisma query:
  // const users = await prisma.lead.findMany({
  //   where: {
  //     createdAt: {
  //       lte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  //     },
  //     bookings: {
  //       none: {}
  //     }
  //   }
  // });

  return [];
}

/**
 * Send retention email to inactive users
 */
export async function sendRetentionEmails() {
  const emailService = getEmailService();
  const inactiveUsers = await checkInactiveUsers();

  console.log(`[RETENTION] Found ${inactiveUsers.length} inactive users`);

  for (const user of inactiveUsers) {
    const daysInactive = user.daysSinceActivity;
    let subject = "";
    let html = "";

    if (daysInactive === 7) {
      subject = "We miss you! Last chance for your demo offer";
      html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>We Miss You!</h1>
          <p>It's been a week since you accessed the Plumbflow demo.</p>
          <p><strong>Here's your final offer:</strong> Get Plumbflow Pro for $39/month for your first 3 months (normally $79).</p>
          <p><a href="https://plumbflow.com/account/register?promo=RETENTION7" style="display: inline-block; padding: 10px 20px; background-color: #0f6ee8; color: white; text-decoration: none; border-radius: 6px;">Claim Offer</a></p>
          <p>Expires in 48 hours.</p>
        </div>
      `;
    } else if (daysInactive === 14) {
      subject = "Last chance: 60% off Plumbflow";
      html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Final Offer Inside</h1>
          <p>You had 14 days to try Plumbflow. Here's one last chance.</p>
          <p><strong>60% off your first year</strong> when you sign up today.</p>
          <p><a href="https://plumbflow.com/account/register?promo=LASTCHANCE" style="display: inline-block; padding: 10px 20px; background-color: #d34249; color: white; text-decoration: none; border-radius: 6px;">Claim Now</a></p>
        </div>
      `;
    } else if (daysInactive === 30) {
      subject = "Your Plumbflow demo offer has expired";
      html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Offer Expired</h1>
          <p>The special demo offer has ended.</p>
          <p>If you'd like to get started with Plumbflow, our standard pricing applies. We're here to help if you have questions.</p>
          <p><a href="https://plumbflow.com/#pricing" style="display: inline-block; padding: 10px 20px; background-color: #0f6ee8; color: white; text-decoration: none; border-radius: 6px;">View Pricing</a></p>
        </div>
      `;
    }

    if (subject && html) {
      const sent = await emailService.send({
        to: user.email,
        subject,
        html,
      });

      if (sent) {
        console.log(`[RETENTION] Email sent to ${user.email} (${daysInactive} days inactive)`);
      }
    }
  }
}

/**
 * Slack Alert for Inactive Users
 * Sends a Slack notification to your team about users at risk of churn
 */
export async function sendSlackRetentionAlert() {
  const inactiveUsers = await checkInactiveUsers();

  if (inactiveUsers.length === 0) return;

  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("[SLACK] SLACK_WEBHOOK_URL not configured");
    return;
  }

  try {
    const message = {
      text: "🚨 Retention Alert",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${inactiveUsers.length} inactive demo users*\n\nUsers who haven't completed a booking after 7+ days of demo access.`,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: inactiveUsers
              .slice(0, 10)
              .map((u) => `• ${u.email} (${u.daysSinceActivity}d inactive)`)
              .join("\n"),
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "View in PostHog",
              },
              url: "https://posthog.com",
            },
          ],
        },
      ],
    };

    await fetch(webhookUrl, {
      method: "POST",
      body: JSON.stringify(message),
    });

    console.log("[SLACK] Retention alert sent");
  } catch (error) {
    console.error("[SLACK] Failed to send alert:", error);
  }
}

/**
 * Cron Job Setup
 *
 * To run retention checks daily, set up a cron job:
 *
 * Option 1: Vercel Cron Functions (Next.js 14+)
 * Create /src/app/api/cron/retention/route.ts and set in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/retention",
 *     "schedule": "0 9 * * *"  // Daily at 9am UTC
 *   }]
 * }
 *
 * Option 2: External cron service (EasyCron, cron-job.org)
 * POST to: https://yoursite.com/api/cron/retention
 * Schedule: Daily at 9am
 *
 * Option 3: Background job queue (Bull, RQ, Celery)
 * Schedule job: sendRetentionEmails() every 24 hours
 */

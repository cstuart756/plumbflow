/**
 * Email Service Integration
 * Supports SendGrid and Mailgun
 */

interface EmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

class SendGridEmailService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.SENDGRID_API_KEY || "";
  }

  async send(params: EmailParams): Promise<boolean> {
    if (!this.apiKey) {
      console.warn("SendGrid API key not configured");
      return false;
    }

    try {
      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: params.to }] }],
          from: { email: params.from || "noreply@plumbflow.com" },
          subject: params.subject,
          content: [{ type: "text/html", value: params.html }],
        }),
      });

      return response.ok;
    } catch (error) {
      console.error("[SendGrid Error]", error);
      return false;
    }
  }
}

class MailgunEmailService {
  private apiKey: string;
  private domain: string;

  constructor() {
    this.apiKey = process.env.MAILGUN_API_KEY || "";
    this.domain = process.env.MAILGUN_DOMAIN || "";
  }

  async send(params: EmailParams): Promise<boolean> {
    if (!this.apiKey || !this.domain) {
      console.warn("Mailgun credentials not configured");
      return false;
    }

    try {
      const formData = new FormData();
      formData.append("from", params.from || "noreply@plumbflow.com");
      formData.append("to", params.to);
      formData.append("subject", params.subject);
      formData.append("html", params.html);

      const response = await fetch(`https://api.mailgun.net/v3/${this.domain}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`api:${this.apiKey}`).toString("base64")}`,
        },
        body: formData,
      });

      return response.ok;
    } catch (error) {
      console.error("[Mailgun Error]", error);
      return false;
    }
  }
}

export function getEmailService() {
  const provider = process.env.EMAIL_PROVIDER || "sendgrid";

  if (provider.toLowerCase() === "mailgun") {
    return new MailgunEmailService();
  }

  return new SendGridEmailService();
}

/**
 * Email Templates for Demo Nurture Sequence
 */
export const emailTemplates = {
  demoAccess: (email: string) => ({
    subject: "Welcome to Plumbflow Demo",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Demo Access Confirmed</h1>
        <p>Hi there,</p>
        <p>You've unlocked exclusive demo access to Plumbflow. See how plumbers book jobs faster and reduce missed calls.</p>
        <p><a href="https://plumbflow.com/?demo=true&email=${encodeURIComponent(email)}" style="display: inline-block; padding: 10px 20px; background-color: #0f6ee8; color: white; text-decoration: none; border-radius: 6px;">Open Demo</a></p>
        <p>Questions? Reply to this email.</p>
      </div>
    `,
  }),

  followUp24h: (name: string) => ({
    subject: "How's the Plumbflow Demo Going?",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Quick check-in</h1>
        <p>Hi ${name || "there"},</p>
        <p>We wanted to see if you've had a chance to try the Plumbflow demo. Most plumbers save 4-6 hours per week.</p>
        <p><a href="https://calendly.com/plumbflow/demo-walkthrough" style="display: inline-block; padding: 10px 20px; background-color: #0f6ee8; color: white; text-decoration: none; border-radius: 6px;">Schedule Live Walkthrough</a></p>
        <p>Or book a specific time to chat about your team's needs.</p>
      </div>
    `,
  }),

  followUp3days: () => ({
    subject: "Real plumbers, real results",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>See What's Possible</h1>
        <p>Here's what plumbers are achieving with Plumbflow:</p>
        <ul>
          <li>Ryan: "We were losing 4 calls/day. Now the calendar fills itself."</li>
          <li>Aimee: "SMS reminders cut no-shows by 80%."</li>
          <li>Darren: "Team checks jobs on mobile before arriving. Huge time saver."</li>
        </ul>
        <p><a href="https://plumbflow.com/#pricing" style="display: inline-block; padding: 10px 20px; background-color: #0eaf85; color: white; text-decoration: none; border-radius: 6px;">See Pricing</a></p>
      </div>
    `,
  }),

  followUp7days: () => ({
    subject: "Last Chance: Demo Special Pricing",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Time's Running Out</h1>
        <p>This is the last reminder about your exclusive demo access.</p>
        <p><strong>Special offer for demo users:</strong> Get your first month at 50% off when you sign up in the next 7 days.</p>
        <p><a href="https://plumbflow.com/account/register?promo=DEMO50" style="display: inline-block; padding: 10px 20px; background-color: #0f6ee8; color: white; text-decoration: none; border-radius: 6px;">Claim Offer</a></p>
        <p>No credit card required to start.</p>
      </div>
    `,
  }),
};

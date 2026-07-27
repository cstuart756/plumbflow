type BookingConfirmationEmailInput = {
  name: string;
  email: string;
  date: string;
  time: string;
  service: string;
};

export async function sendBookingConfirmationEmail(input: BookingConfirmationEmailInput): Promise<boolean> {
  const provider = (process.env.EMAIL_PROVIDER || "mailgun").toLowerCase();
  const subject = "Booking Confirmation";
  const text = `Hi ${input.name}, your booking for ${input.service} on ${input.date} at ${input.time} is confirmed. Thank you for choosing Plumbflow!`;
  const html = `<p>Hi ${input.name},</p><p>Your booking for <strong>${input.service}</strong> on <strong>${input.date}</strong> at <strong>${input.time}</strong> is confirmed.</p><p>Thank you for choosing Plumbflow!</p>`;

  if (provider === "resend") {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.warn("Resend is not configured. Skipping booking confirmation email.");
      return false;
    }

    const from = process.env.MAIL_FROM || "Plumbflow <onboarding@resend.dev>";

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from,
          to: [input.email],
          subject,
          html,
          text,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Resend error:", response.status, errorText);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Resend request failed:", error);
      return false;
    }
  }

  if (provider === "sendgrid") {
    const sendGridApiKey = process.env.SENDGRID_API_KEY;
    if (!sendGridApiKey) {
      console.warn("SendGrid is not configured. Skipping booking confirmation email.");
      return false;
    }

    const from = process.env.MAIL_FROM || "noreply@plumbflow.com";

    try {
      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sendGridApiKey}`,
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: input.email }] }],
          from: { email: from },
          subject,
          content: [{ type: "text/plain", value: text }],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("SendGrid error:", response.status, errorText);
        return false;
      }

      return true;
    } catch (error) {
      console.error("SendGrid request failed:", error);
      return false;
    }
  }

  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;

  if (!apiKey || !domain) {
    console.warn("Mailgun is not configured. Skipping booking confirmation email.");
    return false;
  }

  const from = process.env.MAIL_FROM || `Plumbflow <postmaster@${domain}>`;
  const params = new URLSearchParams({
    from,
    to: input.email,
    subject,
    text,
  });

  try {
    const response = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Mailgun error:", response.status, errorText);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Mailgun request failed:", error);
    return false;
  }
}

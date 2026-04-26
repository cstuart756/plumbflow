type BookingConfirmationEmailInput = {
  name: string;
  email: string;
  date: string;
  time: string;
  service: string;
};

export async function sendBookingConfirmationEmail(input: BookingConfirmationEmailInput): Promise<boolean> {
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
    subject: "Booking Confirmation",
    text: `Hi ${input.name}, your booking for ${input.service} on ${input.date} at ${input.time} is confirmed. Thank you for choosing Plumbflow!`,
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

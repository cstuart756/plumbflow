// Mailgun integration for sending booking confirmation emails
// Set MAILGUN_API_KEY and MAILGUN_DOMAIN in your environment for production use
import mailgun from "mailgun-js";

const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY || "test-key", // replace with your test key
  domain: process.env.MAILGUN_DOMAIN || "test-domain", // replace with your test domain
});

export async function sendBookingConfirmationEmail({ name, email, date, time, service }) {
  const data = {
    from: "Plumbflow <no-reply@plumbflow.com>",
    to: email,
    subject: "Booking Confirmation",
    text: `Hi ${name}, your booking for ${service} on ${date} at ${time} is confirmed. Thank you for choosing Plumbflow!`,
  };
  // In test mode, this will not send a real email
  try {
    const body = await mg.messages().send(data);
    console.log("Mailgun response:", body);
    return true;
  } catch (err) {
    console.error("Mailgun error:", err);
    return false;
  }
}

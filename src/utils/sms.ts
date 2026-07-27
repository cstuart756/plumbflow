// Twilio SMS integration for sending reminders
// Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in your environment for production use
import twilio from "twilio";

const fromNumber = process.env.TWILIO_PHONE_NUMBER || "";

interface SMSReminderParams {
  to: string;
  message: string;
}

export async function sendSMSReminder({ to, message }: SMSReminderParams) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken || !fromNumber) {
    console.warn("Twilio is not configured. Skipping SMS reminder.");
    return false;
  }

  const client = twilio(accountSid, authToken);

  try {
    const msg = await client.messages.create({
      body: message,
      from: fromNumber,
      to,
    });
    console.log("Twilio SMS sent:", msg.sid);
    return true;
  } catch (err) {
    console.error("Twilio SMS error:", err);
    return false;
  }
}

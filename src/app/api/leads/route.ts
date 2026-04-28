import { NextResponse } from "next/server";
import { getCRMClient } from "@/lib/crm";
import { getEmailService, emailTemplates } from "@/lib/emailService";
import { track } from "@/lib/analytics";

interface LeadBody {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: LeadBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, firstName, lastName, phone } = body;

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // Log to console
  console.log("[LEAD_CAPTURED]", {
    email,
    firstName,
    lastName,
    phone,
    timestamp: new Date().toISOString(),
  });

  // Push to CRM
  const crm = getCRMClient();
  const crmResult = await crm.createContact({
    email,
    firstName,
    lastName,
    phone,
    properties: {
      lead_source: "plumbflow_demo",
      captured_at: new Date().toISOString(),
    },
  });

  if (crmResult.success) {
    console.log(`[CRM] Contact created: ${crmResult.id}`);
  } else {
    console.error(`[CRM] Failed to create contact: ${crmResult.error}`);
  }

  // Send welcome email
  const emailService = getEmailService();
  const welcomeEmail = emailTemplates.demoAccess(email);
  const emailSent = await emailService.send({
    to: email,
    subject: welcomeEmail.subject,
    html: welcomeEmail.html,
  });

  if (emailSent) {
    console.log(`[EMAIL] Welcome email sent to ${email}`);
  } else {
    console.warn(`[EMAIL] Failed to send welcome email to ${email}`);
  }

  // TODO: Schedule follow-up emails
  // - 24h follow-up
  // - 3-day follow-up  
  // - 7-day follow-up with special offer

  return NextResponse.json({
    ok: true,
    email,
    crmId: crmResult.id,
    emailSent,
  });
}

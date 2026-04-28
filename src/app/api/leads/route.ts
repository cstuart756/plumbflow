import { NextResponse } from "next/server";

interface LeadBody {
  email: string;
}

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: LeadBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email } = body;

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // Log to console
  console.log("[LEAD_CAPTURED]", {
    email,
    timestamp: new Date().toISOString(),
  });

  // TODO: In production, save to:
  // - Database (Postgres, MongoDB)
  // - CRM (Salesforce, HubSpot, Pipedrive)
  // - Email service (SendGrid, Mailgun)
  // - Slack notification

  return NextResponse.json({ ok: true, email });
}

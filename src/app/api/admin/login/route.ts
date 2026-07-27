import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  createAdminCookieValue,
  getAdminCookieName,
  isAdminPasswordValid,
} from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const password = String(body?.password ?? "");

  if (!isAdminPasswordValid(password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set({
    name: getAdminCookieName(),
    value: createAdminCookieValue(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ ok: true });
}

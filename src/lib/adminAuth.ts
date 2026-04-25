import crypto from "crypto";

const COOKIE_NAME = "plumbflow_admin";

function getSecret(): string {
  const secret = process.env.ADMIN_AUTH_SECRET;
  if (!secret) {
    throw new Error("Missing ADMIN_AUTH_SECRET env var");
  }
  return secret;
}

function base64UrlEncode(input: Buffer | string): string {
  const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input, "utf8");
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(input: string): Buffer {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "===".slice((normalized.length + 3) % 4);
  return Buffer.from(padded, "base64");
}

function hmacSha256(data: string, secret: string): Buffer {
  return crypto.createHmac("sha256", secret).update(data).digest();
}

function timingSafeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

export function getAdminCookieName() {
  return COOKIE_NAME;
}

export function createAdminCookieValue(nowMs: number = Date.now()): string {
  const secret = getSecret();
  const payload = String(nowMs);
  const sig = base64UrlEncode(hmacSha256(payload, secret));
  return `${base64UrlEncode(payload)}.${sig}`;
}

export function verifyAdminCookieValue(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  const [payloadB64, sig] = cookieValue.split(".");
  if (!payloadB64 || !sig) return false;

  let payload: string;
  try {
    payload = base64UrlDecode(payloadB64).toString("utf8");
  } catch {
    return false;
  }

  if (!/^[0-9]{10,}$/.test(payload)) return false;

  const secret = getSecret();
  const expectedSig = base64UrlEncode(hmacSha256(payload, secret));
  if (!timingSafeEqual(expectedSig, sig)) return false;

  const issuedAt = Number(payload);
  if (!Number.isFinite(issuedAt)) return false;

  const maxAgeMs = 7 * 24 * 60 * 60 * 1000; // 7 days
  if (Date.now() - issuedAt > maxAgeMs) return false;

  return true;
}

export function isAdminPasswordValid(password: string | undefined): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    throw new Error("Missing ADMIN_PASSWORD env var");
  }
  if (!password) return false;
  return timingSafeEqual(expected, password);
}

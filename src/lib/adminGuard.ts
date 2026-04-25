import { cookies } from "next/headers";
import { getAdminCookieName, verifyAdminCookieValue } from "@/lib/adminAuth";

export function isAdminAuthed(): boolean {
  const cookieValue = cookies().get(getAdminCookieName())?.value;
  return verifyAdminCookieValue(cookieValue);
}

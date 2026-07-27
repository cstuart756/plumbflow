import { cookies } from "next/headers";
import { getAdminCookieName, verifyAdminCookieValue } from "@/lib/adminAuth";

export async function isAdminAuthed(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(getAdminCookieName())?.value;
  return verifyAdminCookieValue(cookieValue);
}

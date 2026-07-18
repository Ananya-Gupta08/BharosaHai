import "server-only";

import {cookies} from "next/headers";
import {redirect} from "next/navigation";

const cookieName = "kb_admin_session";

function getAdminAccessToken() {
  const token = process.env.ADMIN_ACCESS_TOKEN;

  if (!token || token.length < 32) {
    throw new Error("ADMIN_ACCESS_TOKEN must be set to a strong secret with at least 32 characters.");
  }

  return token;
}

export async function hasAdminAccess() {
  const cookieStore = await cookies();
  const session = cookieStore.get(cookieName)?.value;

  return Boolean(session && session === getAdminAccessToken());
}

export async function requireAdminAccess(locale: string) {
  if (!(await hasAdminAccess())) {
    redirect(`/${locale}/admin/login`);
  }
}

export async function setAdminSession() {
  const cookieStore = await cookies();

  cookieStore.set(cookieName, getAdminAccessToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();

  cookieStore.delete(cookieName);
}

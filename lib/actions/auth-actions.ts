"use server";

import {redirect} from "next/navigation";

import {clearAdminSession, setAdminSession} from "@/lib/auth/admin-session";

function safeLocale(formData: FormData) {
  const locale = formData.get("locale");

  return locale === "hi" ? "hi" : "en";
}

type AdminLoginState = {
  status: "idle" | "error";
  messageKey?: string;
};

export async function loginAdmin(
  _previousState: AdminLoginState,
  formData: FormData
): Promise<AdminLoginState> {
  const locale = safeLocale(formData);
  const submittedToken = formData.get("accessToken");
  const expectedToken = process.env.ADMIN_ACCESS_TOKEN;

  if (!expectedToken || expectedToken.length < 32) {
    return {status: "error", messageKey: "login.configError"};
  }

  if (typeof submittedToken !== "string" || submittedToken !== expectedToken) {
    return {status: "error", messageKey: "login.invalid"};
  }

  await setAdminSession();
  redirect(`/${locale}/admin`);
}

export async function logoutAdmin(formData: FormData) {
  const locale = safeLocale(formData);

  await clearAdminSession();
  redirect(`/${locale}/admin/login`);
}

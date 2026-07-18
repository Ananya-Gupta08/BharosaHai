"use client";

import {useLocale, useTranslations} from "next-intl";

import {logoutAdmin} from "@/lib/actions/auth-actions";

export function AdminLogoutButton() {
  const t = useTranslations("admin.dashboard");
  const locale = useLocale();

  return (
    <form action={logoutAdmin}>
      <input type="hidden" name="locale" value={locale} />
      <button className="rounded-full border border-[#eae4da] bg-white px-5 py-3 text-sm font-bold text-[#374151] transition hover:border-[#2f5d50] hover:text-[#2f5d50]">
        {t("logout")}
      </button>
    </form>
  );
}

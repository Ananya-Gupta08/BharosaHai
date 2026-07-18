"use client";

import {useActionState} from "react";
import {useLocale} from "next-intl";
import {useTranslations} from "next-intl";

import {loginAdmin} from "@/lib/actions/auth-actions";

const initialState = {status: "idle" as const};

export function AdminLoginForm() {
  const t = useTranslations("admin.login");
  const locale = useLocale();
  const [state, formAction, pending] = useActionState(loginAdmin, initialState);

  return (
    <form action={formAction} className="mt-8 grid gap-4">
      <input type="hidden" name="locale" value={locale} />
      <label className="grid gap-2">
        <span className="text-sm font-bold text-[#374151]">{t("tokenLabel")}</span>
        <input name="accessToken" type="password" className="rounded-2xl border border-[#eae4da] bg-white px-4 py-3 text-sm text-[#1f2937] outline-none transition focus:border-[#2f5d50]" placeholder={t("placeholder")} />
      </label>
      {state.messageKey && <p className="rounded-2xl bg-[#fff1f2] px-4 py-3 text-sm font-semibold text-[#991b1b]">{t(state.messageKey)}</p>}
      <button disabled={pending} className="rounded-full bg-[#2f5d50] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#264c42] disabled:cursor-not-allowed disabled:opacity-60">{pending ? t("pending") : t("submit")}</button>
    </form>
  );
}

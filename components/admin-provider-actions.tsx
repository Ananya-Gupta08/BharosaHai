"use client";

import {useActionState} from "react";
import {useTranslations} from "next-intl";

import {updateProviderStatus} from "@/lib/actions/admin-actions";

const initialState = {status: "idle" as const};

export function AdminProviderActions({providerId}: {providerId: string}) {
  const t = useTranslations("admin.detail");
  const [state, formAction, pending] = useActionState(updateProviderStatus, initialState);

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-3">
      <input type="hidden" name="providerId" value={providerId} />
      <label className="grid gap-2">
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#6b7280]">{t("actions.noteLabel")}</span>
        <textarea name="note" className="min-h-24 rounded-2xl border border-[#eae4da] bg-white px-4 py-3 text-sm text-[#1f2937] outline-none transition focus:border-[#2f5d50]" placeholder={t("actions.notePlaceholder")} />
      </label>
      {state.messageKey && (
        <p className={`rounded-2xl px-4 py-3 text-sm font-semibold ${state.status === "success" ? "bg-[#e8f3ee] text-[#2f5d50]" : "bg-[#fff1f2] text-[#991b1b]"}`}>
          {t(state.messageKey)}
        </p>
      )}
      <button disabled={pending} name="decision" value="approve" className="rounded-full bg-[#2f5d50] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#264c42] disabled:cursor-not-allowed disabled:opacity-60">{t("actions.approve")}</button>
      <button disabled={pending} name="decision" value="more" className="rounded-full border border-[#eae4da] bg-white px-5 py-3 text-sm font-bold text-[#374151] transition hover:border-[#2f5d50] hover:text-[#2f5d50] disabled:cursor-not-allowed disabled:opacity-60">{t("actions.more")}</button>
      <button disabled={pending} name="decision" value="reject" className="rounded-full border border-[#eae4da] bg-white px-5 py-3 text-sm font-bold text-[#374151] transition hover:border-[#991b1b] hover:text-[#991b1b] disabled:cursor-not-allowed disabled:opacity-60">{t("actions.reject")}</button>
    </form>
  );
}

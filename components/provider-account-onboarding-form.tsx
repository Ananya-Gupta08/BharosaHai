"use client";

import {SignOutButton, useUser} from "@clerk/nextjs";
import {Camera, LogOut, PhoneCall, ShieldCheck} from "lucide-react";
import {useTranslations} from "next-intl";
import {useState} from "react";

import {saveProviderOnboardingProfile, syncCurrentProviderAccount} from "@/lib/actions/provider-auth-actions";
import {useRouter} from "@/i18n/navigation";

function clerkErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === "object" &&
    error !== null &&
    "errors" in error &&
    Array.isArray((error as {errors?: Array<{longMessage?: string; message?: string}>}).errors)
  ) {
    const first = (error as {errors: Array<{longMessage?: string; message?: string}>}).errors[0];

    return first?.longMessage ?? first?.message ?? fallback;
  }

  return fallback;
}

export function ProviderAccountOnboardingForm({initialMobile = ""}: {initialMobile?: string | null}) {
  const t = useTranslations("provider.onboarding");
  const router = useRouter();
  const {isLoaded, user} = useUser();
  const [mobile, setMobile] = useState(initialMobile ?? "");
  const [photoName, setPhotoName] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isLoaded) {
    return <p className="text-sm font-semibold text-[#6b7280]">{t("loading")}</p>;
  }

  if (!user) {
    return <p className="text-sm font-semibold text-[#991b1b]">{t("signedOut")}</p>;
  }

  const emailVerified = user.primaryEmailAddress?.verification.status === "verified";

  async function saveProfilePhoto(file: File | undefined) {
    if (!file || !user) {
      return;
    }

    setPending(true);
    setError(null);
    setPhotoName(file.name);

    try {
      await user.setProfileImage({file});
      await user.reload();
      await syncCurrentProviderAccount();
      setMessage(t("photoSaved"));
    } catch (caught) {
      setError(clerkErrorMessage(caught, t("photoError")));
    } finally {
      setPending(false);
    }
  }

  async function continueToDashboard() {
    setPending(true);
    setError(null);
    setMessage(null);

    try {
      const result = await saveProviderOnboardingProfile(mobile);

      if (result.status === "success") {
        router.replace("/provider/dashboard");
        return;
      }

      setError(result.status === "emailRequired" ? t("email.pending") : t("phone.validationError"));
    } catch {
      setError(t("phone.saveError"));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-5">
      <div className="rounded-2xl border border-[#eae4da] bg-[#f7f4ee] p-5">
        <div className="flex items-center gap-3">
          <ShieldCheck className={emailVerified ? "text-[#2f5d50]" : "text-[#c6922e]"} size={22} aria-hidden />
          <div>
            <p className="font-heading text-base font-bold text-[#111827]">{t("email.title")}</p>
            <p className="mt-1 text-sm text-[#6b7280]">{emailVerified ? t("email.verified") : t("email.pending")}</p>
          </div>
        </div>
      </div>

      <label className="rounded-2xl border border-[#eae4da] bg-white p-5">
        <span className="flex items-center gap-3 font-heading text-base font-bold text-[#111827]">
          <Camera className="text-[#2f5d50]" size={22} aria-hidden />
          {t("photo.title")}
        </span>
        <span className="mt-2 block text-sm leading-6 text-[#6b7280]">{t("photo.copy")}</span>
        <span className="mt-4 inline-flex rounded-full border border-[#eae4da] bg-[#f7f4ee] px-4 py-2 text-xs font-bold text-[#2f5d50]">
          {photoName || t("photo.choose")}
        </span>
        <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => saveProfilePhoto(event.target.files?.[0])} />
      </label>

      <div className="rounded-2xl border border-[#eae4da] bg-white p-5">
        <div className="flex items-center gap-3">
          <PhoneCall className="text-[#2f5d50]" size={22} aria-hidden />
          <div>
            <p className="font-heading text-base font-bold text-[#111827]">{t("phone.title")}</p>
            <p className="mt-1 text-sm text-[#6b7280]">{t("phone.copy")}</p>
          </div>
        </div>
        <div className="mt-5 grid gap-3">
          <input value={mobile} onChange={(event) => setMobile(event.target.value)} className="rounded-2xl border border-[#eae4da] bg-white px-4 py-3 text-sm text-[#1f2937] outline-none transition focus:border-[#2f5d50]" placeholder={t("phone.placeholder")} />
          <button type="button" disabled={pending || !emailVerified || !mobile} onClick={continueToDashboard} className="rounded-full bg-[#2f5d50] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#264c42] disabled:cursor-not-allowed disabled:opacity-60">
            {pending ? t("saving") : t("phone.continue")}
          </button>
        </div>
      </div>

      {message && <p className="rounded-2xl bg-[#e8f3ee] px-4 py-3 text-sm font-semibold text-[#2f5d50]">{message}</p>}
      {error && <p className="rounded-2xl bg-[#fff1f2] px-4 py-3 text-sm font-semibold text-[#991b1b]">{error}</p>}
      <SignOutButton>
        <button type="button" className="inline-flex items-center justify-center gap-2 rounded-full border border-[#eae4da] bg-white px-5 py-3 text-sm font-bold text-[#374151] transition hover:border-[#2f5d50] hover:text-[#2f5d50]">
          <LogOut size={16} aria-hidden />
          {t("logout")}
        </button>
      </SignOutButton>
    </div>
  );
}

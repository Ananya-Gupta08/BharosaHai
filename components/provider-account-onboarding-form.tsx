"use client";

import {SignOutButton, useUser} from "@clerk/nextjs";
import {ArrowRight, Camera, CheckCircle2, Loader2, LogOut, PhoneCall, ShieldCheck, Upload, type LucideIcon} from "lucide-react";
import Image from "next/image";
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
    return <p className="text-sm font-semibold text-[var(--secondary-text)]">{t("loading")}</p>;
  }

  if (!user) {
    return <p className="text-sm font-semibold text-[var(--error)]">{t("signedOut")}</p>;
  }

  const emailVerified = user.primaryEmailAddress?.verification.status === "verified";
  const displayName = user.fullName || user.primaryEmailAddress?.emailAddress || t("accountFallback");

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
      <div className="rounded-[24px] border border-[var(--border)] bg-[var(--background)] p-4 sm:p-5">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-white">
            {user.imageUrl ? (
              <Image src={user.imageUrl} alt={displayName} fill sizes="64px" className="object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center bg-[var(--hover-bg)] font-heading text-xl font-bold text-[var(--primary)]">
                {displayName.slice(0, 1).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <p className="font-heading text-lg font-bold text-[var(--primary)]">{displayName}</p>
            <p className="mt-1 text-sm font-semibold text-[var(--secondary-text)]">{user.primaryEmailAddress?.emailAddress}</p>
          </div>
        </div>
      </div>

      <StatusCard icon={ShieldCheck} title={t("email.title")} copy={emailVerified ? t("email.verified") : t("email.pending")} complete={emailVerified} />

      <label className="group cursor-pointer rounded-[24px] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
        <span className="flex items-start justify-between gap-4">
          <span>
            <span className="flex items-center gap-3 font-heading text-base font-bold text-[var(--foreground)]">
              <Camera className="text-[var(--primary)]" size={22} aria-hidden />
              {t("photo.title")}
            </span>
            <span className="mt-2 block text-sm leading-6 text-[var(--secondary-text)]">{t("photo.copy")}</span>
          </span>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--hover-bg)] text-[var(--primary)]">
            <Upload size={19} aria-hidden />
          </span>
        </span>
        <span className="mt-5 inline-flex max-w-full rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-xs font-bold text-[var(--primary)]">
          <span className="truncate">{photoName || t("photo.choose")}</span>
        </span>
        <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => saveProfilePhoto(event.target.files?.[0])} />
      </label>

      <div className="rounded-[24px] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)]">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--hover-bg)] text-[var(--primary)]">
            <PhoneCall size={22} aria-hidden />
          </span>
          <div>
            <p className="font-heading text-base font-bold text-[var(--foreground)]">{t("phone.title")}</p>
            <p className="mt-1 text-sm leading-6 text-[var(--secondary-text)]">{t("phone.copy")}</p>
          </div>
        </div>
        <div className="mt-5 grid gap-3">
          <input value={mobile} onChange={(event) => setMobile(event.target.value)} inputMode="tel" className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10" placeholder={t("phone.placeholder")} aria-label={t("phone.title")} />
          <button type="button" disabled={pending || !emailVerified || !mobile} onClick={continueToDashboard} className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60">
            {pending ? <Loader2 className="animate-spin" size={16} aria-hidden /> : <ArrowRight size={16} aria-hidden />}
            {pending ? t("saving") : t("phone.continue")}
          </button>
        </div>
      </div>

      {message && <p className="rounded-2xl border border-[var(--success)]/20 bg-[var(--success)]/10 px-4 py-3 text-sm font-semibold text-[var(--success)]">{message}</p>}
      {error && <p className="rounded-2xl border border-[var(--error)]/20 bg-[var(--error)]/10 px-4 py-3 text-sm font-semibold text-[var(--error)]">{error}</p>}
      <SignOutButton>
        <button type="button" className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-white px-5 py-3 text-sm font-bold text-[var(--secondary-text)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]">
          <LogOut size={16} aria-hidden />
          {t("logout")}
        </button>
      </SignOutButton>
    </div>
  );
}

function StatusCard({icon: Icon, title, copy, complete}: {icon: LucideIcon; title: string; copy: string; complete: boolean}) {
  return (
    <div className="rounded-[24px] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-start gap-3">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${complete ? "bg-[var(--success)]/10 text-[var(--success)]" : "bg-[var(--accent)]/10 text-[var(--accent)]"}`}>
          {complete ? <CheckCircle2 size={22} aria-hidden /> : <Icon size={22} aria-hidden />}
        </span>
        <div>
          <p className="font-heading text-base font-bold text-[var(--foreground)]">{title}</p>
          <p className="mt-1 text-sm leading-6 text-[var(--secondary-text)]">{copy}</p>
        </div>
      </div>
    </div>
  );
}

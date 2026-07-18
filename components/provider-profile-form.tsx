"use client";

import {useUser} from "@clerk/nextjs";
import {Camera} from "lucide-react";
import {useTranslations} from "next-intl";
import {useActionState, useState} from "react";

import {syncCurrentProviderAccount, updateProviderProfile} from "@/lib/actions/provider-auth-actions";

type ProviderProfileFormProps = {
  profile: {
    name: string;
    email: string;
    mobile: string;
    city: string;
    address: string;
    specialization: string;
    experienceYears: number;
    languages: string[];
    officeAddress: string;
    bio: string;
  };
};

const initialState = {status: "idle" as const};

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

export function ProviderProfileForm({profile}: ProviderProfileFormProps) {
  const t = useTranslations("provider.dashboard.profile");
  const {user} = useUser();
  const [state, formAction, pending] = useActionState(updateProviderProfile, initialState);
  const [photoName, setPhotoName] = useState("");
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoMessage, setPhotoMessage] = useState<string | null>(null);

  async function saveProfilePhoto(file: File | undefined) {
    if (!file || !user) {
      return;
    }

    setPhotoName(file.name);
    setPhotoError(null);
    setPhotoMessage(null);

    try {
      await user.setProfileImage({file});
      await user.reload();
      await syncCurrentProviderAccount();
      setPhotoMessage(t("photoSaved"));
    } catch (caught) {
      setPhotoError(clerkErrorMessage(caught, t("photoError")));
    }
  }

  return (
    <form action={formAction} className="mt-8 grid gap-4 md:grid-cols-2">
      <ReadonlyField label={t("fields.email")} value={profile.email} />
      <ReadonlyField label={t("fields.mobile")} value={profile.mobile} />
      <Input name="city" label={t("fields.city")} defaultValue={profile.city} />
      <Input name="specialization" label={t("fields.specialization")} defaultValue={profile.specialization} />
      <Input name="experienceYears" label={t("fields.experience")} defaultValue={String(profile.experienceYears)} type="number" />
      <Input name="languages" label={t("fields.languages")} defaultValue={profile.languages.join(", ")} />
      <Textarea name="address" label={t("fields.address")} defaultValue={profile.address} />
      <Textarea name="officeAddress" label={t("fields.officeAddress")} defaultValue={profile.officeAddress} />
      <Textarea name="bio" label={t("fields.bio")} defaultValue={profile.bio} className="md:col-span-2" />
      <label className="rounded-2xl border border-[#eae4da] bg-[#f7f4ee] p-4 md:col-span-2">
        <span className="flex items-center gap-2 text-sm font-bold text-[#111827]"><Camera size={17} className="text-[#2f5d50]" aria-hidden />{t("fields.photo")}</span>
        <span className="mt-3 inline-flex rounded-full bg-white px-4 py-2 text-xs font-bold text-[#2f5d50]">{photoName || t("choosePhoto")}</span>
        <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => saveProfilePhoto(event.target.files?.[0])} />
      </label>
      {(state.messageKey || photoMessage || photoError) && (
        <div className="md:col-span-2">
          {state.messageKey && <p className={`rounded-2xl px-4 py-3 text-sm font-semibold ${state.status === "success" ? "bg-[#e8f3ee] text-[#2f5d50]" : "bg-[#fff1f2] text-[#991b1b]"}`}>{t(state.messageKey)}</p>}
          {photoMessage && <p className="rounded-2xl bg-[#e8f3ee] px-4 py-3 text-sm font-semibold text-[#2f5d50]">{photoMessage}</p>}
          {photoError && <p className="rounded-2xl bg-[#fff1f2] px-4 py-3 text-sm font-semibold text-[#991b1b]">{photoError}</p>}
          {state.errors && state.errors.length > 0 && <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#991b1b]">{state.errors.map((error) => <li key={error}>{error}</li>)}</ul>}
        </div>
      )}
      <button disabled={pending} className="rounded-full bg-[#2f5d50] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#264c42] disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2">
        {pending ? t("saving") : t("save")}
      </button>
    </form>
  );
}

function ReadonlyField({label, value}: {label: string; value: string}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#6b7280]">{label}</span>
      <input value={value} readOnly className="rounded-2xl border border-[#eae4da] bg-[#f7f4ee] px-4 py-3 text-sm text-[#6b7280] outline-none" />
    </label>
  );
}

function Input({name, label, defaultValue, type = "text"}: {name: string; label: string; defaultValue: string; type?: string}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#6b7280]">{label}</span>
      <input name={name} type={type} defaultValue={defaultValue} className="rounded-2xl border border-[#eae4da] bg-white px-4 py-3 text-sm text-[#1f2937] outline-none transition focus:border-[#2f5d50]" />
    </label>
  );
}

function Textarea({name, label, defaultValue, className = ""}: {name: string; label: string; defaultValue: string; className?: string}) {
  return (
    <label className={`grid gap-2 ${className}`}>
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#6b7280]">{label}</span>
      <textarea name={name} defaultValue={defaultValue} className="min-h-28 rounded-2xl border border-[#eae4da] bg-white px-4 py-3 text-sm text-[#1f2937] outline-none transition focus:border-[#2f5d50]" />
    </label>
  );
}

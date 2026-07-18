"use server";

import {revalidatePath} from "next/cache";
import {z} from "zod";

import {syncProviderAccountFromClerk} from "@/lib/auth/provider-account";
import {prisma} from "@/lib/db/prisma";

const onboardingProfileSchema = z.object({
  mobile: z.string().trim().min(8).max(20)
});

const providerProfileUpdateSchema = z.object({
  city: z.string().trim().min(2).max(80),
  address: z.string().trim().min(5).max(300),
  specialization: z.string().trim().max(120).optional(),
  experienceYears: z.coerce.number().int().min(0).max(60),
  languages: z
    .string()
    .trim()
    .min(2)
    .max(200)
    .transform((value) =>
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    )
    .pipe(z.array(z.string().min(2).max(40)).min(1)),
  officeAddress: z.string().trim().min(5).max(300),
  bio: z.string().trim().min(20).max(1200)
});

export type ProviderProfileState = {
  status: "idle" | "success" | "error";
  messageKey?: string;
  errors?: string[];
};

export async function syncCurrentProviderAccount() {
  const account = await syncProviderAccountFromClerk();

  if (!account) {
    return {status: "error" as const};
  }

  revalidatePath("/[locale]/provider/dashboard", "page");
  revalidatePath("/[locale]/provider/onboarding", "page");

  return {
    status: "success" as const,
    emailVerified: account.user.emailVerified,
    phoneVerified: account.user.phoneVerified
  };
}

export async function saveProviderOnboardingProfile(mobile: string) {
  const parsed = onboardingProfileSchema.safeParse({mobile});

  if (!parsed.success) {
    return {status: "validationError" as const};
  }

  const account = await syncProviderAccountFromClerk();

  if (!account || !account.user.emailVerified) {
    return {status: "emailRequired" as const};
  }

  await prisma.$transaction([
    prisma.user.update({
      where: {id: account.user.id},
      data: {mobile: parsed.data.mobile}
    }),
    prisma.provider.update({
      where: {id: account.provider.id},
      data: {mobile: parsed.data.mobile}
    })
  ]);

  revalidatePath("/[locale]/provider/dashboard", "page");
  revalidatePath("/[locale]/provider/onboarding", "page");
  revalidatePath("/[locale]/provider/register", "page");

  return {status: "success" as const};
}

export async function updateProviderProfile(_previousState: ProviderProfileState, formData: FormData): Promise<ProviderProfileState> {
  const account = await syncProviderAccountFromClerk();

  if (!account || !account.user.emailVerified || !account.user.mobile) {
    return {status: "error" as const, messageKey: "profile.authRequired"};
  }

  const parsed = providerProfileUpdateSchema.safeParse({
    city: formData.get("city"),
    address: formData.get("address"),
    specialization: formData.get("specialization"),
    experienceYears: formData.get("experienceYears"),
    languages: formData.get("languages"),
    officeAddress: formData.get("officeAddress"),
    bio: formData.get("bio")
  });

  if (!parsed.success) {
    return {
      status: "error" as const,
      messageKey: "profile.validationError",
      errors: parsed.error.issues.map((issue) => {
        const field = issue.path.join(".");

        return field ? `${field}: ${issue.message}` : issue.message;
      })
    };
  }

  await prisma.provider.update({
    where: {id: account.provider.id},
    data: {
      city: parsed.data.city,
      address: parsed.data.address,
      specialization: parsed.data.specialization || null,
      experienceYears: parsed.data.experienceYears,
      languages: parsed.data.languages,
      officeAddress: parsed.data.officeAddress,
      bio: parsed.data.bio
    }
  });

  revalidatePath("/[locale]/provider/dashboard", "page");

  return {status: "success" as const, messageKey: "profile.success"};
}

import {auth, currentUser} from "@clerk/nextjs/server";
import {Role} from "@prisma/client";

import {prisma} from "@/lib/db/prisma";

function isVerified(verification: {status?: string | null} | null | undefined) {
  return verification?.status === "verified";
}

function fullName(firstName: string | null | undefined, lastName: string | null | undefined, fallback: string) {
  const name = [firstName, lastName].filter(Boolean).join(" ").trim();

  return name || fallback;
}

export async function syncProviderAccountFromClerk() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const primaryEmail = clerkUser.primaryEmailAddress ?? clerkUser.emailAddresses[0] ?? null;
  const primaryPhone = clerkUser.primaryPhoneNumber ?? clerkUser.phoneNumbers[0] ?? null;

  if (!primaryEmail?.emailAddress) {
    throw new Error("A verified email address is required before provider onboarding.");
  }

  const email = primaryEmail.emailAddress.toLowerCase();
  const name = fullName(clerkUser.firstName, clerkUser.lastName, email);
  const profilePhotoUrl = clerkUser.imageUrl || null;
  const emailVerified = isVerified(primaryEmail.verification);
  const phoneVerified = isVerified(primaryPhone?.verification);

  return prisma.$transaction(async (tx) => {
    const existingUser = await tx.user.findUnique({
      where: {email}
    });
    const mobile = primaryPhone?.phoneNumber ?? existingUser?.mobile ?? null;

    const user = await tx.user.upsert({
      where: {email},
      update: {
        clerkId: clerkUser.id,
        name,
        mobile,
        profilePhotoUrl,
        emailVerified,
        phoneVerified,
        role: Role.PROVIDER
      },
      create: {
        clerkId: clerkUser.id,
        email,
        name,
        mobile,
        profilePhotoUrl,
        emailVerified,
        phoneVerified,
        role: Role.PROVIDER
      }
    });

    const provider = await tx.provider.upsert({
      where: {userId: user.id},
      update: {
        name,
        email,
        mobile,
        profilePhotoUrl
      },
      create: {
        userId: user.id,
        name,
        email,
        mobile,
        profilePhotoUrl,
        status: "DRAFT"
      }
    });

    return {user, provider};
  });
}

export async function requireProviderAccount() {
  await auth.protect();

  const account = await syncProviderAccountFromClerk();

  if (!account) {
    throw new Error("Provider account is required.");
  }

  return account;
}

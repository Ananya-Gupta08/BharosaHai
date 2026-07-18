import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import {redirect} from "next/navigation";

import {ProviderDashboardView} from "@/components/provider-dashboard-view";
import {requireProviderAccount} from "@/lib/auth/provider-account";
import {prisma} from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "provider.dashboard.metadata"});

  return {
    title: t("title"),
    description: t("description")
  };
}

export default async function ProviderDashboardPage({params}: Props) {
  const {locale} = await params;
  const account = await requireProviderAccount();

  if (!account.user.emailVerified || !account.user.mobile) {
    redirect(`/${locale}/provider/onboarding`);
  }

  const provider = await prisma.provider.findUnique({
    where: {id: account.provider.id},
    select: {
      id: true,
      status: true,
      name: true,
      email: true,
      mobile: true,
      city: true,
      address: true,
      specialization: true,
      experienceYears: true,
      languages: true,
      officeAddress: true,
      bio: true,
      createdAt: true,
      categoryId: true,
      declarationAcceptedAt: true,
      verifiedAt: true,
      documents: {
        orderBy: {uploadedAt: "desc"},
        select: {
          id: true,
          documentType: true,
          originalFileName: true,
          fileName: true,
          status: true,
          uploadedAt: true,
          reviewedAt: true,
          storagePath: true
        }
      },
      verificationRequests: {
        orderBy: {createdAt: "desc"},
        take: 8,
        select: {
          id: true,
          status: true,
          message: true,
          createdAt: true
        }
      }
    }
  });

  if (!provider) {
    redirect(`/${locale}/provider/onboarding`);
  }

  const documentCount = provider.documents.length;
  const hasSubmittedApplication = Boolean(provider.categoryId && provider.declarationAcceptedAt);

  return (
    <ProviderDashboardView
      status={provider.status}
      documentCount={documentCount}
      hasSubmittedApplication={hasSubmittedApplication}
      provider={{
        name: provider.name,
        email: provider.email,
        mobile: provider.mobile ?? "",
        city: provider.city ?? "",
        address: provider.address ?? "",
        specialization: provider.specialization ?? "",
        experienceYears: provider.experienceYears ?? 0,
        languages: provider.languages,
        officeAddress: provider.officeAddress ?? "",
        bio: provider.bio ?? "",
        createdAt: provider.createdAt,
        declarationAcceptedAt: provider.declarationAcceptedAt,
        verifiedAt: provider.verifiedAt,
        emailVerifiedAt: account.user.updatedAt,
        phoneVerifiedAt: account.user.mobile ? account.user.updatedAt : null
      }}
      documents={provider.documents}
      verificationRequests={provider.verificationRequests}
    />
  );
}

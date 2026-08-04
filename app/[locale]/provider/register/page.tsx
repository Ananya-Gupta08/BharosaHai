import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import {redirect} from "next/navigation";

import ProviderRegisterPage from "@/components/provider-registration-view";
import {requireProviderAccount} from "@/lib/auth/provider-account";
import {prisma} from "@/lib/db/prisma";
import {isDatabaseConnectionError} from "@/lib/db/errors";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "provider.register.metadata"});

  return {
    title: t("title"),
    description: t("description")
  };
}

export default async function ProtectedProviderRegisterPage({params}: Props) {
  const {locale} = await params;
  let account;

  try {
    account = await requireProviderAccount();
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      redirect(`/${locale}/provider/setup-error`);
    }

    throw error;
  }

  if (!account.user.emailVerified || !account.user.mobile) {
    redirect(`/${locale}/provider/onboarding`);
  }

  if (account.provider.status === "PENDING" || account.provider.status === "NEEDS_MORE_DOCUMENTS" || account.provider.status === "REJECTED") {
    redirect(`/${locale}/provider/verification`);
  }

  if (account.provider.status === "APPROVED") {
    redirect(`/${locale}/provider/dashboard`);
  }

  const categories = await prisma.category.findMany({
    orderBy: {name: "asc"},
    include: {
      subCategories: {orderBy: {name: "asc"}},
      services: {orderBy: {name: "asc"}}
    }
  });

  return (
    <ProviderRegisterPage
      categories={categories.map((category) => ({
        value: category.slug,
        label: category.name,
        specializations: category.subCategories.map((item) => ({value: item.slug, label: item.name})),
        services: category.services.map((item) => ({value: item.name, label: item.name}))
      }))}
    />
  );
}

import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import {ProviderPortalDashboard} from "@/components/provider-portal-workspace";
import {requireProviderWorkspace} from "@/lib/auth/provider-workspace";
import {getProviderPortalData} from "@/lib/services/provider-portal-service";

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
  const account = await requireProviderWorkspace(locale);
  const data = await getProviderPortalData(account.provider.id);

  return <ProviderPortalDashboard data={data} />;
}

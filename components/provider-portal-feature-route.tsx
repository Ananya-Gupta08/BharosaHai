import {ProviderPortalFeaturePage} from "@/components/provider-portal-workspace";
import {requireProviderWorkspace} from "@/lib/auth/provider-workspace";
import {getProviderPortalData} from "@/lib/services/provider-portal-service";

type ProviderFeatureRouteProps = {
  params: Promise<{locale: string}>;
  feature: string;
};

export async function ProviderPortalFeatureRoute({params, feature}: ProviderFeatureRouteProps) {
  const {locale} = await params;
  const account = await requireProviderWorkspace(locale);
  const data = await getProviderPortalData(account.provider.id);

  return <ProviderPortalFeaturePage data={data} feature={feature} />;
}

import {ProviderFeaturePage} from "@/components/provider-feature-page";
import {requireProviderWorkspace} from "@/lib/auth/provider-workspace";

type Props = {params: Promise<{locale: string}>};

export default async function ProviderSettingsPage({params}: Props) {
  const {locale} = await params;
  const account = await requireProviderWorkspace(locale);

  return <ProviderFeaturePage status={account.provider.status} providerName={account.provider.name} provider={account.provider} featureKey="settings" href="/provider/settings" />;
}

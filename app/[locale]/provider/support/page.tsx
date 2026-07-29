import {ProviderPortalFeatureRoute} from "@/components/provider-portal-feature-route";

type Props = {params: Promise<{locale: string}>};

export default async function ProviderSupportPage({params}: Props) {
  return <ProviderPortalFeatureRoute params={params} feature="support" />;
}

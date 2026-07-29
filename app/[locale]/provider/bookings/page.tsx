import {ProviderPortalFeatureRoute} from "@/components/provider-portal-feature-route";

type Props = {params: Promise<{locale: string}>};

export default async function ProviderBookingsPage({params}: Props) {
  return <ProviderPortalFeatureRoute params={params} feature="bookings" />;
}

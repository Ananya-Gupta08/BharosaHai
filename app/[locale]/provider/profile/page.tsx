import {ProviderFeaturePage} from "@/components/provider-feature-page";
import {requireProviderWorkspace} from "@/lib/auth/provider-workspace";
import {prisma} from "@/lib/db/prisma";

type Props = {params: Promise<{locale: string}>};

export default async function ProviderProfilePage({params}: Props) {
  const {locale} = await params;
  const account = await requireProviderWorkspace(locale);
  const documents = await prisma.providerDocument.findMany({
    where: {providerId: account.provider.id},
    orderBy: {uploadedAt: "desc"}
  });

  return <ProviderFeaturePage status={account.provider.status} providerName={account.provider.name} provider={account.provider} documents={documents} featureKey="profile" href="/provider/profile" />;
}

import {ProviderFeaturePage} from "@/components/provider-feature-page";
import {requireProviderWorkspace} from "@/lib/auth/provider-workspace";
import {prisma} from "@/lib/db/prisma";

type Props = {params: Promise<{locale: string}>};

export default async function ProviderVerificationPage({params}: Props) {
  const {locale} = await params;
  const account = await requireProviderWorkspace(locale);
  const [documents, verificationRequests] = await Promise.all([
    prisma.providerDocument.findMany({
      where: {providerId: account.provider.id},
      orderBy: {uploadedAt: "desc"}
    }),
    prisma.verificationRequest.findMany({
      where: {providerId: account.provider.id},
      orderBy: {createdAt: "desc"}
    })
  ]);

  return <ProviderFeaturePage status={account.provider.status} providerName={account.provider.name} provider={account.provider} documents={documents} verificationRequests={verificationRequests} featureKey="verification" href="/provider/verification" />;
}

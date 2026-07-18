import {NextResponse} from "next/server";

import {requireProviderAccount} from "@/lib/auth/provider-account";
import {prisma} from "@/lib/db/prisma";
import {createProviderDocumentSignedUrl} from "@/lib/storage/provider-documents";

type Props = {
  params: Promise<{id: string}>;
};

export const dynamic = "force-dynamic";

function unavailable() {
  return new Response("Document unavailable.", {
    status: 404,
    headers: {"content-type": "text/plain; charset=utf-8"}
  });
}

export async function GET(_request: Request, {params}: Props) {
  const account = await requireProviderAccount();
  const {id} = await params;
  const document = await prisma.providerDocument.findFirst({
    where: {
      id,
      providerId: account.provider.id
    }
  });

  if (!document) {
    return unavailable();
  }

  const signedUrl = await createProviderDocumentSignedUrl(document.storagePath);

  if (!signedUrl) {
    return unavailable();
  }

  return NextResponse.redirect(signedUrl);
}

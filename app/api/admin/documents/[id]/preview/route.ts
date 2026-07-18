import {NextResponse} from "next/server";

import {hasAdminAccess} from "@/lib/auth/admin-session";
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
  if (!(await hasAdminAccess())) {
    return new Response("Unauthorized", {status: 401});
  }

  const {id} = await params;
  const document = await prisma.providerDocument.findUnique({
    where: {id}
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

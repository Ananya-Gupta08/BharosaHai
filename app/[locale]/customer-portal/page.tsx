import {redirect} from "next/navigation";

export default async function CustomerPortalRedirect({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  redirect(`/${locale}/customer`);
}

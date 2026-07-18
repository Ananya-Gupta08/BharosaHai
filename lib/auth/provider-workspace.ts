import {redirect} from "next/navigation";

import {requireProviderAccount} from "@/lib/auth/provider-account";

export async function requireProviderWorkspace(locale: string) {
  const account = await requireProviderAccount();

  if (!account.user.emailVerified || !account.user.mobile) {
    redirect(`/${locale}/provider/onboarding`);
  }

  return account;
}

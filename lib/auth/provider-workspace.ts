import {redirect} from "next/navigation";

import {requireProviderAccount} from "@/lib/auth/provider-account";
import {isDatabaseConnectionError} from "@/lib/db/errors";

export async function requireProviderWorkspace(locale: string) {
  let account;

  try {
    account = await requireProviderAccount();
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      redirect(`/${locale}/provider/setup-error`);
    }

    throw error;
  }

  if (!account.user.emailVerified || !account.user.mobile) {
    redirect(`/${locale}/provider/onboarding`);
  }

  return account;
}

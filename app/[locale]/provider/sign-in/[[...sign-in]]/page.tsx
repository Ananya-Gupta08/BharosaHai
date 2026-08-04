import {SignIn} from "@clerk/nextjs";
import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";

import {ProviderAuthShell, providerClerkAppearance} from "@/components/provider-auth-shell";
import {SiteShell} from "@/components/site-shell";

type Props = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "provider.auth.signIn.metadata"});

  return {
    title: t("title"),
    description: t("description")
  };
}

export default async function ProviderSignInPage({params}: Props) {
  const {locale} = await params;
  return (
    <SiteShell visualStyle="indian-marketplace">
      <ProviderAuthShell mode="sign-in">
        <SignIn
          routing="path"
          path={`/${locale}/provider/sign-in`}
          signUpUrl={`/${locale}/provider/sign-up`}
          forceRedirectUrl={`/${locale}/provider/dashboard`}
          fallbackRedirectUrl={`/${locale}/provider/dashboard`}
          appearance={providerClerkAppearance}
        />
      </ProviderAuthShell>
    </SiteShell>
  );
}

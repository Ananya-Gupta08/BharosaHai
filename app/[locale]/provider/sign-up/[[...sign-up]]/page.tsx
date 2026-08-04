import {SignUp} from "@clerk/nextjs";
import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";

import {ProviderAuthShell, providerClerkAppearance} from "@/components/provider-auth-shell";
import {SiteShell} from "@/components/site-shell";

type Props = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "provider.auth.signUp.metadata"});

  return {
    title: t("title"),
    description: t("description")
  };
}

export default async function ProviderSignUpPage({params}: Props) {
  const {locale} = await params;
  return (
    <SiteShell visualStyle="indian-marketplace">
      <ProviderAuthShell mode="sign-up">
        <SignUp
          routing="path"
          path={`/${locale}/provider/sign-up`}
          signInUrl={`/${locale}/provider/sign-in`}
          forceRedirectUrl={`/${locale}/provider/onboarding`}
          fallbackRedirectUrl={`/${locale}/provider/onboarding`}
          unsafeMetadata={{role: "PROVIDER"}}
          appearance={providerClerkAppearance}
        />
      </ProviderAuthShell>
    </SiteShell>
  );
}

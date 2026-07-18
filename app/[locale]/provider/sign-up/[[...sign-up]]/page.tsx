import {SignUp} from "@clerk/nextjs";
import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";

import {MotionSection} from "@/components/motion-section";
import {Card, PageHero, container, pageY} from "@/components/premium-ui";
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
  const t = await getTranslations({locale, namespace: "provider.auth.signUp"});

  return (
    <SiteShell>
      <PageHero eyebrow={t("hero.eyebrow")} title={t("hero.title")} copy={t("hero.copy")} image={{src: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80", alt: t("hero.imageAlt")}} />
      <MotionSection className={`${container} ${pageY}`}>
        <Card className="mx-auto flex max-w-xl justify-center">
          <SignUp
            routing="path"
            path={`/${locale}/provider/sign-up`}
            signInUrl={`/${locale}/provider/sign-in`}
            forceRedirectUrl={`/${locale}/provider/onboarding`}
            fallbackRedirectUrl={`/${locale}/provider/onboarding`}
            unsafeMetadata={{role: "PROVIDER"}}
          />
        </Card>
      </MotionSection>
    </SiteShell>
  );
}

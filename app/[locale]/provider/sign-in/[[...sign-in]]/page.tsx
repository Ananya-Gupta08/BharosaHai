import {SignIn} from "@clerk/nextjs";
import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";

import {SiteShell} from "@/components/site-shell";
import {Card, PageHero, container, pageY} from "@/components/premium-ui";
import {MotionSection} from "@/components/motion-section";

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
  const t = await getTranslations({locale, namespace: "provider.auth.signIn"});

  return (
    <SiteShell>
      <PageHero eyebrow={t("hero.eyebrow")} title={t("hero.title")} copy={t("hero.copy")} image={{src: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80", alt: t("hero.imageAlt")}} />
      <MotionSection className={`${container} ${pageY}`}>
        <Card className="mx-auto flex max-w-xl justify-center">
          <SignIn
            routing="path"
            path={`/${locale}/provider/sign-in`}
            signUpUrl={`/${locale}/provider/sign-up`}
            forceRedirectUrl={`/${locale}/provider/dashboard`}
            fallbackRedirectUrl={`/${locale}/provider/dashboard`}
          />
        </Card>
      </MotionSection>
    </SiteShell>
  );
}

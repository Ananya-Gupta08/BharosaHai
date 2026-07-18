import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import {redirect} from "next/navigation";

import {MotionSection} from "@/components/motion-section";
import {Card, PageHero, SectionHeader, container, pageY} from "@/components/premium-ui";
import {ProviderAccountOnboardingForm} from "@/components/provider-account-onboarding-form";
import {SiteShell} from "@/components/site-shell";
import {requireProviderAccount} from "@/lib/auth/provider-account";

type Props = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "provider.onboarding.metadata"});

  return {
    title: t("title"),
    description: t("description")
  };
}

export default async function ProviderOnboardingPage({params}: Props) {
  const {locale} = await params;
  const account = await requireProviderAccount();

  if (account.user.emailVerified && account.user.mobile) {
    redirect(`/${locale}/provider/dashboard`);
  }

  const t = await getTranslations({locale, namespace: "provider.onboarding"});

  return (
    <SiteShell>
      <PageHero eyebrow={t("hero.eyebrow")} title={t("hero.title")} copy={t("hero.copy")} image={{src: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80", alt: t("hero.imageAlt")}} />
      <MotionSection className={`${container} ${pageY}`}>
        <Card className="mx-auto max-w-2xl">
          <SectionHeader eyebrow={t("card.eyebrow")} title={t("card.title")} copy={t("card.copy")} />
          <div className="mt-8">
            <ProviderAccountOnboardingForm initialMobile={account.user.mobile} />
          </div>
        </Card>
      </MotionSection>
    </SiteShell>
  );
}

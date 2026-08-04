import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import {redirect} from "next/navigation";
import {Camera, CheckCircle2, ClipboardCheck, PhoneCall, ShieldCheck} from "lucide-react";

import {HeroBackgroundCarousel} from "@/components/hero-background-carousel";
import {MotionSection} from "@/components/motion-section";
import {ProviderAccountOnboardingForm} from "@/components/provider-account-onboarding-form";
import {SiteShell} from "@/components/site-shell";
import {requireProviderAccount} from "@/lib/auth/provider-account";
import {isDatabaseConnectionError} from "@/lib/db/errors";

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
  let account;

  try {
    account = await requireProviderAccount();
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      redirect(`/${locale}/provider/setup-error`);
    }

    throw error;
  }

  if (account.user.emailVerified && account.user.mobile) {
    redirect(`/${locale}/provider/dashboard`);
  }

  const t = await getTranslations({locale, namespace: "provider.onboarding"});
  const steps = t.raw("journey.items") as string[];
  const stepIcons = [ShieldCheck, PhoneCall, Camera, ClipboardCheck];

  return (
    <SiteShell visualStyle="indian-marketplace">
      <MotionSection className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <HeroBackgroundCarousel align="left">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <span className="inline-flex rounded-full border border-[var(--border)] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)] shadow-[var(--shadow-soft)]">
                {t("hero.eyebrow")}
              </span>
              <h1 className="mt-5 max-w-3xl font-heading text-4xl font-bold leading-tight text-[var(--primary)] sm:text-5xl">
                {t("hero.title")}
              </h1>
              <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-[var(--foreground)]">
                {t("hero.copy")}
              </p>
              <div className="mt-7 grid gap-3">
                {steps.map((item, index) => {
                  const Icon = stepIcons[index] ?? CheckCircle2;

                  return (
                    <div key={item} className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm font-bold text-[var(--foreground)] shadow-[var(--shadow-soft)]">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--hover-bg)] text-[var(--primary)]">
                        <Icon size={18} aria-hidden />
                      </span>
                      {item}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="rounded-[30px] border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-lift)] sm:p-6">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">{t("card.eyebrow")}</p>
                  <h2 className="mt-2 font-heading text-2xl font-bold text-[var(--primary)]">{t("card.title")}</h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--secondary-text)]">{t("card.copy")}</p>
                </div>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary)] text-white">
                  <ShieldCheck size={24} aria-hidden />
                </span>
              </div>
              <div>
            <ProviderAccountOnboardingForm initialMobile={account.user.mobile} />
              </div>
            </div>
          </div>
        </HeroBackgroundCarousel>
      </MotionSection>
    </SiteShell>
  );
}

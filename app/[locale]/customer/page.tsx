"use client";

import {useTranslations} from "next-intl";

import {HeroBackgroundCarousel} from "@/components/hero-background-carousel";
import {
  ComingSoonBadge,
  CustomerFeatureCard,
  CustomerPreviewPanel,
  DisabledCategoryCard,
  LaunchCityCard
} from "@/components/customer-page-components";
import {FAQAccordion, HomeSection, PrimaryButton, SecondaryButton, SectionHeading, homeContainer} from "@/components/homepage-components";
import {SiteShell} from "@/components/site-shell";
import {
  customerFaqs,
  customerFeatures,
  customerHeroMetrics,
  customerLaunchCities,
  customerServiceCategories,
  customerWhyCards
} from "@/lib/customer-page-config";

type CardText = {title: string; copy: string};
type FAQText = {question: string; answer: string};
type MetricText = {label: string; value: string};

export default function CustomerPage() {
  const t = useTranslations("customer");

  return (
    <SiteShell visualStyle="indian-marketplace">
      <section className={`${homeContainer} py-8 sm:py-10 lg:py-12`}>
        <HeroBackgroundCarousel align="left">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.92fr] lg:items-center">
            <div>
              <ComingSoonBadge>{t("hero.badge")}</ComingSoonBadge>
              <h1 className="mt-4 max-w-3xl font-heading text-4xl font-bold text-[var(--primary)] sm:text-5xl lg:text-[50px] lg:leading-[1.06]">{t("hero.title")}</h1>
              <p className="mt-4 max-w-2xl text-base font-semibold leading-8 text-[var(--foreground)] sm:text-lg">{t("hero.supporting")}</p>
              <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--secondary-text)]">{t("hero.copy")}</p>
              <div className="mt-6 flex flex-row flex-wrap gap-3">
                <PrimaryButton href="/contact">{t("hero.primary")}</PrimaryButton>
                <SecondaryButton href="/">{t("hero.secondary")}</SecondaryButton>
              </div>
            </div>

            <CustomerPreviewPanel
              title={t("preview.title")}
              copy={t("preview.copy")}
              items={customerHeroMetrics.map(({key, icon}) => {
                const item = t.raw(`preview.items.${key}`) as MetricText;
                return {...item, icon};
              })}
            />
          </div>
        </HeroBackgroundCarousel>
      </section>

      <HomeSection>
        <SectionHeading eyebrow={t("categories.eyebrow")} title={t("categories.title")} copy={t("categories.copy")} />
        <div className="mt-8 grid grid-cols-2 gap-3 min-[430px]:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          {customerServiceCategories.map(({key, icon}) => <DisabledCategoryCard key={key} icon={icon} title={t(`categories.items.${key}`)} badge={t("commonBadge")} />)}
        </div>
      </HomeSection>

      <HomeSection>
        <SectionHeading eyebrow={t("features.eyebrow")} title={t("features.title")} copy={t("features.copy")} />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {customerFeatures.map(({key, icon}) => {
            const item = t.raw(`features.items.${key}`) as CardText;
            return <CustomerFeatureCard key={key} icon={icon} title={item.title} copy={item.copy} />;
          })}
        </div>
      </HomeSection>

      <HomeSection>
        <SectionHeading eyebrow={t("cities.eyebrow")} title={t("cities.title")} copy={t("cities.copy")} />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {customerLaunchCities.map(({key}) => <LaunchCityCard key={key} name={t(`cities.items.${key}`)} badge={t("commonBadge")} />)}
        </div>
      </HomeSection>

      <HomeSection>
        <SectionHeading eyebrow={t("why.eyebrow")} title={t("why.title")} copy={t("why.copy")} align="center" />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {customerWhyCards.map(({key, icon}) => {
            const item = t.raw(`why.items.${key}`) as CardText;
            return <CustomerFeatureCard key={key} icon={icon} title={item.title} copy={item.copy} />;
          })}
        </div>
      </HomeSection>

      <HomeSection>
        <SectionHeading eyebrow={t("faq.eyebrow")} title={t("faq.title")} copy={t("faq.copy")} />
        <div className="mt-10">
          <FAQAccordion items={customerFaqs.map(({key}) => t.raw(`faq.items.${key}`) as FAQText)} />
        </div>
      </HomeSection>
    </SiteShell>
  );
}

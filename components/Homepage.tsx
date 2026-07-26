"use client";

import {MapPin, Search} from "lucide-react";
import {useTranslations} from "next-intl";

import {HeroBackgroundCarousel} from "@/components/hero-background-carousel";
import {
  ArticleCard,
  CityCard,
  ExploreCategoryCard,
  FAQAccordion,
  FeaturedProviderCard,
  HomeSection,
  HowStepCard,
  PopularServiceCard,
  PremiumCard,
  PrimaryButton,
  SecondaryButton,
  SectionHeading,
  TestimonialCard,
  homeContainer
} from "@/components/homepage-components";
import {SiteShell} from "@/components/site-shell";
import {
  homepageCities,
  homepageFaqs,
  homepageHowSteps,
  homepageKnowledgeArticles,
  homepagePopularServices,
  homepageProviders,
  homepageTestimonials,
  homepageWhyCards
} from "@/lib/homepage-config";

type CardText = {title: string; copy: string};
type ProviderText = {name: string; profession: string; city: string; experience: string; rating: string};
type TestimonialText = {label: string; quote: string; credit: string};
type ArticleText = CardText & {meta: string};
type FAQText = {question: string; answer: string};

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <SiteShell visualStyle="indian-marketplace">
      <section className={`${homeContainer} py-8 text-center sm:py-10 lg:py-12`}>
        <HeroBackgroundCarousel>
          <div className="mx-auto max-w-4xl">
            <p className="font-heading text-sm font-bold uppercase tracking-[0.08em] text-[var(--accent)]">{t("hero.eyebrow")}</p>
            <h1 className="mx-auto mt-4 max-w-4xl font-heading text-4xl font-bold text-[var(--primary)] sm:text-5xl lg:text-[52px] lg:leading-[1.06]">{t("hero.title")}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-8 text-[var(--foreground)] sm:text-lg">{t("hero.subheading")}</p>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-[var(--secondary-text)]">{t("hero.copy")}</p>

            <div className="mt-6 flex flex-row flex-wrap justify-center gap-3">
              <PrimaryButton href="/services">{t("hero.primary")}</PrimaryButton>
              <SecondaryButton href="/provider/sign-up">{t("hero.secondary")}</SecondaryButton>
            </div>

            <form className="mx-auto mt-6 grid max-w-3xl gap-3 rounded-[22px] border border-[var(--border)] bg-white p-3 text-left shadow-[var(--shadow-soft)] sm:grid-cols-[1fr_0.8fr_auto]" onSubmit={(event) => event.preventDefault()}>
              <label className="flex min-h-12 items-center gap-3 rounded-2xl bg-[var(--background)] px-4">
                <Search className="shrink-0 text-[var(--primary)]" size={19} aria-hidden />
                <input className="w-full bg-transparent text-sm font-semibold text-[var(--foreground)] outline-none placeholder:text-[var(--secondary-text)]" placeholder={t("hero.searchPlaceholder")} aria-label={t("hero.searchLabel")} />
              </label>
              <label className="flex min-h-12 items-center gap-3 rounded-2xl bg-[var(--background)] px-4">
                <MapPin className="shrink-0 text-[var(--primary)]" size={19} aria-hidden />
                <select className="w-full bg-transparent text-sm font-semibold text-[var(--foreground)] outline-none" aria-label={t("hero.locationLabel")} defaultValue="mathura">
                  <option value="mathura">{t("cities.items.mathura.name")}</option>
                  <option value="vrindavan">{t("cities.items.vrindavan.name")}</option>
                  <option value="agra">{t("cities.items.agra.name")}</option>
                  <option value="delhi">{t("cities.items.delhi.name")}</option>
                </select>
              </label>
              <button className="min-h-12 rounded-2xl bg-[var(--primary)] px-6 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--primary-hover)]">
                {t("hero.searchButton")}
              </button>
            </form>
          </div>
        </HeroBackgroundCarousel>
      </section>

      <HomeSection className="pt-4 sm:pt-6 lg:pt-8">
        <SectionHeading eyebrow={t("popular.eyebrow")} title={t("popular.title")} copy={t("popular.copy")} />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {homepagePopularServices.map(({key, icon}) => {
            const item = t.raw(`popular.items.${key}`) as CardText;
            return <PopularServiceCard key={key} href={`/services?category=${key}`} icon={icon} title={item.title} copy={item.copy} />;
          })}
        </div>
      </HomeSection>

      <HomeSection>
        <SectionHeading eyebrow={t("categories.eyebrow")} title={t("categories.title")} copy={t("categories.copy")} />
        <div className="mt-8 grid grid-cols-2 gap-3 min-[430px]:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          {homepagePopularServices.map(({key, icon}) => {
            const item = t.raw(`popular.items.${key}`) as CardText;
            return <ExploreCategoryCard key={key} icon={icon} title={item.title} badge={t("categories.badge")} />;
          })}
        </div>
      </HomeSection>

      <HomeSection>
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <SectionHeading eyebrow={t("cities.eyebrow")} title={t("cities.title")} copy={t("cities.copy")} />
            <label className="mt-7 flex min-h-12 items-center gap-3 rounded-full border border-[var(--border)] bg-white px-5 shadow-[var(--shadow-soft)]">
              <Search className="shrink-0 text-[var(--primary)]" size={18} aria-hidden />
              <input className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-[var(--secondary-text)]" placeholder={t("cities.searchPlaceholder")} aria-label={t("cities.searchLabel")} />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {homepageCities.map(({key}) => <CityCard key={key} name={t(`cities.items.${key}.name`)} copy={t(`cities.items.${key}.copy`)} />)}
          </div>
        </div>
      </HomeSection>

      <HomeSection>
        <SectionHeading eyebrow={t("why.eyebrow")} title={t("why.title")} copy={t("why.copy")} align="center" />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {homepageWhyCards.map(({key}) => {
            const item = t.raw(`why.items.${key}`) as CardText;
            return (
              <PremiumCard key={key}>
                <h3 className="font-heading text-xl font-bold text-[var(--primary)]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--secondary-text)]">{item.copy}</p>
              </PremiumCard>
            );
          })}
        </div>
      </HomeSection>

      <HomeSection>
        <SectionHeading eyebrow={t("process.eyebrow")} title={t("process.title")} copy={t("process.copy")} align="center" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {homepageHowSteps.map(({key, icon}, index) => <HowStepCard key={key} icon={icon} index={index + 1} stepLabel={t("process.stepLabel")} title={t(`process.items.${key}.title`)} />)}
        </div>
      </HomeSection>

      <HomeSection>
        <SectionHeading eyebrow={t("providers.eyebrow")} title={t("providers.title")} copy={t("providers.copy")} />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {homepageProviders.map(({key, icon, photo}) => {
            const item = t.raw(`providers.items.${key}`) as ProviderText;
            return <FeaturedProviderCard key={key} photo={photo} icon={icon} badge={t("providers.badge")} cta={t("providers.cta")} name={item.name} profession={item.profession} city={item.city} experience={item.experience} rating={item.rating} />;
          })}
        </div>
      </HomeSection>

      <HomeSection>
        <SectionHeading eyebrow={t("testimonials.eyebrow")} title={t("testimonials.title")} copy={t("testimonials.copy")} />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {homepageTestimonials.map(({key, icon}) => {
            const item = t.raw(`testimonials.items.${key}`) as TestimonialText;
            return <TestimonialCard key={key} icon={icon} label={item.label} quote={item.quote} credit={item.credit} />;
          })}
        </div>
      </HomeSection>

      <HomeSection>
        <SectionHeading eyebrow={t("knowledge.eyebrow")} title={t("knowledge.title")} copy={t("knowledge.copy")} />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {homepageKnowledgeArticles.map(({key, icon}) => {
            const item = t.raw(`knowledge.items.${key}`) as ArticleText;
            return <ArticleCard key={key} icon={icon} title={item.title} copy={item.copy} meta={item.meta} />;
          })}
        </div>
      </HomeSection>

      <HomeSection>
        <SectionHeading eyebrow={t("faqPreview.eyebrow")} title={t("faqPreview.title")} copy={t("faqPreview.copy")} />
        <div className="mt-10">
          <FAQAccordion items={homepageFaqs.map(({key}) => t.raw(`faqPreview.items.${key}`) as FAQText)} />
        </div>
      </HomeSection>
    </SiteShell>
  );
}

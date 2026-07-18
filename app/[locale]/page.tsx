"use client";

import {BadgeCheck, Banknote, ClipboardCheck, FileText, Gavel, HomeIcon, Landmark, MapPin, ShieldCheck, Sparkles, Users} from "lucide-react";
import {useTranslations} from "next-intl";
import {Link} from "@/i18n/navigation";
import {SiteShell} from "@/components/site-shell";
import {ButtonLink, CTASection, Card, Checklist, FAQAccordion, FeatureGrid, IconBadge, PageHero, SectionHeader, SplitSection, StatGrid, Timeline, container, pageY} from "@/components/premium-ui";
import {MotionSection} from "@/components/motion-section";

const serviceIcons = [Gavel, Banknote, HomeIcon, ClipboardCheck, FileText, Landmark];

type Stat = {value: string; label: string; copy: string};
type Feature = {title: string; copy: string};
type TimelineItem = {title: string; copy: string};
type Professional = {name: string; role: string; focus: string};
type FAQ = {question: string; answer: string};

export default function HomePage() {
  const t = useTranslations("home");

  const services = (t.raw("services.items") as Feature[]).map((item, index) => ({...item, icon: serviceIcons[index]}));

  return (
    <SiteShell>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        copy={t("hero.copy")}
        primary={{label: t("hero.primary"), href: "/become-a-partner"}}
        secondary={{label: t("hero.secondary"), href: "/customer-portal"}}
        image={{src: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80", alt: t("hero.imageAlt")}}
      >
        <div className="grid max-w-2xl gap-3 sm:grid-cols-3">
          {(t.raw("hero.badges") as string[]).map((item) => (
            <div key={item} className="rounded-2xl border border-[#eae4da] bg-white px-4 py-3 text-sm font-semibold text-[#374151] shadow-sm">
              {item}
            </div>
          ))}
        </div>
      </PageHero>

      <StatGrid items={t.raw("stats") as Stat[]} />

      <MotionSection className={`${container} ${pageY}`}>
        <SectionHeader eyebrow={t("services.eyebrow")} title={t("services.title")} copy={t("services.copy")} />
        <div className="mt-10">
          <FeatureGrid items={services} />
        </div>
      </MotionSection>

      <SplitSection
        eyebrow={t("how.eyebrow")}
        title={t("how.title")}
        copy={t("how.copy")}
        image={{src: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80", alt: t("how.imageAlt")}}
      >
        <Timeline items={t.raw("how.items") as TimelineItem[]} />
      </SplitSection>

      <MotionSection className={`${container} ${pageY} bg-[#f7f4ee] sm:bg-transparent`}>
        <div className="rounded-[30px] bg-[#f7f4ee] p-6 sm:p-8 lg:p-10">
          <SectionHeader eyebrow={t("verificationMatter.eyebrow")} title={t("verificationMatter.title")} copy={t("verificationMatter.copy")} />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {(t.raw("verificationMatter.items") as Feature[]).map((item) => (
              <Card key={item.title}>
                <IconBadge icon={ShieldCheck} />
                <h3 className="mt-5 font-heading text-xl font-bold text-[#1f2937]">{item.title}</h3>
                <p className="mt-3 text-base leading-7 text-[#6b7280]">{item.copy}</p>
              </Card>
            ))}
          </div>
        </div>
      </MotionSection>

      <SplitSection
        eyebrow={t("verification.eyebrow")}
        title={t("verification.title")}
        copy={t("verification.copy")}
        image={{src: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80", alt: t("verification.imageAlt")}}
        reverse
      >
        <Timeline items={t.raw("verification.items") as TimelineItem[]} />
      </SplitSection>

      <MotionSection className={`${container} ${pageY}`}>
        <SectionHeader eyebrow={t("professionals.eyebrow")} title={t("professionals.title")} copy={t("professionals.copy")} />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {(t.raw("professionals.items") as Professional[]).map((person) => (
            <Card key={person.name}>
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f7f4ee] font-heading text-lg font-bold text-[#2f5d50]">
                  {person.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-[#1f2937]">{person.name}</h3>
                  <p className="text-sm font-semibold text-[#6b7280]">{person.role}</p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-7 text-[#6b7280]">{person.focus}</p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#f7f4ee] px-3 py-2 text-xs font-bold text-[#2f5d50]">
                <BadgeCheck size={15} aria-hidden /> {t("professionals.badge")}
              </div>
            </Card>
          ))}
        </div>
      </MotionSection>

      <MotionSection className={`${container} ${pageY}`}>
        <div className="grid gap-8 rounded-[30px] border border-[#eae4da] bg-white p-6 shadow-[0_18px_60px_rgba(17,24,39,0.06)] lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
          <div>
            <SectionHeader eyebrow={t("cities.eyebrow")} title={t("cities.title")} copy={t("cities.copy")} />
            <div className="mt-8">
              <ButtonLink href="/contact" variant="secondary">{t("cities.cta")}</ButtonLink>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {(t.raw("cities.items") as string[]).map((city) => (
              <div key={city} className="flex items-center gap-3 rounded-2xl border border-[#eae4da] bg-[#f7f4ee] px-4 py-4 text-sm font-bold text-[#374151]">
                <MapPin size={18} className="text-[#2f5d50]" aria-hidden />
                {city}
              </div>
            ))}
          </div>
        </div>
      </MotionSection>

      <MotionSection className={`${container} ${pageY}`}>
        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="bg-[#2f5d50] text-white">
            <IconBadge icon={Sparkles} />
            <h2 className="mt-6 font-heading text-3xl font-bold">{t("visionMission.visionTitle")}</h2>
            <p className="mt-4 text-base leading-8 text-[#e8f1ee]">{t("visionMission.visionCopy")}</p>
          </Card>
          <Card>
            <IconBadge icon={Users} />
            <h2 className="mt-6 font-heading text-3xl font-bold text-[#111827]">{t("visionMission.missionTitle")}</h2>
            <p className="mt-4 text-base leading-8 text-[#6b7280]">{t("visionMission.missionCopy")}</p>
          </Card>
        </div>
      </MotionSection>

      <MotionSection className={`${container} ${pageY}`}>
        <SectionHeader eyebrow={t("why.eyebrow")} title={t("why.title")} align="center" />
        <div className="mt-10">
          <Checklist items={t.raw("why.items") as string[]} />
        </div>
      </MotionSection>

      <MotionSection className={`${container} ${pageY}`}>
        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <p className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-[#c6922e]">{t("testimonials.customerLabel")}</p>
            <p className="mt-5 text-xl leading-8 text-[#1f2937]">{t("testimonials.customerQuote")}</p>
            <p className="mt-5 text-sm font-bold text-[#6b7280]">{t("testimonials.customerCredit")}</p>
          </Card>
          <Card>
            <p className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-[#c6922e]">{t("testimonials.partnerLabel")}</p>
            <p className="mt-5 text-xl leading-8 text-[#1f2937]">{t("testimonials.partnerQuote")}</p>
            <p className="mt-5 text-sm font-bold text-[#6b7280]">{t("testimonials.partnerCredit")}</p>
          </Card>
        </div>
      </MotionSection>

      <MotionSection className={`${container} ${pageY}`}>
        <SectionHeader eyebrow={t("faqPreview.eyebrow")} title={t("faqPreview.title")} copy={t("faqPreview.copy")} />
        <div className="mt-10">
          <FAQAccordion items={t.raw("faqPreview.items") as FAQ[]} />
        </div>
        <Link href="/faq" className="mt-8 inline-flex items-center gap-2 font-heading text-sm font-bold text-[#2f5d50]">
          {t("faqPreview.cta")}
        </Link>
      </MotionSection>

      <CTASection title={t("cta.title")} copy={t("cta.copy")} primary={{label: t("cta.primary"), href: "/provider/sign-up"}} secondary={{label: t("cta.secondary"), href: "/become-a-partner"}} />

      <MotionSection className={`${container} pb-16 sm:pb-20 lg:pb-24`}>
        <div className="rounded-[28px] border border-[#eae4da] bg-white p-6 shadow-[0_18px_60px_rgba(17,24,39,0.05)] sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <SectionHeader eyebrow={t("newsletter.eyebrow")} title={t("newsletter.title")} copy={t("newsletter.copy")} />
            <form className="flex flex-col gap-3 sm:flex-row" onSubmit={(event) => event.preventDefault()}>
              <input aria-label={t("newsletter.emailLabel")} className="min-h-12 flex-1 rounded-full border border-[#eae4da] bg-white px-5 text-sm text-[#1f2937] outline-none transition focus:border-[#2f5d50]" placeholder={t("newsletter.placeholder")} />
              <button className="rounded-full bg-[#2f5d50] px-6 py-3 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#264c42]">
                {t("newsletter.button")}
              </button>
            </form>
          </div>
        </div>
      </MotionSection>
    </SiteShell>
  );
}

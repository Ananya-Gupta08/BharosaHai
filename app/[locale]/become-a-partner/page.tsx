"use client";

import {BadgeCheck, BadgeIndianRupee, BarChart3, BriefcaseBusiness, CheckCircle2, Crown, ShieldCheck, Users} from "lucide-react";
import {useTranslations} from "next-intl";
import {SiteShell} from "@/components/site-shell";
import {CTASection, Card, Checklist, FAQAccordion, FeatureGrid, PageHero, SectionHeader, SplitSection, Timeline, container, pageY} from "@/components/premium-ui";
import {MotionSection} from "@/components/motion-section";

type Feature = {title: string; copy: string};
type TimelineItem = {title: string; copy: string};
type FAQ = {question: string; answer: string};
const benefitIcons = [BadgeCheck, BarChart3, BriefcaseBusiness, BadgeIndianRupee, CheckCircle2, Users];

export default function BecomePartnerPage() {
  const t = useTranslations("partner");
  return (
    <SiteShell>
      <PageHero eyebrow={t("hero.eyebrow")} title={t("hero.title")} copy={t("hero.copy")} primary={{label: t("hero.primary"), href: "/provider/sign-up"}} secondary={{label: t("hero.secondary"), href: "/provider/dashboard"}} image={{src: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80", alt: t("hero.imageAlt")}} />
      <MotionSection className={`${container} ${pageY}`}><SectionHeader eyebrow={t("benefits.eyebrow")} title={t("benefits.title")} copy={t("benefits.copy")} /><div className="mt-10"><FeatureGrid items={(t.raw("benefits.items") as Feature[]).map((item, index) => ({...item, icon: benefitIcons[index]}))} /></div></MotionSection>
      <SplitSection eyebrow={t("growth.eyebrow")} title={t("growth.title")} copy={t("growth.copy")} image={{src: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80", alt: t("growth.imageAlt")}}><Checklist items={t.raw("growth.items") as string[]} /></SplitSection>
      <MotionSection className={`${container} ${pageY}`}><SectionHeader eyebrow={t("process.eyebrow")} title={t("process.title")} /><div className="mt-10"><Timeline items={t.raw("process.items") as TimelineItem[]} /></div></MotionSection>
      <MotionSection className={`${container} ${pageY}`}><div className="rounded-[30px] bg-[#f7f4ee] p-6 sm:p-8 lg:p-10"><SectionHeader eyebrow={t("who.eyebrow")} title={t("who.title")} /><div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{(t.raw("who.items") as string[]).map((item) => <Card key={item}><ShieldCheck className="text-[#2f5d50]" size={24} aria-hidden /><h3 className="mt-4 font-heading text-lg font-bold text-[#1f2937]">{item}</h3></Card>)}</div></div></MotionSection>
      <MotionSection className={`${container} ${pageY}`}><SectionHeader eyebrow={t("founding.eyebrow")} title={t("founding.title")} /><div className="mt-10 grid gap-5 lg:grid-cols-3">{(t.raw("founding.items") as Feature[]).map((item) => <Card key={item.title}><Crown className="text-[#c6922e]" size={28} aria-hidden /><h3 className="mt-5 font-heading text-2xl font-bold text-[#1f2937]">{item.title}</h3><p className="mt-3 text-base leading-7 text-[#6b7280]">{item.copy}</p></Card>)}</div></MotionSection>
      <SplitSection eyebrow={t("stories.eyebrow")} title={t("stories.title")} copy={t("stories.copy")} image={{src: "https://images.unsplash.com/photo-1573496130141-209d200cebd8?auto=format&fit=crop&w=1200&q=80", alt: t("stories.imageAlt")}} reverse><div className="grid gap-4">{(t.raw("stories.items") as string[]).map((item) => <Card key={item}><p className="text-base leading-7 text-[#374151]">{item}</p></Card>)}</div></SplitSection>
      <MotionSection className={`${container} ${pageY}`}><SectionHeader eyebrow={t("faq.eyebrow")} title={t("faq.title")} /><div className="mt-10"><FAQAccordion items={t.raw("faq.items") as FAQ[]} /></div></MotionSection>
      <CTASection title={t("cta.title")} copy={t("cta.copy")} primary={{label: t("cta.primary"), href: "/provider/sign-up"}} secondary={{label: t("cta.secondary"), href: "/contact"}} />
    </SiteShell>
  );
}

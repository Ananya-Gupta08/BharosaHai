"use client";

import {Banknote, Building2, ClipboardCheck, FileText, Gavel, HomeIcon, Landmark} from "lucide-react";
import {useTranslations} from "next-intl";
import {SiteShell} from "@/components/site-shell";
import {Card, Checklist, FAQAccordion, IconBadge, PageHero, SectionHeader, SplitSection, Timeline, container, pageY} from "@/components/premium-ui";
import {MotionSection} from "@/components/motion-section";

type Category = {title: string; overview: string; problems: string[]; services: string[]};
type FAQ = {question: string; answer: string};
type Feature = {title: string; copy: string};
type TimelineItem = {title: string; copy: string};
const icons = [Gavel, Banknote, HomeIcon, ClipboardCheck, FileText, Landmark];

export default function ServicesPage() {
  const t = useTranslations("services");
  const categories = t.raw("categories") as Category[];
  return (
    <SiteShell>
      <PageHero eyebrow={t("hero.eyebrow")} title={t("hero.title")} copy={t("hero.copy")} image={{src: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80", alt: t("hero.imageAlt")}} />
      <MotionSection className={`${container} ${pageY}`}><SectionHeader eyebrow={t("overview.eyebrow")} title={t("overview.title")} copy={t("overview.copy")} /><div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{categories.map((category, index) => { const Icon = icons[index]; return <Card key={category.title}><IconBadge icon={Icon} /><h2 className="mt-5 font-heading text-2xl font-bold text-[#1f2937]">{category.title}</h2><p className="mt-3 text-base leading-7 text-[#6b7280]">{category.overview}</p></Card>; })}</div></MotionSection>
      {categories.map((category, index) => { const Icon = icons[index]; return <MotionSection key={category.title} className={`${container} ${pageY}`}><div className={`grid gap-8 rounded-[30px] border border-[#eae4da] p-6 shadow-[0_18px_60px_rgba(17,24,39,0.05)] lg:grid-cols-[0.9fr_1.1fr] lg:p-10 ${index % 2 === 0 ? "bg-white" : "bg-[#f7f4ee]"}`}><div><IconBadge icon={Icon} /><h2 className="mt-5 font-heading text-3xl font-bold text-[#111827]">{category.title}</h2><p className="mt-4 text-base leading-8 text-[#374151]">{category.overview}</p><div className="mt-7"><Checklist items={category.services} /></div></div><div className="grid gap-5"><Card><h3 className="font-heading text-xl font-bold text-[#1f2937]">{t("labels.commonProblems")}</h3><ul className="mt-4 space-y-3 text-sm leading-7 text-[#6b7280]">{category.problems.map((problem) => <li key={problem}>{problem}</li>)}</ul></Card><Card><h3 className="font-heading text-xl font-bold text-[#1f2937]">{t("labels.benefits")}</h3><p className="mt-4 text-sm leading-7 text-[#6b7280]">{t("labels.benefitsCopy")}</p></Card></div></div></MotionSection>; })}
      <SplitSection eyebrow={t("how.eyebrow")} title={t("how.title")} copy={t("how.copy")} image={{src: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80", alt: t("how.imageAlt")}}><Timeline items={t.raw("how.items") as TimelineItem[]} /></SplitSection>
      <MotionSection className={`${container} ${pageY}`}><SectionHeader eyebrow={t("related.eyebrow")} title={t("related.title")} /><div className="mt-10 grid gap-5 md:grid-cols-3">{(t.raw("related.items") as Feature[]).map((item) => <Card key={item.title}><Building2 className="text-[#2f5d50]" size={26} aria-hidden /><h3 className="mt-5 font-heading text-xl font-bold text-[#1f2937]">{item.title}</h3><p className="mt-3 text-base leading-7 text-[#6b7280]">{item.copy}</p></Card>)}</div></MotionSection>
      <MotionSection className={`${container} ${pageY}`}><SectionHeader eyebrow={t("faq.eyebrow")} title={t("faq.title")} /><div className="mt-10"><FAQAccordion items={t.raw("faq.items") as FAQ[]} /></div></MotionSection>
    </SiteShell>
  );
}

"use client";

import {BadgeCheck, Compass, Handshake, Lightbulb, Map, ShieldCheck, Target, Users} from "lucide-react";
import {useTranslations} from "next-intl";
import {SiteShell} from "@/components/site-shell";
import {Card, Checklist, FeatureGrid, PageHero, SectionHeader, SplitSection, Timeline, container, pageY} from "@/components/premium-ui";
import {MotionSection} from "@/components/motion-section";

type Feature = {title: string; copy: string};
type TimelineItem = {title: string; copy: string};
const valueIcons = [ShieldCheck, Compass, Handshake, BadgeCheck, Lightbulb, Map];

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <SiteShell>
      <PageHero eyebrow={t("hero.eyebrow")} title={t("hero.title")} copy={t("hero.copy")} image={{src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80", alt: t("hero.imageAlt")}} />
      <SplitSection eyebrow={t("story.eyebrow")} title={t("story.title")} copy={t("story.copy")} image={{src: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80", alt: t("story.imageAlt")}}>
        <Checklist items={t.raw("story.items") as string[]} />
      </SplitSection>
      <MotionSection className={`${container} ${pageY}`}>
        <SectionHeader eyebrow={t("problem.eyebrow")} title={t("problem.title")} copy={t("problem.copy")} />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {(t.raw("problem.items") as Feature[]).map((item) => <Card key={item.title}><h3 className="font-heading text-2xl font-bold text-[#1f2937]">{item.title}</h3><p className="mt-4 text-base leading-8 text-[#6b7280]">{item.copy}</p></Card>)}
        </div>
      </MotionSection>
      <MotionSection className={`${container} ${pageY}`}>
        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="bg-[#2f5d50] text-white"><Target className="text-[#f1d49d]" size={32} aria-hidden /><h2 className="mt-5 font-heading text-3xl font-bold">{t("mission.title")}</h2><p className="mt-4 text-base leading-8 text-[#e8f1ee]">{t("mission.copy")}</p></Card>
          <Card><Users className="text-[#2f5d50]" size={32} aria-hidden /><h2 className="mt-5 font-heading text-3xl font-bold text-[#111827]">{t("mission.visionTitle")}</h2><p className="mt-4 text-base leading-8 text-[#6b7280]">{t("mission.visionCopy")}</p></Card>
        </div>
      </MotionSection>
      <MotionSection className={`${container} ${pageY}`}><SectionHeader eyebrow={t("values.eyebrow")} title={t("values.title")} /><div className="mt-10"><FeatureGrid items={(t.raw("values.items") as Feature[]).map((item, index) => ({...item, icon: valueIcons[index]}))} /></div></MotionSection>
      <SplitSection eyebrow={t("philosophy.eyebrow")} title={t("philosophy.title")} copy={t("philosophy.copy")} image={{src: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80", alt: t("philosophy.imageAlt")}} reverse><Timeline items={t.raw("philosophy.items") as TimelineItem[]} /></SplitSection>
      <MotionSection className={`${container} ${pageY}`}><SectionHeader eyebrow={t("roadmap.eyebrow")} title={t("roadmap.title")} /><div className="mt-10"><Timeline items={t.raw("roadmap.items") as TimelineItem[]} /></div></MotionSection>
      <MotionSection className={`${container} ${pageY}`}><div className="rounded-[30px] border border-[#eae4da] bg-[#f7f4ee] p-8 lg:p-12"><SectionHeader eyebrow={t("founder.eyebrow")} title={t("founder.title")} /><p className="mt-6 max-w-4xl text-xl leading-9 text-[#374151]">{t("founder.quote")}</p></div></MotionSection>
    </SiteShell>
  );
}

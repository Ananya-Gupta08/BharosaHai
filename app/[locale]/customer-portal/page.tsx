"use client";

import {Bell, CalendarDays, ClipboardList, FileCheck2, MessageSquareText, ShieldCheck} from "lucide-react";
import {useTranslations} from "next-intl";
import {SiteShell} from "@/components/site-shell";
import {Card, Checklist, FeatureGrid, PageHero, SectionHeader, Timeline, container, pageY} from "@/components/premium-ui";
import {MotionSection} from "@/components/motion-section";

type Feature = {title: string; copy: string};
type TimelineItem = {title: string; copy: string};
const icons = [ClipboardList, ShieldCheck, FileCheck2, MessageSquareText, Bell, CalendarDays];

export default function CustomerPortalPage() {
  const t = useTranslations("provider.customerPortal");
  return (
    <SiteShell>
      <PageHero eyebrow={t("hero.eyebrow")} title={t("hero.title")} copy={t("hero.copy")} image={{src: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80", alt: t("hero.imageAlt")}}>
        <form className="flex max-w-xl flex-col gap-3 sm:flex-row" onSubmit={(event) => event.preventDefault()}>
          <input aria-label={t("hero.emailLabel")} className="min-h-12 flex-1 rounded-full border border-[#eae4da] bg-white px-5 text-sm text-[#1f2937] outline-none transition focus:border-[#2f5d50]" placeholder={t("hero.placeholder")} />
          <button className="rounded-full bg-[#2f5d50] px-6 py-3 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#264c42]">{t("hero.button")}</button>
        </form>
      </PageHero>
      <MotionSection className={`${container} ${pageY}`}><SectionHeader eyebrow={t("coming.eyebrow")} title={t("coming.title")} copy={t("coming.copy")} /><div className="mt-10"><FeatureGrid items={(t.raw("coming.items") as Feature[]).map((item, index) => ({...item, icon: icons[index]}))} /></div></MotionSection>
      <MotionSection className={`${container} ${pageY}`}><SectionHeader eyebrow={t("features.eyebrow")} title={t("features.title")} /><div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]"><Card><h2 className="font-heading text-2xl font-bold text-[#111827]">{t("features.panelTitle")}</h2><div className="mt-6"><Checklist items={t.raw("features.items") as string[]} /></div></Card><div className="rounded-[30px] bg-[#f7f4ee] p-6"><Timeline items={t.raw("features.timeline") as TimelineItem[]} /></div></div></MotionSection>
    </SiteShell>
  );
}

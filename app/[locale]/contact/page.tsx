"use client";

import {Clock, Mail, MapPin, MessageCircle, PhoneCall} from "lucide-react";
import {useTranslations} from "next-intl";
import {SiteShell} from "@/components/site-shell";
import {Card, PageHero, SectionHeader, SplitSection, container, pageY} from "@/components/premium-ui";
import {MotionSection} from "@/components/motion-section";

type Info = {title: string; copy: string};
const supportIcons = [Mail, PhoneCall, Clock, MessageCircle];

export default function ContactPage() {
  const t = useTranslations("contact");
  return (
    <SiteShell>
      <PageHero eyebrow={t("hero.eyebrow")} title={t("hero.title")} copy={t("hero.copy")} image={{src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80", alt: t("hero.imageAlt")}} />
      <MotionSection className={`${container} ${pageY}`}>
        <SectionHeader eyebrow={t("support.eyebrow")} title={t("support.title")} />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {(t.raw("support.items") as Info[]).map((item, index) => {
            const Icon = supportIcons[index];
            return <Card key={item.title}><Icon className="text-[#2f5d50]" size={26} aria-hidden /><h2 className="mt-5 font-heading text-xl font-bold text-[#1f2937]">{item.title}</h2><p className="mt-3 text-sm leading-7 text-[#6b7280]">{item.copy}</p></Card>;
          })}
        </div>
      </MotionSection>
      <SplitSection eyebrow={t("office.eyebrow")} title={t("office.title")} copy={t("office.copy")} image={{src: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80", alt: t("office.imageAlt")}}>
        <div className="grid gap-4">{(t.raw("office.items") as Info[]).map((item) => <Card key={item.title}><h3 className="font-heading text-xl font-bold text-[#1f2937]">{item.title}</h3><p className="mt-3 text-sm leading-7 text-[#6b7280]">{item.copy}</p></Card>)}</div>
      </SplitSection>
      <MotionSection className={`${container} ${pageY}`}>
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div><SectionHeader eyebrow={t("map.eyebrow")} title={t("map.title")} copy={t("map.copy")} /><div className="mt-8 flex items-center gap-3 rounded-2xl border border-[#eae4da] bg-white px-4 py-4 text-sm font-bold text-[#374151]"><MapPin className="text-[#2f5d50]" size={20} aria-hidden />{t("map.location")}</div></div>
          <div className="flex min-h-[360px] items-center justify-center rounded-[30px] border border-[#eae4da] bg-[#f7f4ee] p-8 text-center"><div><MapPin className="mx-auto text-[#2f5d50]" size={42} aria-hidden /><h2 className="mt-5 font-heading text-2xl font-bold text-[#111827]">{t("map.placeholderTitle")}</h2><p className="mt-3 max-w-md text-sm leading-7 text-[#6b7280]">{t("map.placeholderCopy")}</p></div></div>
        </div>
      </MotionSection>
    </SiteShell>
  );
}

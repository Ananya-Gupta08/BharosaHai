"use client";

import {useTranslations} from "next-intl";
import {SiteShell} from "@/components/site-shell";
import {FAQAccordion, PageHero, SectionHeader, container, pageY} from "@/components/premium-ui";
import {MotionSection} from "@/components/motion-section";

type FAQ = {question: string; answer: string};

export default function FAQPage() {
  const t = useTranslations("faq");
  return (
    <SiteShell>
      <PageHero eyebrow={t("hero.eyebrow")} title={t("hero.title")} copy={t("hero.copy")} image={{src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80", alt: t("hero.imageAlt")}} />
      <MotionSection className={`${container} ${pageY}`}>
        <SectionHeader eyebrow={t("section.eyebrow")} title={t("section.title")} copy={t("section.copy")} />
        <div className="mt-10"><FAQAccordion items={t.raw("items") as FAQ[]} /></div>
      </MotionSection>
    </SiteShell>
  );
}

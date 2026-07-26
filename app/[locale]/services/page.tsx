"use client";

import {useEffect, useState} from "react";
import {useTranslations} from "next-intl";

import {FAQAccordion, HomeSection, PremiumCard, SectionHeading, homeContainer} from "@/components/homepage-components";
import {MotionSection} from "@/components/motion-section";
import {SiteShell} from "@/components/site-shell";
import {serviceCategories} from "@/data/serviceCategories";

type ServiceText = {overview: string; problems: string[]; services: string[]};
type FAQ = {question: string; answer: string};

export default function ServicesPage() {
  const t = useTranslations("services");
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    function scrollToHash() {
      const id = window.location.hash.slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;

      const top = target.getBoundingClientRect().top + window.scrollY - 92;
      window.scrollTo({top: Math.max(top, 0), behavior: "smooth"});
      setActiveSection(id);
      window.setTimeout(() => setActiveSection((current) => (current === id ? null : current)), 1800);
    }

    window.setTimeout(scrollToHash, 80);
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  return (
    <SiteShell>
      <section className={`${homeContainer} py-8 text-center sm:py-10 lg:py-12`}>
        <p className="font-heading text-sm font-bold uppercase tracking-[0.08em] text-[var(--accent)]">{t("hero.eyebrow")}</p>
        <h1 className="mx-auto mt-4 max-w-4xl font-heading text-4xl font-bold text-[var(--primary)] sm:text-5xl lg:text-[52px] lg:leading-[1.06]">{t("hero.title")}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[var(--secondary-text)] sm:text-lg">{t("hero.copy")}</p>
      </section>

      <HomeSection className="pt-4 sm:pt-6">
        <SectionHeading eyebrow={t("overview.eyebrow")} title={t("overview.title")} copy={t("overview.copy")} />
        <div className="mt-8 grid grid-cols-2 gap-3 min-[430px]:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          {serviceCategories.map(({id, label, icon: Icon}) => (
            <a key={id} href={`#${id}`} className="flex min-h-[108px] flex-col items-center justify-center rounded-[18px] border border-[var(--border)] bg-white px-2.5 py-3 text-center shadow-[var(--shadow-soft)] transition hover:bg-[var(--hover-bg)]">
              <Icon className="text-[var(--primary)]" size={24} strokeWidth={1.8} aria-hidden />
              <span className="mt-3 text-[12px] font-bold leading-tight text-[var(--primary)] sm:text-sm">{label}</span>
            </a>
          ))}
        </div>
      </HomeSection>

      {serviceCategories.map(({id, label, icon: Icon}) => {
        const item = t.raw(`categoryDetails.${id}`) as ServiceText;
        const highlighted = activeSection === id;
        return (
          <section key={id} id={id} className="scroll-mt-24">
            <MotionSection className={`${homeContainer} py-6 sm:py-8 lg:py-10`}>
              <div className={`grid gap-6 rounded-[22px] border p-5 shadow-[var(--shadow-soft)] transition-all duration-700 lg:grid-cols-[0.9fr_1.1fr] lg:p-7 ${highlighted ? "border-[var(--primary)] bg-[var(--hover-bg)] shadow-[var(--shadow-lift)]" : "border-[var(--border)] bg-white"}`}>
                <div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--hover-bg)] text-[var(--primary)]">
                    <Icon size={25} strokeWidth={1.8} aria-hidden />
                  </span>
                  <h2 className="mt-4 font-heading text-2xl font-bold text-[var(--primary)] sm:text-3xl">{label}</h2>
                  <p className="mt-3 text-base leading-7 text-[var(--secondary-text)]">{item.overview}</p>
                  <div className="mt-5 grid gap-2">
                    {item.services.map((service) => (
                      <div key={service} className="rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-semibold text-[var(--foreground)]">
                        {service}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid gap-4">
                  <PremiumCard>
                    <h3 className="font-heading text-xl font-bold text-[var(--primary)]">{t("labels.commonProblems")}</h3>
                    <ul className="mt-4 grid gap-3 text-sm leading-7 text-[var(--secondary-text)]">
                      {item.problems.map((problem) => <li key={problem}>{problem}</li>)}
                    </ul>
                  </PremiumCard>
                  <PremiumCard>
                    <h3 className="font-heading text-xl font-bold text-[var(--primary)]">{t("labels.benefits")}</h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--secondary-text)]">{t("labels.benefitsCopy")}</p>
                  </PremiumCard>
                </div>
              </div>
            </MotionSection>
          </section>
        );
      })}

      <HomeSection>
        <SectionHeading eyebrow={t("faq.eyebrow")} title={t("faq.title")} />
        <div className="mt-8">
          <FAQAccordion items={t.raw("faq.items") as FAQ[]} />
        </div>
      </HomeSection>
    </SiteShell>
  );
}

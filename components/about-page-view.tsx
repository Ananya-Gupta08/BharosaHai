"use client";

import {motion} from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  FileSearch,
  Handshake,
  Headphones,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  UserCheck,
  Users,
  type LucideIcon
} from "lucide-react";
import {useTranslations} from "next-intl";
import {useState} from "react";

import {HeroBackgroundCarousel} from "@/components/hero-background-carousel";
import {MotionSection} from "@/components/motion-section";
import {SiteShell} from "@/components/site-shell";
import {serviceCategories} from "@/data/serviceCategories";
import {Link} from "@/i18n/navigation";

type CopyItem = {title: string; copy: string};
type Comparison = {without: string[]; with: string[]};
type Journey = {customer: CopyItem[]; provider: CopyItem[]};
type ServiceCopy = {id: string; copy: string};
type Faq = {question: string; answer: string};

const container = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";
const sectionY = "py-12 sm:py-16 lg:py-20";
const cardClass = "rounded-[26px] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] sm:p-6";

const valueIcons: LucideIcon[] = [ShieldCheck, FileSearch, BadgeCheck, Users, TrendingUp, Sparkles];
const trustIcons: LucideIcon[] = [UserCheck, BadgeCheck, Star, ClipboardCheck, ShieldCheck, Headphones];
const promiseIcons: LucideIcon[] = [ShieldCheck, ClipboardCheck, Headphones, Handshake];
const verificationIcons: LucideIcon[] = [BriefcaseBusiness, FileSearch, UserCheck, ClipboardCheck, BadgeCheck, ShieldCheck];

export function AboutPageView() {
  const t = useTranslations("about");

  return (
    <SiteShell visualStyle="indian-marketplace">
      <main>
        <HeroSection />
        <StorySection />
        <MissionVision />
        <ValuesSection items={t.raw("values.items") as CopyItem[]} />
        <ComparisonSection data={t.raw("difference.comparison") as Comparison} />
        <JourneySection journeys={t.raw("journeys") as Journey} />
        <VerificationSection items={t.raw("verification.items") as CopyItem[]} />
        <WhoWeServe />
        <ServiceNetwork items={t.raw("network.items") as ServiceCopy[]} />
        <TrustSection items={t.raw("trust.items") as CopyItem[]} />
        <PromiseSection items={t.raw("promise.items") as CopyItem[]} />
        <FAQSection items={t.raw("faq.items") as Faq[]} />
        <FinalCTA />
      </main>
    </SiteShell>
  );
}

function SectionHeading({eyebrow, title, copy, center = false}: {eyebrow: string; title: string; copy?: string; center?: boolean}) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">{eyebrow}</p>
      <h2 className="mt-3 font-heading text-3xl font-bold leading-tight text-[var(--primary)] sm:text-4xl lg:text-[42px]">{title}</h2>
      {copy && <p className="mt-4 text-base leading-8 text-[var(--secondary-text)] sm:text-lg">{copy}</p>}
    </div>
  );
}

function HeroSection() {
  const t = useTranslations("about.hero");
  const chips = t.raw("chips") as string[];
  const visual = t.raw("visual.items") as CopyItem[];
  const icons = [Users, BadgeCheck, FileSearch, Handshake];

  return (
    <MotionSection className={`${container} pt-8 sm:pt-10 lg:pt-12`}>
      <HeroBackgroundCarousel align="left">
        <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <motion.div initial={{opacity: 0, y: 18}} animate={{opacity: 1, y: 0}} transition={{duration: 0.34}}>
            <span className="inline-flex rounded-full border border-[var(--border)] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)] shadow-[var(--shadow-soft)]">
              {t("eyebrow")}
            </span>
            <h1 className="mt-5 max-w-4xl font-heading text-4xl font-bold leading-tight text-[var(--primary)] sm:text-5xl lg:text-[62px]">{t("title")}</h1>
            <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-[var(--foreground)]">{t("subtitle")}</p>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--secondary-text)]">{t("copy")}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <PrimaryLink href="/services">{t("primary")}</PrimaryLink>
              <SecondaryLink href="/provider">{t("secondary")}</SecondaryLink>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {chips.map((chip) => (
                <div key={chip} className="rounded-2xl border border-[var(--border)] bg-white px-3 py-3 text-center text-xs font-bold text-[var(--primary)] shadow-[var(--shadow-soft)]">
                  {chip}
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{opacity: 0, y: 18}} animate={{opacity: 1, y: 0}} transition={{duration: 0.34, delay: 0.08}} className="rounded-[30px] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-lift)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">{t("visual.eyebrow")}</p>
                <h2 className="mt-2 font-heading text-2xl font-bold text-[var(--primary)]">{t("visual.title")}</h2>
              </div>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)] text-white"><ShieldCheck size={24} aria-hidden /></span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {visual.map((item, index) => {
                const Icon = icons[index] ?? ShieldCheck;
                return <MiniCard key={item.title} icon={Icon} title={item.title} copy={item.copy} />;
              })}
            </div>
          </motion.div>
        </div>
      </HeroBackgroundCarousel>
    </MotionSection>
  );
}

function StorySection() {
  const t = useTranslations("about.story");
  const items = t.raw("items") as CopyItem[];

  return (
    <MotionSection className={`${container} ${sectionY}`}>
      <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div>
          <SectionHeading eyebrow={t("eyebrow")} title={t("title")} copy={t("copy")} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item, index) => <NumberCard key={item.title} index={index} title={item.title} copy={item.copy} />)}
        </div>
      </div>
    </MotionSection>
  );
}

function MissionVision() {
  const t = useTranslations("about.mission");

  return (
    <MotionSection className={`${container} pb-12 sm:pb-16 lg:pb-20`}>
      <div className="grid gap-5 lg:grid-cols-2">
        <InfoCard icon={Handshake} eyebrow={t("missionEyebrow")} title={t("missionTitle")} copy={t("missionCopy")} />
        <InfoCard icon={Sparkles} eyebrow={t("visionEyebrow")} title={t("visionTitle")} copy={t("visionCopy")} />
      </div>
    </MotionSection>
  );
}

function ValuesSection({items}: {items: CopyItem[]}) {
  const t = useTranslations("about.values");

  return (
    <MotionSection className={`${container} ${sectionY}`}>
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} copy={t("copy")} center />
      <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => {
          const Icon = valueIcons[index] ?? ShieldCheck;
          return <IconCard key={item.title} icon={Icon} title={item.title} copy={item.copy} />;
        })}
      </div>
    </MotionSection>
  );
}

function ComparisonSection({data}: {data: Comparison}) {
  const t = useTranslations("about.difference");

  return (
    <MotionSection className={`${container} ${sectionY}`}>
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} copy={t("copy")} center />
      <div className="mt-9 grid gap-5 lg:grid-cols-2">
        <ComparisonCard title={t("withoutTitle")} items={data.without} tone="muted" />
        <ComparisonCard title={t("withTitle")} items={data.with} tone="brand" />
      </div>
    </MotionSection>
  );
}

function JourneySection({journeys}: {journeys: Journey}) {
  const t = useTranslations("about.journeys");

  return (
    <MotionSection className={`${container} ${sectionY}`}>
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} copy={t("copy")} center />
      <div className="mt-9 grid gap-5 lg:grid-cols-2">
        <TimelinePanel title={t("customerTitle")} items={journeys.customer} icon={Search} />
        <TimelinePanel title={t("providerTitle")} items={journeys.provider} icon={BriefcaseBusiness} />
      </div>
    </MotionSection>
  );
}

function VerificationSection({items}: {items: CopyItem[]}) {
  const t = useTranslations("about.verification");

  return (
    <MotionSection className={`${container} ${sectionY}`}>
      <div className="rounded-[30px] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)] sm:p-8 lg:p-10">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} copy={t("copy")} center />
        <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const Icon = verificationIcons[index] ?? BadgeCheck;
            return <IconCard key={item.title} icon={Icon} title={item.title} copy={item.copy} />;
          })}
        </div>
        <p className="mx-auto mt-7 max-w-2xl rounded-2xl bg-[var(--hover-bg)] px-5 py-4 text-center text-sm font-bold text-[var(--primary)]">{t("note")}</p>
      </div>
    </MotionSection>
  );
}

function WhoWeServe() {
  const t = useTranslations("about.serve");

  return (
    <MotionSection className={`${container} ${sectionY}`}>
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} copy={t("copy")} center />
      <div className="mt-9 grid gap-5 lg:grid-cols-2">
        <AudienceCard icon={Users} title={t("customers.title")} copy={t("customers.copy")} href="/services" cta={t("customers.cta")} />
        <AudienceCard icon={BriefcaseBusiness} title={t("providers.title")} copy={t("providers.copy")} href="/provider" cta={t("providers.cta")} />
      </div>
    </MotionSection>
  );
}

function ServiceNetwork({items}: {items: ServiceCopy[]}) {
  const t = useTranslations("about.network");
  const copyById = new Map(items.map((item) => [item.id, item.copy]));

  return (
    <MotionSection className={`${container} ${sectionY}`}>
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} copy={t("copy")} center />
      <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {serviceCategories.map(({id, label, icon: Icon}) => (
          <div key={id} className="rounded-[22px] border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-soft)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
            <Icon className="text-[var(--primary)]" size={22} strokeWidth={1.8} aria-hidden />
            <h3 className="mt-4 font-heading text-sm font-bold text-[var(--foreground)] sm:text-base">{label}</h3>
            <p className="mt-2 text-xs leading-5 text-[var(--secondary-text)]">{copyById.get(id) ?? t("fallback")}</p>
            <Link href={`/services#${id}`} className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[var(--primary)]">
              {t("cta")}
              <ArrowRight size={14} aria-hidden />
            </Link>
          </div>
        ))}
      </div>
    </MotionSection>
  );
}

function TrustSection({items}: {items: CopyItem[]}) {
  const t = useTranslations("about.trust");

  return (
    <MotionSection className={`${container} ${sectionY}`}>
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} copy={t("copy")} center />
      <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => {
          const Icon = trustIcons[index] ?? ShieldCheck;
          return <IconCard key={item.title} icon={Icon} title={item.title} copy={item.copy} />;
        })}
      </div>
    </MotionSection>
  );
}

function PromiseSection({items}: {items: CopyItem[]}) {
  const t = useTranslations("about.promise");

  return (
    <MotionSection className={`${container} ${sectionY}`}>
      <div className="rounded-[32px] border border-[var(--border)] bg-[var(--primary)] p-6 text-white shadow-[var(--shadow-lift)] sm:p-8 lg:p-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">{t("eyebrow")}</p>
          <h2 className="mt-3 font-heading text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-[42px]">{t("title")}</h2>
          <p className="mt-4 text-base leading-8 text-white/78 sm:text-lg">{t("copy")}</p>
        </div>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            const Icon = promiseIcons[index] ?? ShieldCheck;
            return (
              <div key={item.title} className="rounded-[24px] border border-white/15 bg-white/10 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/15">
                <Icon className="text-[var(--accent)]" size={24} aria-hidden />
                <h3 className="mt-4 font-heading text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/78">{item.copy}</p>
              </div>
            );
          })}
        </div>
      </div>
    </MotionSection>
  );
}

function FAQSection({items}: {items: Faq[]}) {
  const t = useTranslations("about.faq");
  const [open, setOpen] = useState(0);

  return (
    <MotionSection className={`${container} ${sectionY}`}>
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} copy={t("copy")} center />
      <div className="mx-auto mt-9 grid max-w-4xl gap-3">
        {items.map((item, index) => {
          const active = open === index;
          return (
            <div key={item.question} className="overflow-hidden rounded-[24px] border border-[var(--border)] bg-white shadow-[var(--shadow-soft)]">
              <button type="button" onClick={() => setOpen(active ? -1 : index)} className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]">
                <span className="font-heading text-base font-bold text-[var(--foreground)]">{item.question}</span>
                <ChevronDown className={`shrink-0 text-[var(--primary)] transition ${active ? "rotate-180" : ""}`} size={20} aria-hidden />
              </button>
              {active && <motion.p initial={{height: 0, opacity: 0}} animate={{height: "auto", opacity: 1}} className="overflow-hidden border-t border-[var(--border)] px-5 pb-5 pt-4 text-sm leading-7 text-[var(--secondary-text)]">{item.answer}</motion.p>}
            </div>
          );
        })}
      </div>
    </MotionSection>
  );
}

function FinalCTA() {
  const t = useTranslations("about.cta");

  return (
    <MotionSection className={`${container} pb-16 sm:pb-20 lg:pb-24`}>
      <div className="rounded-[32px] border border-[var(--border)] bg-white p-6 text-center shadow-[var(--shadow-lift)] sm:p-10 lg:p-12">
        <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">{t("eyebrow")}</p>
        <h2 className="mx-auto mt-3 max-w-3xl font-heading text-3xl font-bold text-[var(--primary)] sm:text-4xl">{t("title")}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[var(--secondary-text)]">{t("copy")}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <PrimaryLink href="/services">{t("primary")}</PrimaryLink>
          <SecondaryLink href="/provider">{t("secondary")}</SecondaryLink>
        </div>
      </div>
    </MotionSection>
  );
}

function PrimaryLink({href, children}: {href: string; children: React.ReactNode}) {
  return <Link href={href} className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-bold text-white shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:bg-[var(--primary-hover)]">{children}<ArrowRight size={16} aria-hidden /></Link>;
}

function SecondaryLink({href, children}: {href: string; children: React.ReactNode}) {
  return <Link href={href} className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--primary)] bg-white px-6 py-3 text-sm font-bold text-[var(--primary)] transition hover:-translate-y-0.5 hover:bg-[var(--hover-bg)]">{children}<ArrowRight size={16} aria-hidden /></Link>;
}

function MiniCard({icon: Icon, title, copy}: {icon: LucideIcon; title: string; copy: string}) {
  return (
    <div className="rounded-[22px] border border-[var(--border)] bg-[var(--background)] p-4">
      <Icon className="text-[var(--primary)]" size={22} aria-hidden />
      <h3 className="mt-4 font-heading text-base font-bold text-[var(--foreground)]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--secondary-text)]">{copy}</p>
    </div>
  );
}

function NumberCard({index, title, copy}: {index: number; title: string; copy: string}) {
  return (
    <div className={cardClass}>
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] font-heading text-sm font-bold text-white">{String(index + 1).padStart(2, "0")}</span>
      <h3 className="mt-5 font-heading text-xl font-bold text-[var(--foreground)]">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-[var(--secondary-text)]">{copy}</p>
    </div>
  );
}

function InfoCard({icon: Icon, eyebrow, title, copy}: {icon: LucideIcon; eyebrow: string; title: string; copy: string}) {
  return (
    <div className={`${cardClass} min-h-full`}>
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--hover-bg)] text-[var(--primary)]"><Icon size={24} aria-hidden /></span>
      <p className="mt-5 font-heading text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">{eyebrow}</p>
      <h2 className="mt-3 font-heading text-3xl font-bold text-[var(--primary)]">{title}</h2>
      <p className="mt-4 text-base leading-8 text-[var(--secondary-text)]">{copy}</p>
    </div>
  );
}

function IconCard({icon: Icon, title, copy}: {icon: LucideIcon; title: string; copy: string}) {
  return (
    <div className={cardClass}>
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--hover-bg)] text-[var(--primary)]"><Icon size={21} strokeWidth={1.8} aria-hidden /></span>
      <h3 className="mt-5 font-heading text-xl font-bold text-[var(--foreground)]">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-[var(--secondary-text)]">{copy}</p>
    </div>
  );
}

function ComparisonCard({title, items, tone}: {title: string; items: string[]; tone: "brand" | "muted"}) {
  return (
    <div className={`${cardClass} ${tone === "brand" ? "ring-1 ring-[var(--primary)]/15" : ""}`}>
      <h3 className="font-heading text-2xl font-bold text-[var(--primary)]">{title}</h3>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <div key={item} className="flex gap-3 rounded-2xl bg-[var(--background)] px-4 py-3 text-sm font-semibold text-[var(--foreground)]">
            <CheckCircle2 className={tone === "brand" ? "text-[var(--primary)]" : "text-[var(--secondary-text)]"} size={18} aria-hidden />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function TimelinePanel({title, items, icon: Icon}: {title: string; items: CopyItem[]; icon: LucideIcon}) {
  return (
    <div className={cardClass}>
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary)] text-white"><Icon size={21} aria-hidden /></span>
        <h3 className="font-heading text-2xl font-bold text-[var(--primary)]">{title}</h3>
      </div>
      <div className="mt-6 grid gap-4">
        {items.map((item, index) => (
          <div key={item.title} className="grid grid-cols-[auto_1fr] gap-4">
            <div className="flex flex-col items-center">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--hover-bg)] text-xs font-bold text-[var(--primary)]">{index + 1}</span>
              {index < items.length - 1 && <span className="mt-2 h-full min-h-7 w-px bg-[var(--border)]" />}
            </div>
            <div className="pb-2">
              <h4 className="font-heading text-base font-bold text-[var(--foreground)]">{item.title}</h4>
              <p className="mt-1 text-sm leading-6 text-[var(--secondary-text)]">{item.copy}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AudienceCard({icon: Icon, title, copy, href, cta}: {icon: LucideIcon; title: string; copy: string; href: string; cta: string}) {
  return (
    <div className={cardClass}>
      <Icon className="text-[var(--primary)]" size={28} aria-hidden />
      <h3 className="mt-5 font-heading text-2xl font-bold text-[var(--primary)]">{title}</h3>
      <p className="mt-3 text-base leading-8 text-[var(--secondary-text)]">{copy}</p>
      <Link href={href} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--primary)]">{cta}<ArrowRight size={16} aria-hidden /></Link>
    </div>
  );
}

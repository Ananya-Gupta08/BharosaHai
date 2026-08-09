"use client";

import {motion} from "framer-motion";
import {
  BarChart3,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  FileText,
  Headphones,
  Landmark,
  LockKeyhole,
  MessageSquare,
  ShieldCheck,
  Star,
  TrendingUp,
  UserCheck,
  Users,
  type LucideIcon
} from "lucide-react";

import {HeroBackgroundCarousel} from "@/components/hero-background-carousel";
import {serviceCategories} from "@/data/serviceCategories";
import {Link} from "@/i18n/navigation";

type ProviderLandingPageProps = {
  stats: {
    categories: number;
    providers: number;
    enquiries: number;
  };
  dashboardCtaVisible: boolean;
};

const container = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";
const sectionY = "py-14 sm:py-16 lg:py-20";
const card = "rounded-[28px] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6";
const primaryButton = "inline-flex min-h-12 items-center justify-center rounded-2xl bg-[var(--primary)] px-5 py-3 text-sm font-bold text-white shadow-[var(--shadow-soft)] transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--primary-hover)] focus:outline-none focus:ring-4 focus:ring-[#005BAC]/20";
const secondaryButton = "inline-flex min-h-12 items-center justify-center rounded-2xl border border-[var(--primary)] bg-white px-5 py-3 text-sm font-bold text-[var(--primary)] transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--hover-bg)] focus:outline-none focus:ring-4 focus:ring-[#005BAC]/20";

const trustStrip = ["Verified Platform", "Transparent Verification", "Secure Dashboard", "Dedicated Support"];

const features = [
  {title: "Verified Customer Leads", copy: "Receive enquiries from people looking for professional help in your city.", icon: Users},
  {title: "Business Dashboard", copy: "Track leads, bookings, messages, documents and performance from one workspace.", icon: BriefcaseBusiness},
  {title: "Verified Trust Badge", copy: "Build credibility with a profile reviewed through KaunBatayega verification.", icon: BadgeCheck},
  {title: "Grow Local Visibility", copy: "Make your services easier to discover across local KaunBatayega launch cities.", icon: TrendingUp},
  {title: "Simple Verification", copy: "Complete your profile, upload documents and follow a clear approval process.", icon: FileCheck2},
  {title: "Dedicated Support", copy: "Get platform guidance while setting up your profile and provider operations.", icon: Headphones}
];

const steps = [
  {title: "Register", copy: "Create your provider account.", icon: UserCheck},
  {title: "Complete Profile", copy: "Add professional and business details.", icon: FileText},
  {title: "Upload Documents", copy: "Submit identity and work proofs.", icon: ClipboardCheck},
  {title: "Verification", copy: "The admin team reviews your profile.", icon: ShieldCheck},
  {title: "Receive Leads", copy: "Start handling customer enquiries.", icon: MessageSquare},
  {title: "Grow Your Business", copy: "Build reviews and local visibility.", icon: TrendingUp}
];

const comparison = {
  without: ["Finding customers manually", "No online visibility", "Unverified profile", "Scattered business records", "No business insights"],
  with: ["Verified profile", "Customer enquiries", "Business dashboard", "Performance analytics", "Reviews", "Digital business management"]
};

const customerTrust = [
  {title: "Identity Verified", icon: UserCheck},
  {title: "Professional Documents Verified", icon: FileCheck2},
  {title: "Transparent Reviews", icon: Star},
  {title: "Verified Contact Information", icon: BadgeCheck},
  {title: "Secure Platform", icon: LockKeyhole},
  {title: "Quality Assurance", icon: ShieldCheck}
];

const faqs = [
  ["Who can register?", "Professionals and service providers from supported categories can register, including legal, GST, property, documentation, government-service, insurance, electricity and compliance professionals."],
  ["How long does verification take?", "The usual review target is 24 to 48 hours after your profile and required documents are submitted clearly."],
  ["Are there registration fees?", "Provider account creation is available for onboarding. Any future paid plans will be shown clearly before activation."],
  ["How are customer enquiries assigned?", "Enquiries are planned to be matched using service category, city, profile readiness, verification status, responsiveness and customer requirement."],
  ["Can I offer multiple services?", "Yes. You can add multiple relevant services and service areas during registration and later manage them from the provider dashboard."],
  ["Can I work in multiple cities?", "Yes. Providers can add service areas and cities where they can genuinely serve customers."],
  ["How do I update my profile?", "After login, use the provider dashboard profile section to update business details, working hours, services and documents."],
  ["Can I pause my availability?", "Availability controls are prepared inside the provider workspace so verified providers can manage work status as the platform grows."]
];

export function ProviderLandingPage({stats, dashboardCtaVisible}: ProviderLandingPageProps) {
  const displayStats = [
    {value: `${stats.categories}+`, label: "Service Categories"},
    {value: `${Math.max(stats.providers, 100)}+`, label: "Verified Providers"},
    {value: `${Math.max(stats.enquiries, 500)}+`, label: "Customer Enquiries"},
    {value: "24x7", label: "Support"}
  ];

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <section className={`${container} pt-8 sm:pt-10 lg:pt-12`}>
        <HeroBackgroundCarousel align="left">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.92fr] lg:items-center">
            <motion.div initial={{opacity: 0, y: 18}} animate={{opacity: 1, y: 0}} transition={{duration: 0.35}}>
              <span className="inline-flex rounded-full border border-[var(--border)] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--primary)] shadow-[var(--shadow-soft)]">
                Trusted Professional Network
              </span>
              <h1 className="mt-5 max-w-3xl font-heading text-4xl font-bold leading-tight text-[var(--primary)] sm:text-5xl lg:text-[56px]">
                Grow Your Business with KaunBatayega
              </h1>
              <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-[var(--foreground)]">
                Join a verified multi-service platform built to help professionals earn trust, receive quality enquiries and manage work digitally.
              </p>
              <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--secondary-text)]">
                KaunBatayega gives providers a secure dashboard for profile verification, lead management, documents, messages, analytics and long-term business credibility.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/provider/sign-up" className={primaryButton}>Register as Provider</Link>
                <Link href="/provider/sign-in" className={secondaryButton}>Login to Dashboard</Link>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {trustStrip.map((item) => <TrustPill key={item} label={item} />)}
              </div>
            </motion.div>

            <motion.div initial={{opacity: 0, y: 18}} animate={{opacity: 1, y: 0}} transition={{duration: 0.35, delay: 0.08}}>
              <ProfessionCollage />
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {displayStats.map((item) => <StatCard key={item.label} value={item.value} label={item.label} />)}
              </div>
            </motion.div>
            </div>
        </HeroBackgroundCarousel>
      </section>

      <Section eyebrow="Why join" title="Why Professionals Choose KaunBatayega" copy="A provider workspace designed for trust, local growth and everyday business management.">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((item) => <FeatureCard key={item.title} {...item} />)}
        </div>
      </Section>

      <Section eyebrow="Process" title="How It Works" copy="A clear path from registration to verified provider visibility.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          {steps.map((step, index) => <TimelineStep key={step.title} index={index + 1} {...step} />)}
        </div>
      </Section>

      <Section eyebrow="Eligibility" title="Who Can Join" copy="KaunBatayega is built for verified professionals across essential local service categories.">
        <div className="grid grid-cols-2 gap-3 min-[430px]:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          {serviceCategories.map(({id, providerAudience, icon}) => <ServiceAudienceCard key={id} title={providerAudience} icon={icon} />)}
        </div>
      </Section>

      <Section eyebrow="Business advantage" title="Benefits of Joining KaunBatayega" copy="Move from scattered manual work to a verified digital provider workspace.">
        <div className="grid gap-5 lg:grid-cols-2">
          <ComparisonCard title="Without KaunBatayega" items={comparison.without} muted />
          <ComparisonCard title="With KaunBatayega" items={comparison.with} />
        </div>
      </Section>

      <Section eyebrow="Dashboard preview" title="A Workspace Built for Daily Provider Work" copy="The provider dashboard brings operations, trust and growth tools into one place.">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <LaptopPreview />
          <div className={card}>
            <h3 className="font-heading text-2xl font-bold text-[var(--primary)]">Manage your provider business digitally</h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {["Manage Leads", "Bookings", "Documents", "Analytics", "Reviews", "Subscription", "Messages", "Business Growth"].map((item) => <TrustPill key={item} label={item} />)}
            </div>
            {dashboardCtaVisible && <Link href="/provider/dashboard" className={`${primaryButton} mt-7`}>Explore Dashboard</Link>}
          </div>
        </div>
      </Section>

      <Section eyebrow="Verification" title="Verification Process" copy="Average verification target: 24-48 hours after complete submission.">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {["Registration", "Profile Completion", "Document Upload", "Verification Review", "Approval", "Start Receiving Leads"].map((item, index) => <ProcessCard key={item} index={index + 1} title={item} />)}
        </div>
      </Section>

      <Section eyebrow="Customer trust" title="Why Customers Trust Our Providers" copy="Every provider profile is designed around proof, clarity and accountability.">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {customerTrust.map((item) => <MiniFeature key={item.title} {...item} />)}
        </div>
      </Section>

      <Section eyebrow="Provider success" title="Built for a Growing Provider Community" copy="Real testimonials can be added later. Until then, KaunBatayega focuses on measurable trust standards.">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {["Growing Provider Community", "High Verification Standards", "Quick Support", "Business Growth Focus"].map((item) => <div key={item} className={card}><h3 className="font-heading text-xl font-bold text-[var(--primary)]">{item}</h3><p className="mt-3 text-sm leading-7 text-[var(--secondary-text)]">A focused system to help professionals prepare for verified customer discovery.</p></div>)}
        </div>
      </Section>

      <Section eyebrow="FAQ" title="Provider Questions" copy="Clear answers before you start registration.">
        <div className="mx-auto max-w-4xl divide-y divide-[var(--border)] overflow-hidden rounded-[28px] border border-[var(--border)] bg-white shadow-[var(--shadow-soft)]">
          {faqs.map(([question, answer]) => <FAQItem key={question} question={question} answer={answer} />)}
        </div>
      </Section>

      <section className={`${container} pb-20`}>
        <div className="rounded-[32px] bg-[var(--primary)] px-6 py-12 text-center text-white shadow-[var(--shadow-lift)] sm:px-10">
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">Ready to Grow Your Business?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/86">Join KaunBatayega and start connecting with verified customers through a trusted provider platform.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/provider/sign-up" className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-bold text-[var(--primary)] transition hover:-translate-y-0.5">Register Now</Link>
            <Link href="/provider/sign-in" className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/60 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/10">Already Registered? Login</Link>
          </div>
        </div>
      </section>

      <Link href="/provider/sign-up" className="fixed bottom-5 right-5 z-40 hidden rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-bold text-white shadow-[var(--shadow-lift)] transition hover:-translate-y-0.5 hover:bg-[var(--primary-hover)] lg:inline-flex">Become a Provider</Link>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-white p-3 shadow-[0_-12px_35px_rgba(0,91,172,0.12)] lg:hidden">
        <Link href="/provider/sign-up" className={`${primaryButton} w-full`}>Register as Provider</Link>
      </div>
    </div>
  );
}

function Section({eyebrow, title, copy, children}: {eyebrow: string; title: string; copy: string; children: React.ReactNode}) {
  return (
    <section className={`${container} ${sectionY}`}>
      <div className="mb-9 max-w-3xl">
        <p className="font-heading text-sm font-bold uppercase tracking-[0.16em] text-[var(--accent)]">{eyebrow}</p>
        <h2 className="mt-3 font-heading text-3xl font-bold text-[var(--primary)] sm:text-4xl">{title}</h2>
        <p className="mt-3 text-base leading-7 text-[var(--secondary-text)]">{copy}</p>
      </div>
      {children}
    </section>
  );
}

function TrustPill({label}: {label: string}) {
  return <motion.div whileHover={{y: -2}} transition={{duration: 0.2}} className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-white px-3 py-3 text-xs font-bold text-[var(--primary)] shadow-[var(--shadow-soft)]"><CheckCircle2 size={16} aria-hidden />{label}</motion.div>;
}

function StatCard({value, label}: {value: string; label: string}) {
  return <motion.div whileHover={{y: -3}} transition={{duration: 0.2}} className="rounded-[20px] border border-[var(--border)] bg-white p-4 text-center shadow-[var(--shadow-lift)]"><p className="font-heading text-2xl font-bold text-[var(--primary)]">{value}</p><p className="mt-1 text-xs font-bold text-[var(--secondary-text)]">{label}</p></motion.div>;
}

function FeatureCard({title, copy, icon: Icon}: {title: string; copy: string; icon: LucideIcon}) {
  return <motion.article whileHover={{y: -4}} className={card}><Icon className="text-[var(--primary)]" size={28} strokeWidth={1.8} aria-hidden /><h3 className="mt-5 font-heading text-xl font-bold text-[var(--primary)]">{title}</h3><p className="mt-3 text-sm leading-7 text-[var(--secondary-text)]">{copy}</p></motion.article>;
}

function ProfessionCollage() {
  const professions = [
    ["Lawyer", ShieldCheck],
    ["CA", ClipboardCheck],
    ["Electrician", Building2],
    ["Insurance Advisor", BadgeCheck],
    ["Property Consultant", Landmark],
    ["Architect", BriefcaseBusiness],
    ["Plumber", FileCheck2],
    ["Government Consultant", FileText]
  ] as const;

  return (
    <div className="rounded-[34px] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-lift)]">
      <div className="rounded-[26px] bg-[var(--background)] p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)]">Provider Network</p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-[var(--primary)]">For every verified professional</h2>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)] text-white"><Users size={24} aria-hidden /></span>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {professions.map(([label, Icon]) => <div key={label} className="rounded-2xl border border-[var(--border)] bg-white p-4"><Icon className="text-[var(--primary)]" size={22} aria-hidden /><p className="mt-3 text-sm font-bold text-[var(--foreground)]">{label}</p></div>)}
        </div>
      </div>
    </div>
  );
}

function TimelineStep({index, title, copy, icon: Icon}: {index: number; title: string; copy: string; icon: LucideIcon}) {
  return <motion.article whileHover={{y: -4}} transition={{duration: 0.22}} className={`${card} relative`}><span className="absolute right-4 top-4 font-heading text-3xl font-bold text-[var(--hover-bg)]">{index}</span><Icon className="text-[var(--primary)]" size={26} aria-hidden /><h3 className="mt-5 font-heading text-lg font-bold text-[var(--primary)]">{title}</h3><p className="mt-2 text-sm leading-6 text-[var(--secondary-text)]">{copy}</p></motion.article>;
}

function ServiceAudienceCard({title, icon: Icon}: {title: string; icon: LucideIcon}) {
  return <motion.article whileHover={{y: -3}} className="min-h-[118px] rounded-[20px] border border-[var(--border)] bg-white p-4 text-center shadow-[var(--shadow-soft)]"><span className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--hover-bg)] text-[var(--primary)]"><Icon size={21} aria-hidden /></span><h3 className="mt-3 text-sm font-bold leading-tight text-[var(--primary)]">{title}</h3></motion.article>;
}

function ComparisonCard({title, items, muted}: {title: string; items: string[]; muted?: boolean}) {
  return <motion.article whileHover={{y: -4}} transition={{duration: 0.22}} className={`${card} ${muted ? "bg-[var(--background)]" : ""}`}><h3 className="font-heading text-2xl font-bold text-[var(--primary)]">{title}</h3><ul className="mt-6 grid gap-3">{items.map((item) => <li key={item} className="flex items-center gap-3 text-sm font-semibold text-[var(--foreground)]"><CheckCircle2 className={muted ? "text-[var(--secondary-text)]" : "text-[var(--success)]"} size={18} aria-hidden />{item}</li>)}</ul></motion.article>;
}

function LaptopPreview() {
  return <div className="rounded-[30px] border border-[var(--border)] bg-[#1f2937] p-3 shadow-[var(--shadow-lift)]"><div className="rounded-[22px] bg-white p-4"><div className="flex items-center justify-between border-b border-[var(--border)] pb-3"><p className="font-heading text-sm font-bold text-[var(--primary)]">Provider Dashboard</p><BadgeCheck className="text-[var(--success)]" size={20} /></div><div className="mt-4 grid gap-3 md:grid-cols-3"><PreviewMetric label="New Leads" value="12" /><PreviewMetric label="Bookings" value="8" /><PreviewMetric label="Rating" value="4.8" /></div><div className="mt-4 grid gap-3 md:grid-cols-[0.65fr_0.35fr]"><div className="rounded-2xl bg-[var(--background)] p-4"><p className="text-xs font-bold text-[var(--accent)]">Lead Pipeline</p><div className="mt-4 grid gap-2">{["New", "Accepted", "In Progress", "Completed"].map((item) => <div key={item} className="h-8 rounded-xl bg-white" />)}</div></div><div className="rounded-2xl bg-[var(--hover-bg)] p-4"><BarChart3 className="text-[var(--primary)]" /><p className="mt-4 text-sm font-bold text-[var(--primary)]">Analytics</p></div></div></div></div>;
}

function PreviewMetric({label, value}: {label: string; value: string}) {
  return <motion.div whileHover={{y: -2}} transition={{duration: 0.2}} className="rounded-2xl bg-[var(--background)] p-4"><p className="text-xs font-bold text-[var(--secondary-text)]">{label}</p><p className="mt-2 font-heading text-2xl font-bold text-[var(--primary)]">{value}</p></motion.div>;
}

function ProcessCard({index, title}: {index: number; title: string}) {
  return <motion.article whileHover={{y: -4}} transition={{duration: 0.22}} className={card}><p className="font-heading text-3xl font-bold text-[var(--accent)]">0{index}</p><h3 className="mt-3 font-heading text-xl font-bold text-[var(--primary)]">{title}</h3><p className="mt-2 text-sm leading-6 text-[var(--secondary-text)]">A structured step in the provider approval journey.</p></motion.article>;
}

function MiniFeature({title, icon: Icon}: {title: string; icon: LucideIcon}) {
  return <motion.div whileHover={{y: -3}} transition={{duration: 0.2}} className="rounded-[20px] border border-[var(--border)] bg-white p-4 text-center shadow-[var(--shadow-soft)]"><Icon className="mx-auto text-[var(--primary)]" size={24} aria-hidden /><p className="mt-3 text-sm font-bold text-[var(--primary)]">{title}</p></motion.div>;
}

function FAQItem({question, answer}: {question: string; answer: string}) {
  return <details className="group p-5 transition duration-300 hover:bg-[var(--background)] open:bg-[var(--background)]"><summary className="cursor-pointer list-none font-heading text-lg font-bold text-[var(--primary)] focus:outline-none focus:ring-4 focus:ring-[#005BAC]/20">{question}</summary><p className="mt-3 text-sm leading-7 text-[var(--secondary-text)]">{answer}</p></details>;
}

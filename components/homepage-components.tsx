"use client";

import Image from "next/image";
import {motion} from "framer-motion";
import {ArrowRight, ChevronDown, CheckCircle2, type LucideIcon} from "lucide-react";
import {useState, type ReactNode} from "react";

import {Link} from "@/i18n/navigation";
import {MotionSection} from "@/components/motion-section";

export const homeContainer = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";
export const homeSectionY = "py-10 sm:py-12 lg:py-16";

export function SectionHeading({eyebrow, title, copy, align = "left"}: {eyebrow?: string; title: string; copy?: string; align?: "left" | "center"}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && <p className="font-heading text-sm font-bold uppercase tracking-[0.08em] text-[var(--accent)]">{eyebrow}</p>}
      <h2 className="mt-2 font-heading text-2xl font-bold text-[var(--primary)] sm:text-3xl lg:text-[36px] lg:leading-[1.12]">{title}</h2>
      {copy && <p className="mt-3 text-base leading-7 text-[var(--secondary-text)]">{copy}</p>}
    </div>
  );
}

export function PrimaryButton({href, children}: {href: string; children: ReactNode}) {
  return (
    <Link href={href} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-6 py-3 text-sm font-bold text-white shadow-[var(--shadow-soft)] transition duration-300 hover:bg-[var(--primary-hover)]">
      {children}
      <ArrowRight size={16} aria-hidden />
    </Link>
  );
}

export function SecondaryButton({href, children}: {href: string; children: ReactNode}) {
  return (
    <Link href={href} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[var(--primary)] bg-white px-6 py-3 text-sm font-bold text-[var(--primary)] transition duration-300 hover:bg-[var(--hover-bg)]">
      {children}
    </Link>
  );
}

export function PremiumCard({children, className = ""}: {children: ReactNode; className?: string}) {
  return (
    <motion.div whileHover={{y: -2}} transition={{duration: 0.18, ease: "easeOut"}} className={`rounded-[22px] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)] ${className}`}>
      {children}
    </motion.div>
  );
}

export function IconFrame({icon: Icon}: {icon: LucideIcon}) {
  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--hover-bg)] text-[var(--primary)]">
      <Icon size={24} strokeWidth={1.8} aria-hidden />
    </span>
  );
}

export function ServiceCard({icon, title, copy}: {icon: LucideIcon; title: string; copy: string}) {
  return (
    <PremiumCard>
      <IconFrame icon={icon} />
      <h3 className="mt-6 font-heading text-xl font-bold text-[var(--primary)]">{title}</h3>
      <p className="mt-3 text-base leading-7 text-[var(--secondary-text)]">{copy}</p>
    </PremiumCard>
  );
}

export function PopularServiceCard({href, icon, title, copy}: {href: string; icon: LucideIcon; title: string; copy: string}) {
  return (
    <Link href={href} className="group rounded-[20px] border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-soft)] transition duration-300 hover:bg-[var(--hover-bg)]">
      <div className="flex items-start justify-between gap-4">
        <IconFrame icon={icon} />
        <ArrowRight className="mt-3 text-[var(--primary)] opacity-50 transition duration-300 group-hover:translate-x-1 group-hover:opacity-100" size={18} aria-hidden />
      </div>
      <h3 className="mt-4 font-heading text-base font-bold text-[var(--primary)] sm:text-lg">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--secondary-text)]">{copy}</p>
    </Link>
  );
}

export function CategoryGroupCard({href, icon, title, copy, cta}: {href: string; icon: LucideIcon; title: string; copy: string; cta: string}) {
  return (
    <PremiumCard>
      <IconFrame icon={icon} />
      <h3 className="mt-6 font-heading text-xl font-bold text-[var(--primary)]">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-[var(--secondary-text)]">{copy}</p>
      <Link href={href} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--primary)]">
        {cta}
        <ArrowRight size={15} aria-hidden />
      </Link>
    </PremiumCard>
  );
}

export function ExploreCategoryCard({icon: Icon, title, badge}: {icon: LucideIcon; title: string; badge: string}) {
  return (
    <div aria-disabled="true" className="flex min-h-[108px] cursor-default flex-col items-center justify-between rounded-[18px] border border-[var(--border)] bg-white px-2.5 py-3 text-center shadow-[var(--shadow-soft)] sm:min-h-[118px] sm:px-3 sm:py-4">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--hover-bg)] text-[var(--primary)] sm:h-11 sm:w-11">
        <Icon size={20} strokeWidth={1.8} aria-hidden />
      </span>
      <h3 className="mt-2 line-clamp-2 min-h-[32px] text-[12px] font-bold leading-tight text-[var(--primary)] sm:text-sm">{title}</h3>
      <span className="mt-2 rounded-full border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-[10px] font-bold leading-none text-[var(--secondary-text)]">
        {badge}
      </span>
    </div>
  );
}

export function CityCard({name, copy}: {name: string; copy: string}) {
  return (
    <div className="rounded-[20px] border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-soft)] transition duration-300 hover:bg-[var(--hover-bg)]">
      <p className="font-heading text-lg font-bold text-[var(--primary)]">{name}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--secondary-text)]">{copy}</p>
    </div>
  );
}

export function FeaturedProviderCard({photo, icon, name, profession, city, experience, rating, cta, badge}: {photo: string; icon: LucideIcon; name: string; profession: string; city: string; experience: string; rating: string; cta: string; badge: string}) {
  return (
    <PremiumCard className="p-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-[var(--hover-bg)]">
        <Image src={photo} alt={name} fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw" className="object-cover" />
        <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[var(--primary)] shadow-sm">
          <IconFrameSmall icon={icon} />
          {badge}
        </div>
      </div>
      <div className="p-2 pt-5">
        <h3 className="font-heading text-lg font-bold text-[var(--primary)]">{name}</h3>
        <p className="mt-1 text-sm font-semibold text-[var(--secondary-text)]">{profession}</p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-bold text-[var(--foreground)]">
          <span className="rounded-2xl bg-[var(--hover-bg)] px-3 py-2">{city}</span>
          <span className="rounded-2xl bg-[var(--hover-bg)] px-3 py-2">{experience}</span>
          <span className="rounded-2xl bg-[var(--hover-bg)] px-3 py-2">{rating}</span>
          <Link href="/customer" className="rounded-2xl bg-[var(--primary)] px-3 py-2 text-center text-white">
            {cta}
          </Link>
        </div>
      </div>
    </PremiumCard>
  );
}

export function ProviderCard({icon, initials, name, role, focus, badge}: {icon: LucideIcon; initials: string; name: string; role: string; focus: string; badge: string}) {
  return (
    <PremiumCard>
      <div className="flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary)] font-heading text-base font-bold text-white">{initials}</span>
        <div>
          <h3 className="font-heading text-lg font-bold text-[var(--primary)]">{name}</h3>
          <p className="text-sm font-semibold text-[var(--secondary-text)]">{role}</p>
        </div>
      </div>
      <p className="mt-5 text-sm leading-7 text-[var(--secondary-text)]">{focus}</p>
      <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--hover-bg)] px-3 py-2 text-xs font-bold text-[var(--primary)]">
        <IconFrameSmall icon={icon} />
        {badge}
      </div>
    </PremiumCard>
  );
}

export function HowStepCard({icon, index, title, stepLabel}: {icon: LucideIcon; index: number; title: string; stepLabel: string}) {
  return (
    <div className="relative rounded-[20px] border border-[var(--border)] bg-white p-4 text-center shadow-[var(--shadow-soft)]">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)] text-white">
        <IconWithIndex icon={icon} index={index} />
      </span>
      <p className="mt-3 text-xs font-bold uppercase tracking-[0.08em] text-[var(--accent)]">{stepLabel} {index}</p>
      <h3 className="mt-2 font-heading text-lg font-bold text-[var(--primary)]">{title}</h3>
    </div>
  );
}

export function TestimonialCard({icon, label, quote, credit}: {icon: LucideIcon; label: string; quote: string; credit: string}) {
  return (
    <PremiumCard>
      <IconFrame icon={icon} />
      <p className="mt-5 font-heading text-sm font-bold uppercase tracking-[0.08em] text-[var(--accent)]">{label}</p>
      <p className="mt-4 text-lg leading-8 text-[var(--foreground)]">{quote}</p>
      <p className="mt-5 text-sm font-bold text-[var(--secondary-text)]">{credit}</p>
    </PremiumCard>
  );
}

export function ArticleCard({icon, title, copy, meta}: {icon: LucideIcon; title: string; copy: string; meta: string}) {
  return (
    <PremiumCard>
      <IconFrame icon={icon} />
      <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">{meta}</p>
      <h3 className="mt-3 font-heading text-xl font-bold text-[var(--primary)]">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-[var(--secondary-text)]">{copy}</p>
    </PremiumCard>
  );
}

export function FAQAccordion({items}: {items: Array<{question: string; answer: string}>}) {
  const [open, setOpen] = useState(0);
  return (
    <div className="grid gap-3">
      {items.map((item, index) => {
        const active = open === index;
        return (
          <div key={item.question} className="overflow-hidden rounded-[24px] border border-[var(--border)] bg-white shadow-[var(--shadow-soft)]">
            <button type="button" onClick={() => setOpen(active ? -1 : index)} className="flex w-full items-center justify-between gap-5 p-5 text-left">
              <span className="font-heading text-base font-bold text-[var(--primary)]">{item.question}</span>
              <ChevronDown className={`shrink-0 text-[var(--primary)] transition duration-300 ${active ? "rotate-180" : ""}`} size={20} aria-hidden />
            </button>
            {active && (
              <motion.div initial={{height: 0, opacity: 0}} animate={{height: "auto", opacity: 1}} transition={{duration: 0.24}} className="overflow-hidden">
                <p className="border-t border-[var(--border)] px-5 pb-5 pt-4 text-sm leading-7 text-[var(--secondary-text)]">{item.answer}</p>
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function ImagePanel({src, alt, priority = false}: {src: string; alt: string; priority?: boolean}) {
  return (
    <motion.div initial={{opacity: 0, scale: 0.985}} animate={{opacity: 1, scale: 1}} transition={{duration: 0.32}} className="relative overflow-hidden rounded-[34px] border border-[var(--border)] bg-white p-3 shadow-[var(--shadow-lift)]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[26px]">
        <Image src={src} alt={alt} fill priority={priority} sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
      </div>
    </motion.div>
  );
}

export function StepCard({icon, index, title, copy}: {icon: LucideIcon; index: number; title: string; copy: string}) {
  return (
    <div className="grid gap-4 rounded-[24px] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)] sm:grid-cols-[auto_1fr]">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)] text-white">
        <IconWithIndex icon={icon} index={index} />
      </span>
      <div>
        <h3 className="font-heading text-lg font-bold text-[var(--primary)]">{title}</h3>
        <p className="mt-2 text-sm leading-7 text-[var(--secondary-text)]">{copy}</p>
      </div>
    </div>
  );
}

export function CheckList({items}: {items: string[]}) {
  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div key={item} className="flex gap-3 rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--foreground)] shadow-[var(--shadow-soft)]">
          <CheckCircle2 className="mt-0.5 shrink-0 text-[var(--success)]" size={18} aria-hidden />
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

export function HomeSection({children, className = ""}: {children: ReactNode; className?: string}) {
  return <MotionSection className={`${homeContainer} ${homeSectionY} ${className}`}>{children}</MotionSection>;
}

function IconFrameSmall({icon: Icon}: {icon: LucideIcon}) {
  return <Icon size={14} strokeWidth={1.9} aria-hidden />;
}

function IconWithIndex({icon: Icon, index}: {icon: LucideIcon; index: number}) {
  return (
    <span className="relative flex items-center justify-center">
      <Icon size={20} strokeWidth={1.8} aria-hidden />
      <span className="sr-only">Step {index}</span>
    </span>
  );
}

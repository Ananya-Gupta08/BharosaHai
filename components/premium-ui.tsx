"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ChevronDown, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { MotionSection } from "./motion-section";

export const container = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";
export const pageY = "py-16 sm:py-20 lg:py-24";

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-[#2f5d50]">{children}</p>;
}

export function SectionHeader({
  eyebrow,
  title,
  copy,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-3 font-heading text-3xl font-bold tracking-[-0.02em] text-[#111827] sm:text-4xl lg:text-[42px] lg:leading-[1.08]">
        {title}
      </h2>
      {copy && <p className="mt-4 text-base leading-8 text-[#6b7280] sm:text-lg">{copy}</p>}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  copy,
  primary,
  secondary,
  image,
  children,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  image?: { src: string; alt: string };
  children?: ReactNode;
}) {
  return (
    <section className={`${container} pt-12 sm:pt-16 lg:pt-20`}>
      <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.34 }}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-4 max-w-4xl font-heading text-5xl font-bold tracking-[-0.035em] text-[#111827] sm:text-6xl lg:text-[64px] lg:leading-[1.02]">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#374151]">{copy}</p>
          {(primary || secondary) && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {primary && <ButtonLink href={primary.href}>{primary.label}</ButtonLink>}
              {secondary && <ButtonLink href={secondary.href} variant="secondary">{secondary.label}</ButtonLink>}
            </div>
          )}
          {children && <div className="mt-8">{children}</div>}
        </motion.div>
        {image && <ImageFeature src={image.src} alt={image.alt} />}
      </div>
    </section>
  );
}

export function ButtonLink({ href, children, variant = "primary" }: { href: string; children: ReactNode; variant?: "primary" | "secondary" }) {
  const styles =
    variant === "primary"
      ? "bg-[#2f5d50] text-white shadow-[0_16px_34px_rgba(47,93,80,0.24)] hover:bg-[#264c42]"
      : "border border-[#eae4da] bg-white text-[#374151] hover:border-[#2f5d50] hover:text-[#2f5d50]";
  return (
    <Link href={href} className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold transition duration-300 hover:-translate-y-0.5 ${styles}`}>
      {children}
      <ArrowRight size={16} aria-hidden />
    </Link>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className={`rounded-[22px] border border-[#eae4da] bg-white p-6 shadow-[0_14px_44px_rgba(17,24,39,0.05)] ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function IconBadge({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#eae4da] bg-[#f7f4ee] text-[#2f5d50]">
      <Icon size={20} strokeWidth={1.8} aria-hidden />
    </span>
  );
}

export function StatGrid({ items }: { items: Array<{ value: string; label: string; copy?: string }> }) {
  return (
    <MotionSection className={`${container} ${pageY}`}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <Card key={item.label}>
            <p className="font-heading text-4xl font-bold text-[#c6922e]">{item.value}</p>
            <p className="mt-2 font-heading text-base font-bold text-[#1f2937]">{item.label}</p>
            {item.copy && <p className="mt-2 text-sm leading-6 text-[#6b7280]">{item.copy}</p>}
          </Card>
        ))}
      </div>
    </MotionSection>
  );
}

export function FeatureGrid({ items }: { items: Array<{ title: string; copy: string; icon: LucideIcon }> }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card key={item.title}>
          <IconBadge icon={item.icon} />
          <h3 className="mt-5 font-heading text-xl font-bold text-[#1f2937]">{item.title}</h3>
          <p className="mt-3 text-base leading-7 text-[#6b7280]">{item.copy}</p>
        </Card>
      ))}
    </div>
  );
}

export function SplitSection({
  eyebrow,
  title,
  copy,
  image,
  children,
  reverse = false,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  image: { src: string; alt: string };
  children?: ReactNode;
  reverse?: boolean;
}) {
  return (
    <MotionSection className={`${container} ${pageY}`}>
      <div className={`grid gap-10 lg:grid-cols-2 lg:items-center ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
        <div>
          <SectionHeader eyebrow={eyebrow} title={title} copy={copy} />
          {children && <div className="mt-8">{children}</div>}
        </div>
        <ImageFeature src={image.src} alt={image.alt} />
      </div>
    </MotionSection>
  );
}

export function ImageFeature({ src, alt }: { src: string; alt: string }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.34 }} className="relative overflow-hidden rounded-[28px] border border-[#eae4da] bg-[#f7f4ee] p-3 shadow-[0_24px_70px_rgba(17,24,39,0.08)]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[22px]">
        <Image src={src} alt={alt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
      </div>
    </motion.div>
  );
}

export function Checklist({ items }: { items: string[] }) {
  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div key={item} className="flex gap-3 rounded-2xl border border-[#eae4da] bg-white px-4 py-3 text-sm font-semibold text-[#374151]">
          <CheckCircle2 className="mt-0.5 shrink-0 text-[#2f5d50]" size={18} aria-hidden />
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

export function Timeline({ items }: { items: Array<{ title: string; copy: string }> }) {
  return (
    <div className="grid gap-4">
      {items.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.3, delay: index * 0.04 }}
          className="grid gap-4 rounded-[22px] border border-[#eae4da] bg-white p-5 sm:grid-cols-[auto_1fr]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2f5d50] font-heading text-sm font-bold text-white">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <h3 className="font-heading text-lg font-bold text-[#1f2937]">{item.title}</h3>
            <p className="mt-2 text-sm leading-7 text-[#6b7280]">{item.copy}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function FAQAccordion({ items }: { items: Array<{ question: string; answer: string }> }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="grid gap-3">
      {items.map((item, index) => {
        const active = open === index;
        return (
          <Card key={item.question} className="p-0">
            <button type="button" onClick={() => setOpen(active ? -1 : index)} className="flex w-full items-center justify-between gap-5 p-5 text-left">
              <span className="font-heading text-base font-bold text-[#1f2937]">{item.question}</span>
              <ChevronDown className={`shrink-0 text-[#2f5d50] transition duration-300 ${active ? "rotate-180" : ""}`} size={20} aria-hidden />
            </button>
            {active && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} transition={{ duration: 0.28 }} className="overflow-hidden">
                <p className="border-t border-[#eae4da] px-5 pb-5 pt-4 text-sm leading-7 text-[#6b7280]">{item.answer}</p>
              </motion.div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

export function CTASection({ title, copy, primary, secondary }: { title: string; copy: string; primary: { label: string; href: string }; secondary?: { label: string; href: string } }) {
  const t = useTranslations("common.ui");

  return (
    <MotionSection className={`${container} ${pageY}`}>
      <div className="overflow-hidden rounded-[30px] bg-[#2f5d50] p-8 text-white shadow-[0_24px_70px_rgba(47,93,80,0.22)] sm:p-10 lg:p-12">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-[#f1d49d]">{t("nextStep")}</p>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-[-0.02em] sm:text-4xl">{title}</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[#e8f1ee]">{copy}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <ButtonLink href={primary.href} variant="secondary">{primary.label}</ButtonLink>
            {secondary && <Link href={secondary.href} className="inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-3.5 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/10">{secondary.label}</Link>}
          </div>
        </div>
      </div>
    </MotionSection>
  );
}

"use client";

import {motion} from "framer-motion";
import {Bell, CheckCircle2, type LucideIcon} from "lucide-react";
import type {ReactNode} from "react";

import {IconFrame, PremiumCard} from "@/components/homepage-components";

export function ComingSoonBadge({children}: {children: ReactNode}) {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-[10px] font-bold leading-none text-[var(--secondary-text)]">
      {children}
    </span>
  );
}

export function CustomerFeatureCard({icon, title, copy}: {icon: LucideIcon; title: string; copy: string}) {
  return (
    <PremiumCard>
      <IconFrame icon={icon} />
      <h3 className="mt-6 font-heading text-xl font-bold text-[var(--primary)]">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-[var(--secondary-text)]">{copy}</p>
    </PremiumCard>
  );
}

export function DisabledCategoryCard({icon: Icon, title, badge}: {icon: LucideIcon; title: string; badge: string}) {
  return (
    <div aria-disabled="true" className="flex min-h-[108px] cursor-default flex-col items-center justify-between rounded-[18px] border border-[var(--border)] bg-white px-2.5 py-3 text-center shadow-[var(--shadow-soft)] sm:min-h-[118px] sm:px-3 sm:py-4">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--hover-bg)] text-[var(--primary)] sm:h-11 sm:w-11">
        <Icon size={22} strokeWidth={1.8} aria-hidden />
      </span>
      <h3 className="mt-2 line-clamp-2 min-h-[32px] text-[12px] font-bold leading-tight text-[var(--primary)] sm:text-sm">{title}</h3>
      <ComingSoonBadge>{badge}</ComingSoonBadge>
    </div>
  );
}

export function LaunchCityCard({name, badge}: {name: string; badge: string}) {
  return (
    <div className="flex min-h-[86px] items-center gap-3 rounded-[18px] border border-[var(--border)] bg-white p-3 shadow-[var(--shadow-soft)]">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--hover-bg)] text-[var(--primary)]">
        <CheckCircle2 size={19} strokeWidth={1.8} aria-hidden />
      </span>
      <div>
        <h3 className="font-heading text-base font-bold text-[var(--primary)]">{name}</h3>
        <div className="mt-2">
          <ComingSoonBadge>{badge}</ComingSoonBadge>
        </div>
      </div>
    </div>
  );
}

export function CustomerPreviewPanel({title, copy, items}: {title: string; copy: string; items: Array<{label: string; value: string; icon: LucideIcon}>}) {
  return (
    <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{duration: 0.22}} className="rounded-[24px] border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-lift)] sm:p-5">
      <div className="rounded-[20px] bg-[var(--background)] p-4 sm:p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--accent)]">{title}</p>
            <h2 className="mt-2 font-heading text-xl font-bold text-[var(--primary)] sm:text-2xl">{copy}</h2>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)] text-white">
            <Bell size={22} strokeWidth={1.8} aria-hidden />
          </span>
        </div>
        <div className="mt-6 grid gap-3">
          {items.map(({label, value, icon: Icon}) => (
            <div key={label} className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-white p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--hover-bg)] text-[var(--primary)]">
                <Icon size={18} strokeWidth={1.8} aria-hidden />
              </span>
              <div>
                <p className="text-sm font-bold text-[var(--primary)]">{label}</p>
                <p className="mt-1 text-xs font-semibold text-[var(--secondary-text)]">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

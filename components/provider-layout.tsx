"use client";

import {SignOutButton, UserButton} from "@clerk/nextjs";
import type {ProviderStatus} from "@prisma/client";
import {AnimatePresence, motion} from "framer-motion";
import {BarChart3, BadgeCheck, Bell, CreditCard, FileText, Home, Lock, LogOut, MessageSquare, Settings, Star, UserRound, Users} from "lucide-react";
import {usePathname} from "next/navigation";
import {useTranslations} from "next-intl";
import type {ReactNode} from "react";

import {Link} from "@/i18n/navigation";

type ProviderLayoutProps = {
  children: ReactNode;
  status: ProviderStatus;
  providerName: string;
  breadcrumb: string;
  notification?: string;
};

const items = [
  {href: "/provider/dashboard", key: "dashboard", icon: Home, always: true},
  {href: "/provider/leads", key: "leads", icon: Users, always: false},
  {href: "/provider/profile", key: "profile", icon: UserRound, always: false},
  {href: "/provider/documents", key: "documents", icon: FileText, always: false},
  {href: "/provider/verification", key: "verification", icon: BadgeCheck, always: true},
  {href: "/provider/reviews", key: "reviews", icon: Star, always: false},
  {href: "/provider/analytics", key: "analytics", icon: BarChart3, always: false},
  {href: "/provider/subscription", key: "subscription", icon: CreditCard, always: false},
  {href: "/provider/messages", key: "messages", icon: MessageSquare, always: false},
  {href: "/provider/settings", key: "settings", icon: Settings, always: true}
] as const;

export function ProviderLayout({children, status, providerName, breadcrumb, notification}: ProviderLayoutProps) {
  const t = useTranslations("provider.workspace");
  const pathname = usePathname();
  const approved = status === "APPROVED";

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1f2937]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-[#e5e7eb] bg-white/92 px-4 py-5 backdrop-blur-xl lg:block">
        <Link href="/provider/dashboard" className="flex items-center gap-3 px-2" aria-label={t("homeLabel")}>
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2f5d50] font-heading text-lg font-bold text-white">BH</span>
          <span>
            <span className="block font-heading text-lg font-bold text-[#111827]">{t("brand")}</span>
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#6b7280]">{t(`status.${status}`)}</span>
          </span>
        </Link>
        <nav className="mt-8 grid gap-1" aria-label={t("navLabel")}>
          {items.map((item) => {
            const active = pathname.includes(item.href);
            const locked = !approved && !item.always;
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href} className={`group relative flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold transition ${active ? "text-[#2f5d50]" : "text-[#374151] hover:bg-[#f7f4ee] hover:text-[#2f5d50]"}`}>
                {active && <motion.span layoutId="provider-active-nav" className="absolute inset-0 rounded-2xl bg-[#e8f3ee]" transition={{duration: 0.25}} />}
                <span className="relative flex items-center gap-3">
                  <Icon size={18} aria-hidden />
                  {t(`nav.${item.key}`)}
                  {locked && <Lock size={14} className="text-[#9ca3af]" aria-label={t("locked")} />}
                </span>
              </Link>
            );
          })}
        </nav>
        <SignOutButton>
          <button type="button" className="absolute bottom-5 left-4 right-4 flex items-center justify-center gap-2 rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-bold text-[#374151] transition hover:border-[#991b1b] hover:text-[#991b1b]">
            <LogOut size={17} aria-hidden />
            {t("logout")}
          </button>
        </SignOutButton>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-[#e5e7eb] bg-[#f8fafc]/88 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6b7280]">{t("breadcrumbRoot")} / {breadcrumb}</p>
              <h1 className="mt-1 font-heading text-xl font-bold text-[#111827]">{providerName}</h1>
            </div>
            <div className="flex items-center gap-3">
              {notification && (
                <div className="hidden items-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-4 py-2 text-xs font-bold text-[#374151] md:flex">
                  <Bell size={15} className="text-[#2f5d50]" aria-hidden />
                  {notification}
                </div>
              )}
              <UserButton />
            </div>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {items.map((item) => {
              const active = pathname.includes(item.href);
              const Icon = item.icon;

              return (
                <Link key={item.href} href={item.href} className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold ${active ? "bg-[#2f5d50] text-white" : "bg-white text-[#374151]"}`}>
                  <Icon size={15} aria-hidden />
                  {t(`nav.${item.key}`)}
                </Link>
              );
            })}
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.main key={pathname} initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -8}} transition={{duration: 0.22}} className="px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}

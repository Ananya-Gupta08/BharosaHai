"use client";

import {motion} from "framer-motion";
import {Menu, X} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {useEffect, useState, type ReactNode} from "react";
import {Link, usePathname, useRouter} from "@/i18n/navigation";
import type {AppLocale} from "@/i18n/routing";

const navLinks = [
  {href: "/", label: "home"},
  {href: "/services", label: "services"},
  {href: "/become-a-partner", label: "partner"},
  {href: "/about", label: "about"},
  {href: "/faq", label: "faq"},
  {href: "/contact", label: "contact"},
] as const;
const locales: Array<{value: AppLocale; icon: string; labelKey: "hindi" | "english"; optionKey: "hindiOption" | "englishOption"}> = [
  {value: "hi", icon: "🇮🇳", labelKey: "hindi", optionKey: "hindiOption"},
  {value: "en", icon: "🇬🇧", labelKey: "english", optionKey: "englishOption"},
];
export function SiteShell({children}: {children: ReactNode}) {
  const t = useTranslations("common");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, {passive: true});
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#fffdf8] text-[#1f2937]">
      <LanguageWelcomeModal />
      <motion.header
        initial={false}
        animate={{
          backgroundColor: scrolled ? "rgba(255,253,248,0.94)" : "rgba(255,253,248,0.78)",
          boxShadow: scrolled ? "0 18px 60px rgba(17,24,39,0.09)" : "0 0 0 rgba(17,24,39,0)",
          borderColor: scrolled ? "rgba(234,228,218,1)" : "rgba(234,228,218,0.72)",
        }}
        transition={{duration: 0.28, ease: "easeOut"}}
        className="sticky top-0 z-50 border-b backdrop-blur-xl"
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-3" aria-label={t("brand.homeLabel")}>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2f5d50] font-heading text-lg font-bold text-white shadow-[0_14px_30px_rgba(47,93,80,0.24)]">
              {t("brand.initials")}
            </span>
            <span className="font-heading text-xl font-bold tracking-[-0.01em] text-[#111827]">
              {t("brand.name")}
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label={t("nav.label")}>
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition duration-300 ${
                    active ? "bg-[#f7f4ee] text-[#2f5d50]" : "text-[#374151] hover:bg-white hover:text-[#2f5d50]"
                  }`}
                >
                  {t(`nav.${link.label}`)}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <LanguageSwitcher />
            <Link
              href="/customer-portal"
              className="rounded-full border border-[#eae4da] bg-white px-4 py-2 text-sm font-semibold text-[#374151] transition duration-300 hover:-translate-y-0.5 hover:border-[#2f5d50] hover:text-[#2f5d50]"
            >
              {t("nav.customerPortal")}
            </Link>
            <Link
              href="/provider/sign-up"
              className="rounded-full bg-[#2f5d50] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(47,93,80,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#264c42]"
            >
              {t("nav.joinProvider")}
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#eae4da] bg-white text-[#1f2937] lg:hidden"
            aria-label={t("nav.toggle")}
            aria-expanded={open}
          >
            {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </div>

        {open && (
          <motion.div
            initial={{opacity: 0, y: -8}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.25}}
            className="border-t border-[#eae4da] bg-[#fffdf8] px-4 py-4 lg:hidden"
          >
            <div className="mx-auto grid max-w-7xl gap-2">
              <div className="mb-2">
                <LanguageSwitcher />
              </div>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-semibold text-[#374151] hover:bg-[#f7f4ee]">
                  {t(`nav.${link.label}`)}
                </Link>
              ))}
              <Link href="/provider/sign-up" onClick={() => setOpen(false)} className="mt-2 rounded-2xl bg-[#2f5d50] px-4 py-3 text-center text-sm font-semibold text-white">
                {t("nav.joinProvider")}
              </Link>
            </div>
          </motion.div>
        )}
      </motion.header>

      <main>{children}</main>

      <footer className="border-t border-[#eae4da] bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.35fr_0.8fr_0.8fr_0.8fr] lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2f5d50] font-heading text-lg font-bold text-white">{t("brand.initials")}</span>
              <p className="font-heading text-xl font-bold text-[#111827]">{t("brand.name")}</p>
            </div>
            <p className="mt-5 max-w-sm text-base leading-7 text-[#6b7280]">{t("footer.description")}</p>
          </div>
          <FooterColumn title={t("footer.company")} links={[[t("footer.about"), "/about"], [t("footer.services"), "/services"], [t("footer.faq"), "/faq"]]} />
          <FooterColumn title={t("footer.providers")} links={[[t("footer.becomePartner"), "/become-a-partner"], [t("footer.registration"), "/provider/register"], [t("footer.providerDashboard"), "/provider/dashboard"]]} />
          <FooterColumn title={t("footer.support")} links={[[t("footer.contact"), "/contact"], [t("footer.customerPortal"), "/customer-portal"], [t("footer.admin"), "/admin"]]} />
        </div>
      </footer>
    </div>
  );
}
function LanguageSwitcher() {
  const t = useTranslations("common.language");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(nextLocale: AppLocale) {
    persistLocale(nextLocale);
    router.replace(pathname, {locale: nextLocale});
  }

  return (
    <div className="inline-flex rounded-full border border-[#eae4da] bg-white p-1 shadow-sm" aria-label={t("label")}>
      {locales.map((item) => {
        const active = item.value === locale;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => switchLocale(item.value)}
            className={`relative rounded-full px-3 py-1.5 text-xs font-bold transition duration-300 sm:text-sm ${
              active ? "bg-[#2f5d50] text-white shadow-[0_8px_18px_rgba(47,93,80,0.22)]" : "text-[#6b7280] hover:text-[#2f5d50]"
            }`}
          >
            <span className="mr-1" aria-hidden>{item.icon}</span>
            {t(item.labelKey)}
          </button>
        );
      })}
    </div>
  );
}
function LanguageWelcomeModal() {
  const t = useTranslations("common.language");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!window.localStorage.getItem("preferred-locale")) {
      window.requestAnimationFrame(() => setVisible(true));
    }
  }, []);

  function chooseLocale(nextLocale: AppLocale) {
    persistLocale(nextLocale);
    setVisible(false);
    if (nextLocale !== locale) {
      router.replace(pathname, {locale: nextLocale});
    }
  }

  if (!visible) return null;

  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#111827]/35 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="language-title"
    >
      <motion.div initial={{opacity: 0, y: 20, scale: 0.98}} animate={{opacity: 1, y: 0, scale: 1}} transition={{duration: 0.3}} className="w-full max-w-lg rounded-[30px] border border-[#eae4da] bg-[#fffdf8] p-6 shadow-[0_30px_90px_rgba(17,24,39,0.22)] sm:p-8">
        <p className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-[#2f5d50]">{t("label")}</p>
        <h2 id="language-title" className="mt-3 font-heading text-3xl font-bold text-[#111827]">{t("modalTitle")}</h2>
        <p className="mt-4 text-base leading-7 text-[#6b7280]">{t("modalCopy")}</p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {locales.map((item) => (
            <button key={item.value} type="button" onClick={() => chooseLocale(item.value)} className="rounded-2xl border border-[#eae4da] bg-white px-5 py-5 text-left font-heading text-lg font-bold text-[#1f2937] transition duration-300 hover:-translate-y-0.5 hover:border-[#2f5d50] hover:text-[#2f5d50]">
              {t(item.optionKey)}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function persistLocale(nextLocale: AppLocale) {
  window.localStorage.setItem("preferred-locale", nextLocale);
  document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
}
function FooterColumn({title, links}: {title: string; links: Array<[string, string]>}) {
  return (
    <div>
      <p className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-[#374151]">{title}</p>
      <ul className="mt-4 space-y-3">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link href={href} className="text-sm font-medium text-[#6b7280] transition hover:text-[#2f5d50]">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

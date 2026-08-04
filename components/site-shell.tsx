"use client";

import {motion} from "framer-motion";
import {ChevronDown, Languages, Menu, X} from "lucide-react";
import Image from "next/image";
import {useLocale, useTranslations} from "next-intl";
import {useEffect, useRef, useState, type CSSProperties, type ReactNode} from "react";

import {serviceCategories} from "@/data/serviceCategories";
import {Link, usePathname, useRouter} from "@/i18n/navigation";
import type {AppLocale} from "@/i18n/routing";

const navLinks = [
  {href: "/", label: "home"},
  {href: "/services", label: "services"},
  {href: "/provider", label: "partner"},
  {href: "/about", label: "about"},
  {href: "/faq", label: "faq"},
  {href: "/contact", label: "contact"}
] as const;

const locales: Array<{value: AppLocale; short: string; labelKey: "hindi" | "english"; optionKey: "hindiOption" | "englishOption"}> = [
  {value: "hi", short: "HI", labelKey: "hindi", optionKey: "hindiOption"},
  {value: "en", short: "EN", labelKey: "english", optionKey: "englishOption"}
];

const brandLogo = {
  src: "/brand/bharosa-hai-logo.png",
  width: 735,
  height: 385
} as const;

const indianMarketplaceTheme = {
  "--background": "#FFFDF8",
  "--primary": "#005BAC",
  "--primary-hover": "#004A8A",
  "--accent": "#F4A300",
  "--hover-bg": "#EAF4FF",
  "--success": "#2E7D32",
  "--shadow-soft": "0 10px 28px rgba(0, 91, 172, 0.08)",
  "--shadow-lift": "0 16px 42px rgba(0, 91, 172, 0.12)"
} as CSSProperties;

export function SiteShell({children, visualStyle = "default"}: {children: ReactNode; visualStyle?: "default" | "indian-marketplace"}) {
  const t = useTranslations("common");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const themed = visualStyle === "indian-marketplace";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, {passive: true});
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setServicesOpen(false);
        setMobileServicesOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]" style={themed ? indianMarketplaceTheme : undefined}>
      <LanguageWelcomeModal />
      <motion.header
        initial={false}
        animate={{
          backgroundColor: themed ? "#FFFDF8" : scrolled ? "rgba(250,251,252,0.96)" : "rgba(250,251,252,0.84)",
          boxShadow: scrolled ? "var(--shadow-soft)" : "0 0 0 rgba(0,91,172,0)",
          borderColor: scrolled ? "var(--border)" : "rgba(229,231,235,0.9)"
        }}
        transition={{duration: 0.24, ease: "easeOut"}}
        className={`sticky top-0 z-50 border-b ${themed ? "" : "backdrop-blur-xl"}`}
      >
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
          <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label={t("brand.homeLabel")}>
            <Image
              src={brandLogo.src}
              alt={t("brand.name")}
              width={brandLogo.width}
              height={brandLogo.height}
              priority
              className="h-12 w-auto object-contain sm:h-14"
            />
          </Link>

          <nav className="mx-4 hidden flex-1 items-center justify-center gap-0.5 xl:flex" aria-label={t("nav.label")}>
            {navLinks.map((link) => {
              const active = pathname === link.href;
              if (link.label === "services") {
                return (
                  <div key={link.href} ref={servicesRef} className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
                    <button
                      type="button"
                      onClick={() => setServicesOpen((value) => !value)}
                      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold transition duration-300 ${
                        active ? "bg-[var(--hover-bg)] text-[var(--primary)]" : "text-[var(--foreground)] hover:bg-white hover:text-[var(--primary)]"
                      }`}
                      aria-haspopup="menu"
                      aria-expanded={servicesOpen}
                    >
                      {t("nav.services")}
                      <ChevronDown className={`transition duration-200 ${servicesOpen ? "rotate-180" : ""}`} size={16} aria-hidden />
                    </button>

                    {servicesOpen && (
                      <motion.div initial={{opacity: 0, y: 8}} animate={{opacity: 1, y: 0}} transition={{duration: 0.16}} className="absolute left-1/2 top-full z-50 mt-3 w-[680px] -translate-x-1/2 rounded-[22px] border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-lift)]" role="menu">
                        <div className="grid grid-cols-3 gap-2">
                          {serviceCategories.map(({id, label, icon: Icon}) => (
                            <Link key={id} href={`/services#${id}`} onClick={() => setServicesOpen(false)} className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--hover-bg)] hover:text-[var(--primary)]" role="menuitem">
                              <Icon className="shrink-0 text-[var(--primary)]" size={20} strokeWidth={1.8} aria-hidden />
                              <span>{label}</span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold transition duration-300 ${
                    active ? "bg-[var(--hover-bg)] text-[var(--primary)]" : "text-[var(--foreground)] hover:bg-white hover:text-[var(--primary)]"
                  }`}
                >
                  {t(`nav.${link.label}`)}
                </Link>
              );
            })}
          </nav>

          <div className="hidden shrink-0 items-center gap-2 xl:flex">
            <LanguageSwitcher />
            <Link href="/customer" className="whitespace-nowrap rounded-full border border-[var(--primary)] bg-white px-3.5 py-2 text-sm font-semibold text-[var(--primary)] transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--hover-bg)]">
              {t("nav.customerPortal")}
            </Link>
            <Link href="/provider/sign-up" className="whitespace-nowrap rounded-full bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--primary-hover)]">
              {t("nav.joinProvider")}
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-white text-[var(--primary)] xl:hidden"
            aria-label={t("nav.toggle")}
            aria-expanded={open}
          >
            {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </div>

        {open && (
          <motion.div initial={{opacity: 0, y: -8}} animate={{opacity: 1, y: 0}} transition={{duration: 0.22}} className="border-t border-[var(--border)] bg-[var(--background)] px-4 py-4 xl:hidden">
            <div className="mx-auto grid max-w-7xl gap-2">
              <div className="mb-2">
                <LanguageSwitcher />
              </div>
              {navLinks.map((link) => {
                if (link.label === "services") {
                  return (
                    <div key={link.href} className="rounded-2xl border border-[var(--border)] bg-white">
                      <button type="button" onClick={() => setMobileServicesOpen((value) => !value)} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-[var(--foreground)]" aria-expanded={mobileServicesOpen}>
                        {t("nav.services")}
                        <ChevronDown className={`text-[var(--primary)] transition duration-200 ${mobileServicesOpen ? "rotate-180" : ""}`} size={18} aria-hidden />
                      </button>
                      {mobileServicesOpen && (
                        <div className="grid gap-1 border-t border-[var(--border)] p-2">
                          {serviceCategories.map(({id, label, icon: Icon}) => (
                            <Link key={id} href={`/services#${id}`} onClick={() => { setOpen(false); setMobileServicesOpen(false); }} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--hover-bg)]">
                              <Icon className="text-[var(--primary)]" size={19} strokeWidth={1.8} aria-hidden />
                              {label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--hover-bg)]">
                    {t(`nav.${link.label}`)}
                  </Link>
                );
              })}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link href="/customer" onClick={() => setOpen(false)} className="rounded-2xl border border-[var(--primary)] bg-white px-3 py-3 text-center text-sm font-semibold text-[var(--primary)]">
                  {t("nav.customerPortal")}
                </Link>
                <Link href="/provider/sign-up" onClick={() => setOpen(false)} className="rounded-2xl bg-[var(--primary)] px-3 py-3 text-center text-sm font-semibold text-white">
                  {t("nav.joinProvider")}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </motion.header>

      <main>{children}</main>

      <footer className="border-t border-[var(--border)] bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.35fr_0.8fr_0.8fr_0.8fr] lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src={brandLogo.src}
                alt={t("brand.name")}
                width={brandLogo.width}
                height={brandLogo.height}
                className="h-14 w-auto object-contain"
              />
            </div>
            <p className="mt-5 max-w-sm text-base leading-7 text-[var(--secondary-text)]">{t("footer.description")}</p>
          </div>
          <FooterColumn title={t("footer.company")} links={[[t("footer.about"), "/about"], [t("footer.services"), "/services"], [t("footer.faq"), "/faq"]]} />
          <FooterColumn title={t("footer.providers")} links={[[t("footer.becomePartner"), "/provider"], [t("footer.registration"), "/provider/register"], [t("footer.providerDashboard"), "/provider/dashboard"]]} />
          <FooterColumn title={t("footer.support")} links={[[t("footer.contact"), "/contact"], [t("footer.customerPortal"), "/customer"], [t("footer.admin"), "/admin"]]} />
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
    <div className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-white p-1 shadow-sm" aria-label={t("label")}>
      <Languages size={15} className="ml-2 text-[var(--primary)]" aria-hidden />
      {locales.map((item) => {
        const active = item.value === locale;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => switchLocale(item.value)}
            className={`relative rounded-full px-2.5 py-1.5 text-xs font-bold transition duration-300 sm:text-sm ${
              active ? "bg-[var(--primary)] text-white shadow-[var(--shadow-soft)]" : "text-[var(--secondary-text)] hover:text-[var(--primary)]"
            }`}
          >
            <span className="mr-1" aria-hidden>{item.short}</span>
            <span className="hidden 2xl:inline">{t(item.labelKey)}</span>
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
    <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--primary)]/35 px-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="language-title">
      <motion.div initial={{opacity: 0, y: 20, scale: 0.98}} animate={{opacity: 1, y: 0, scale: 1}} transition={{duration: 0.3}} className="w-full max-w-lg rounded-[30px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-lift)] sm:p-8">
        <p className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-[var(--accent)]">{t("label")}</p>
        <h2 id="language-title" className="mt-3 font-heading text-3xl font-bold text-[var(--primary)]">{t("modalTitle")}</h2>
        <p className="mt-4 text-base leading-7 text-[var(--secondary-text)]">{t("modalCopy")}</p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {locales.map((item) => (
            <button key={item.value} type="button" onClick={() => chooseLocale(item.value)} className="rounded-2xl border border-[var(--border)] bg-white px-5 py-5 text-left font-heading text-lg font-bold text-[var(--foreground)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--primary)] hover:bg-[var(--hover-bg)] hover:text-[var(--primary)]">
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
      <p className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-[var(--primary)]">{title}</p>
      <ul className="mt-4 space-y-3">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link href={href} className="text-sm font-medium text-[var(--secondary-text)] transition hover:text-[var(--primary)]">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

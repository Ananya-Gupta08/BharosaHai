import {AlertTriangle, Database, RefreshCw} from "lucide-react";
import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";

import {HeroBackgroundCarousel} from "@/components/hero-background-carousel";
import {MotionSection} from "@/components/motion-section";
import {SiteShell} from "@/components/site-shell";
import {Link} from "@/i18n/navigation";

type Props = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "provider.setupError.metadata"});

  return {
    title: t("title"),
    description: t("description")
  };
}

export default async function ProviderSetupErrorPage({params}: Props) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "provider.setupError"});

  return (
    <SiteShell visualStyle="indian-marketplace">
      <MotionSection className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <HeroBackgroundCarousel align="center">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)] shadow-[var(--shadow-soft)]">
              <AlertTriangle size={16} aria-hidden />
              {t("eyebrow")}
            </span>
            <h1 className="mt-5 font-heading text-4xl font-bold leading-tight text-[var(--primary)] sm:text-5xl">
              {t("title")}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-7 text-[var(--foreground)] sm:text-lg">
              {t("copy")}
            </p>
          </div>

          <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] border border-[var(--border)] bg-white p-5 text-left shadow-[var(--shadow-soft)]">
              <Database className="text-[var(--primary)]" size={24} aria-hidden />
              <h2 className="mt-4 font-heading text-lg font-bold text-[var(--primary)]">{t("database.title")}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--secondary-text)]">{t("database.copy")}</p>
            </div>
            <div className="rounded-[24px] border border-[var(--border)] bg-white p-5 text-left shadow-[var(--shadow-soft)]">
              <RefreshCw className="text-[var(--primary)]" size={24} aria-hidden />
              <h2 className="mt-4 font-heading text-lg font-bold text-[var(--primary)]">{t("next.title")}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--secondary-text)]">{t("next.copy")}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/provider" className="rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-bold text-white shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:bg-[var(--primary-hover)]">
              {t("actions.provider")}
            </Link>
            <Link href="/provider/sign-in" className="rounded-full border border-[var(--primary)] bg-white px-6 py-3 text-sm font-bold text-[var(--primary)] transition hover:-translate-y-0.5 hover:bg-[var(--hover-bg)]">
              {t("actions.login")}
            </Link>
          </div>
        </HeroBackgroundCarousel>
      </MotionSection>
    </SiteShell>
  );
}

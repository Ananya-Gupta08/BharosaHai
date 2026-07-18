import type {Metadata} from "next";
import {ClerkProvider} from "@clerk/nextjs";
import {hasLocale} from "next-intl";
import {NextIntlClientProvider} from "next-intl";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import {routing} from "@/i18n/routing";
import "../globals.css";

type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "common.metadata"});

  return {
    title: {
      default: t("title"),
      template: `%s | ${t("brand")}`,
    },
    description: t("description"),
    alternates: {
      languages: {
        en: "/en",
        hi: "/hi",
      },
    },
  };
}

export default async function LocaleLayout({children, params}: Props) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className="h-full antialiased"
    >
      <body className="min-h-full bg-[#fffdf8] text-[#1f2937]">
        <ClerkProvider>
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}

import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";

import {AboutPageView} from "@/components/about-page-view";

type Props = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "about.metadata"});
  const path = `/${locale}/about`;

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: path,
      languages: {
        en: "/en/about",
        hi: "/hi/about"
      }
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: path,
      siteName: "Bharosa Hai",
      type: "website",
      images: [{url: "/brand/bharosa-hai-logo.png", width: 735, height: 385, alt: "Bharosa Hai"}]
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/brand/bharosa-hai-logo.png"]
    }
  };
}

export default async function AboutRoute({params}: Props) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "about"});
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: t("metadata.title"),
    description: t("metadata.description"),
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {"@type": "ListItem", position: 1, name: t("schema.home"), item: `/${locale}`},
        {"@type": "ListItem", position: 2, name: t("schema.about"), item: `/${locale}/about`}
      ]
    },
    publisher: {
      "@type": "Organization",
      name: "Bharosa Hai",
      logo: "/brand/bharosa-hai-logo.png"
    }
  };

  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}} />
      <AboutPageView />
    </>
  );
}

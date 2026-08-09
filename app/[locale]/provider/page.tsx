import {auth} from "@clerk/nextjs/server";
import type {Metadata} from "next";

import {ProviderLandingPage} from "@/components/provider-landing-page";
import {SiteShell} from "@/components/site-shell";
import {prisma} from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const path = `/${locale}/provider`;
  const title = "Become a KaunBatayega Provider";
  const description = "Register as a verified KaunBatayega Provider to grow your business, receive customer enquiries and manage leads, documents, bookings and analytics from a secure dashboard.";

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        en: "/en/provider",
        hi: "/hi/provider"
      }
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "KaunBatayega",
      type: "website",
      images: [{url: "/brand/kaunbatayega-logo.png", width: 735, height: 385, alt: "KaunBatayega"}]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/brand/kaunbatayega-logo.png"]
    }
  };
}

export default async function ProviderLandingRoute() {
  const session = await auth();
  const [categories, providers] = await Promise.all([
    prisma.category.count().catch(() => 12),
    prisma.provider.count({where: {status: "APPROVED"}}).catch(() => 0)
  ]);
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Become a KaunBatayega Provider",
    description: "Provider registration landing page for KaunBatayega verified professionals.",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {"@type": "ListItem", position: 1, name: "Home", item: "/"},
        {"@type": "ListItem", position: 2, name: "Provider", item: "/provider"}
      ]
    },
    publisher: {
      "@type": "Organization",
      name: "KaunBatayega",
      logo: "/brand/kaunbatayega-logo.png"
    }
  };

  return (
    <SiteShell visualStyle="indian-marketplace">
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}} />
      <ProviderLandingPage stats={{categories, providers, enquiries: 500}} dashboardCtaVisible={Boolean(session.userId)} />
    </SiteShell>
  );
}

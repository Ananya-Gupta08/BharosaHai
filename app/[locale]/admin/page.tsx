import {Clock3, Search, ShieldCheck, UserCheck, UserX, Users} from "lucide-react";
import {getTranslations} from "next-intl/server";
import type {ProviderStatus} from "@prisma/client";

import {MotionSection} from "@/components/motion-section";
import {Card, PageHero, SectionHeader, Timeline, container, pageY} from "@/components/premium-ui";
import {AdminLogoutButton} from "@/components/admin-logout-button";
import {SiteShell} from "@/components/site-shell";
import {Link} from "@/i18n/navigation";
import {requireAdminAccess} from "@/lib/auth/admin-session";
import {prisma} from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

const statIcons = [Clock3, UserCheck, UserX, Users];

type ProviderStatusCount = {
  status: ProviderStatus;
  _count: {
    _all: number;
  };
};

type Props = {
  params: Promise<{locale: string}>;
};

export default async function AdminDashboardPage({params}: Props) {
  const {locale} = await params;
  await requireAdminAccess(locale);

  const t = await getTranslations({locale, namespace: "admin.dashboard"});
  const headers = t.raw("list.headers") as string[];
  const providers = await prisma.provider.findMany({
    orderBy: {createdAt: "desc"},
    include: {category: true},
    take: 50
  });
  const statusCounts = await prisma.provider.groupBy({
    by: ["status"],
    _count: {_all: true}
  });
  const totalProviders = await prisma.provider.count();
  const countByStatus = new Map((statusCounts as ProviderStatusCount[]).map((item) => [item.status, item._count._all]));
  const stats = [
    {label: t("stats.pending"), value: String(countByStatus.get("PENDING") ?? 0)},
    {label: t("stats.approved"), value: String(countByStatus.get("APPROVED") ?? 0)},
    {label: t("stats.rejected"), value: String(countByStatus.get("REJECTED") ?? 0)},
    {label: t("stats.total"), value: String(totalProviders)}
  ];

  return (
    <SiteShell>
      <section className="bg-[#f8fafc]">
        <PageHero eyebrow={t("hero.eyebrow")} title={t("hero.title")} copy={t("hero.copy")} image={{src: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80", alt: t("hero.imageAlt")}}>
          <AdminLogoutButton />
        </PageHero>
        <MotionSection className={`${container} ${pageY}`}>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((item, index) => {
              const Icon = statIcons[index];
              return <Card key={item.label}><Icon className="text-[#2f5d50]" size={26} aria-hidden /><p className="mt-5 text-sm font-semibold text-[#6b7280]">{item.label}</p><h2 className="mt-2 font-heading text-3xl font-bold text-[#111827]">{item.value}</h2></Card>;
            })}
          </div>
        </MotionSection>
        <MotionSection className={`${container} ${pageY}`}>
          <Card className="p-0">
            <div className="border-b border-[#eae4da] p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <SectionHeader eyebrow={t("list.eyebrow")} title={t("list.title")} copy={t("list.copy")} />
                <label className="flex min-h-12 items-center gap-3 rounded-full border border-[#eae4da] bg-white px-4">
                  <Search size={18} className="text-[#6b7280]" aria-hidden />
                  <input className="w-full bg-transparent text-sm outline-none placeholder:text-[#6b7280]" placeholder={t("list.search")} />
                </label>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#f7f4ee] text-[#6b7280]">
                  <tr>{headers.map((header) => <th key={header} className="px-6 py-4 font-heading font-bold">{header}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-[#eae4da] bg-white">
                  {providers.map((provider) => (
                    <tr key={provider.id} className="transition hover:bg-[#fffdf8]">
                      <td className="px-6 py-4 font-semibold text-[#1f2937]">{provider.name}</td>
                      <td className="px-6 py-4 text-[#6b7280]">{provider.category?.name ?? t("list.notProvided")}</td>
                      <td className="px-6 py-4 text-[#6b7280]">{provider.city ?? t("list.notProvided")}</td>
                      <td className="px-6 py-4"><span className="rounded-full bg-[#f7f4ee] px-3 py-1 text-xs font-bold text-[#2f5d50]">{t(`status.${provider.status}`)}</span></td>
                      <td className="px-6 py-4"><Link href={`/admin/providers/${provider.id}`} className="font-heading text-sm font-bold text-[#2f5d50] hover:text-[#c6922e]">{t("list.review")}</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </MotionSection>
        <MotionSection className={`${container} ${pageY}`}>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <Card><ShieldCheck className="text-[#2f5d50]" size={30} aria-hidden /><h2 className="mt-5 font-heading text-2xl font-bold text-[#111827]">{t("secure.title")}</h2><p className="mt-4 text-base leading-8 text-[#6b7280]">{t("secure.copy")}</p></Card>
            <Timeline items={t.raw("timeline") as Array<{title: string; copy: string}>} />
          </div>
        </MotionSection>
      </section>
    </SiteShell>
  );
}

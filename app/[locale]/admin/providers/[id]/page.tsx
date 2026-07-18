import {ArrowLeft, FileCheck2, ShieldCheck, UserRound} from "lucide-react";
import {getTranslations} from "next-intl/server";
import {notFound} from "next/navigation";

import {AdminProviderActions} from "@/components/admin-provider-actions";
import {MotionSection} from "@/components/motion-section";
import {Card, PageHero, SectionHeader, Timeline, container, pageY} from "@/components/premium-ui";
import {SiteShell} from "@/components/site-shell";
import {Link} from "@/i18n/navigation";
import {requireAdminAccess} from "@/lib/auth/admin-session";
import {prisma} from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{locale: string; id: string}>;
};

export default async function ProviderDetailPage({params}: Props) {
  const {locale, id} = await params;
  await requireAdminAccess(locale);

  const t = await getTranslations({locale, namespace: "admin.detail"});
  const provider = await prisma.provider.findUnique({
    where: {id},
    include: {
      category: true,
      subCategory: true,
      documents: {
        orderBy: {uploadedAt: "desc"}
      },
      verificationRequests: {
        orderBy: {createdAt: "desc"},
        take: 4
      }
    }
  });

  if (!provider) {
    notFound();
  }

  const profileFields = [
    {label: t("profile.fields.category"), value: provider.category?.name ?? t("profile.notProvided")},
    {label: t("profile.fields.experience"), value: provider.experienceYears === null ? t("profile.notProvided") : t("profile.years", {count: provider.experienceYears})},
    {label: t("profile.fields.city"), value: provider.city ?? t("profile.notProvided")},
    {label: t("profile.fields.status"), value: t(`status.${provider.status}`)},
    {label: t("profile.fields.languages"), value: provider.languages.length > 0 ? provider.languages.join(", ") : t("profile.notProvided")},
    {label: t("profile.fields.office"), value: provider.officeAddress ?? t("profile.notProvided")}
  ];
  const fileSizeFormatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0
  });
  const formatFileSize = (size: number | null) => {
    if (!size) {
      return t("documents.unavailable");
    }

    if (size < 1024 * 1024) {
      return `${fileSizeFormatter.format(size / 1024)} KB`;
    }

    return `${fileSizeFormatter.format(size / (1024 * 1024))} MB`;
  };
  const formatUploadDate = (date: Date) =>
    new Intl.DateTimeFormat(locale, {dateStyle: "medium"}).format(date);

  return (
    <SiteShell>
      <section className="bg-[#f8fafc]">
        <PageHero eyebrow={t("hero.eyebrow")} title={t("hero.title")} copy={t("hero.copy")} image={{src: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80", alt: t("hero.imageAlt")}}>
          <Link href="/admin" className="inline-flex items-center gap-2 rounded-full border border-[#eae4da] bg-white px-5 py-3 text-sm font-bold text-[#374151] transition hover:border-[#2f5d50] hover:text-[#2f5d50]"><ArrowLeft size={16} aria-hidden />{t("hero.back")}</Link>
        </PageHero>
        <MotionSection className={`${container} ${pageY}`}>
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <Card>
              <UserRound className="text-[#2f5d50]" size={30} aria-hidden />
              <SectionHeader eyebrow={t("profile.eyebrow")} title={provider.name} copy={provider.bio ?? t("profile.notProvided")} />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {profileFields.map((field) => <div key={field.label} className="rounded-2xl border border-[#eae4da] bg-[#f7f4ee] p-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6b7280]">{field.label}</p><p className="mt-2 font-heading text-base font-bold text-[#1f2937]">{field.value}</p></div>)}
              </div>
            </Card>
            <Card>
              <FileCheck2 className="text-[#2f5d50]" size={30} aria-hidden />
              <SectionHeader eyebrow={t("documents.eyebrow")} title={t("documents.title")} copy={t("documents.copy")} />
              <div className="mt-8 grid gap-4">
                {provider.documents.length === 0 && <p className="rounded-2xl border border-[#eae4da] bg-[#f7f4ee] p-4 text-sm font-semibold text-[#6b7280]">{t("documents.empty")}</p>}
                {provider.documents.map((document) => {
                  const unavailable = document.storagePath.startsWith("pending://");

                  return (
                    <div key={document.id} className="rounded-2xl border border-[#eae4da] bg-[#f7f4ee] p-4">
                      <div className="grid gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6b7280]">{t("documents.type")}</p>
                          <p className="mt-1 font-heading text-base font-bold text-[#1f2937]">{document.documentType}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6b7280]">{t("documents.originalFileName")}</p>
                          <p className="mt-1 break-all text-sm font-semibold text-[#374151]">{document.originalFileName ?? document.fileName}</p>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6b7280]">{t("documents.uploadDate")}</p>
                            <p className="mt-1 text-sm font-semibold text-[#374151]">{formatUploadDate(document.uploadedAt)}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6b7280]">{t("documents.fileSize")}</p>
                            <p className="mt-1 text-sm font-semibold text-[#374151]">{formatFileSize(document.fileSize)}</p>
                          </div>
                        </div>
                      </div>
                      {unavailable ? (
                        <p className="mt-4 rounded-full bg-white px-4 py-2 text-center text-xs font-bold text-[#991b1b]">{t("documents.unavailable")}</p>
                      ) : (
                        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                          <a href={`/api/admin/documents/${document.id}/preview`} target="_blank" rel="noreferrer" className="rounded-full bg-white px-4 py-2 text-center text-xs font-bold text-[#2f5d50] transition hover:text-[#c6922e]">{t("documents.preview")}</a>
                          <a href={`/api/admin/documents/${document.id}/download`} className="rounded-full bg-white px-4 py-2 text-center text-xs font-bold text-[#2f5d50] transition hover:text-[#c6922e]">{t("documents.download")}</a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </MotionSection>
        <MotionSection className={`${container} ${pageY}`}>
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <Card>
              <ShieldCheck className="text-[#2f5d50]" size={30} aria-hidden />
              <h2 className="mt-5 font-heading text-2xl font-bold text-[#111827]">{t("actions.title")}</h2>
              <p className="mt-3 text-base leading-7 text-[#6b7280]">{t("actions.copy")}</p>
              <AdminProviderActions providerId={provider.id} />
            </Card>
            <div>
              <SectionHeader eyebrow={t("checklist.eyebrow")} title={t("checklist.title")} />
              <div className="mt-8"><Timeline items={t.raw("checklist.items") as Array<{title: string; copy: string}>} /></div>
            </div>
          </div>
        </MotionSection>
      </section>
    </SiteShell>
  );
}
